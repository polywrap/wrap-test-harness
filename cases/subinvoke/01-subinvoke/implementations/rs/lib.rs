pub mod wrap;
use imported::imported_subinvoke_module::ArgsAdd;
pub use wrap::*;

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
            &imported::imported_subinvoke_module::ArgsInvokeThrowError { error: args.error },
        )
        .unwrap())
    }
}
