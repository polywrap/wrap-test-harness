import { wrap_load_env } from "@polywrap/wasm-as";
import {
  method
} from "../../index";
import {
  deserializemethodArgs,
  serializemethodResult
} from "./serialization";
import * as Types from "..";

export function methodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemethodArgs(argsBuf);

  const result = method(
    {
      arg1: args.arg1,
      arg2: args.arg2,
      obj: args.obj
    }
  );
  return serializemethodResult(result);
}
