import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
    const asSubinvokeWrapperPath = path.join(__dirname, "00-subinvoke", "implementations", "as");
    const asSubinvokeImplementationUri = `fs/${path.resolve(asSubinvokeWrapperPath)}/build`

    const asInvokeWrapperPath = path.join(__dirname, "01-invoke", "implementations", "as");
    const asInvokeImplementationUri = `fs/${path.resolve(asInvokeWrapperPath)}/build`


    return builder.addRedirect("ens/imported-subinvoke.eth", asSubinvokeImplementationUri).addRedirect("ens/imported-invoke.eth", asInvokeImplementationUri);
}