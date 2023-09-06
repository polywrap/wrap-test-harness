pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn add(args: ArgsAdd) -> Result<i32, String> {
        Ok(args.a + args.b)
    }

    fn invoke_throw_error(args: ArgsInvokeThrowError) -> Result<bool, String> {
        panic!("{}", args.error);
    }
}
