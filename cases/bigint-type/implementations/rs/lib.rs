use std::ops::Mul;

use polywrap_msgpack_serde::BigIntWrapper;
pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
    fn method(args: ArgsMethod) -> Result<BigIntWrapper, String> {
        let mut result = args.arg1.0.mul(args.obj.prop1.0);

        if args.arg2.is_some() {
            result = result.mul(args.arg2.unwrap().0);
        }
        if args.obj.prop2.is_some() {
            result = result.mul(args.obj.prop2.unwrap().0);
        }

        Ok(result)
    }
}
