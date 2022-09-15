mod lib;

use crate::lib::{IMPLEMENTATIONS,Implementation};

use std::{fs, io};
use std::fmt::Error;
use std::fs::File;
use std::io::BufReader;
use std::ops::{Deref, Index};
use std::path::Path;
use std::process::Command;
use serde_json;
use serde_yaml;
use serde::{Deserialize, Serialize};


const BUILD_FOLDER: &str = "build";
const TEST_FOLDER: &str = "tests";
const CUSTOM_MANIFEST: &str = "polywrap.json";
const EXPECTED_FILES: [&str; 3] = ["workflow.json", "schema.graphql", "implementations"];

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
struct Workflow {
    format: Option<String>,
    name: Option<String>,
    jobs: serde_json::Value,
}

type ImportAbis = Vec<ImportAbi>;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
struct ImportAbi {
    uri: String,
    abi: String,
}

#[derive(Default, Serialize, Deserialize, Debug, Clone, PartialEq)]
struct Project {
    name: Option<String>,
    #[serde(rename = "type")]
    _type: Option<String>,
}

#[derive(Default, Serialize, Deserialize, Debug, Clone, PartialEq)]
struct Source {
    schema: Option<String>,
    module: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    import_abis: Option<ImportAbis>,
}

#[derive(Default, Serialize, Deserialize, Debug, Clone, PartialEq)]
struct Manifest {
    pub format: Option<String>,
    pub project: Option<Project>,
    pub source: Option<Source>,
}

impl Manifest {
    fn merge(self, custom: Manifest) -> Result<Manifest, Error> {
        let default_project = self.project.unwrap();

        let project  = match custom.project {
            Some(p) => Some(Project {
                name: p.name.or(default_project.name),
                _type: p._type.or(default_project._type),
            }),
            _ => Some(default_project)
        };

        let default_source = self.source.unwrap();
        let source = match custom.source {
            Some(s) => Some(Source {
                schema: s.schema.or(default_source.schema),
                module: s.module.or(default_source.module),
                import_abis: s.import_abis.or(default_source.import_abis)
            }),
            _ => Some(default_source)
        };

        Ok(Self {
            format: self.format,
            project,
            source
        })
    }

    pub fn default(
        project_name: &str,
        implementation: &Implementation<'_>,
    ) -> Manifest {
        Manifest {
            format: Some("0.2.0".to_string()),
            project: Some(Project {
                name: Some(project_name.to_string()),
                _type: Some(format!("wasm/{}", &implementation.name.to_string())),
            }),
            source: Some(Source {
                schema: Some("../../schema.graphql".to_string()),
                module: Some(implementation.module.to_string()),
                import_abis: None,
            })
        }
    }
}

impl Generator<'_> {
    pub fn new<'a>(
        dest_path: &'a Path,
        source_path: &'a Path,
    ) -> Generator<'a> {
        Generator {
            dest_path,
            source_path,
        }
    }

    pub fn generate_project(&self, project_name: &str) -> Result<(), &str> {
        let project_folder = self.dest_path.join(project_name);
        let test_folder = self.source_path.join(project_name);

        let files = fs::read_dir(&test_folder).unwrap().map(|directory| {
            let name = directory.unwrap().file_name();
            return name.into_string().unwrap();
        }).collect::<Vec<_>>();

        let missing_files = EXPECTED_FILES
            .into_iter()
            .filter(|&file| !files.contains(&String::from(file)))
            .collect::<Vec<_>>();

        if missing_files.len() > 0 {
            let error_message = format!("File {} missing from tests: {}", missing_files[0], project_name);
            // TODO: Return Err instead of panicking
            panic!("{}", error_message);
        }

        fs::create_dir(project_folder).unwrap();

        // Generate test manifest from workflow
        self.generate_test_manifest(project_name).unwrap();
        // Copy schema to implementation folder
        self.generate_schema(project_name).unwrap();
        self.generate_dependency_file(project_name).unwrap();

        Ok(())
    }

    pub fn generate_test_manifest(&self, project_name: &str) -> Result<(), ()> {
        let workflow_path = self.source_path.join(project_name).join(EXPECTED_FILES[0]);
        let workflow_str = fs::read_to_string(&workflow_path).unwrap();
        let mut workflow: Workflow = serde_json::from_str(&workflow_str.as_str()).unwrap();

        workflow.format = Some(String::from("0.1.0"));
        workflow.name = Some(String::from(project_name));

        // TODO: Add validation to test manifest from JS
        let test_manifest_path = self.dest_path.join(project_name).join("polywrap.test.yaml");
        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(&test_manifest_path)
            .unwrap();

        serde_yaml::to_writer(f, &workflow).unwrap();
        Ok(())
    }

    pub fn generate_schema(&self, project_name: &str) -> Result<(), ()> {
        let source_path = self.source_path.join(project_name).join("schema.graphql");
        let dest_path = self.dest_path.join(project_name).join("schema.graphql");
        fs::copy(source_path, dest_path).unwrap();
        Ok(())
    }

    pub fn generate_dependency_file(&self, project_name: &str) -> Result<(), ()> {
        let dest_implementation_folder = &self.dest_path.join(project_name).join("implementations");
        fs::create_dir(dest_implementation_folder).unwrap();
        let template_implementation_folder = &self.source_path.join(project_name).join("implementations");

        let implementations = fs::read_dir(template_implementation_folder).unwrap();
        for implementation in implementations {
            let imp = implementation.unwrap();
            let impl_name = &imp.file_name();
            let source_path = &template_implementation_folder.join(impl_name);
            let dest_path = &dest_implementation_folder.join(impl_name).join("src");

            // Generate implementation files (i.e: index.ts/lib.rs)
            let files = fs::read_dir(source_path).unwrap();
            for file in files {
                fs::create_dir_all(dest_path).unwrap();
                let name = &file.as_ref().unwrap().file_name();
                let impl_source = source_path.join(name);
                let impl_dest = dest_path.join(name);
                fs::copy(impl_source, impl_dest).unwrap();
            }

            // Generate dependency files (i.e: package.json/Cargo.toml)
            let defaults_folder = self.source_path.join("..").join("defaults");
            let implementation_info = IMPLEMENTATIONS.get(impl_name.to_str().unwrap()).unwrap();
            let dependencies_source = defaults_folder.join(&implementation_info.dependency);
            let dependencies_dest = dest_implementation_folder.join(impl_name).join(&implementation_info.dependency);
            fs::copy(dependencies_source, dependencies_dest).unwrap();

            let root = template_implementation_folder.join("..");
            let mut root_files = fs::read_dir(root).unwrap().into_iter().filter(
                |file| !EXPECTED_FILES.to_vec().contains(&file.as_ref().unwrap().file_name().to_str().unwrap())
            ).map(|entry| entry.unwrap()).collect::<Vec<_>>();

            // Generate polywrap manifest (i.e: polywrap.yaml)
            let index = root_files.iter().position(|file| {
                file.file_name().eq(CUSTOM_MANIFEST)
            });

            let  mut manifest = Manifest::default(project_name, implementation_info);
            match index {
                Some(i) => {
                    // Open the file in read-only mode with buffer.
                    let file = File::open(root_files[i].path()).unwrap();
                    let reader = BufReader::new(file);
                    let custom_manifest: Manifest = serde_json::from_reader(reader).unwrap();

                    manifest = manifest.merge(custom_manifest).unwrap();
                    // TODO: Validate manifest

                    root_files = root_files.into_iter().filter(|file| {
                        return !file.file_name().eq(CUSTOM_MANIFEST);
                    }).collect::<Vec<_>>();
                }
                _ => {}
            }

            let manifest_path = dest_implementation_folder.join(impl_name).join("polywrap.yaml");
            let f = fs::OpenOptions::new()
                .write(true)
                .create(true)
                .open(&manifest_path)
                .unwrap();
            serde_yaml::to_writer(f, &manifest).unwrap();

            for file in root_files {
                let dest_file = dest_implementation_folder.join("..").join(file.file_name());
                let source_file = template_implementation_folder.join("..").join(file.file_name());
                fs::copy(source_file, dest_file).unwrap();
            }

        }

        Ok(())
    }
}

