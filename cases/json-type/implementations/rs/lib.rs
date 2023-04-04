pub mod wrap;
use polywrap_wasm_rs::JSON;
use serde_json::*;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn stringify(args: ArgsStringify) -> String {
        let mut new_string = String::from("");
        for object in &args.values {
            new_string.push_str(&object.to_string());
        }
        new_string
    }

    fn parse(args: ArgsParse) -> JSON::Value {
        JSON::from_str(&args.value).unwrap()
    }

    fn stringify_object(args: ArgsStringifyObject) -> String {
        let mut new_string = String::from(&args.object.json_a.to_string());
        new_string.push_str(&args.object.json_b.to_string());
        new_string
    }

    fn method_j_s_o_n(args: ArgsMethodJSON) -> JSON::Value {
        json!({
            "valueA": args.value_a,
            "valueB": args.value_b,
            "valueC": args.value_c
        })
    }

    fn parse_reserved(args: ArgsParseReserved) -> Reserved {
        JSON::from_str::<Reserved>(&args.json).unwrap()
    }

    fn stringify_reserved(args: ArgsStringifyReserved) -> String {
        JSON::to_string(&args.reserved).unwrap()
    }
}
