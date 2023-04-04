pub mod wrap;
use polywrap_wasm_rs::Map;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn get_key(args: ArgsGetKey) -> i32 {
        *args.foo.map.get(&args.key).unwrap()
    }

    fn return_map(args: ArgsReturnMap) -> Map<String, i32> {
        args.map
    }

    fn return_custom_map(args: ArgsReturnCustomMap) -> CustomMap {
        args.foo
    }

    fn return_nested_map(args: ArgsReturnNestedMap) -> Map<String, Map<String, i32>> {
        args.foo
    }
}
