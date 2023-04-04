pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn bool_method(args: ArgsBoolMethod) -> bool {
        args.arg
    }

    fn int_method(args: ArgsIntMethod) -> i32 {
        args.arg
    }

    fn u_int_method(args: ArgsUIntMethod) -> u32 {
        args.arg
    }

    fn bytes_method(args: ArgsBytesMethod) -> Vec<u8> {
        args.arg
    }

    fn array_method(args: ArgsArrayMethod) -> Option<Vec<String>> {
        Some(args.arg)
    }
}
