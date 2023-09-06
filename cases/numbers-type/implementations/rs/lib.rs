pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn i8_method(args: ArgsI8Method) -> Result<i8, String> {
        Ok(args.first + args.second)
    }

    fn u8_method(args: ArgsU8Method) -> Result<u8, String> {
        Ok(args.first + args.second)
    }

    fn i16_method(args: ArgsI16Method) -> Result<i16, String> {
        Ok(args.first + args.second)
    }

    fn u16_method(args: ArgsU16Method) -> Result<u16, String> {
        Ok(args.first + args.second)
    }

    fn i32_method(args: ArgsI32Method) -> Result<i32, String> {
        Ok(args.first + args.second)
    }

    fn u32_method(args: ArgsU32Method) -> Result<u32, String> {
        Ok(args.first + args.second)
    }
}
