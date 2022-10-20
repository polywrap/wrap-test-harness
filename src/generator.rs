use std::{fs, io};
use std::fs::File;
use std::io::{BufReader};
use std::path::{Path, PathBuf};
use serde_json;
use serde_yaml;
use thiserror::Error;
use crate::constants::{IMPLEMENTATIONS};
use crate::generator::GenerateError::{MissingExpectedFile, ReadError};
use crate::manifest::{Manifest, MergeManifestError, Workflow};

const CUSTOM_MANIFEST: &str = "polywrap.json";
const EXPECTED_FILES: [&str; 3] = ["workflow.json", "schema.graphql", "implementations"];

#[derive(Error, Debug)]
pub enum GenerateError {
    #[error("Read error")]
    ReadError(String),
    #[error("Feature folder could not be created")]
    CreateFeatureDirErr,
    #[error("Missing expected file")]
    MissingExpectedFile(String, String),
    #[error("Generate test manifest from workflow failed")]
    GenerateTestManifestError(#[from] GenerateTestManifestError),
    #[error("Generate implementation files failed")]
    GenerateImplementationError(#[from] GenerateImplementationError)
}

#[derive(Error, Debug)]
pub enum GenerateTestManifestError {
    #[error("File manipulation error")]
    FileError(#[from] io::Error),
    #[error("JSON parse error")]
    JsonParseError(#[from] serde_json::Error),
    #[error("YAML Parse error")]
    YamlParseError(#[from] serde_yaml::Error)
}

#[derive(Error, Debug)]
pub enum GenerateImplementationError {
    #[error("File manipulation error")]
    FileError(#[from] io::Error),
    #[error("Directory entry not found")]
    DirEntryError(String),
    #[error("Create implementation failed")]
    CreateImplementationError(#[from] CreateImplementationError)
}

#[derive(Error, Debug)]
pub enum CreateImplementationError {
    #[error("File manipulation error")]
    FileError(#[from] io::Error),
    #[error("File manipulation error")]
    OpenFileError(File),
    #[error("JSON parse error")]
    JsonParseError(#[from] serde_json::Error),
    #[error("Manifest merge error")]
    MergeManifestError(#[from] MergeManifestError),
    #[error("YAML Parse error")]
    YamlParseError(#[from] serde_yaml::Error)
}


impl From<io::Error> for GenerateError {
    fn from(e: io::Error) -> Self {
        ReadError(e.to_string())
    }
}

pub struct Generate<'a> {
    pub dest_path: &'a Path,
    pub source_path: &'a Path,
}

impl Generate<'_> {
    pub fn project<'a>(
        dest_path: &'a Path,
        source_path: &'a Path,
        feature: &'a str,
        implementation: &'a str,
    ) -> Result<(), GenerateError> {
        let generator = Generate {
            dest_path,
            source_path,
        };
        fs::create_dir(&dest_path.join(feature))?;
        let test_folder = source_path.join(feature);
        let files = fs::read_dir(&test_folder).map_err(|_| {
            let message = format!("Error reading folder from tests: {}. Make sure there's no type in the feature argument", feature);
            ReadError(message)
        })?;

        let files = files.map(|directory| {
            let name = directory.unwrap().file_name();
            return name.into_string().unwrap();
        }).collect::<Vec<_>>();

        let missing_files = EXPECTED_FILES
            .into_iter()
            .filter(|&file| !files.contains(&file.to_string()))
            .collect::<Vec<_>>();

        if missing_files.len() > 0 {
            return Err(MissingExpectedFile(missing_files[0].to_string(), feature.to_string()));
        };

        println!(
            "Generating implementation: {} in test case {}",
            implementation,
            feature
        );

        // Generate test manifest from workflow
        generator.test_manifest(feature)?;
        // Copy schema to implementation folder
        generator.schema(feature)?;
        // Create implementation folder & respective files
        generator.implementation_files(feature, implementation)?;
        Ok(())
    }

    pub fn test_manifest(&self, feature: &str) -> Result<(), GenerateTestManifestError> {
        let workflow_path = self.source_path.join(feature).join(EXPECTED_FILES[0]);
        let workflow_str = fs::read_to_string(&workflow_path)?;
        let mut workflow = serde_json::from_str::<Workflow>(&workflow_str.as_str())?;

        workflow.format = Some(String::from("0.1.0"));
        workflow.name = Some(String::from(feature));

        // TODO: Add validation to test manifest from JS
        let test_manifest_path = self.dest_path.join(feature).join("polywrap.test.yaml");
        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(&test_manifest_path)?;

        serde_yaml::to_writer(f, &workflow)?;
        Ok(())
    }

    pub fn schema(&self, feature: &str) -> Result<(), io::Error> {
        let source_path = self.source_path.join(feature).join("schema.graphql");
        let dest_path = self.dest_path.join(feature).join("schema.graphql");
        fs::copy(source_path, dest_path)?;
        Ok(())
    }

    pub fn implementation_files(&self, feature: &str, implementation: &str) -> Result<(), GenerateImplementationError> {
        let dest_implementation_folder = &self.dest_path.join(feature).join("implementations");
        let template_implementation_folder = &self.source_path.join(feature).join("implementations");
        fs::create_dir(dest_implementation_folder)?;

        if implementation.is_empty() {
            let implementations = fs::read_dir(template_implementation_folder)?;
            for implementation in implementations {
                let imp = implementation?;
                let impl_name = &imp.file_name();
                let source_path = &template_implementation_folder.join(impl_name);
                let dest_path = &dest_implementation_folder.join(impl_name);
                self.create_implementation(
                    source_path,
                    dest_path,
                    feature,
                    impl_name.to_str().unwrap(),
                )?;
            };
        } else {
            let source_path = &template_implementation_folder.join(implementation);
            let dest_path = &dest_implementation_folder.join(implementation);
            self.create_implementation(
                source_path,
                dest_path,
                feature,
                implementation,
            )?;
        };
        Ok(())
    }

    fn create_implementation(
        &self,
        source_path: &PathBuf,
        destination_path: &PathBuf,
        feature: &str,
        implementation: &str,
    ) -> Result<(), CreateImplementationError> {
        // Generate implementation files (i.e: index.ts/lib.rs)
        let files = fs::read_dir(source_path)?;
        for file in files {
            let destination_folder = &destination_path.join("src");
            fs::create_dir_all(destination_folder)?;
            let name = file?.file_name();
            let impl_source = source_path.join(&name);
            let impl_dest = destination_folder.join(name);
            fs::copy(impl_source, impl_dest)?;
        }

        // Generate dependency files (i.e: package.json/Cargo.toml)
        let defaults_folder = self.source_path.join("..").join("defaults");
        let implementation_info = IMPLEMENTATIONS.get(implementation).unwrap();
        let dependencies_source = defaults_folder.join(&implementation_info.dependency);
        let dependencies_dest = destination_path.join(&implementation_info.dependency);
        fs::copy(dependencies_source, dependencies_dest)?;

        let root = source_path.join("..").join("..");
        let mut root_files = fs::read_dir(root)?.into_iter().filter(
            |file| !EXPECTED_FILES.to_vec().contains(&file.as_ref().unwrap().file_name().to_str().unwrap())
        ).map(|entry| entry.unwrap()).collect::<Vec<_>>();

        // Generate polywrap manifest (i.e: polywrap.yaml)
        let index = root_files.iter().position(|file| {
            file.file_name().eq(CUSTOM_MANIFEST)
        });

        let mut manifest = Manifest::default(feature, implementation_info);
        match index {
            Some(i) => {
                let file = File::open(root_files[i].path())?;
                let reader = BufReader::new(file);
                let custom_manifest: Manifest = serde_json::from_reader(reader)?;

                manifest = manifest.merge(custom_manifest)?;
                // TODO: Validate manifest

                root_files = root_files.into_iter().filter(|file| {
                    return !file.file_name().eq(CUSTOM_MANIFEST);
                }).collect::<Vec<_>>();
            }
            _ => {}
        }

        let manifest_path = destination_path.join("polywrap.yaml");
        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(&manifest_path)?;
        serde_yaml::to_writer(f, &manifest)?;

        for file in root_files {
            let dest_file = destination_path.join("../..").join(file.file_name());
            let source_file = source_path.join("../..").join(file.file_name());
            fs::copy(source_file, dest_file)?;
        };

        Ok(())
    }
}