use std::fs;

use clap::{Parser};

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
    #[arg(short, long, action = clap::ArgAction::Count)]
    verbose: u8,
    #[arg(short, long)]
    build: Option<bool>,
}

pub struct SanitizedArgs {
    pub implementation: Option<String>,
    pub feature: Option<String>,
    pub build: bool
}

pub fn handle_args() -> SanitizedArgs {
    let args = Args::parse();

    match fs::create_dir(BUILD_FOLDER) {
        Err(_) => {
            if args.reset {
                fs::remove_dir_all(BUILD_FOLDER).unwrap();
                fs::create_dir(BUILD_FOLDER).unwrap();
                fs::remove_file("results.json").unwrap_or_default();
                fs::remove_dir_all("./wrappers").unwrap_or_default()
            }
        }
        _ => {}
    }

    // You can see how many times a particular flag or argument occurred
    // Note, only flags can have multiple occurrences
    // match args.verbose {
    //     0 => println!("Debug mode is off"),
    //     1 => println!("Debug mode is kind of on"),
    //     2 => println!("Debug mode is on"),
    //     _ => println!("Don't be crazy"),
    // }

    let mut build_only = false;
    if let Some(b) = args.build {
        build_only = b;
    }

    return SanitizedArgs {
        implementation: args.implementation,
        feature: args.feature,
        build: build_only
    }

}
