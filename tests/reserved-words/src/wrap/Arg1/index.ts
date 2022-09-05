import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeArg1,
  deserializeArg1,
  writeArg1,
  readArg1
} from "./serialization";
import * as Types from "..";

export class Arg1 {
  m_const: string;

  static toBuffer(type: Arg1): ArrayBuffer {
    return serializeArg1(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Arg1 {
    return deserializeArg1(buffer);
  }

  static write(writer: Write, type: Arg1): void {
    writeArg1(writer, type);
  }

  static read(reader: Read): Arg1 {
    return readArg1(reader);
  }
}
