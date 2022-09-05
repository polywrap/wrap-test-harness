import { wrap_load_env } from "@polywrap/wasm-as";
import {
  method1
} from "../../index";
import {
  deserializemethod1Args,
  serializemethod1Result
} from "./serialization";
import * as Types from "..";

export function method1Wrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemethod1Args(argsBuf);

  const result = method1(
    {
      m_const: args.m_const
    }
  );
  return serializemethod1Result(result);
}
