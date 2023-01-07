use std::fs;

use clap::{Parser};
use log::Level;

pub static BUILD_FOLDER: &str = "build";
pub static TEST_FOLDER: &str = "tests";

#[derive(Parser,Debug,Default)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    implementation: Option<String>,
    #[arg(short, long)]
    feature: Option<String>,
    #[arg(short, long)]
    reset: bool,
    #[arg(short, long)]
    build: bool,
    #[arg(short, long)]
    verbose: Option<u8>,
}

pub struct SanitizedArgs {
    pub implementation: Option<String>,
    pub feature: Option<String>,
    pub build: bool,
    pub verbose: Level
}

pub fn handle_args() -> SanitizedArgs {
    let args = Args::parse();

    if fs::create_dir(BUILD_FOLDER).is_err() && args.reset {
        fs::remove_dir_all(BUILD_FOLDER).unwrap_or_default();
        fs::create_dir(BUILD_FOLDER).unwrap_or_default();
        fs::remove_file("results.json").unwrap_or_default();
        fs::remove_dir_all("./wrappers").unwrap_or_default()
    }

    let verbose = if let Some(v) = args.verbose {
        match v {
            0 => Level::Info,
            1 => Level::Debug,
            2 => Level::Error,
            _ => panic!("Verbose level not accept")
        }
    } else {
        Level::Info
    };

    SanitizedArgs {
        implementation: args.implementation,
        feature: args.feature,
        build: args.build,
        verbose
    }

}
