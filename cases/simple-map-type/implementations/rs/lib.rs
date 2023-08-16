pub mod wrap;
use polywrap_wasm_rs::Map;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn return_custom_map(args: ArgsReturnCustomMap) -> Result<CustomMap, String> {
        Ok(args.foo)
    }
}
