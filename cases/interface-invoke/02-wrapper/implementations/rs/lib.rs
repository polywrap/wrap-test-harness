pub mod wrap;
pub use wrap::prelude::*;
pub use wrap::imported::interface_module;
pub use wrap::imported::interface_argument;

impl ModuleTrait for Module {
    fn module_method(args: ArgsModuleMethod) -> Result<ImplementationType, String> {
        Ok(args.arg)
    }
    
    fn abstract_module_method(args: ArgsAbstractModuleMethod) -> Result<String, String> {
        let impls = Interface::get_implementations();
        let uri: String = impls[1].to_owned();
        let module = InterfaceModule::new(uri);
        let method_args = interface_module::ArgsAbstractModuleMethod {
            arg: interface_argument::InterfaceArgument {
                str: args.arg.str
            }
        };
        Ok(module.abstract_module_method(&method_args).unwrap())
    }
}
