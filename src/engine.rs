use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use crate::{Results};
use crate::constants::IMPLEMENTATIONS;

pub struct Engine {
    pub path: String,
    pub case_name: String,
}

pub enum Executor {
    Build,
    Run
}

impl Engine {
    pub fn new() -> Self {
        Self {
            path: String::new(),
            case_name: String::new()
        }
    }

    pub fn set_case(&mut self, path: &Path, name: &str) -> () {
        self.path = String::from(path.to_str().unwrap());
        self.case_name = String::from(name);
    }

    pub fn execute(&mut self, action: Executor) {
        let wrapper_path = Path::new(&self.path.as_str()).join(&self.case_name).join("implementations");
        for implementation in fs::read_dir(&wrapper_path).unwrap() {
            let dir = &wrapper_path.join(implementation.as_ref().unwrap().file_name());
            dbg!(dir.file_name().unwrap());
            match action {
                Executor::Build => {
                    println!(
                        "Building implementation: {} in test case {}",
                        implementation.as_ref().unwrap().file_name().to_str().unwrap(),
                        self.case_name
                    );
                    self.build(dir);
                },
                Executor::Run => {
                    let impl_path = implementation.as_ref().unwrap();
                    println!(
                        "Testing implementation: {} in case {}",
                        impl_path.file_name().to_str().unwrap(),
                        self.case_name
                    );
                    self.test(dir, &wrapper_path);
                }
            };

        }
    }

    pub fn build(&self, dir: &PathBuf)  {
        let mut build = Command::new("npx");
        build.current_dir(dir.canonicalize().unwrap());
        build.arg("polywrap").arg("build");

        match build.output() {
            Ok(t) => {
                let error = String::from_utf8(t.stderr).unwrap();
                if !error.is_empty() {
                    // TODO: Return error instead of panicking
                    dbg!(error);
                    panic!("Error installing packages")
                }
                let message = String::from_utf8(t.stdout).unwrap();
                println!("Message from build");
                dbg!(message);
                t.status.success()
            }
            Err(e) => {
                dbg!(e);
                false
            }
        };
    }

    pub fn test(&self, dir: &PathBuf, wrapper_path: &PathBuf) {
        let mut run = Command::new("npx");
        run.current_dir(dir.canonicalize().unwrap());
        run.arg("polywrap").arg("run")
            .arg("-m").arg("../../polywrap.test.yaml")
            .arg("-o").arg("./output.json");

        let custom_config = wrapper_path.join("../client-config.ts").exists();
        if custom_config {
            run.arg("-c").arg("../../client-config.ts");
        }

        match run.output() {
            Ok(_) => {
                let impl_path = dir.file_name().unwrap().to_str().unwrap();
                dbg!(wrapper_path);
                dbg!(impl_path);
                let results_dir = dir.join("output.json");
                let summary = Results::process(results_dir);

                let impl_name = IMPLEMENTATIONS.get(impl_path).unwrap().name;
                let info_path = Path::new(self.path.as_str())
                    .join("..")
                    .join("results-test.json");
                // let case_summary = self.path.entry(impl_name).or_default();


                let info = match fs::read(&info_path) {
                    Ok(i) => {

                    }
                    Err(_) => {
                        let results = Results::new();
                        // results.insert(case_summary, summary);
                        let f = fs::OpenOptions::new()
                            .write(true)
                            .create(true)
                            .open(info_path)
                            .unwrap();
                        serde_json::to_writer(f, &results).unwrap();
                    }
                };
                // dbg!(&results);

                // t.status.success()
            }
            Err(e) => {
                dbg!(e);
                // false
            }
        };
    }
}
