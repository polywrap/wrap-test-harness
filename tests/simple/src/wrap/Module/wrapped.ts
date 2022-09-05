import { wrap_load_env } from "@polywrap/wasm-as";
import {
  simpleMethod
} from "../../index";
import {
  deserializesimpleMethodArgs,
  serializesimpleMethodResult
} from "./serialization";
import * as Types from "..";

export function simpleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializesimpleMethodArgs(argsBuf);

  const result = simpleMethod(
    {
      arg: args.arg
    }
  );
  return serializesimpleMethodResult(result);
}
