import {
  Args_getFile,
  Args_tryResolveUri,
  UriResolver_MaybeUriOrManifest,
} from "./wrap";

export function tryResolveUri(
  args: Args_tryResolveUri
): UriResolver_MaybeUriOrManifest {
  if (args.authority == "custom-fs") {
    return {
      uri: "wrap://file/" + args.path,
      manifest: null,
    };
  }
  
  return {
    uri: "wrap://" + args.authority + "/" + args.path,
    manifest: null,
  };
}

export function getFile(args: Args_getFile): ArrayBuffer | null {
  return null;
}
