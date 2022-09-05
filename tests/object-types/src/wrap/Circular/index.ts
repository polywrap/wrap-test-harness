import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeCircular,
  deserializeCircular,
  writeCircular,
  readCircular
} from "./serialization";
import * as Types from "..";

export class Circular {
  prop: string;

  static toBuffer(type: Circular): ArrayBuffer {
    return serializeCircular(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Circular {
    return deserializeCircular(buffer);
  }

  static write(writer: Write, type: Circular): void {
    writeCircular(writer, type);
  }

  static read(reader: Read): Circular {
    return readCircular(reader);
  }
}
