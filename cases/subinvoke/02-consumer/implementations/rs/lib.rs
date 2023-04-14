pub mod wrap;
use imported::imported_invoke_module::ImportedInvokeModule;
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

    fn add_from_plugin_and_increment(args: ArgsAddFromPluginAndIncrement) -> Result<i32, String> {
        Ok(ImportedInvokeModule::add_from_plugin_and_increment(
            &imported::imported_invoke_module::ArgsAddFromPluginAndIncrement {
                a: args.a,
                b: args.b,
            },
        )
        .unwrap()
            + 1)
    }
}
