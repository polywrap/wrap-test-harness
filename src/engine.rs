use std::collections::HashMap;
use std::fs;
use std::fs::read_dir;
use std::path::{Path, PathBuf};
use std::process::Command;
use crate::{Results};
use crate::generator::Generate;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Engine {
    pub destination_path: String,
    pub source_path: String,
    pub feature: String,
    pub implementation: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum Executor {
    Build,
    Run,
    Generate
}

impl Engine {
    pub fn new() -> Self {
        Self {
            destination_path: String::new(),
            source_path: String::new(),
            feature: String::new(),
            implementation: String::new(),
        }
    }

    pub fn set_case(
        &mut self,
        destination_path: &Path,
        source_path: &Path,
        feature: String,
        implementation: String,
    )  {
        self.destination_path = String::from(destination_path.to_str().unwrap());
        self.source_path = String::from(source_path.to_str().unwrap());
        self.feature = feature;
        self.implementation = implementation;
    }

    pub fn execute(&mut self, action: Executor) {
        let wrapper_path = Path::new(
            &self.destination_path.as_str()
        ).join(&self.feature).join("implementations");
        let dir = &wrapper_path.join(&self.implementation);
        match action {
            Executor::Generate => {
                println!(
                    "Generating implementation: {} in test case {}",
                    &self.implementation,
                    self.feature
                );

                let destination_path = Path::new(self.destination_path.as_str());
                fs::create_dir(&destination_path.join(&self.feature)).unwrap();
                Generate::project(
                    destination_path,
                    Path::new(self.source_path.as_str()),
                    self.feature.as_str(),
                    self.implementation.as_str()
                );
            }
            Executor::Build => {
                if !self.implementation.is_empty() {
                    self.build(dir);
                } else {
                    for implementation in read_dir(&wrapper_path).unwrap() {
                        self.build(&implementation.unwrap().path());
                    }
                }
            }
            Executor::Run => {
                if !self.implementation.is_empty() {
                    self.run(dir);
                } else {
                    for implementation in read_dir(&wrapper_path).unwrap() {
                        self.run(&implementation.unwrap().path());
                    }
                }
                Results::show();
            }
        };
    }

    pub fn build(&self, dir: &PathBuf) {
        println!(
            "Building implementation: {} in test case {}",
            &self.implementation,
            self.feature
        );
        let mut build = Command::new("npx");
        build.current_dir(dir.canonicalize().unwrap());
        build.arg("../../../../../monorepo/packages/cli").arg("build").arg("-v");

        match build.output() {
            Ok(t) => {
                let error = String::from_utf8(t.stderr).unwrap();
                if !error.is_empty() {
                    dbg!(error);
                    // TODO: Return error instead of panicking
                //     panic!("Error installing packages")
                }
                let message = String::from_utf8(t.stdout).unwrap();
                // println!("Message from build");
                dbg!(message);
                t.status.success()
            }
            Err(e) => {
                dbg!(e);
                false
            }
        };
    }

    pub fn run(&self, dir: &PathBuf) {
        let mut run = Command::new("npx");
        run.current_dir(dir.canonicalize().unwrap());
        run.arg("../../../../../monorepo/packages/cli").arg("run")
            .arg("-m").arg("../../polywrap.test.yaml")
            .arg("-o").arg("./output.json");

        let custom_config = dir.join("../../client-config.ts").exists();
        if custom_config {
            run.arg("-c").arg("../../client-config.ts");
        }

        match run.output() {
            Ok(t) => {
                let error = String::from_utf8(t.stderr).unwrap();
                let message = String::from_utf8(t.stdout).unwrap();
                dbg!(message);
                dbg!(error);
                dbg!(&dir);
                let impl_name = dir.file_name().unwrap().to_str().unwrap();


                let results_dir = dir.join("output.json");
                let summary = Results::process(results_dir);

                let info_path = Path::new(self.destination_path.as_str())
                    .join("..")
                    .join("results.json");
                let feature_name = &self.feature;

                match fs::read(&info_path) {
                    Ok(f) => {
                        let result_str: String = String::from_utf8_lossy(&f).parse().unwrap();
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
    }
}
