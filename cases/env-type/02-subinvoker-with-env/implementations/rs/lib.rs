pub mod wrap;
pub use wrap::prelude::*;
pub use wrap::imported;

impl ModuleTrait for Module {
    fn subinvoke_method_require_env(_: ArgsSubinvokeMethodRequireEnv, _env: Env) -> Result<SubinvokedEnv, String> {
        SubinvokedModule::method_require_env(&(imported::ArgsMethodRequireEnv {}))
    }
}
