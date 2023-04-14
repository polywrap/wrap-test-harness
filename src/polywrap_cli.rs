use std::env;
use std::path::Path;
use std::process::Command;
use crate::error::CliError;

pub struct PolywrapCli {
    pub command: Result<Command, CliError>,
}

impl PolywrapCli {
    pub fn new() -> PolywrapCli {
        PolywrapCli {
            command: match env::var("POLYWRAP_CLI_PATH") {
                Ok(path) => {
                    let mut command = Command::new("node");
                    let executable_path = Path::new(path.as_str()).join("bin/polywrap");

                    if !executable_path.exists() {
                        let message = format!("Path: {} not found. Make sure to use absolute path. i.e: /home/user/toolchain/packages/cli", path);
                        Err(CliError::CliLocalPathNotFound(message))
                    } else {
                        command.arg(executable_path);
                        Ok(command)
                    }
                },
                Err(_) => {
                    let mut command = Command::new("npx");
                    command.arg("polywrap@0.10.0");
                    Ok(command)
                }
            }
        }
    }
}
