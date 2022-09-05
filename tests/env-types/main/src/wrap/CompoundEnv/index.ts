import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeCompoundEnv,
  deserializeCompoundEnv,
  writeCompoundEnv,
  readCompoundEnv
} from "./serialization";
import * as Types from "..";

export class CompoundEnv {
  local: Types.Env;
  external: Types.ExternalEnvApi_Env;

  static toBuffer(type: CompoundEnv): ArrayBuffer {
    return serializeCompoundEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): CompoundEnv {
    return deserializeCompoundEnv(buffer);
  }

  static write(writer: Write, type: CompoundEnv): void {
    writeCompoundEnv(writer, type);
  }

  static read(reader: Read): CompoundEnv {
    return readCompoundEnv(reader);
  }
}
