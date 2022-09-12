use std::env::current_exe;
use std::{fs, io};
use std::ffi::OsString;
use std::fmt::format;
use std::path::Path;
use serde_json;
use serde_yaml;
use serde::{Deserialize, Serialize};


const BUILD_FOLDER: &str = "build";
const TEST_FOLDER: &str = "tests";

const EXPECTED_FILES: [&str; 3] = ["workflow.json", "schema.graphql", "implementations"];

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
struct Workflow {
    format: Option<String>,
    name: Option<String>,
    jobs: serde_json::Value,
}

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

        fs::create_dir(project_folder).expect("TODO: panic message");

        self.generate_test_manifest(project_name).expect("TODO: panic message");

        Ok(())
    }

    pub fn generate_test_manifest(&self, project_name: &str) -> Result<(), &str> {
        let workflow_path = self.source_path.join(project_name).join(EXPECTED_FILES[0]);
        let workflow_str = fs::read_to_string(&workflow_path).unwrap();
        let mut workflow: Workflow = serde_json::from_str(&workflow_str.as_str()).unwrap();

        workflow.format = Some(String::from("0.1.0"));
        workflow.name = Some(String::from(project_name));

        dbg!(&workflow);
        let manifest_json = serde_json::to_string(&workflow).unwrap();
        dbg!(&manifest_json);
        let manifest: Workflow = serde_yaml::from_str(&manifest_json).unwrap();
        dbg!(&manifest);

        let test_manifest_path = self.dest_path.join(project_name).join("polywrap.test.yaml");
        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(&test_manifest_path)
            .unwrap();

        serde_yaml::to_writer(f, &workflow);


        dbg!(test_manifest_path);

        // fs::write(test_manifest_path, manifest).expect("TODO: panic message");


        Ok(())
    }
}

struct Generator<'a> {
    pub dest_path: &'a Path,
    pub source_path: &'a Path,
}

fn main() -> std::io::Result<()> {
    let dirname = current_exe()?;

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
