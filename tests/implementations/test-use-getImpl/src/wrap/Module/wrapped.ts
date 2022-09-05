import { wrap_load_env } from "@polywrap/wasm-as";
import {
  moduleImplementations,
  moduleMethod,
  abstractModuleMethod
} from "../../index";
import {
  deserializemoduleImplementationsArgs,
  serializemoduleImplementationsResult,
  deserializemoduleMethodArgs,
  serializemoduleMethodResult,
  deserializeabstractModuleMethodArgs,
  serializeabstractModuleMethodResult
} from "./serialization";
import * as Types from "..";

export function moduleImplementationsWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {

  const result = moduleImplementations({}
  );
  return serializemoduleImplementationsResult(result);
}

export function moduleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemoduleMethodArgs(argsBuf);

  const result = moduleMethod(
    {
      arg: args.arg
    }
  );
  return serializemoduleMethodResult(result);
}

export function abstractModuleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializeabstractModuleMethodArgs(argsBuf);

  const result = abstractModuleMethod(
    {
      arg: args.arg
    }
  );
  return serializeabstractModuleMethodResult(result);
}
