import { wrap_load_env } from "@polywrap/wasm-as";
import {
  getKey,
  returnMap
} from "../../index";
import {
  deserializegetKeyArgs,
  serializegetKeyResult,
  deserializereturnMapArgs,
  serializereturnMapResult
} from "./serialization";
import * as Types from "..";

export function getKeyWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializegetKeyArgs(argsBuf);

  const result = getKey(
    {
      key: args.key,
      map: args.map
    }
  );
  return serializegetKeyResult(result);
}

export function returnMapWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializereturnMapArgs(argsBuf);

  const result = returnMap(
    {
      map: args.map
    }
  );
  return serializereturnMapResult(result);
}
