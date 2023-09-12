pub mod wrap;
use polywrap_wasm_rs::ByteBuf;
use wrap::module::{Module, ModuleTrait};
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn bytes_method(args: ArgsBytesMethod) -> Result<ByteBuf, String> {
        match String::from_utf8(args.arg.prop.to_vec()) {
            Ok(s) => Ok(ByteBuf::from(String::into_bytes([&s, " Sanity!"].concat()))),
            Err(_e) => Err(_e.to_string()),
        }
    }
}
