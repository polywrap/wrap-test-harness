import { ClientConfig } from "@polywrap/client-config-builder-js";
import path from "path";

export const getCustomConfig = async (): Promise<Partial<ClientConfig>> => {
    const asWrapperPath = path.join(__dirname, "01-implementation", "implementations", "as");
    const rsWrapperPath = path.join(__dirname, "01-implementation", "implementations", "rs");
    const asImplementationUri = `fs/${path.resolve(asWrapperPath)}/build`
    const rsImplementationUri = `fs/${path.resolve(rsWrapperPath)}/build`
    return {
        interfaces: [{
            interface: "wrap://ens/interface.eth",
            implementations: [asImplementationUri, rsImplementationUri],
        }]
    }
}