import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeEnv,
  deserializeEnv,
  writeEnv,
  readEnv
} from "./serialization";
import * as Types from "..";

export class Env {
  str: string;
  optStr: string | null;
  optFilledStr: string | null;
  m_number: i8;
  optNumber: Option<i8>;
  m_bool: bool;
  optBool: Option<bool>;
  en: Types.EnvEnum;
  optEnum: Option<Types.EnvEnum>;
  object: Types.EnvObject;
  optObject: Types.EnvObject | null;
  array: Array<u32>;

  static toBuffer(type: Env): ArrayBuffer {
    return serializeEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Env {
    return deserializeEnv(buffer);
  }

  static write(writer: Write, type: Env): void {
    writeEnv(writer, type);
  }

  static read(reader: Read): Env {
    return readEnv(reader);
  }
}
