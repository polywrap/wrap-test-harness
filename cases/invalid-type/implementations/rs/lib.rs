pub mod wrap;
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn bool_method(args: ArgsBoolMethod) -> Result<bool, String> {
        Ok(args.arg)
    }

    fn int_method(args: ArgsIntMethod) -> Result<i32, String> {
        Ok(args.arg)
    }

    fn u_int_method(args: ArgsUIntMethod) -> Result<u32, String> {
        Ok(args.arg)
    }

    fn bytes_method(args: ArgsBytesMethod) -> Result<Vec<u8>, String> {
        Ok(args.arg)
    }

    fn array_method(args: ArgsArrayMethod) -> Result<Option<Vec<String>>, String> {
        Ok(Some(args.arg))
    }
}
