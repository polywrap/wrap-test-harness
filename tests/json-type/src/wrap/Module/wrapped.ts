import { wrap_load_env } from "@polywrap/wasm-as";
import {
  parse,
  stringify,
  stringifyObject,
  methodJSON
} from "../../index";
import {
  deserializeparseArgs,
  serializeparseResult,
  deserializestringifyArgs,
  serializestringifyResult,
  deserializestringifyObjectArgs,
  serializestringifyObjectResult,
  deserializemethodJSONArgs,
  serializemethodJSONResult
} from "./serialization";
import * as Types from "..";

export function parseWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializeparseArgs(argsBuf);

  const result = parse(
    {
      value: args.value
    }
  );
  return serializeparseResult(result);
}

export function stringifyWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializestringifyArgs(argsBuf);

  const result = stringify(
    {
      values: args.values
    }
  );
  return serializestringifyResult(result);
}

export function stringifyObjectWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializestringifyObjectArgs(argsBuf);

  const result = stringifyObject(
    {
      object: args.object
    }
  );
  return serializestringifyObjectResult(result);
}

export function methodJSONWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemethodJSONArgs(argsBuf);

  const result = methodJSON(
    {
      valueA: args.valueA,
      valueB: args.valueB,
      valueC: args.valueC
    }
  );
  return serializemethodJSONResult(result);
}
