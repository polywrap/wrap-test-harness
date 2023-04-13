pub mod wrap;
use polywrap_wasm_rs::Map;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn get_key(args: ArgsGetKey) -> Result<i32, String> {
        Ok(*args.foo.map.get(&args.key).unwrap())
    }

    fn return_map(args: ArgsReturnMap) -> Result<Map<String, i32> , String>{
        Ok(args.map)
    }

    fn return_custom_map(args: ArgsReturnCustomMap) -> Result<CustomMap, String> {
        Ok(args.foo)
    }

    fn return_nested_map(args: ArgsReturnNestedMap) -> Result<Map<String, Map<String, i32>>, String> {
        Ok(args.foo)
    }
}
