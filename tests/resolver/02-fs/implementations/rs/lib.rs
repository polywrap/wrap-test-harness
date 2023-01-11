pub mod wrap;
pub use wrap::*;
use imported::uri_resolver_module;
use imported::UriResolverMaybeUriOrManifest;

pub fn try_resolve_uri(args: ArgsTryResolveUri) -> Option<UriResolverMaybeUriOrManifest> {
    if args.authority.as_str().eq("custom-fs") {
        Some(UriResolverMaybeUriOrManifest {
            uri: Some(format!("wrap://file/{}", args.path)),
            manifest: None
        })
    } else {
        Some(UriResolverMaybeUriOrManifest{
            uri: Some(format!("wrap://{}/{}", args.authority, args.path)),
            manifest: None
        })
    }
}

pub fn get_file(args: ArgsGetFile) -> Option<Vec<u8>> {
    return None
}