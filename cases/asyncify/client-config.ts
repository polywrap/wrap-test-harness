import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { latestWrapManifestVersion } from "@polywrap/wrap-manifest-types-js";
import { parseSchema } from "@polywrap/schema-parse";

export function configure(builder: ClientConfigBuilder): ClientConfigBuilder {
  const memoryStoragePlugin = () => {
    return PluginPackage.from(new MemoryStoragePlugin({}), {
      name: "memoryStorage",
      type: "plugin",
      version: latestWrapManifestVersion,
      abi: parseSchema(`
        type Module {
          getData: Int32!
          setData(value: Int32!): Boolean!
        }
      `),
    });
  };
  return builder.setPackage(
    "wrap://plugin/memory-storage",
    memoryStoragePlugin()
  );
}

class MemoryStoragePlugin extends PluginModule<Record<string, unknown>> {
  private _value: number;

  async getData(_: {}): Promise<number> {
    await this.sleep(50);
    return this._value;
  }

  async setData(args: { value: number }): Promise<boolean> {
    await this.sleep(50);
    this._value = args.value;
    return true;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
