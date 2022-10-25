use std::collections::HashMap;
use std::{fs};
use std::fs::read_dir;
use std::path::{Path, PathBuf};
use std::process::Command;
use crate::{Results};
use crate::generator::{Generate};
use serde::{Deserialize, Serialize};
use crate::error::{BuildError, TestError, ExecutionError};
use crate::error::BuildError::BuildExecutionError;
use crate::error::TestError::TestExecutionError;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Engine {
    pub destination_path: String,
    pub source_path: String,
    pub feature: String,
    pub implementation: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum Executor {
    Build,
    Run,
    Generate
}

impl Engine {
    pub fn new() -> Self {
        Self {
            destination_path: String::new(),
            source_path: String::new(),
            feature: String::new(),
            implementation: String::new(),
        }
    }

    pub fn set_case(
        &mut self,
        destination_path: &Path,
        source_path: &Path,
        feature: String,
        implementation: String,
    )  {
        self.destination_path = String::from(destination_path.to_str().unwrap());
        self.source_path = String::from(source_path.to_str().unwrap());
        self.feature = feature;
        self.implementation = implementation;
    }

    pub fn execute(&self, action: Executor) -> Result<(), ExecutionError> {
        let wrapper_path = Path::new(
            &self.destination_path.as_str()
        ).join(&self.feature).join("implementations");
        let dir = &wrapper_path.join(&self.implementation);
        match action {
            Executor::Generate => {
                let destination_path = Path::new(self.destination_path.as_str());
                Generate::new(
                    destination_path.canonicalize().unwrap().to_path_buf(),
                    PathBuf::from(&self.source_path),
                ).project(
                    self.feature.as_str(),
                    self.implementation.as_str()
                )?;
            }
            _ => {}
        };
        Ok(())
    }
}
