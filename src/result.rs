use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default, Copy)]
pub struct Summary {
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
pub struct Results<'a> {
    pub version: &'a str,
    pub info: HashMap<&'a str, HashMap<String, Summary>>
}

impl Results<'_> {
    pub fn new() -> Results<'static> {
        Results {
            version: "1",
            info: HashMap::new()
        }
    }
}

type RawResult<'a> = Vec<Job<'a>>;

pub fn get_summary(path: PathBuf) -> Summary {
    let info = fs::read(path).unwrap();
    let result_str: String = String::from_utf8_lossy(&info).parse().unwrap();
    let result: RawResult = serde_json::from_str(result_str.as_str()).unwrap();


    result.iter().fold(Summary::default(),|mut acc, r| {
        acc.total += 1;
        match r.status {
            "SUCCEED" => acc.succeeded += 1,
            _ => acc.failed += 1
        }

        acc
    })

}