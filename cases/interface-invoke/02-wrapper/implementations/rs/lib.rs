pub mod wrap;
pub use wrap::*;
pub use wrap::imported::interface_module;
pub use wrap::imported::interface_argument;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn module_method(args: ArgsModuleMethod) -> ImplementationType {
        args.arg
    }
    
    fn abstract_module_method(args: ArgsAbstractModuleMethod) -> String {
        let impls = Interface::get_implementations();
        let uri: String = impls[1].to_owned();
        let module = InterfaceModule::new(uri);
        let method_args = interface_module::serialization::ArgsAbstractModuleMethod {
            arg: interface_argument::InterfaceArgument {
                str: args.arg.str
            }
        };
        module.abstract_module_method(&method_args).unwrap()
    }
}
