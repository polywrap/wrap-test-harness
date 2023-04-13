pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn add(args: ArgsAdd) -> Result<i32, String> {
        Ok(args.a + args.b)
    }

    fn subinvoke_throw_error(args: ArgsSubinvokeThrowError) -> Result<bool, String> {
        panic!("{}", args.a);
    }
}
