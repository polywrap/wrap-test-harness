pub mod wrap;
use wrap::module;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn no_args_method(args: module::ArgsNoArgsMethod) -> Result<bool, String> {
        Ok(true)
    }
}
