use std::path::{Path, PathBuf};
use std::process::Command;
use serde::{Deserialize, Serialize};
use crate::error::BuildError::BuildExecutionError;
use crate::error::EngineError;
use crate::error::EngineError::BuildError;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum NewExecutor {
    Generate,
    Build(String, String),
    Run(String, String),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct NewEngine {
    pub path: NewEnginePath,
    pub feature: Option<String>,
    pub implementation: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct NewEnginePath {
    pub destination: PathBuf,
    pub source: PathBuf,
}

const CLI_PATH: &'static str = "../../../../../monorepo/packages/cli/bin/polywrap";

impl NewEngine {
    pub fn new(destination: &Path, source: &Path) -> Self {
        Self {
            path: NewEnginePath {
                destination: destination.to_path_buf(),
                source: source.to_path_buf(),
            },
            feature: None,
            implementation: None,
        }
    }

    pub fn execute(self, action: NewExecutor) -> Result<(), EngineError> {
        match action {
            NewExecutor::Generate => {}
            NewExecutor::Build(feature, implementation) => {
                let mut build = Command::new("node");
                let directory = self.path.destination
                    .join(feature)
                    .join("implementations")
                    .join(implementation);
                build.current_dir(directory);
                build.arg(CLI_PATH).arg("build").arg("-v");

                match build.output() {
                    Ok(t) => {
                        // let error = String::from_utf8(t.stderr)?;
                        // if !error.is_empty() {
                        //     return Err(BuildError(BuildExecutionError("Build command has failed".to_string())))
                        // }
                        // let message = String::from_utf8(t.stdout)?;
                        // t.status.success()?;
                    }
                    Err(e) => {
                        return Ok(());
                    }
                };
                ()
            }
            NewExecutor::Run(feature, implementation) => {}
        };
        Ok(())
    }
}
