pub mod wrap;
use imported::uri_resolver_module;
use imported::UriResolverMaybeUriOrManifest;
use wrap::module::{Module, ModuleTrait};
pub use wrap::*;

impl ModuleTrait for Module {
    fn try_resolve_uri(args: ArgsTryResolveUri) -> Result<Option<UriResolverMaybeUriOrManifest>, String> {
        if args.authority.as_str().eq("custom-fs") {
            Ok(Some(UriResolverMaybeUriOrManifest {
                uri: Some(format!("wrap://file/{}", args.path)),
                manifest: None,
            }))
        } else {
            Ok(Some(UriResolverMaybeUriOrManifest {
                uri: Some(format!("wrap://{}/{}", args.authority, args.path)),
                manifest: None,
            }))
        }
    }

    fn get_file(args: ArgsGetFile) -> Result<Option<Vec<u8>>, String> {
        return Ok(None);
    }
}
