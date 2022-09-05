import { wrap_load_env } from "@polywrap/wasm-as";
import {
  getEnv
} from "../../index";
import {
  deserializegetEnvArgs,
  serializegetEnvResult
} from "./serialization";
import * as Types from "..";

export function getEnvWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  let env: Types.Env | null = null;
  if (env_size > 0) {
    const envBuf = wrap_load_env(env_size);
    env = Types.Env.fromBuffer(envBuf);
  }
  const args = deserializegetEnvArgs(argsBuf);

  const result = getEnv(
    {
      arg: args.arg
    },
    env
  );
  return serializegetEnvResult(result);
}
