import { wrap_load_env } from "@polywrap/wasm-as";
import {
  externalEnvMethod
} from "../../index";
import {
  deserializeexternalEnvMethodArgs,
  serializeexternalEnvMethodResult
} from "./serialization";
import * as Types from "..";

export function externalEnvMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  if (env_size == 0) {
    throw new Error("Environment is not set, and it is required by method 'objectMethod'")
  }
  
  const envBuf = wrap_load_env(env_size);
  const env = Types.Env.fromBuffer(envBuf);

  const result = externalEnvMethod({},
    env
  );
  return serializeexternalEnvMethodResult(result);
}
