import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: ClientConfigBuilder): ClientConfigBuilder {
  const asWrapperPath = path.join(
    __dirname,
    "01-implementation",
    "implementations",
    "as"
  );
  const rsWrapperPath = path.join(
    __dirname,
    "01-implementation",
    "implementations",
    "rs"
  );
  const asImplementationUri = `fs/${path.resolve(asWrapperPath)}/build`;
  const rsImplementationUri = `fs/${path.resolve(rsWrapperPath)}/build`;
  return builder.addInterfaceImplementations("wrap://authority/interface", [
    asImplementationUri,
    rsImplementationUri,
  ]);
}
