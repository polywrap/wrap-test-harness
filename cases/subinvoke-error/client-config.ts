import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  const asSubinvokeWrapperPath = path.join(__dirname, "00-subinvoke-error", "implementations", "as");
  const asSubinvokeImplementationUri = `fs/${path.resolve(asSubinvokeWrapperPath)}/build`

  const asInvokeWrapperPath = path.join(__dirname, "01-invoke", "implementations", "as");
  const asInvokeImplementationUri = `fs/${path.resolve(asInvokeWrapperPath)}/build`


  return builder
    .addRedirect("ens/00-subinvoke-error.eth", asSubinvokeImplementationUri)
    .addRedirect("ens/01-invoke.eth", asInvokeImplementationUri);
}
