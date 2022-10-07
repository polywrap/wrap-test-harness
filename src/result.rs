use std::collections::HashMap;
use std::fs;
use std::path::{PathBuf};
use serde::{Deserialize, Serialize};
use serde_json::{Value};

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

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
pub struct Results {
    pub version: i8,
    pub info: HashMap<String, HashMap<String, Summary>>
}

type RawResult<'a> = Vec<Job<'a>>;

impl Results {
    pub fn new() -> Results {
        Results {
            version: 1,
            info: HashMap::new()
        }
    }

    pub fn process(path: PathBuf) -> Summary {
        dbg!(path.canonicalize().unwrap());
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
}