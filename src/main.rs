extern crate core;

mod generator;
mod constants;
mod result;
mod engine;
mod input;
mod manifest;
mod new_engine;
mod error;

use std::{fs, io};
use std::path::Path;

use crate::engine::{Engine, Executor};
use crate::result::{Results};
use crate::input::{BUILD_FOLDER, TEST_FOLDER};
use crate::error::HarnessError;

fn main() -> Result<(), HarnessError> {
    let destination_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    let sanitized_args = &input::handle_args();
    let feature = &sanitized_args.feature;
    let implementation = &sanitized_args.implementation;

    // @TODO: Remove this match, it's unnecessary
    let feature = match feature.as_str() {
        "" => None,
        f => Some(f)
    };
    let mut engine = Engine::new();

    // let engine = Engine::start(
    //     destination_path,
    //     source_path,
    //     feature,
    //     implementation,
    // );

    if feature.is_none() {
        for entry in fs::read_dir(&source_path)? {
            engine.set_case(
                destination_path,
                source_path,
                String::from(entry?.file_name().to_str().unwrap()),
                implementation.to_string(),
            );
            engine.execute(Executor::Generate)?;
        }

        for entry in fs::read_dir(&source_path)? {
            engine.set_case(
                destination_path,
                source_path,
                String::from(entry?.file_name().to_str().unwrap()),
                implementation.to_string(),
            );
            engine.execute(Executor::Build)?;
        }

        for entry in fs::read_dir(&source_path)? {
            engine.set_case(
                destination_path,
                source_path,
                String::from(entry?.file_name().to_str().unwrap()),
                implementation.to_string(),
            );
            engine.execute(Executor::Run)?;
        }
        return Ok(());
    }

    engine.set_case(
        destination_path,
        source_path,
        feature.unwrap().to_string(),
        implementation.to_string(),
    );
    engine.execute(Executor::Generate)?;
    engine.execute(Executor::Build)?;
    engine.execute(Executor::Run)?;

    Ok(())
}
