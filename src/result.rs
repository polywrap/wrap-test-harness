use std::collections::HashMap;
use std::{fs, io};
use std::fs::File;
use std::io::BufReader;
use std::path::{PathBuf};
use serde::{Deserialize, Serialize};
use serde_json::{Value};
use cli_table::{Cell, Table, CellStruct};
use crate::error::{ResultError, ShowResultsError};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default, Copy)]
pub struct Summary {
    stats: Stats,
    passed: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default, Copy)]
pub struct Stats {
    total: u8,
    succeeded: u8,
    failed: u8,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Job<'a> {
    id: &'a str,
    status: &'a str,
    data: Option<Value>,
    error: Option<Value>,
    validation: Validation<'a>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Validation<'a> {
    status: &'a str,
    error: Option<&'a str>,
}

type Info = HashMap<String, HashMap<String, Summary>>;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
pub struct Results {
    pub version: i8,
    pub info: Info,
}


type RawResult<'a> = Vec<Job<'a>>;

pub struct TableResults {
    pub titles: Vec<CellStruct>,
    pub descriptions: Vec<Vec<CellStruct>>,
}

impl TableResults {
    pub fn new() -> Self {
        Self {
            titles: vec!["features".cell()],
            descriptions: vec![],
        }
    }
}

impl Results {
    pub fn new() -> Results {
        Results {
            version: 1,
            info: HashMap::new(),
        }
    }

    pub fn process(path: PathBuf) -> Result<Summary, ResultError> {
        let info = fs::read(path.canonicalize()?)?;
        let result_str: String = String::from_utf8_lossy(&info).parse().unwrap();
        let result: RawResult = serde_json::from_str(result_str.as_str()).unwrap();

        let default_summary = Summary {
            passed: true,
            ..Summary::default()
        };

        let summary = result.iter().fold(default_summary, |mut acc, r| {
            acc.stats.total += 1;
            match (r.status, r.validation.status) {
                ("SUCCEED", "SKIPPED") => acc.stats.succeeded += 1,
                (_, "SUCCEED") => acc.stats.succeeded += 1,
                _ => {
                    acc.stats.failed += 1;
                    acc.passed = false;
                }
            }
            acc
        });
        Ok(summary)
    }

    pub fn show() -> Result<(), ShowResultsError> {
        let file = File::open("results.json")?;
        let reader = BufReader::new(file);
        let results: Results = serde_json::from_reader(reader).unwrap();

        let mut table_results = TableResults::new();

        for (implementation, summary) in results.info.iter() {
            table_results.titles.push(implementation.cell());
            let mut features: Vec<String> = summary.keys().map(|s| s.to_string()).collect::<Vec<String>>();
            features.sort();
            for (index, feature) in features.iter().enumerate() {
                match table_results.descriptions.get_mut(index) {
                    None => {
                        table_results.descriptions.push(vec![(&feature).cell()]);
                        table_results.descriptions.get_mut(index).unwrap().push(summary[feature].passed.cell());
                    }
                    Some(d) => d.push(summary[feature].passed.cell())
                }
            };
        }

        let table = table_results.descriptions.table().title(table_results.titles);
        println!("{}", table.display().unwrap());
        Ok(())
    }
}