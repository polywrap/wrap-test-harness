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
    let feature = match &sanitized_args.feature {
        Some(t) =>  Some(t.as_str()),
        None => None
    };

    let implementation = match &sanitized_args.implementation {
        Some(t) => Some(t.as_str()),
        None => None
    };

    Engine::start(
        destination_path,
        source_path
    ).execute(feature, implementation)?;
    Results::show()?;
    Ok(())
}
