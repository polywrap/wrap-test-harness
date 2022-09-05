import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeLargeCollection,
  deserializeLargeCollection,
  writeLargeCollection,
  readLargeCollection
} from "./serialization";
import * as Types from "..";

export class LargeCollection {
  largeStr: string;
  largeBytes: ArrayBuffer;
  largeStrArray: Array<string>;
  largeBytesArray: Array<ArrayBuffer>;

  static toBuffer(type: LargeCollection): ArrayBuffer {
    return serializeLargeCollection(type);
  }

  static fromBuffer(buffer: ArrayBuffer): LargeCollection {
    return deserializeLargeCollection(buffer);
  }

  static write(writer: Write, type: LargeCollection): void {
    writeLargeCollection(writer, type);
  }

  static read(reader: Read): LargeCollection {
    return readLargeCollection(reader);
  }
}
