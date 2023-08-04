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
    if (args.authority == "custom-fs") {
      return {
        uri: "wrap://file/" + args.path,
        manifest: null,
      };
    }

    if (args.authority == "expected-error") {
      throw new Error("Expected error thrown");
    }

    return {
      uri: "wrap://" + args.authority + "/" + args.path,
      manifest: null,
    };
  }

  getFile(args: Args_getFile): ArrayBuffer | null {
    return null;
  }
}
