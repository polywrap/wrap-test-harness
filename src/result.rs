use std::collections::HashMap;
use std::fs;
use std::path::{PathBuf};
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
pub struct Results {
    pub version: String,
    pub info: HashMap<String, HashMap<String, Summary>>
}

type RawResult<'a> = Vec<Job<'a>>;

impl Results {
    pub fn new() -> Results {
        Results {
            version: "1".to_string(),
            info: HashMap::new()
        }
    }

    pub fn process(path: PathBuf) -> Summary {
        // let file = File::open(path).unwrap();
        // let reader = BufReader::new(file);
        // let result: RawResult = serde_json::from_reader(reader).unwrap();

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
}