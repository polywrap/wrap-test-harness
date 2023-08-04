pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
    fn subinvoke_method_no_env(args: ArgsSubinvokeMethodNoEnv) -> Result<String, String> {
        SubinvokedModule::method_no_env(&(imported::ArgsMethodNoEnv {arg: args.arg}))
    }
    
    fn subinvoke_method_require_env(_: ArgsSubinvokeMethodRequireEnv) -> Result<SubinvokedEnv, String> {
        SubinvokedModule::method_require_env(&(imported::ArgsMethodRequireEnv {}))
    }

    fn subinvoke_method_optional_env(args: ArgsSubinvokeMethodOptionalEnv) -> Result<Option<SubinvokedEnv>, String> {
        SubinvokedModule::method_optional_env(&(imported::ArgsMethodOptionalEnv {}))
    }
}
