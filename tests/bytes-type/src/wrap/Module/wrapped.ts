import { wrap_load_env } from "@polywrap/wasm-as";
import {
  bytesMethod
} from "../../index";
import {
  deserializebytesMethodArgs,
  serializebytesMethodResult
} from "./serialization";
import * as Types from "..";

export function bytesMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializebytesMethodArgs(argsBuf);

  const result = bytesMethod(
    {
      arg: args.arg
    }
  );
  return serializebytesMethodResult(result);
}
