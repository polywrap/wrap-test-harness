use std::collections::HashMap;
use std::fs;
use std::fs::read_dir;
use std::path::{Path, PathBuf};
use std::process::Command;
use serde::{Deserialize, Serialize};
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

const CLI_PATH: &'static str = "../../../../../monorepo/packages/cli/bin/polywrap";

type ComplexCase = HashMap<String, Option<Vec<String>>>;

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

    pub fn execute(&self, feature: Option<&str>, implementation: Option<&str>) -> Result<(), ExecutionError> {
        let generator = Generate::new(
            self.path.destination.to_path_buf(),
            self.path.source.to_path_buf()
        );
        self.handler(
            Box::new(|a, b, c| generator.project(a, b, c).map_err(|e| ExecutionError::GenerateError(e))),
            feature,
            implementation
        )?;
        self.handler(
            Box::new(|a, b, c| self.build(a,b,c).map_err(|e| ExecutionError::BuildError(e))),
            feature,
            implementation
        )?;

        self.handler(
            Box::new(
                |a, b, _| {
                    if let Some(i) = b {
                        return self.test(a, i).map_err(|e| ExecutionError::TestError(e));
                    }
                    Ok(())
                }),
            feature,
            implementation
        )?;
        Ok(())
    }

    fn handler<'a>(
        &self,
        executor: Box<dyn Fn(&str, Option<&str>, Option<&str>) -> Result<(), ExecutionError> + 'a>,
        feature: Option<&str>,
        implementation: Option<&str>
    ) -> Result<(), ExecutionError>  {
        type FeatureImplMap = HashMap<String, CaseType>;
        let mut feature_map : FeatureImplMap = HashMap::new();
        match feature {
            None => {
                feature_map = read_dir(&self.path.source)?.fold(feature_map, |mut current, f| {
                    current.insert(String::from(f.unwrap().file_name().to_str().unwrap()), CaseType::Simple(vec![]));
                    current
                });
            },
            Some(f) => {
                feature_map.insert(f.to_string(), CaseType::Simple(vec![]));
            }
        }

        match implementation {
            None => {
                for feature in feature_map.clone().into_keys() {
                    let feature_folder = self.path.source.join(&feature);
                    let implementation_folder = feature_folder.join("implementations");
                    if implementation_folder.exists() {
                        let implementations = read_dir(implementation_folder)?.map(|i| {
                            i.unwrap().file_name().into_string().unwrap()
                        }).collect::<Vec<String>>();
                        feature_map.insert(feature.to_string(), CaseType::Simple(implementations));
                    } else {
                        let mut complex_case_map: ComplexCase = HashMap::new();
                        read_dir(feature_folder)?.into_iter().filter(|i| {
                            i.as_ref().unwrap().metadata().unwrap().is_dir()
                        }).for_each(|entry| {
                            dbg!(&entry);
                            let dir = entry.unwrap();
                            let step_name = dir.file_name().into_string().unwrap();
                            let step_implementations = dir.path().join("implementations");
                            if step_implementations.exists() {
                                let implementations = read_dir(step_implementations).unwrap().map(|i| {
                                    i.unwrap().file_name().into_string().unwrap()
                                }).collect::<Vec<String>>();
                                complex_case_map.insert(step_name, Some(implementations));
                            } else {
                                complex_case_map.insert(step_name, None);
                            }
                        });
                        feature_map.insert(feature, CaseType::Complex(complex_case_map));
                    };
                };
            },
            Some(i) => {
                for feature in feature_map.clone().into_keys() {
                    feature_map.insert(feature.to_string(), CaseType::Simple(vec![i.to_string()]));
                }
            }
        }

        for feature in feature_map.clone().into_keys() {
            let f = feature_map.get(feature.as_str());
            match f.unwrap() {
                CaseType::Simple(implementations) => {
                    for implementation in implementations {
                        executor(feature.as_str(), Some(implementation.as_str()), None)?;
                    }
                }
                CaseType::Complex(cases) => {
                    dbg!(&feature_map);
                    let mut steps = cases.clone().into_keys().map(|c| c).collect::<Vec<String>>();
                    steps.sort();
                    for step in steps {
                        let implementations = cases.get(step.as_str()).unwrap();
                        if let Some(implementation) = implementations {
                            for i in implementation {
                                executor(feature.as_str(), Some(i.as_str()), Some(step.as_str()))?;
                            }
                        } else {
                            executor(feature.as_str(), None, Some(step.as_str()))?;
                        }
                    }
                }
            }
        }
        Ok(())
    }

    fn build(&self, feature: &str, implementation: Option<&str>, subpath: Option<&str>) -> Result<(), BuildError> {
        let mut build = Command::new("node");
        let mut directory = self.path.destination.join(feature);

        if let Some(p) = subpath {
            directory = directory.join(p);
        };

        if let Some(i) = implementation {
            directory = directory
                .join("implementations")
                .join(i);
        };
        build.current_dir(directory);
        build.arg(CLI_PATH).arg("build").arg("-v");

        match build.output() {
            Ok(output) => {
                let error = String::from_utf8(output.stderr)?;
                if !error.is_empty() {
                    return Err(BuildError::BuildExecutionError("Build command has failed".to_string()));
                }
                // let message = String::from_utf8(t.stdout)?;
                // t.status.success()?;
            }
            Err(e) => {
                // TODO: Return error
                dbg!(e);
                return Ok(());
            }
        };
        Ok(())
    }

    fn test(&self, feature: &str, implementation: &str) -> Result<(), TestError> {
        let mut test = Command::new("node");
        let directory = self.path.destination
            .join(feature)
            .join("implementations")
            .join(implementation);
        test.current_dir(&directory);
        test.arg(CLI_PATH).arg("test")
            .arg("-m").arg("../../polywrap.test.yaml")
            .arg("-o").arg("./output.json");

        let custom_config = directory.join("../../client-config.ts").exists();
        if custom_config {
            test.arg("-c").arg("../../client-config.ts");
        };

        match test.output() {
            Ok(output) => {
                let error = String::from_utf8(output.stderr)?;
                if !error.is_empty() {
                    return Err(TestError::TestExecutionError(error))
                }
                // let message = String::from_utf8(t.stdout)?;

                let impl_name = directory.file_name().unwrap().to_str().unwrap();
                let results_dir = directory.join("output.json");
                let summary = Results::process(results_dir)?;

                let info_path = Path::new(self.path.destination.as_os_str())
                    .join("..")
                    .join("results.json");
                let feature_name = feature.clone();
                match fs::read(&info_path) {
                    Ok(f) => {
                        let result_str = String::from_utf8_lossy(&f).parse::<String>().unwrap();
                        let mut results: Results = serde_json::from_str(result_str.as_str()).unwrap();
                        results.info.entry(impl_name.to_string()).or_default().insert(feature_name.to_string(), summary);
                        let results_file = fs::OpenOptions::new()
                            .write(true)
                            .open(&info_path)
                            .unwrap();
                        serde_json::to_writer_pretty(results_file, &results).unwrap();
                    }
                    Err(_) => {
                        let mut results = Results::new();
                        let summaries = HashMap::from([
                            (feature_name.to_string(), summary)
                        ]);
                        results.info.insert(impl_name.to_string(), summaries);
                        let results_file = fs::OpenOptions::new()
                            .write(true)
                            .create(true)
                            .open(&info_path)
                            .unwrap();
                        serde_json::to_writer_pretty(results_file, &results).unwrap();
                    }
                };
            }
            Err(e) => {
                // TODO: Return error
                dbg!(e);
            }
        };
        Ok(())
    }
}
