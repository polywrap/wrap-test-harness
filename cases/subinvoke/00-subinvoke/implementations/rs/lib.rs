pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn add(args: ArgsAdd) -> i32 {
        args.a + args.b
    }

    fn subinvoke_throw_error(args: ArgsSubinvokeThrowError) -> bool {
        panic!("{}", args.a);
    }
}
