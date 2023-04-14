pub mod wrap;
use wrap::module::{Module, ModuleTrait};
use wrap::imported::adder_module;
pub use wrap::*;

impl ModuleTrait for Module {
    fn add(args: ArgsAdd) -> Result<i32, String> {
        Ok(args.a + args.b)
    }

    fn add_from_plugin(args: ArgsAddFromPlugin) -> Result<i32, String> {
        AdderModule::add(&adder_module::ArgsAdd {
            a: args.a,
            b: args.b
        })
    }

    fn subinvoke_throw_error(args: ArgsSubinvokeThrowError) -> Result<bool, String> {
        panic!("{}", args.a);
    }
}
