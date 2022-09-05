import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeResult,
  deserializeResult,
  writeResult,
  readResult
} from "./serialization";
import * as Types from "..";

export class Result {
  m_const: string;

  static toBuffer(type: Result): ArrayBuffer {
    return serializeResult(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Result {
    return deserializeResult(buffer);
  }

  static write(writer: Write, type: Result): void {
    writeResult(writer, type);
  }

  static read(reader: Read): Result {
    return readResult(reader);
  }
}