struct Generator<'a> {
    pub dest_path: &'a Path,
    pub source_path: &'a Path,
}

fn main() -> io::Result<()> {
    // let dirname = current_exe()?;

    let dest_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new(TEST_FOLDER);

    match fs::create_dir(BUILD_FOLDER) {
        Err(_) => {
            fs::remove_dir_all(BUILD_FOLDER)?;
            fs::create_dir(BUILD_FOLDER)?;
        }
        _ => {}
    }

    let generator = Generator::new(dest_path, source_path);

    for entry in fs::read_dir(&source_path)? {
        let file_name = &entry?.file_name();
        println!("Generating test case: {}", &file_name.to_str().unwrap());
        generator.generate_project(&file_name.to_str().unwrap()).unwrap();
    }

    for entry in fs::read_dir(&source_path)? {
        let file_name = &entry?.file_name();
        let wrapper_path = dest_path.join(&file_name).join("implementations");
        for implementation in fs::read_dir(&wrapper_path)? {
            let dir = &wrapper_path.join(implementation.as_ref().unwrap().file_name());
            println!(
                "Building implementation: {} in test case {}",
                implementation.as_ref().unwrap().file_name().to_str().unwrap(),
                file_name.to_str().unwrap()
            );
            let mut build = Command::new("npx");
            build.current_dir(dir.to_str().unwrap().to_string());
            build.arg("polywrap").arg("build");

            let status = match build.output() {
                Ok(t) => {
                    let error = String::from_utf8(t.stderr).unwrap();
                    let message = String::from_utf8(t.stdout).unwrap();
                    dbg!(error);
                    dbg!(message);
                    t.status.success()
                }
                Err(e) => {
                    dbg!(e);
                    false
                }
            };
            dbg!(status);
        }
    }

    for entry in fs::read_dir(&source_path)? {
        let file_name = &entry?.file_name();
        let wrapper_path = dest_path.join(&file_name).join("implementations");
        for implementation in fs::read_dir(&wrapper_path)? {
            let dir = &wrapper_path.join(implementation.as_ref().unwrap().file_name());
            println!(
                "Testing implementation: {} in case {}",
                implementation.as_ref().unwrap().file_name().to_str().unwrap(),
                file_name.to_str().unwrap()
            );
            let mut build = Command::new("npx");
            build.current_dir(dir.to_str().unwrap().to_string());
            build
                .arg("polywrap").arg("run")
                .arg("-m").arg("../../polywrap.test.yaml")
                .arg("-o").arg("./output.json");

            let custom_config = wrapper_path.join("../client-config.ts").exists();
            if custom_config {
                build.arg("-c").arg("../../client-config.ts");
            }

            let status = match build.output() {
                Ok(t) => {
                    let error = String::from_utf8(t.stderr).unwrap();
                    let message = String::from_utf8(t.stdout).unwrap();
                    dbg!(error);
                    dbg!(message);
                    t.status.success()
                }
                Err(e) => {
                    dbg!(e);
                    false
                }
            };
            dbg!(status);
        }
    }








    Ok(())
}
