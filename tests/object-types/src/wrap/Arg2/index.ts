import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeArg2,
  deserializeArg2,
  writeArg2,
  readArg2
} from "./serialization";
import * as Types from "..";

export class Arg2 {
  prop: string;
  circular: Types.Circular;

  static toBuffer(type: Arg2): ArrayBuffer {
    return serializeArg2(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Arg2 {
    return deserializeArg2(buffer);
  }

  static write(writer: Write, type: Arg2): void {
    writeArg2(writer, type);
  }

  static read(reader: Read): Arg2 {
    return readArg2(reader);
  }
}
