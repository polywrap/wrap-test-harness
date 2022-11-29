use lazy_static::lazy_static;
use std::collections::HashMap;

#[derive(Debug)]
pub struct Implementation<'a> {
    pub dependency: &'a str,
    pub name: &'a str,
    pub module: &'a str,
    pub id: &'a str
}

lazy_static! {
    pub static ref IMPLEMENTATIONS: HashMap<&'static str, Implementation<'static>> = {
        let mut map = HashMap::new();
        map.insert("as", Implementation {
            dependency: "package.json",
            name: "assemblyscript",
            module: "./src/index.ts",
            id: "as"
        });
        map.insert("rs", Implementation {
            dependency: "Cargo.toml",
            name: "rust",
            module: "./Cargo.toml",
            id: "rs"
        });
        map
    };
}