import { wrap_load_env } from "@polywrap/wasm-as";
import {
  methodNoEnv,
  methodRequireEnv,
  methodOptionalEnv,
  subinvokeEnvMethod
} from "../../index";
import {
  deserializemethodNoEnvArgs,
  serializemethodNoEnvResult,
  deserializemethodRequireEnvArgs,
  serializemethodRequireEnvResult,
  deserializemethodOptionalEnvArgs,
  serializemethodOptionalEnvResult,
  deserializesubinvokeEnvMethodArgs,
  serializesubinvokeEnvMethodResult
} from "./serialization";
import * as Types from "..";

export function methodNoEnvWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemethodNoEnvArgs(argsBuf);

  const result = methodNoEnv(
    {
      arg: args.arg
    }
  );
  return serializemethodNoEnvResult(result);
}

export function methodRequireEnvWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  if (env_size == 0) {
    throw new Error("Environment is not set, and it is required by method 'objectMethod'")
  }
  
  const envBuf = wrap_load_env(env_size);
  const env = Types.Env.fromBuffer(envBuf);
  const args = deserializemethodRequireEnvArgs(argsBuf);

  const result = methodRequireEnv(
    {
      arg: args.arg
    },
    env
  );
  return serializemethodRequireEnvResult(result);
}

export function methodOptionalEnvWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  let env: Types.Env | null = null;
  if (env_size > 0) {
    const envBuf = wrap_load_env(env_size);
    env = Types.Env.fromBuffer(envBuf);
  }
  const args = deserializemethodOptionalEnvArgs(argsBuf);

  const result = methodOptionalEnv(
    {
      arg: args.arg
    },
    env
  );
  return serializemethodOptionalEnvResult(result);
}

export function subinvokeEnvMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  if (env_size == 0) {
    throw new Error("Environment is not set, and it is required by method 'objectMethod'")
  }
  
  const envBuf = wrap_load_env(env_size);
  const env = Types.Env.fromBuffer(envBuf);
  const args = deserializesubinvokeEnvMethodArgs(argsBuf);

  const result = subinvokeEnvMethod(
    {
      arg: args.arg
    },
    env
  );
  return serializesubinvokeEnvMethodResult(result);
}
