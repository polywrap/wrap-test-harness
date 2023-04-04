pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn external_env_method(_: ArgsExternalEnvMethod, env: Env) -> Env {
        env
    }
}
