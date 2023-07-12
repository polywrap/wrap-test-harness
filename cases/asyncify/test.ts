import { PolywrapClient } from "@polywrap/client-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { WasmPackage } from "@polywrap/wasm-js";
import fs from "fs";

import { configure } from "./client-config";

const packageDir = `${__dirname}/../../build/asyncify/implementations/go/build`;
const p = WasmPackage.from(
  fs.readFileSync(packageDir + "/wrap.info"),
  fs.readFileSync(packageDir + "/wrap.wasm"),
);

const builder = new ClientConfigBuilder();
builder.addDefaults();
builder.addPackage("my/wrap", p);
const config = configure(builder).build();
const client = new PolywrapClient(config);
client.invoke({
  uri: "my/wrap",
  method: "subsequentInvokes",
  args: {
    numberOfTimes: 1
  }
}).then((res) => console.log(res))
