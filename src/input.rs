use std::fs;

use clap::{Parser,Arg,Command,arg,value_parser, ArgAction};
use log::Level;

pub static BUILD_FOLDER: &str = "build";
pub static TEST_FOLDER: &str = "cases";

#[derive(Parser,Debug,Default)]
struct Args {
    #[arg(short, long)]
    implementation: Option<String>,
    #[arg(short, long)]
    feature: Option<String>,
    #[arg(short, long)]
    reset: bool,
    #[arg(short, long)]
    wrappers_path: Option<String>,
    #[arg(short, long)]
    verbose: Option<u8>,
    #[arg(short, long)]
    passthrough: Option<Vec<String>>,
}

impl Args {
    fn parse() -> Self {
        let default_build_path = "./wrappers";

        let build_arg = Arg::new("create_built_wrappers")
            .short('w')
            .long("wrappers_path")
            .required(false)
            .default_missing_value(default_build_path)
            .default_value("")
            .require_equals(true)
            .num_args(0..=1)
            .help("An argument that takes a boolean value or a custom build path string");

        let implementation_args = Arg::new("implementation")
            .short('i')
            .long("implementation")
            .required(false)
            .help("Optional: Implementation to be executed (i.e: (rs/as)");

        let feature_args = Arg::new("feature")
            .short('f')
            .long("feature")
            .required(false);

        let reset = Arg::new("reset")
            .short('r')
            .long("reset")
            .required(false)
            .action(ArgAction::SetTrue);

        let verbose = Arg::new("verbose")
            .short('v')
            .long("verbose")
            .required(false)
            .default_value("1")
            .value_parser(value_parser!(i32));

        let passthrough_args = Arg::new("passthrough")
            .short('p')
            .long("passthrough")
            .action(ArgAction::Append)
            .value_parser(value_parser!(String))
            .required(false);


        let app = Command::new("wasm-test-harness")
            .arg(build_arg)
            .arg(implementation_args)
            .arg(feature_args)
            .arg(reset)
            .arg(verbose)
            .arg(passthrough_args)
            .get_matches();

        let wrappers_path =  if let Some(b) = app.get_one::<String>("create_built_wrappers") {
            if b.eq(&String::new()) {
                None
            } else {
                Some(b.to_owned())
            }
        } else {
            None
        };

        let implementation = app.get_one::<String>("implementation").map(|b| b.to_owned());
        let feature = app.get_one::<String>("feature").map(|b| b.to_owned());
        let reset = app.try_contains_id("reset").unwrap();
        let options = app.get_many::<String>("passthrough").map(|b| b.to_owned().cloned().collect::<Vec<String>>());

        let verbose = if let Some(v) = app.get_one("verbose") {
            match v {
                0 | 1 | 2 => v.to_owned() as u8,
                _ => panic!("Verbose level not accept")
            }
        } else {
            0
        };

        Args {
            implementation,
            feature,
            reset,
            wrappers_path,
            verbose: Some(verbose),
            passthrough: options
        }
    }
}

pub struct SanitizedArgs {
    pub implementation: Option<String>,
    pub feature: Option<String>,
    pub wrappers_path: Option<String>,
    pub verbose: Level,
    pub passthrough: Option<Vec<String>>
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
        wrappers_path: args.wrappers_path,
        verbose,
        passthrough: args.passthrough
    }

}
