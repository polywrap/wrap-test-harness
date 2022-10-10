use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::io::BufReader;
use std::path::{PathBuf};
use serde::{Deserialize, Serialize};
use serde_json::{Value};
use cli_table::{format::Justify, print_stdout, Cell, Style, Table};
use serde_json::Value::Object;

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
    error: Option<Value>
}

type Info = HashMap<String, HashMap<String, Summary>>;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
pub struct Results {
    pub version: i8,
    pub info: Info
}


type RawResult<'a> = Vec<Job<'a>>;

#[derive(Debug)]
pub struct TableResults {
    titles: Vec<String>,
    descriptions: Vec<Vec<String>>,
}

impl TableResults {
    pub fn new() -> Self {
        Self {
            titles: vec![String::from("features")],
            descriptions: vec![]
        }
    }
}

impl Results {
    pub fn new() -> Results {
        Results {
            version: 1,
            info: HashMap::new()
        }
    }

    pub fn process(path: PathBuf) -> Summary {
        let info = fs::read(path.canonicalize().unwrap()).unwrap();
        let result_str: String = String::from_utf8_lossy(&info).parse().unwrap();
        let result: RawResult = serde_json::from_str(result_str.as_str()).unwrap();

        let default_summary = Summary {
            passed: true,
            ..Summary::default()
        };

        result.iter().fold(default_summary,|mut acc, r| {
            acc.stats.total += 1;
            match r.status {
                "SUCCEED" => acc.stats.succeeded += 1,
                _ => {
                    acc.stats.failed += 1;
                    acc.passed = false;
                }
            }
            acc
        })
    }

    pub fn show() {
        let file = File::open("results.json").unwrap();
        let reader = BufReader::new(file);
        let results: Results = serde_json::from_reader(reader).unwrap();

        let mut new_info: HashMap<String, HashMap<String, bool>> = HashMap::new();

        for (feature, summary) in results.info.iter() {
           for implementation in summary.keys() {
                new_info.entry(implementation.to_string()).or_default().insert(feature.to_string(), summary[implementation].passed);
            };
        }

        dbg!(&new_info);
        let implementations = new_info.into_keys().collect::<Vec<String>>();
        let mut table_results = TableResults::new();


        implementations.iter().enumerate().map(|(index, implementation)| {
            // let implementation_index =
            // new_info.get(implementation);
        });

        table_results.titles = implementations;


    }
}