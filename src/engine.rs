use std::collections::HashMap;
use std::fmt::Debug;
use std::fs;
use std::env;
use std::path::{Path, PathBuf};
use std::pin::Pin;
use std::process::Command;
use std::sync::Arc;
use std::sync::Mutex;
use futures::future::try_join_all;
use log::debug;
use serde::{Deserialize, Serialize};
use futures::{Future,future::join_all,StreamExt};
use log::{info};
use crate::error::{ExecutionError, TestError, BuildError};
use crate::Results;
use crate::generator::{Generate};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Engine {
    pub path: EnginePath,
    pub feature: Option<String>,
    pub implementation: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct EnginePath {
    pub destination: PathBuf,
    pub source: PathBuf,
}

type ComplexCase = HashMap<String, Option<Vec<String>>>;

type ExecutorFuture = Pin<Box<dyn Future<Output=Result<(), ExecutionError>> + Send>>;
type Executor = Box<dyn Fn(String, Option<String>, Option<String>) -> ExecutorFuture + Send>;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
enum CaseType {
    Simple(Vec<String>),
    Complex(ComplexCase)
}

impl Engine {
    pub fn start(
        destination: &Path,
        source: &Path
    ) -> Self {
        Self {
            path: EnginePath {
                destination: destination.to_path_buf(),
                source: source.to_path_buf(),
            },
            feature: None,
            implementation: None
        }
    }

    pub async fn execute(&self, feature: Option<&str>, implementation: Option<&str>, build_only: bool) -> Result<(), ExecutionError> {
        let generator = Generate::new(
            self.path.destination.to_path_buf(),
            self.path.source.to_path_buf(),
            build_only
        );
        let generator = Arc::new(generator);
        let engine = Arc::new(self.clone());

        if build_only {
            fs::create_dir("./wrappers")?;
        }

        let project_generator_executor: Executor = Box::new(
            move |feature, implementation, subpath| {
                let generator = generator.clone();
                Box::pin(async move {
                    generator.project(
                        feature.as_str(), 
                        implementation.as_deref(), 
                        subpath.as_deref()
                    ).await.map_err(ExecutionError::GenerateError)
                })
            }
        );

        info!("Running generator executor");
        self.handler(
            project_generator_executor,
            feature.map(|f| f.to_string()),
            implementation.map(|i| i.to_string()),
        ).await?;

        let build_executor: Executor = Box::new(
            move |feature, implementation, subpath| {
                let e = engine.clone();
                Box::pin(async move {
                    e.build(
                        feature.as_str(), 
                        implementation.as_deref(), 
                        subpath.as_deref(),
                        build_only
                    ).await.map_err(ExecutionError::BuildError)
                })
            }
        );


        info!("Running build executor");
        self.handler(
            build_executor,
            feature.map(|f| f.to_string()),
            implementation.map(|i| i.to_string()),
        ).await?;

        let engine = Arc::new(self.clone());
        let test_executor: Executor = Box::new(
            move |feature, implementation, subpath| {
                let e = engine.clone();
                Box::pin(async move {
                    if let Some(i) = implementation {
                        e.test(
                            feature.as_str(), 
                            &i, 
                            subpath.as_deref(),
                        ).await.map_err(ExecutionError::TestError)
                    } else {
                        Ok(())
                    }
                })
            }
        );

        if !build_only {
            info!("Running test executor");
            self.handler(
                test_executor,
                feature.map(|f| f.to_string()),
                implementation.map(|i| i.to_string()),
            ).await?
        }
        Ok(())
    }

    async fn handler(
        &self,
        executor: Executor,
        feature: Option<String>,
        implementation: Option<String>
    ) -> Result<(), ExecutionError> {
        type FeatureImplMap = HashMap<String, CaseType>;
        let mut feature_map : FeatureImplMap = HashMap::new();
        match feature {
            None => {
                feature_map = fs::read_dir(&self.path.source)?.fold(feature_map, |mut current, f| {
                    current.insert(String::from(f.unwrap().file_name().to_str().unwrap()), CaseType::Simple(vec![]));
                    current
                });
            },
            Some(f) => {
                f.split(',')
                    .map(|feature|
                        feature.trim().to_string()
                    ).into_iter().for_each(|f| {
                        feature_map.insert(f, CaseType::Simple(vec![]));
                    }
                );
            }
        }

        for feature in feature_map.clone().into_keys() {
            let feature_folder = self.path.source.join(&feature);
            let implementation_folder = feature_folder.join("implementations");
            match implementation.clone() {
                None => {
                    if implementation_folder.exists() {
                        let implementations = fs::read_dir(implementation_folder)?.map(|i| {
                            i.unwrap().file_name().into_string().unwrap()
                        }).collect::<Vec<String>>();
                        feature_map.insert(feature.to_string(), CaseType::Simple(implementations));
                    } else {
                        let mut complex_case_map: ComplexCase = HashMap::new();
                        fs::read_dir(feature_folder)?.into_iter().filter(|i| {
                            i.as_ref().unwrap().metadata().unwrap().is_dir()
                        }).for_each(|entry| {
                            let dir = entry.unwrap();
                            let step_name = dir.file_name().into_string().unwrap();
                            let step_implementations = dir.path().join("implementations");
                            if step_implementations.exists() {
                                let implementations = fs::read_dir(step_implementations).unwrap().map(|i| {
                                    i.unwrap().file_name().into_string().unwrap()
                                }).collect::<Vec<String>>();
                                complex_case_map.insert(step_name, Some(implementations));
                            } else {
                                complex_case_map.insert(step_name, None);
                            }
                        });
                        feature_map.insert(feature.to_string(), CaseType::Complex(complex_case_map));
                    };
                },
                Some(i) => {
                    if implementation_folder.exists() {
                        feature_map.insert(feature.to_string(), CaseType::Simple(vec![i.to_string()]));
                    } else {
                        let mut complex_case_map: ComplexCase = HashMap::new();
                        fs::read_dir(feature_folder)?.into_iter().filter(|i| {
                            i.as_ref().unwrap().metadata().unwrap().is_dir()
                        }).for_each(|entry| {
                            let dir = entry.unwrap();
                            let step_name = dir.file_name().into_string().unwrap();
                            let step_implementations = dir.path().join("implementations");
                            if step_implementations.exists() {
                                complex_case_map.insert(step_name, Some(vec![i.to_string()]));
                            } else {
                                complex_case_map.insert(step_name, None);
                            }
                        });
                        feature_map.insert(feature.to_string(), CaseType::Complex(complex_case_map));
                    }
                }
            }
        }

        let mut features_execution_futures: HashMap<String, Vec<ExecutorFuture>> = HashMap::new();
        for feature in feature_map.clone().into_keys() {
            let f = feature_map.get(feature.as_str());
            let mut current_executions = vec![];
            match f.unwrap() {
                CaseType::Simple(implementations) => {
                    for implementation in implementations {
                        current_executions.push(
                            executor(feature.clone(), Some(implementation.to_string()), None)
                        );
                    }
                }
                CaseType::Complex(cases) => {
                    let mut steps = cases.clone().into_keys().collect::<Vec<String>>();
                    steps.sort();
                    for step in steps {
                        let implementations = cases.get(step.as_str()).unwrap();
                        if let Some(implementation) = implementations {
                            for i in implementation {
                                current_executions.push(
                                    executor(feature.clone(), Some(i.to_string()), Some(step.to_string()))
                                );
                            }
                        } else {
                            current_executions.push(
                                executor(feature.clone(), None, Some(step.to_string()))
                            );
                        }
                    }
                }
            }
            features_execution_futures.insert(feature, current_executions);
        }

        let execution_futures = features_execution_futures
            .into_values()
            .map(|f| {
                tokio::spawn(join_all(f))
            }
        );
        let futures = try_join_all(futures::stream::iter(execution_futures).collect::<Vec<_>>().await).await.unwrap();

        for feature in futures {
            for result in feature {
                if result.is_err() {
                    return Err(result.err().unwrap());
                }
            }
        }
        Ok(())
    }

    async fn build(&self, feature: &str, implementation: Option<&str>, subpath: Option<&str>, generate_folder: bool) -> Result<(), BuildError> {
        let mut directory = self.path.destination.join(feature);
        let mut copy_dest = self.path.source.join("..").join("wrappers").join(feature);
        
        if let Some(i) = implementation {
            match subpath {
                Some(s) => {
                    directory = directory.join(s);
                    copy_dest = copy_dest.join(s);
                    debug!("From {} building implementation: {} with path: {}", feature, i, s);
                },
                None => {
                    debug!("From {} building implementation: {}", feature, i)
                }
            }
            copy_dest = copy_dest.join("implementations").join(i);
            directory = directory
            .join("implementations")
            .join(i);
        } else {
            debug!("From {} building interface", feature);
        };


        let mut build: Command;
        if let Ok(path) = env::var("POLYWRAP_CLI_PATH") {
            let mut local_build = Command::new("node");
            local_build.current_dir(&directory);
            let executable_path = Path::new(path.as_str()).join("bin/polywrap");

            if !executable_path.exists() {
                let message = format!("Path: {} not found. Make sure to use absolute path. i.e: /home/user/toolchain/packages/cli", path);
                return Err(BuildError::CliLocalPathNotFound(message));
            }
            local_build.arg(executable_path).arg("build").arg("-v");
            build = local_build;
        } else {
            let mut npx_build = Command::new("npx");
            npx_build.current_dir(&directory);
            npx_build.arg("polywrap").arg("build").arg("-v");
            build = npx_build;
        }

        if let Ok(output) = build.output() {
            if output.status.code() == Some(0) {
                let message = if let Some(i) = implementation {
                    if let Some(s) = subpath {
                        format!("Build of feature: {}, with implementation: {} and subpath: {} succeed", feature, i, s)
                    } else {
                        format!("Build of feature: {}, with implementation: {} succeed", feature, i)
                    }
                } else {
                    format!("Build of interface from feature: {} succeed", feature)
                };
                debug!("{}", message);
            }
            if generate_folder {
                directory = directory.join("build");
                fs::create_dir_all(&copy_dest)?;
                if directory.join("wrap.wasm").exists() {
                    fs::copy(directory.join("wrap.wasm"), copy_dest.join("wrap.wasm"))?;
                }
                fs::copy(directory.join("wrap.info"), copy_dest.join("wrap.info"))?;
            }
        } else {
            return Err(BuildError::BuildExecutionError("Error on polywrap cli build command".to_string()));
        }

        Ok(())
    }

    async fn test(&self, feature: &str, implementation: &str, subpath: Option<&str>) -> Result<(), TestError> {
        let mut test = Command::new("npx");
        let mut directory = self.path.destination.join(feature);

        test.arg("polywrap").arg("test");

        if let Some(p) = subpath {
             let mut folders = fs::read_dir(&directory)?
                 .filter_map(|f| {
                     let file = f.unwrap();
                     if file.metadata().unwrap().is_dir() {
                        return Some(file.file_name().into_string().unwrap());
                     }

                     None
                 }).collect::<Vec<_>>();
            folders.sort();

            if !folders.last().eq(&Some(&String::from(p))) {
                return Ok(());
            }
            directory = directory
                .join(p)
                .join("implementations")
                .join(implementation);
            test.arg("-m").arg("../../../polywrap.test.yaml");
            let custom_config = directory.join("../../../client-config.ts").exists();
            if custom_config {
                test.arg("-c").arg("../../../client-config.ts");
            };
        } else {
            directory = directory
                .join("implementations")
                .join(implementation);
            test.arg("-m").arg("../../polywrap.test.yaml");
            let custom_config = directory.join("../../client-config.ts").exists();
            if custom_config {
                test.arg("-c").arg("../../client-config.ts");
            };
        }

        test.current_dir(&directory);
        test.arg("-o").arg("./output.json");

        if test.output().is_err() {
            return Err(TestError::TestExecutionError("Error on polywrap cli test command".to_string()))
        };

        let impl_name = directory.file_name().unwrap().to_str().unwrap();
        let results_dir = directory.join("output.json");
        let summary = Results::process(results_dir)?;

        let info_path = Path::new(self.path.destination.as_os_str())
            .join("..")
            .join("results.json");

        // Since this function is async (which means that is called from different threads)
        // we create a mutex object and lock it so we make sure that only one thread at a time
        // can manipulate the results file. After the context of this function is over, the lock
        // will be dropped automatically
        let mutex = Mutex::new(());
        let _guard = mutex.lock().unwrap();

        if let Ok(f) = fs::read(&info_path) {
            let result_str = String::from_utf8_lossy(&f).parse::<String>().unwrap();
            let mut results: Results = serde_json::from_str(result_str.as_str()).unwrap();
            results.info.entry(impl_name.to_string()).or_default().insert(feature.to_string(), summary);
            let results_file = fs::OpenOptions::new()
                .write(true)
                .open(&info_path)
                .unwrap();
            serde_json::to_writer_pretty(results_file, &results).unwrap();
        } else {
            let mut results = Results::new();
            let summaries = HashMap::from([
                (feature.to_string(), summary)
            ]);
            results.info.insert(impl_name.to_string(), summaries);
            let results_file = fs::OpenOptions::new()
                .write(true)
                .create(true)
                .open(&info_path)
                .unwrap();
            serde_json::to_writer_pretty(results_file, &results).unwrap();
        }
        Ok(())
    }
}
