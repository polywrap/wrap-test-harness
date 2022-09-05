import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeNested,
  deserializeNested,
  writeNested,
  readNested
} from "./serialization";
import * as Types from "..";

export class Nested {
  prop: string;

  static toBuffer(type: Nested): ArrayBuffer {
    return serializeNested(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Nested {
    return deserializeNested(buffer);
  }

  static write(writer: Write, type: Nested): void {
    writeNested(writer, type);
  }

  static read(reader: Read): Nested {
    return readNested(reader);
  }
}
