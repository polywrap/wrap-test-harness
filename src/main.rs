extern crate core;

mod generator;
mod constants;
mod result;
mod input;
mod manifest;
mod engine;
mod error;

use std::path::Path;
use std::process::Command;
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
    ).execute(feature, implementation, sanitized_args.wrappers_path.is_some()).await?;

    if let Some(p) = sanitized_args.wrappers_path.as_deref() {
        if !p.eq("./wrappers") {
            let path = Path::new(p);
            if path.exists() {
                if path.join("wrappers").exists() {
                    let mut remove_wrappers_folder = Command::new("rm");
                    remove_wrappers_folder.current_dir(path);
                    if let Err(e) = remove_wrappers_folder.arg("-rf").arg("wrappers").output() {
                        dbg!(e);
                    }
                };
                let mut move_build_folder = Command::new("mv");
                move_build_folder.arg("-f").arg("wrappers").arg(path).output()?;
            } else {
                return Err(HarnessError::BuildPathNotFound(format!("{} does not exists", path.display())))
            }
        };
    } else {
        Results::show()?;
    }
    Ok(())
}
