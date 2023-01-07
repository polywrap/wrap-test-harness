#![feature(async_closure)]
#![feature(let_chains)]
#![feature(map_try_insert)]
extern crate core;

mod generator;
mod constants;
mod result;
mod input;
mod manifest;
mod engine;
mod error;

use std::path::Path;
use env_logger::{Builder, Env};

use crate::engine::{Engine};
use crate::result::{Results};
use crate::input::{BUILD_FOLDER, TEST_FOLDER};
use crate::error::HarnessError;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() -> Result<(), HarnessError> {
    let destination_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    let sanitized_args = &input::handle_args();
    let feature = sanitized_args.feature.as_deref();
    let implementation = sanitized_args.implementation.as_deref();

    Builder::from_env(Env::default().default_filter_or(sanitized_args.verbose.as_str())).init();

    Engine::start(
        destination_path,
        source_path
    ).execute(feature, implementation, sanitized_args.build).await?;

    if !sanitized_args.build {
        Results::show()?;
    }
    Ok(())
}
