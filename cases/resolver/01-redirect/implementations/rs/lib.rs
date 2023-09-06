pub mod wrap;
use wrap::imported::uri_resolver_module;
use wrap::imported::UriResolverMaybeUriOrManifest;
use wrap::module::{Module, ModuleTrait};
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn try_resolve_uri(args: ArgsTryResolveUri) -> Result<Option<UriResolverMaybeUriOrManifest>, String> {
        if !args.authority.as_str().eq("custom-authority") {
            Ok(Some(UriResolverMaybeUriOrManifest {
                uri: Some(format!("wrap://{}/{}", args.authority, args.path)),
                manifest: None,
            }))
        } else {
            Ok(Some(UriResolverMaybeUriOrManifest {
                uri: Some(format!("wrap://custom-fs/{}", args.path)),
                manifest: None,
            }))
        }
    }

    fn get_file(args: ArgsGetFile) -> Result<Option<Vec<u8>>, String> {
        return Ok(None);
    }
}
