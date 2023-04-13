pub mod wrap;
pub use wrap::*;
use wrap::env::{Env};
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn external_env_method(_: ArgsExternalEnvMethod, env: Env) -> Result<Env, String> {
        Ok(env)
    }
}
