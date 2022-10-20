use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum NewExecutor {
    Generate,
    Build(PathBuf),
    Run(PathBuf),
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

impl NewEngine {
    pub fn start(destination: &Path, source: &Path) -> Self {
        Self {
            path: NewEnginePath {
                destination: destination.to_path_buf(),
                source: source.to_path_buf()
            },
            feature: None,
            implementation: None,
        }
    }

    pub fn set_feature(mut self, feature: String) {
        self.feature = Some(feature);
    }

    pub fn set_implementation(mut self, implementation: String) {
        self.implementation = Some(implementation);
    }

    pub fn execute(action: NewExecutor) {
        match action {
            NewExecutor::Generate => {}
            NewExecutor::Build(path) => {}
            NewExecutor::Run(path) => {}
        };
    }
}
