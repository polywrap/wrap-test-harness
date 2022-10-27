use std::{fs, io};
use std::io::{BufReader};
use std::path::{PathBuf};
use serde_json;
use serde_yaml;
use crate::constants::{IMPLEMENTATIONS};
use crate::error::{CreateImplementationError, GenerateError, GenerateImplementationError, GenerateTestManifestError};
use crate::generator::GenerateError::{MissingExpectedFile, ReadError};
use crate::manifest::{Manifest, Workflow};

const CUSTOM_MANIFEST: &str = "polywrap.json";
const TEST_SCRIPT: &str = "workflow.json";
const SCHEMA: &str = "schema.graphql";
const IMPLEMENTATIONS_FOLDER: &str = "implementations";

const SIMPLE_CASE_EXPECTED_FILES: [&str; 3] = [TEST_SCRIPT, SCHEMA, IMPLEMENTATIONS_FOLDER];

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
        implementation: &str
    ) -> Result<(), GenerateError> {
        let feature_path = self.dest_path.join(feature);
        if !feature_path.exists() {
            fs::create_dir(feature_path)?;
        }


        let test_folder = self.source_path.join(feature);

        let files = fs::read_dir(&test_folder).map_err(|_| {
            let message = format!("Error reading folder from tests: {}. Make sure there's no type in the feature argument", feature);
            ReadError(message)
        })?;

        // Complex projects steps:
        // 1- Files wont be files, but rather folders (and a workflow file)
        // 2- In these folders, we can not check the expected files, what needs to happen
        //    is that we go to every folder, if it doesn't has implementations folder
        //    we assume it's an interface. Every folder **must** have schema.graphql file
        let files = files.map(|directory| {
            let name = directory.unwrap().file_name();
            return name.into_string().unwrap();
        }).collect::<Vec<_>>();

        // if self.is_complex(files) {
        //     self.generate_complex()?;
        //     Ok(())
        // }

        let missing_files = SIMPLE_CASE_EXPECTED_FILES
            .into_iter()
            .filter(|&file| !files.contains(&file.to_string()))
            .collect::<Vec<_>>();

        if missing_files.len() > 0 {
            return Err(MissingExpectedFile(missing_files[0].to_string(), feature.to_string()));
        };

        // Generate test manifest from workflow
        self.test_manifest(feature)?;
        // Copy schema to implementation folder
        self.schema(feature)?;
        // Create implementation folder & respective files
        self.implementation_files(feature, implementation)?;
        Ok(())
    }

    pub fn test_manifest(&self, feature: &str) -> Result<(), GenerateTestManifestError> {
        let workflow_path = self.source_path.join(feature).join(SIMPLE_CASE_EXPECTED_FILES[0]);
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
        let source_path = self.source_path.join(feature).join(SCHEMA);
        let dest_path = self.dest_path.join(feature).join(SCHEMA);
        fs::copy(source_path, dest_path)?;
        Ok(())
    }

    pub fn implementation_files(&self, feature: &str, implementation: &str) -> Result<(), GenerateImplementationError> {
        let dest_implementation_folder = &self.dest_path.join(feature).join(IMPLEMENTATIONS_FOLDER);
        let template_implementation_folder = &self.source_path.join(feature).join(IMPLEMENTATIONS_FOLDER);

        if !dest_implementation_folder.exists() {
            fs::create_dir(dest_implementation_folder)?
        }

        let source_path = &template_implementation_folder.join(implementation);
        let dest_path = &dest_implementation_folder.join(implementation);
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
        source_path: &PathBuf,
        destination_path: &PathBuf,
        feature: &str,
        implementation: &str,
    ) -> Result<(), CreateImplementationError> {
        fs::create_dir(&destination_path)?;
        // Generate implementation files (i.e: index.ts/lib.rs)
        let files = fs::read_dir(source_path)?;
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

    fn is_complex(&self, files: Vec<String>) {

    }

    fn generate_complex(&self) {

    }
}