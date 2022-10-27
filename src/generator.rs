use std::{fs, io};
use std::io::{BufReader};
use std::path::{PathBuf};
use serde_json;
use serde_yaml;
use crate::constants::{IMPLEMENTATIONS};
use crate::error::{CreateImplementationError, GenerateError, GenerateImplementationError, GenerateSchemaError, GenerateTestManifestError};
use crate::generator::GenerateError::{MissingExpectedFile, ReadError};
use crate::manifest::{Manifest, Workflow};

const CUSTOM_MANIFEST: &str = "polywrap.json";
const TEST_SCRIPT: &str = "workflow.json";
const SCHEMA: &str = "schema.graphql";
const IMPLEMENTATIONS_FOLDER: &str = "implementations";

const SIMPLE_CASE_EXPECTED_FILES: [&str; 3] = [TEST_SCRIPT, SCHEMA, IMPLEMENTATIONS_FOLDER];

#[derive(Debug)]
pub struct Generate {
    pub dest_path: PathBuf,
    pub source_path: PathBuf,
}

impl Generate {
    pub fn new(
        dest_path: PathBuf,
        source_path: PathBuf
    ) -> Self {
        Generate {
            dest_path,
            source_path
        }
    }
    pub fn project(
        &self,
        feature: &str,
        implementation: Option<&str>,
        subpath: Option<&str>
    ) -> Result<(), GenerateError> {
        let feature_path = self.dest_path.join(feature);
        if !feature_path.exists() {
            fs::create_dir(feature_path)?;
        }

        // Generate test manifest from workflow
        self.test_manifest(feature)?;
        // Copy schema to implementation folder
        self.schema(feature, subpath)?;
        // Create implementation folder & respective files
        if let Some(i) = implementation {
            self.implementation_files(feature, i, subpath)?;
        }
        Ok(())
    }

    pub fn test_manifest(&self, feature: &str) -> Result<(), GenerateTestManifestError> {
        let workflow_path = self.source_path.join(feature).join(TEST_SCRIPT);
        if !workflow_path.exists() {
            return Err(GenerateTestManifestError::MissingExpectedFile(
                TEST_SCRIPT.to_string(),
                feature.to_string()
            ));
        }

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

    pub fn schema(&self, feature: &str, subpath: Option<&str>) -> Result<(), GenerateSchemaError> {
        let mut source_path = self.source_path.join(feature);
        let mut dest_path = self.dest_path.join(feature);

        if let Some(path) = subpath {
            source_path = source_path.join(path);
            dest_path = dest_path.join(path);
            if !dest_path.exists() {
                fs::create_dir(&dest_path)?;
            }
        }

        source_path = source_path.join(SCHEMA);
        dest_path = dest_path.join(SCHEMA);
        if !source_path.exists() {
            return Err(GenerateSchemaError::MissingExpectedFile(
                SCHEMA.to_string(),
                feature.to_string()
            ));
        }

        if !dest_path.exists() {
            fs::copy(source_path, dest_path)?;
        }

        Ok(())
    }

    pub fn implementation_files(&self, feature: &str, implementation: &str, subpath: Option<&str>) -> Result<(), GenerateImplementationError> {
        let mut dest_implementation_folder = self.dest_path.join(feature);
        let mut template_implementation_folder = self.source_path.join(feature);
        if let Some(path) = subpath {
            dest_implementation_folder = dest_implementation_folder.join(path);
            template_implementation_folder = template_implementation_folder.join(path);
        }

        dest_implementation_folder = dest_implementation_folder.join(IMPLEMENTATIONS_FOLDER);
        template_implementation_folder = template_implementation_folder.join(IMPLEMENTATIONS_FOLDER);

        if !dest_implementation_folder.exists() {
            fs::create_dir(&dest_implementation_folder)?
        }

        let source_path = template_implementation_folder.join(implementation);
        let dest_path = dest_implementation_folder.join(implementation);
        self.create_implementation(
            source_path,
            dest_path,
            feature,
            implementation,
        )?;

        Ok(())
    }

    fn create_implementation(
        &self,
        source_path: PathBuf,
        destination_path: PathBuf,
        feature: &str,
        implementation: &str,
    ) -> Result<(), CreateImplementationError> {
        fs::create_dir(&destination_path)?;
        // Generate implementation files (i.e: index.ts/lib.rs)
        let files = fs::read_dir(&source_path)?;
        for file in files {
            let destination_source_folder = &destination_path.join("src");
            fs::create_dir(destination_source_folder)?;
            let name = file?.file_name();
            let impl_source = source_path.join(&name);
            let impl_dest = destination_source_folder.join(name);
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
            |file| !SIMPLE_CASE_EXPECTED_FILES.to_vec().contains(&file.as_ref().unwrap().file_name().to_str().unwrap())
        ).map(|entry| entry.unwrap()).collect::<Vec<_>>();

        // Generate polywrap manifest (i.e: polywrap.yaml)
        let index = root_files.iter().position(|file| {
            file.file_name().eq(CUSTOM_MANIFEST)
        });

        let mut manifest = Manifest::default(feature, implementation_info);
        match index {
            Some(i) => {
                let file = fs::File::open(root_files[i].path())?;
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