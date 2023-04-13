pub mod wrap;
pub use wrap::*;
use wrap::env::{Env};
use wrap::module::{ModuleTrait, Module};

fn create_env(env: Env) -> Env {
    Env {
        str: env.str,
        opt_str: env.opt_str,
        opt_filled_str: env.opt_filled_str,
        number: env.number,
        opt_number: env.opt_number,
        bool: env.bool,
        opt_bool: env.opt_bool,
        en: env.en,
        opt_enum: env.opt_enum,
        object: env.object,
        opt_object: env.opt_object,
        array: env.array,
    }
}

impl ModuleTrait for Module {
    fn method_no_env(args: ArgsMethodNoEnv) -> Result<String, String> {
        Ok(args.arg)
    }
    
    fn method_require_env(_: ArgsMethodRequireEnv, env: Env) -> Result<Env, String> {
        Ok(create_env(env))
    }

    fn method_optional_env(args: ArgsMethodOptionalEnv, env: Option<Env>) -> Result<Option<Env>, String> {
        Ok(match env {
            Some(e) => Some(create_env(e)),
            None => None
        })
    }

    fn subinvoke_env_method(args: ArgsSubinvokeEnvMethod, env: Env) -> Result<CompoundEnv, String> {
        let external_env: ExternalEnvApiEnv = ExternalEnvApiModule::external_env_method(&(imported::ArgsExternalEnvMethod {})).unwrap();
        
        return Ok(CompoundEnv {
            local: env,
            external: external_env
        });
    }
}
