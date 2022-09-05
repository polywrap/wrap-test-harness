import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeArgs,
  deserializeArgs,
  writeArgs,
  readArgs
} from "./serialization";
import * as Types from "..";

export class Args {
  prop: ArrayBuffer;

  static toBuffer(type: Args): ArrayBuffer {
    return serializeArgs(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Args {
    return deserializeArgs(buffer);
  }

  static write(writer: Write, type: Args): void {
    writeArgs(writer, type);
  }

  static read(reader: Read): Args {
    return readArgs(reader);
  }
}
