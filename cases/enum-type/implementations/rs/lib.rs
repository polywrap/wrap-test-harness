pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn method1(args: ArgsMethod1) -> SanityEnum {
        args.en
    }
    
    fn method2(args: ArgsMethod2) -> Vec<SanityEnum> {
        args.enum_array
    }
}
