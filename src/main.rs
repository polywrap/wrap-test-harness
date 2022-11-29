extern crate core;

mod generator;
mod constants;
mod result;
mod input;
mod manifest;
mod engine;
mod error;

use std::path::Path;

use crate::engine::{Engine};
use crate::result::{Results};
use crate::input::{BUILD_FOLDER, TEST_FOLDER};
use crate::error::HarnessError;

fn main() -> Result<(), HarnessError> {
    let destination_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    let sanitized_args = &input::handle_args();
    let feature = sanitized_args.feature.as_deref();
    let implementation = sanitized_args.implementation.as_deref();

    Engine::start(
        destination_path,
        source_path
    ).execute(feature, implementation, sanitized_args.build)?;

    if !sanitized_args.build {
        Results::show()?;
    }
    Ok(())
}
