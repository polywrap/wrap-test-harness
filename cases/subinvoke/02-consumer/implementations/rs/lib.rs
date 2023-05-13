pub mod wrap;
use imported::imported_invoke_module::ImportedInvokeModule;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn add_and_increment(args: ArgsAddAndIncrement) -> Result<i32, String> {
        Ok(ImportedInvokeModule::add_and_increment(
            &imported::imported_invoke_module::ArgsAddAndIncrement {
                a: args.a,
                b: args.b,
            },
        )
        .unwrap()
            + 1)
    }

    fn throw_error(args: ArgsThrowError) -> Result<bool, String> {
        Ok(ImportedInvokeModule::invoke_throw_error(
            &imported::imported_invoke_module::ArgsInvokeThrowError { a: args.a },
        )
        .unwrap())
    }

    fn rethrow_error(args: ArgsRethrowError) -> Result<bool, String> {
        let result = ImportedInvokeModule::invoke_throw_error(
            &imported::imported_invoke_module::ArgsInvokeThrowError { a: args.a },
        );
        if let Err(err) = result {
            panic!("{}", err);
        }
        result
    }
}
