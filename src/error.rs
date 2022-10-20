use std::fs::File;
use std::io;
use std::string::FromUtf8Error;
use thiserror::Error;
use crate::error::GenerateError::ReadError;
use crate::error::ResultError::FileNotFound;

#[derive(Error, Debug)]
pub enum HarnessError {
    #[error(transparent)]
    EngineError(#[from] EngineError),
    #[error(transparent)]
    FileNotFound(#[from] io::Error)
}

#[derive(Error, Debug)]
pub enum EngineError {
    #[error(transparent)]
    GenerateError(#[from] GenerateError),
    #[error(transparent)]
    BuildError(#[from] BuildError),
    #[error(transparent)]
    TestError(#[from] TestError),
    #[error(transparent)]
    ShowResultsError(#[from] ShowResultsError)
}

#[derive(Error, Debug)]
pub enum GenerateError {
    #[error("Read error")]
    ReadError(String),
    #[error("Feature folder could not be created")]
    CreateFeatureDirErr,
    #[error("Missing expected file")]
    MissingExpectedFile(String, String),
    #[error(transparent)]
    GenerateTestManifestError(#[from] GenerateTestManifestError),
    #[error(transparent)]
    GenerateImplementationError(#[from] GenerateImplementationError)
}

#[derive(Error, Debug)]
pub enum GenerateTestManifestError {
    #[error(transparent)]
    FileError(#[from] io::Error),
    #[error(transparent)]
    JsonParseError(#[from] serde_json::Error),
    #[error(transparent)]
    YamlParseError(#[from] serde_yaml::Error)
}

#[derive(Error, Debug)]
pub enum GenerateImplementationError {
    #[error(transparent)]
    FileError(#[from] io::Error),
    #[error("Directory entry not found")]
    DirEntryError(String),
    #[error(transparent)]
    CreateImplementationError(#[from] CreateImplementationError)
}

#[derive(Error, Debug)]
pub enum CreateImplementationError {
    #[error(transparent)]
    FileError(#[from] io::Error),
    #[error("File manipulation error")]
    OpenFileError(File),
    #[error(transparent)]
    JsonParseError(#[from] serde_json::Error),
    #[error(transparent)]
    MergeManifestError(#[from] MergeManifestError),
    #[error(transparent)]
    YamlParseError(#[from] serde_yaml::Error)
}


impl From<io::Error> for GenerateError {
    fn from(e: io::Error) -> Self {
        ReadError(e.to_string())
    }
}

#[derive(Error, Debug)]
pub enum MergeManifestError {
    #[error("Source in manifest not found")]
    SourceNotFound,
    #[error("Project in manifest not found")]
    ProjectNotFound,
}

#[derive(Error, Debug)]
pub enum BuildError {
    #[error(transparent)]
    ConsoleOutputError(#[from] FromUtf8Error),
    #[error("Build folder not found")]
    BuildFolderNotFound,
    #[error(transparent)]
    FileNotFound(#[from] io::Error),
    #[error("Build execution error")]
    BuildExecutionError(String),
}

#[derive(Error, Debug)]
pub enum TestError {
    #[error(transparent)]
    ConsoleOutputError(#[from] FromUtf8Error),
    #[error("Test folder not found")]
    TestFolderNotFound,
    #[error(transparent)]
    ResultError(#[from] ResultError),
    #[error(transparent)]
    FileNotFound(#[from] io::Error),
    #[error("Test execution error")]
    TestExecutionError(String),
}

#[derive(Error, Debug)]
pub enum ResultError {
    #[error("Result file not found")]
    FileNotFound(String)
}

impl From<io::Error> for ResultError {
    fn from(_: io::Error) -> Self {
        FileNotFound("Results file has not been found".to_string())
    }
}

#[derive(Error, Debug)]
pub enum ShowResultsError {
    #[error(transparent)]
    FileNotFound(#[from] io::Error),
}