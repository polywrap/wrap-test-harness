pub mod wrap;
use wrap::imported::uri_resolver_module;
use polywrap_wasm_rs::ByteBuf;
use wrap::imported::UriResolverMaybeUriOrManifest;
use wrap::module::{Module, ModuleTrait};
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn try_resolve_uri(
        args: ArgsTryResolveUri,
    ) -> Result<Option<UriResolverMaybeUriOrManifest>, String> {
        match args.authority.as_str() {
            "custom-fs" => Ok(Some(UriResolverMaybeUriOrManifest {
                uri: Some(format!("wrap://file/{}", args.path)),
                manifest: None,
            })),
            "expect-error" => Err("Expected error thrown".to_string()),
            _ => Ok(Some(UriResolverMaybeUriOrManifest {
                uri: Some(format!("wrap://{}/{}", args.authority, args.path)),
                manifest: None,
            })),
        }
    }

    fn get_file(args: ArgsGetFile) -> Result<Option<ByteBuf>, String> {
        return Ok(None);
    }
}
