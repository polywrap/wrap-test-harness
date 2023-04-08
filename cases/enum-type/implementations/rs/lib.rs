pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn method1(args: ArgsMethod1) -> Result<SanityEnum, String> {
        Ok(args.en)
    }

    fn method2(args: ArgsMethod2) -> Result<Vec<SanityEnum>, String> {
        Ok(args.enum_array)
    }
}
