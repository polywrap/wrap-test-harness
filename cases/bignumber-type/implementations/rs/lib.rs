use std::ops::Mul;

use polywrap_wasm_rs::BigNumber;
pub mod wrap;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn method(args: ArgsMethod) -> Result<BigNumber, String> {
        let mut result = args.arg1.mul(args.obj.prop1);

        if args.arg2.is_some() {
            result = result.mul(args.arg2.unwrap());
        }
        if args.obj.prop2.is_some() {
            result = result.mul(args.obj.prop2.unwrap());
        }

        Ok(result)
    }
}
