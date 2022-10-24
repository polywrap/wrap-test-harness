use std::collections::HashMap;
use std::fs;
use std::fs::read_dir;
use std::path::{Path, PathBuf};
use std::process::Command;
use serde::{Deserialize, Serialize};
use crate::error::{ExecutionError, HandlerError, TestError, BuildError};
use crate::error::TestError::TestExecutionError;
use crate::generator::Generate;
use crate::Results;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct NewEngine {
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

impl NewEngine {
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

    pub fn execute<'a>(self, feature: Option<&'a str>, implementation: Option<&'a str>) -> Result<(), ExecutionError> {
        // let generator = Generate::new(
        //     self.path.destination.as_path(),
        //     self.path.source.as_path()
        // )?;
        // self.handler(generator.project, feature, implementation)?;
        self.handler(self.build, feature, implementation)?;
        self.handler(self.test, feature, implementation)?;
        Ok(())
    }

    fn handler<'a>(
        self,
        executor: impl Fn(Self, &str, &str) -> Result<(), ExecutionError>,
        feature: Option<&'a str>,
        implementation: Option<&'a str>
    ) -> Result<(), HandlerError>  {
        type FeatureImplMap = HashMap<String, Vec<String>>;
        let mut feature_map : FeatureImplMap = HashMap::new();

        match feature {
            None => {
                feature_map = read_dir(self.path.source)?.fold(feature_map, |mut current, f| {
                    current.insert(String::from(f?.file_name().to_str().unwrap()), vec![]);
                    current
                });
            },
            Some(f) => {
                feature_map.insert(f.to_string(), vec![]);
            }
        }

        let features = feature_map.into_keys();
        match implementation {
            None => {
                for feature in features {
                    let implementation_folder = self.path.source.join(feature);
                    let implementations = read_dir(implementation_folder)?.map(|i| {
                        i?.file_name().into_string().unwrap()
                    }).collect::<Vec<String>>();

                    feature_map.insert(feature.to_string(), implementations)
                }
            },
            Some(i) => {
                for feature in features {
                    feature_map.insert(feature.to_string(), vec![i.to_string()])
                }
            }
        }

        for feature in features {
            let f = feature_map.get(feature.as_str());
            for implementation in f.unwrap() {
                executor(feature.as_str(), implementation.as_str())
            }
        }

        Ok(())
    }

    fn build(self, feature: &str, implementation: &str) -> Result<(), BuildError> {
        let mut build = Command::new("node");
        let directory = self.path.destination
            .join(feature)
            .join("implementations")
            .join(implementation);
        build.current_dir(directory);
        build.arg(CLI_PATH).arg("build").arg("-v");

        match build.output() {
            Ok(output) => {
                // let error = String::from_utf8(t.stderr)?;
                // if !error.is_empty() {
                //     return Err(BuildError(BuildExecutionError("Build command has failed".to_string())))
                // }
                // let message = String::from_utf8(t.stdout)?;
                // t.status.success()?;
            }
            Err(e) => {
                return Ok(());
            }
        };
        Ok(())
    }

    fn test(self, feature: Option<&str>, implementation: Option<&str>) -> Result<(), TestError> {
        let mut test = Command::new("node");
        let directory = self.path.destination
            .join(feature)
            .join("implementations")
            .join(implementation);
        test.current_dir(directory);
        test.arg(CLI_PATH).arg("run")
            .arg("-m").arg("../../polywrap.test.yaml")
            .arg("-o").arg("./output.json");

        let custom_config = directory.join("../../client-config.ts").exists();
        if custom_config {
            test.arg("-c").arg("../../client-config.ts");
        };

        match test.output() {
            Ok(t) => {
                let error = String::from_utf8(t.stderr)?;
                if !error.is_empty() {
                    return Err(TestExecutionError("Run command has failed".to_string()))
                }
                // let message = String::from_utf8(t.stdout)?;

                let impl_name = directory.file_name().unwrap().to_str().unwrap();
                let results_dir = directory.join("output.json");
                let summary = Results::process(results_dir)?;

                let info_path = Path::new(self.path.destination.as_str())
                    .join("..")
                    .join("results.json");
                let feature_name = &self.feature;
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
                dbg!(e);
            }
        };
        Ok(())
    }
}
