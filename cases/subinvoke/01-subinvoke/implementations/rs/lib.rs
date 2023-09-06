pub mod wrap;
use wrap::imported::imported_subinvoke_module::{ArgsAdd, ArgsInvokeThrowError};
pub use wrap::prelude::*;
use polywrap_msgpack_serde::to_vec;
use polywrap_wasm_rs::subinvoke::wrap_subinvoke;

impl ModuleTrait for Module {
    fn add_and_increment(args: ArgsAddAndIncrement) -> Result<i32, String> {
        Ok(ImportedSubinvokeModule::add(&ArgsAdd {
            a: args.a,
            b: args.b,
        })
        .unwrap()
            + 1)
    }

    fn subinvoke_throw_error(args: ArgsSubinvokeThrowError) -> Result<bool, String> {
        Ok(ImportedSubinvokeModule::invoke_throw_error(
            &ArgsInvokeThrowError { error: args.error },
        )
        .unwrap())
    }

    fn subinvoke_method_not_found(_: ArgsSubinvokeMethodNotFound) -> Result<bool, String> {
        let args_add: ArgsAdd = ArgsAdd { a: 1, b: 1 };
        let args_buf = to_vec(&args_add).map_err(|e| e.to_string())?;
        let result = wrap_subinvoke("authority/imported-subinvoke", "methodNotFound", args_buf);
        if result.is_err() {
            return Err(result.unwrap_err());
        }
        Ok(true)
    }

    fn subinvoke_args_incorrect(_: ArgsSubinvokeArgsIncorrect) -> Result<bool, String> {
        let wrong_args: ArgsInvokeThrowError = ArgsInvokeThrowError { error: "Oops!".to_string() };
        let args_buf = to_vec(&wrong_args).map_err(|e| e.to_string())?;
        let result = wrap_subinvoke("authority/imported-subinvoke", "add", args_buf);
        if result.is_err() {
            return Err(result.unwrap_err());
        }
        Ok(true)
    }
}
