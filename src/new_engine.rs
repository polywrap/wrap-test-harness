use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
enum NewExecutor {
    Generate(),
    Build(PathBuf),
    Run(PathBuf),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct NewEngine<'a> {
    pub destination_path: &'a Path,
    pub source_path: &'a Path,
    pub feature: Option<&'a str>,
    pub implementation: Option<&'a str>,
}

impl NewEngine {
    pub fn start(destination: &Path, source: &Path) -> Self {
        Self {
            destination_path: destination,
            source_path: source,
            feature: None,
            implementation: None
        }
    }

    pub fn set_feature(mut self, feature: &str) {
        self.feature = Some(feature);
    }

    pub fn set_implementation(mut self, implementation: &str) {
        self.implementation = Some(implementation);
    }

    pub fn execute(action: NewExecutor) {
        match action {
            NewExecutor::Generate() => {

            },
            NewExecutor::Build(path) => {

            },
            NewExecutor::Run(path) => {

            },
        };
    }
}
