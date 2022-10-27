import { ClientConfig } from "@polywrap/core-js";

export const getClientConfig = async (): Partial<ClientConfig> => {
    const implementationPath = "implementation/implementations/as"
    const implementationUri = `fs/${implementationPath}/build`
    return {
        interfaces: [{
            interface: "wrap://ens/interface.eth",
            implementations: [implementationUri],
        }]
    }
}