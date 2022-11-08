import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
    const asExternalWrapperPath = path.join(__dirname, "00-external", "implementations", "as");
    const rsExternalWrapperPath = path.join(__dirname, "00-external", "implementations", "rs");

    const asWrapperPath = path.join(__dirname, "01-main", "implementations", "as");
    const rsWrapperPath = path.join(__dirname, "01-main", "implementations", "rs");



    const envs = [
        {
            uri: asWrapperPath,
            env: {
                object: {
                    prop: "object string",
                },
                str: "string",
                optFilledStr: "optional string",
                number: 10,
                bool: true,
                en: "FIRST",
                array: [32, 23],
            },
        },
        {
            uri: asExternalWrapperPath,
            env: {
                externalArray: [1, 2, 3],
                externalString: "iamexternal",
            },
        },
        {
            uri: rsWrapperPath,
            env: {
                object: {
                    prop: "object string",
                },
                str: "string",
                optFilledStr: "optional string",
                number: 10,
                bool: true,
                en: "FIRST",
                array: [32, 23],
            },
        },
        {
            uri: rsExternalWrapperPath,
            env: {
                externalArray: [1, 2, 3],
                externalString: "iamexternal",
            },
        },
    ]

    return builder.addEnvs(envs).addRedirect("ens/external-env.polywrap.eth", rsExternalWrapperPath)
}