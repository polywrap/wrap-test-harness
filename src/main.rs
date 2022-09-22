mod generator;
mod constants;
mod result;

use std::{fs, io};
use std::collections::HashMap;
use std::path::Path;
use std::process::Command;
use crate::constants::IMPLEMENTATIONS;

use crate::generator::{Generator, Results};
use crate::result::{get_summary};

const BUILD_FOLDER: &str = "build";
const TEST_FOLDER: &str = "tests";

fn main() -> io::Result<()> {
    let dest_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    match fs::create_dir(BUILD_FOLDER) {
        Err(_) => {
            fs::remove_dir_all(BUILD_FOLDER)?;
            fs::create_dir(BUILD_FOLDER)?;
        }
        _ => {}
    }

    let generator = Generator::new(dest_path, source_path);
    let mut results = Results {
        version: "1",
        info: HashMap::new()
    };

    for entry in fs::read_dir(&source_path)? {
        let file_name = &entry?.file_name();
        println!("Generating test case: {}", &file_name.to_str().unwrap());
        generator.generate_project(&file_name.to_str().unwrap()).unwrap();
    }

    for entry in fs::read_dir(&source_path)? {
        let file_name = &entry?.file_name();
        let wrapper_path = dest_path.join(&file_name).join("implementations");
        for implementation in fs::read_dir(&wrapper_path)? {
            let dir = &wrapper_path.join(implementation.as_ref().unwrap().file_name());
            println!(
                "Building implementation: {} in test case {}",
                implementation.as_ref().unwrap().file_name().to_str().unwrap(),
                file_name.to_str().unwrap()
            );
            let mut build = Command::new("npx");
            build.current_dir(dir.canonicalize().unwrap());
            build.arg("polywrap").arg("build");

            let status = match build.output() {
                Ok(t) => {
                    let error = String::from_utf8(t.stderr).unwrap();
                    let message = String::from_utf8(t.stdout).unwrap();
                    dbg!(error);
                    dbg!(message);
                    t.status.success()
                }
                Err(e) => {
                    dbg!(e);
                    false
                }
            };
            dbg!(status);
        }
    }

    for entry in fs::read_dir(&source_path)? {
        let file_name = entry?.file_name();
        let wrapper_path = dest_path.join(&file_name).join("implementations");
        for implementation in fs::read_dir(&wrapper_path)? {
            let impl_path = implementation.as_ref().unwrap();
            let dir = &wrapper_path.join(&impl_path.file_name());
            let case = String::from(file_name.to_str().unwrap());
            println!(
                "Testing implementation: {} in case {}",
                impl_path.file_name().to_str().unwrap(),
                case
            );
            let mut build = Command::new("npx");
            build.current_dir(dir.canonicalize().unwrap());
            build
                .arg("polywrap").arg("run")
                .arg("-m").arg("../../polywrap.test.yaml")
                .arg("-o").arg("./output.json");

            let custom_config = wrapper_path.join("../client-config.ts").exists();
            if custom_config {
                build.arg("-c").arg("../../client-config.ts");
            }

            let status = match build.output() {
                Ok(t) => {
                    let results_dir = dir.join("output.json");
                    let summary = get_summary(results_dir);

                    let impl_path = implementation.as_ref().unwrap();
                    let impl_name = IMPLEMENTATIONS.get(impl_path.file_name().to_str().unwrap()).unwrap().name;

                    let case_summary = results.info.entry(impl_name).or_default();
                    case_summary.insert(case, summary);

                    dbg!(&results);

                    t.status.success()
                }
                Err(e) => {
                    dbg!(e);
                    false
                }
            };
            dbg!(status);
        }
    }

    Ok(())
}
