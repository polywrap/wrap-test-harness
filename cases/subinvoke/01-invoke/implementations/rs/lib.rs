pub mod wrap;
use imported::imported_subinvoke_module::ArgsAdd;
pub use wrap::*;

impl ModuleTrait for Module {
    fn add_and_increment(args: ArgsAddAndIncrement) -> i32 {
        ImportedSubinvokeModule::add(&ArgsAdd {
            a: args.a,
            b: args.b,
        })
        .unwrap()
            + 1
    }

    fn invoke_throw_error(args: ArgsInvokeThrowError) -> bool {
        ImportedSubinvokeModule::subinvoke_throw_error(
            &imported::imported_subinvoke_module::ArgsSubinvokeThrowError { a: args.a },
        )
        .unwrap()
    }
}
