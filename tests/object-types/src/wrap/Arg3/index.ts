import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeArg3,
  deserializeArg3,
  writeArg3,
  readArg3
} from "./serialization";
import * as Types from "..";

export class Arg3 {
  prop: ArrayBuffer;

  static toBuffer(type: Arg3): ArrayBuffer {
    return serializeArg3(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Arg3 {
    return deserializeArg3(buffer);
  }

  static write(writer: Write, type: Arg3): void {
    writeArg3(writer, type);
  }

  static read(reader: Read): Arg3 {
    return readArg3(reader);
  }
}
