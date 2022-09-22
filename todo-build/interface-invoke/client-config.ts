import { ClientConfig } from "@polywrap/core-js";

export const getClientConfig = (): Partial<ClientConfig> => {
    const implementationUri = `fs/../../../implementation/implementations/as/build`
    return {
        interfaces: [{
            interface: "wrap://ens/interface.eth",
            implementations: [implementationUri]
        }]
    }
}