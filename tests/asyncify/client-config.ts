import { ClientConfig, PluginModule } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const getClientConfig = async (): Promise<Partial<ClientConfig>> => {
  const memoryStoragePackage = {
    factory: () => new MemoryStoragePlugin({}),
    manifest: {} as WrapManifest
  }
  return {
    plugins: [{
      uri: "wrap://ens/memory-storage.polywrap.eth",
      plugin: memoryStoragePackage
    }]
  }
}

class MemoryStoragePlugin extends PluginModule<Record<string, never>> {
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
