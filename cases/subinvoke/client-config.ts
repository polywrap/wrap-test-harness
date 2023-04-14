import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { latestWrapManifestVersion } from "@polywrap/wrap-manifest-types-js";
import { parseSchema } from "@polywrap/schema-parse";
import path from "path";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
    const asSubinvokeWrapperPath = path.join(__dirname, "00-subinvoke", "implementations", "as");
    const asSubinvokeImplementationUri = `fs/${path.resolve(asSubinvokeWrapperPath)}/build`

    const asInvokeWrapperPath = path.join(__dirname, "01-invoke", "implementations", "as");
    const asInvokeImplementationUri = `fs/${path.resolve(asInvokeWrapperPath)}/build`

    const adderPlugin = () => {
        return PluginPackage.from(new Adder({}), {
            name: "adder",
            type: "plugin",
            version: latestWrapManifestVersion,
            abi: parseSchema(`
              type Module {
                add(a: Int32!, b: Int32!): Int32!
              }
            `),
        });
    }


    return builder
      .addPackage("plugin/adder", adderPlugin())
      .addRedirect("ens/imported-subinvoke.eth", asSubinvokeImplementationUri)
      .addRedirect("ens/imported-invoke.eth", asInvokeImplementationUri);
}

class Adder extends PluginModule<Record<string, unknown>> {
    add(args: { a: number, b: number }): number {
        return args.a + args.b
    }
}