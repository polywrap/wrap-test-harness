pub mod wrap;
pub use wrap::*;
use wrap::env::{Env};
use wrap::module::{ModuleTrait, Module};

fn create_env(env: Env) -> Env {
    Env {
        str: env.str,
    }
}

impl ModuleTrait for Module {
    fn env_method(_: ArgsEnvMethod, env: Env) -> Result<String, String> {
        return Ok(env.str);
    }
}
