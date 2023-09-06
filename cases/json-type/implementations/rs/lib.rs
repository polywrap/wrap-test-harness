pub mod wrap;
use polywrap_msgpack_serde::JSONString;
use polywrap_wasm_rs::JSON;
use serde_json::json;
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn stringify(args: ArgsStringify) -> Result<String, String> {
        let mut new_string = String::from("");
        for object in &args.values {
            new_string.push_str(&object.to_json().to_string());
        }
        Ok(new_string)
    }

    fn parse(args: ArgsParse) -> Result<JSONString, String> {
        Ok(JSON::from_str(&args.value).unwrap())
    }

    fn stringify_object(args: ArgsStringifyObject) -> Result<String, String> {
        let mut new_string = String::from(&args.object.json_a.to_json().to_string());
        new_string.push_str(&args.object.json_b.to_json().to_string());
        Ok(new_string)
    }

    fn method_j_s_o_n(args: ArgsMethodJSON) -> Result<JSONString, String> {
        Ok(JSONString::new(json!({
            "valueA": args.value_a,
            "valueB": args.value_b,
            "valueC": args.value_c
        })))
    }

    fn parse_reserved(args: ArgsParseReserved) -> Result<Reserved, String> {
        Ok(JSON::from_str::<Reserved>(&args.json).unwrap())
    }

    fn stringify_reserved(args: ArgsStringifyReserved) -> Result<String, String> {
        Ok(JSON::to_string(&args.reserved).unwrap())
    }
}
