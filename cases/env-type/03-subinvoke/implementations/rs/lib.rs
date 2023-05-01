pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn subinvoke_env_method(args: ArgsSubinvokeEnvMethod) -> Result<String, String> {
        let result: String = SubinvokedModule::env_method(&(imported::ArgsEnvMethod {})).unwrap();
        
        return Ok(result);
    }
}
