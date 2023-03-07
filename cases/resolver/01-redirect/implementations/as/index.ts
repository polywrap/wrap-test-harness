import {
  Args_getFile,
  Args_tryResolveUri,
  UriResolver_MaybeUriOrManifest,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  tryResolveUri(
    args: Args_tryResolveUri
  ): UriResolver_MaybeUriOrManifest {
    if (args.authority != "custom-authority") {
      return {
        uri: "wrap://" + args.authority + "/" + args.path,
        manifest: null,
      };
    }
  
    return {
      uri: "wrap://custom-fs/" + args.path,
      manifest: null,
    };
  }

  getFile(args: Args_getFile): ArrayBuffer | null {
    return null;
  }
}
