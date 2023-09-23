pub mod wrap;
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn method_no_env(args: ArgsMethodNoEnv) -> Result<String, String> {
        Ok(args.arg)
    }
    
    fn method_require_env(_: ArgsMethodRequireEnv, env: Env) -> Result<Env, String> {
        Ok(env)
    }

    fn method_optional_env(args: ArgsMethodOptionalEnv, env: Option<Env>) -> Result<Option<Env>, String> {
        Ok(match env {
            Some(e) => Some(e),
            None => None
        })
    }
}
