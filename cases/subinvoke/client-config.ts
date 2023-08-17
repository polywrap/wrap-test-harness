import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: ClientConfigBuilder): ClientConfigBuilder {
    const asSubinvokeWrapperPath = path.join(__dirname, "00-subinvoke", "implementations", "as");
    const asSubinvokeImplementationUri = `fs/${path.resolve(asSubinvokeWrapperPath)}/build`

    const asInvokeWrapperPath = path.join(__dirname, "01-invoke", "implementations", "as");
    const asInvokeImplementationUri = `fs/${path.resolve(asInvokeWrapperPath)}/build`


    return builder
        .setRedirect("authority/imported-subinvoke", asSubinvokeImplementationUri)
        .setRedirect("authority/imported-invoke", asInvokeImplementationUri);
}