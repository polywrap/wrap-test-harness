extern crate core;

mod generator;
mod constants;
mod result;
mod engine;

use std::{fs, io};
use std::path::Path;
use clap::{Parser, Arg, command, ArgAction};

use crate::engine::{Engine, Executor};
use crate::generator::{Generator};
use crate::result::{Results};

static BUILD_FOLDER: &str = "build";
static TEST_FOLDER: &str = "tests";

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    implementation: Option<String>,
    feature: Option<String>,
    verbose: Option<bool>,
    reset: Option<bool>
}

fn main() -> io::Result<()> {
    let dest_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    let args = Args::parse();
    dbg!(args);
    let case_name = String::new();
    // let case_name = match args.feature {
    //     Some(arg) => arg,
    //     None => String::new()
    // };
    //
    // let implementation = match args.implementation {
    //     Some(arg) => arg,
    //     None => String::new()
    // };
    //
    // if prune.is_some() {
    //     match fs::create_dir(BUILD_FOLDER) {
    //         Err(_) => {
    //             fs::remove_dir_all(BUILD_FOLDER)?;
    //             fs::create_dir(BUILD_FOLDER)?;
    //         }
    //         _ => {}
    //     }
    // };

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

        for entry in fs::read_dir(&source_path)? {
            let file_name = &entry?.file_name();
            engine.set_case(dest_path, file_name.to_str().unwrap());
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
