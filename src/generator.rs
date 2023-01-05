use std::fs;
use std::env;
use std::io::{BufReader};
use std::path::{Path, PathBuf};
use crate::constants::{Implementation, IMPLEMENTATIONS};
use crate::error::{CreateImplementationError, CreateManifestAndCommonFilesError, GenerateError, GenerateImplementationError, GenerateSchemaError, GenerateTestManifestError};
use crate::manifest::{BuildManifest, Manifest, Workflow};

const CUSTOM_MANIFEST: &str = "polywrap.json";
const TEST_SCRIPT: &str = "workflow.json";
const SCHEMA: &str = "schema.graphql";
const IMPLEMENTATIONS_FOLDER: &str = "implementations";

const SIMPLE_CASE_EXPECTED_FILES: [&str; 4] = [TEST_SCRIPT, SCHEMA, IMPLEMENTATIONS_FOLDER, CUSTOM_MANIFEST];

#[derive(Debug)]
pub struct Generate {
    pub dest_path: PathBuf,
    pub source_path: PathBuf,
    pub build_only: bool
}

impl Generate {
    pub fn new(
        dest_path: PathBuf,
        source_path: PathBuf,
        build_only: bool
    ) -> Self {
        Generate {
            dest_path,
            source_path,
            build_only
        }
    }
    pub async fn project(
        &self,
        feature: &str,
        implementation: Option<&str>,
        subpath: Option<&str>,
    ) -> Result<(), GenerateError> {
        let feature_path = self.dest_path.join(feature);
        if !feature_path.exists() && fs::create_dir(
            feature_path
        ).is_err() {
            return Err(GenerateError::CreateFeatureDirErr);
        }

        // Copy schema to implementation folder
        self.schema(feature, subpath)?;
        // Create implementation folder & respective files
        if let Some(i) = implementation {
            self.implementation_files(feature, i, subpath)?;
        } else {
            self.manifest_and_common_files(feature, None, self.dest_path.join(feature), subpath)?;
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
        let mut workflow = serde_json::from_str::<Workflow>(workflow_str.as_str())?;

        workflow.format = Some(String::from("0.1.0"));
        workflow.name = Some(String::from(feature));

        // TODO: Add validation to test manifest from JS
        let test_manifest_path = self.dest_path.join(feature).join("polywrap.test.yaml");
        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(test_manifest_path)?;

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
            subpath
        )?;

        Ok(())
    }

    fn create_implementation(
        &self,
        source_path: PathBuf,
        destination_path: PathBuf,
        feature: &str,
        implementation: &str,
        subpath: Option<&str>
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
        let dependencies_source = defaults_folder.join(implementation_info.dependency);
        let dependencies_dest = destination_path.join(implementation_info.dependency);
        fs::copy(dependencies_source, dependencies_dest)?;
        self.manifest_and_common_files(feature, Some(implementation_info), destination_path, subpath)?;
        Ok(())
    }

    fn manifest_and_common_files(
        &self,
        feature: &str,
        implementation_info: Option<&Implementation>,
        destination_path: PathBuf,
        subpath: Option<&str>
    ) -> Result<(), CreateManifestAndCommonFilesError> {
        let root = self.source_path.join(feature);

        // Get the name of the files to copy, excluding the already processed (and expected) files
        let root_files = fs::read_dir(&root)?.into_iter().filter(
            |file| !SIMPLE_CASE_EXPECTED_FILES.to_vec().contains(&file.as_ref().unwrap().file_name().to_str().unwrap())
        ).filter(|f| !f.as_ref().unwrap().metadata().unwrap().is_dir()).map(|entry| entry.unwrap()).collect::<Vec<_>>();

        // Copy common files
        for file in root_files {
            let dest_file = self.dest_path.join(feature).join(file.file_name());
            let source_file = self.source_path.join(feature).join(file.file_name());
            fs::copy(source_file, dest_file)?;
        };

        if !self.build_only {
            // Generate test manifest from workflow
            self.test_manifest(feature)?;
        }

        // Get manifest path
        let mut manifest_path = destination_path;

        let get_manifest = |file: &Result<fs::DirEntry, std::io::Error>| {
            let file = file.as_ref().unwrap().file_name();
            file.to_str().unwrap().eq(CUSTOM_MANIFEST)
        };
        let custom_manifest_path = if let Some(path) = subpath {
            let mut complex_path = root.join(path);
            if implementation_info.is_some() {
                let test_path = manifest_path.clone().into_os_string().to_str().unwrap().replace("build", "tests");
                complex_path = Path::new(test_path.as_str()).to_path_buf().join("../..");
            } else {
                manifest_path = manifest_path.join(path);
            }
            complex_path.read_dir()?.into_iter().find(get_manifest)
        } else {
            root.read_dir()?.into_iter().find(get_manifest)
        };

        // Generate polywrap manifest (i.e: polywrap.yaml)
        let polywrap_manifest_path = manifest_path.join("polywrap.yaml");
        let mut manifest = Manifest::default(feature, &implementation_info);

        let implementation_id = implementation_info.map(|i| i.id);

        if let Some(custom_path) = custom_manifest_path {
            let file = fs::File::open(custom_path?.path())?;
            let reader = BufReader::new(file);
            let custom_manifest: Manifest = serde_json::from_reader(reader)?;

            // TODO: Validate manifest
            manifest = manifest.merge(custom_manifest, implementation_id)?;
        }

        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(polywrap_manifest_path)?;
        serde_yaml::to_writer(f, &manifest)?;

        let local_wasm_package = env::var("POLYWRAP_WASM_PATH");

        if let Ok(package_path) = local_wasm_package {
           if let Some(i) = implementation_id {
               BuildManifest::generate(manifest_path, package_path, i.to_string());
           }
        }

        Ok(())
    }
}