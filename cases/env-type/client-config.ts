import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  const rsExternalWrapperPath = path.join(
    __dirname,
    "00-external",
    "implementations",
    "rs"
  );
  const rsExternalWrapperUri = `fs/${rsExternalWrapperPath}/build`;
  const envs = {
    "wrap://fs/./build": {
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
    [rsExternalWrapperUri]: {
      externalArray: [1, 2, 3],
      externalString: "iamexternal",
    },
  };

  return builder
    .addEnvs(envs)
    .addRedirect("wrap://authority/external-env", rsExternalWrapperUri);
}
