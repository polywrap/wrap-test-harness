pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn i8_method(args: ArgsI8Method) -> i8 {
        args.first + args.second
    }

    fn u8_method(args: ArgsU8Method) -> u8 {
        args.first + args.second
    }

    fn i16_method(args: ArgsI16Method) -> i16 {
        args.first + args.second
    }

    fn u16_method(args: ArgsU16Method) -> u16 {
        args.first + args.second
    }

    fn i32_method(args: ArgsI32Method) -> i32 {
        args.first + args.second
    }

    fn u32_method(args: ArgsU32Method) -> u32 {
        args.first + args.second
    }
}
