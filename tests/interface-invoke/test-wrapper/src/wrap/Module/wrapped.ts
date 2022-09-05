import { wrap_load_env } from "@polywrap/wasm-as";
import {
  moduleMethod
} from "../../index";
import {
  deserializemoduleMethodArgs,
  serializemoduleMethodResult
} from "./serialization";
import * as Types from "..";

export function moduleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemoduleMethodArgs(argsBuf);

  const result = moduleMethod(
    {
      arg: args.arg
    }
  );
  return serializemoduleMethodResult(result);
}
