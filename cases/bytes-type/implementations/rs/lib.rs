pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn bytes_method(args: ArgsBytesMethod) -> Result<Vec<u8>, String> {
        match String::from_utf8(args.arg.prop) {
            Ok(s) => Ok(String::into_bytes([&s, " Sanity!"].concat())),
            Err(_e) => Err(_e.to_string()),
        }
    }
}
