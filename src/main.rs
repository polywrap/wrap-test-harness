extern crate core;

mod generator;
mod constants;
mod result;
mod engine;

use std::{env, fs, io};
use std::path::Path;
use crate::engine::{Engine, Executor};

use crate::generator::{Generator};
use crate::result::{Results};

static BUILD_FOLDER: &str = "build";
static TEST_FOLDER: &str = "tests";

fn main() -> io::Result<()> {
    let dest_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    let mut args = env::args();
    args.next();
    let case_name = match args.next() {
        Some(arg) => arg,
        None => String::new()
    };

    match fs::create_dir(BUILD_FOLDER) {
        Err(_) => {
            fs::remove_dir_all(BUILD_FOLDER)?;
            fs::create_dir(BUILD_FOLDER)?;
        }
        _ => {}
    }

    let generator = Generator::new(dest_path, source_path);
    let mut engine = Engine::new();

    if case_name.is_empty() {
        for entry in fs::read_dir(&source_path)? {
            let file_name = &entry?.file_name();
            println!("Generating test case: {}", &file_name.to_str().unwrap());
            generator.generate_project(&file_name.to_str().unwrap()).unwrap();
        }

        for entry in fs::read_dir(&source_path)? {
            let file_name = &entry?.file_name();
            engine.set_case(dest_path, file_name.to_str().unwrap());
            engine.execute(Executor::Build);
        }

        for _ in fs::read_dir(&source_path)? {
            engine.execute(Executor::Run);
        }
        return Ok(());
    }

    generator.generate_project(case_name.as_str()).unwrap();
    engine.set_case(dest_path, case_name.as_str());
    engine.execute(Executor::Build);
    engine.execute(Executor::Run);

    Ok(())
}
