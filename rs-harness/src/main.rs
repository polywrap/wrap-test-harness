mod lib;

use crate::lib::IMPLEMENTATIONS;

use std::{fs, io};
use std::fs::File;
use std::io::BufReader;
use std::ops::Index;
use std::path::Path;
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
#[derive(Debug, Default, Serialize, Deserialize)]
struct ImportAbi {
    uri: String,
    abi: String
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct Project {
    name: Option<String>,
    _type: Option<String>
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct Source {
    schema: Option<String>,
    module: Option<String>,
    import_abis: Option<ImportAbis>
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct Manifest {
    format: Option<String>,
    project: Option<Project>,
    source: Option<Source>
}

// impl Manifest {
//     fn merge(self, other: Manifest) -> Self {
//         Self {
//             format: self.format,
//             project: Project {
//                 ..self.project
//             },
//             source: self.source | other.source
//         }
//     }
// }

impl Generator<'_> {
    pub fn new<'a>(
        dest_path: &'a Path,
        source_path: &'a Path,
    ) -> Generator<'a> {
        Generator {
            dest_path,
            source_path
        }
    }

    pub fn generate_project(&self, project_name: &str) -> Result<(), &str> {
        let project_folder = self.dest_path.join(project_name);
        let test_folder = self.source_path.join(project_name);

        let files = fs::read_dir(&test_folder).unwrap().map(|directory| {
            let name = directory.unwrap().file_name();
            return name.into_string().unwrap()
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

        serde_yaml::to_writer(f, &workflow).expect("TODO: panic message");
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
            let root_files = fs::read_dir(root).unwrap().into_iter().filter(
                |file| {
                    return !EXPECTED_FILES.to_vec().contains(&file.as_ref().unwrap().file_name().to_str().unwrap())
                }
            ).map(|entry| entry.unwrap()).collect::<Vec<_>>();

            // Generate polywrap manifest (i.e: polywrap.yaml)
            let project = Project {
                name: Some(project_name.to_string()),
                _type: Some(String::new()),
            };

            let source = Source {
                schema: Some(String::new()),
                module: Some(String::new()),
                import_abis: None
            };

            let manifest = Manifest {
                format: Some(String::new()),
                project: Some(project),
                source: Some(source)
            };

            let index = root_files.iter().position(|file| {
                return file.file_name().eq(CUSTOM_MANIFEST);
            });

            match index {
                Some(i) => {
                    // Open the file in read-only mode with buffer.
                    let file = File::open(root_files[i].path()).unwrap();
                    let reader = BufReader::new(file);

                    let custom_manifest: Result<serde_json::Value, serde_json::Error> = serde_json::from_reader(reader);
                    let manifest = serde_json::to_string(&manifest);

                    println!("{:?}", custom_manifest.unwrap());
                    println!("{:?}", &manifest.unwrap())

                },
                _ => {}
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
        },
        _  => {}
    }

    let generator = Generator::new(dest_path, source_path);

    for entry in fs::read_dir(&source_path)? {
          generator.generate_project(entry?.file_name().to_str().unwrap()).unwrap();
    }


    Ok(())


}
