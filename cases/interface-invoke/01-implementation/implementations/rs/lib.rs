pub mod wrap;
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn module_method(args: ArgsModuleMethod) -> Result<ImplementationType, String> {
        Ok(args.arg)
    }

    fn abstract_module_method(args: ArgsAbstractModuleMethod) -> Result<String, String> {
        Ok(args.arg.str)
    }
}
