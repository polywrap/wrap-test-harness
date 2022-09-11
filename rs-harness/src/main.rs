use std::borrow::Borrow;
use std::env::current_exe;
use std::error::Error;
use std::{fs, io};
use std::ffi::OsString;
use std::fs::{read, read_dir};
use std::path::Path;

const BUILD_FOLDER: &str = "build";
const TEST_FOLDER: &str = "tests";

const EXPECTED_FILES: [&str; 3] = ["workflow.json", "schema.graphql", "implementations"];

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
        let build_folder = self.dest_path.join(project_name);
        let test_folder = self.source_path.join(project_name);

        // for entry in read_dir(&test_folder).unwrap() {
        //     let name = entry.unwrap().file_name();
        //     let g = name.to_str().unwrap();
        //     dbg!(g);
        // }

        // let _ = read_dir(&test_folder).unwrap().contains(&EXPECTED_FILES.to_vec());

        let files = read_dir(&test_folder).unwrap().map(|directory| {
            let name = directory.unwrap().file_name();
            return name.into_string().unwrap()
        }).collect::<Vec<_>>();

        // let missing_files = EXPECTED_FILES
        //     .iter()
        //     .filter_map(|&file| files.contains(file.into_string()))
        //     .collect::<Vec<_>>();


        // let missing_files = EXPECTED_FILES
        //     .iter()
        //     .map(|&file| {
        //         if files.contains(&String::from(file)) {
        //             return file.into_string()
        //         }
        //         return
        //     })
        //     .collect::<Vec<_>>();

        let missing_files = EXPECTED_FILES
            .into_iter()
            .filter(|&file| !files.contains(&String::from(file)))
            .collect::<Vec<_>>();


        match missing_files.len() {
            (0) => {

            },
            (_) => {

            },
        }

        dbg!("{}", &missing_files);
        // match missing_files {
        //     vec!(false, true, true) => {
        //
        //     },
        //     vec!(true, false, true) => {
        //
        //     },
        //     vec!(true, true, false) => {
        //
        //     },
        // }

        println!("test case: {}", project_name);
        dbg!(missing_files);
        // let files2 = files.map()
        // let files = read_dir(&test_folder)?
        //     .map(|res| res.map(|e| {
        //         match e.file_name().to_str(). {
        //             Some(t) => t,
        //             _ => ""
        //         }
        //
        //     }))
        //     .collect::<Result<Vec<_>, io::Error>>();
        //
        // // dbg!(entries.expect("TODO: panic message"));
        //
        dbg!(files);
        // let has_missing_file = EXPECTED_FILES.to_vec().contains(files.to_vec());

        // dbg!(has_missing_file);
        // let files = &entries.iter().filter_map(|entry| {
        //     dbg!(entry);
        //     let entry_str = entry.iter().map(|file| file.to_str()).collect::<Vec<_>>();
        //     EXPECTED_FILES.to_vec().
        //     Some(entry_str)
        // }).collect::<Vec<_>>();
        // dbg!(zz);
        // entries.map(|entry| entry.contains(EXPECTED_FILES))?;
        // let missing_file = EXPECTED_FILES.contains(&&"workflow.json");
        // println!("{}", missing_file);

        // match missing_file {
        //     Some(file) => {
        //         return Err("File {file} missing from tests: {project_name}");
        //     },
        //     _ => {}
        // }
        // entries.iter().filter_map(|entry| expected_files.contains(entry))

        return Ok(())
    }
}

struct Generator<'a> {
    pub dest_path: &'a Path,
    pub source_path: &'a Path,
}

fn main() -> std::io::Result<()> {
    let dirname = current_exe()?;

    let dest_path = Path::new(BUILD_FOLDER);
    let source_path = Path::new("..").join(TEST_FOLDER);

    match fs::create_dir(BUILD_FOLDER) {
        Err(_) => {
            fs::remove_dir_all(BUILD_FOLDER)?;
            fs::create_dir(BUILD_FOLDER)?;
        },
        _  => {}
    }


    let generator = Generator::new(dest_path, source_path.as_path());

    for entry in read_dir(&source_path)? {
          generator.generate_project(entry?.file_name().to_str().unwrap()).unwrap();
    }






    Ok(())


}
