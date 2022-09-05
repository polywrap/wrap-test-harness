import { wrap_load_env } from "@polywrap/wasm-as";
import {
  boolMethod,
  intMethod,
  uIntMethod,
  bytesMethod,
  arrayMethod
} from "../../index";
import {
  deserializeboolMethodArgs,
  serializeboolMethodResult,
  deserializeintMethodArgs,
  serializeintMethodResult,
  deserializeuIntMethodArgs,
  serializeuIntMethodResult,
  deserializebytesMethodArgs,
  serializebytesMethodResult,
  deserializearrayMethodArgs,
  serializearrayMethodResult
} from "./serialization";
import * as Types from "..";

export function boolMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializeboolMethodArgs(argsBuf);

  const result = boolMethod(
    {
      arg: args.arg
    }
  );
  return serializeboolMethodResult(result);
}

export function intMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializeintMethodArgs(argsBuf);

  const result = intMethod(
    {
      arg: args.arg
    }
  );
  return serializeintMethodResult(result);
}

export function uIntMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializeuIntMethodArgs(argsBuf);

  const result = uIntMethod(
    {
      arg: args.arg
    }
  );
  return serializeuIntMethodResult(result);
}

export function bytesMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializebytesMethodArgs(argsBuf);

  const result = bytesMethod(
    {
      arg: args.arg
    }
  );
  return serializebytesMethodResult(result);
}

export function arrayMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializearrayMethodArgs(argsBuf);

  const result = arrayMethod(
    {
      arg: args.arg
    }
  );
  return serializearrayMethodResult(result);
}
