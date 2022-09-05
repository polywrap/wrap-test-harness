import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeImplementationType,
  deserializeImplementationType,
  writeImplementationType,
  readImplementationType
} from "./serialization";
import * as Types from "..";

export class ImplementationType {
  str: string;
  uint8: u8;

  static toBuffer(type: ImplementationType): ArrayBuffer {
    return serializeImplementationType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ImplementationType {
    return deserializeImplementationType(buffer);
  }

  static write(writer: Write, type: ImplementationType): void {
    writeImplementationType(writer, type);
  }

  static read(reader: Read): ImplementationType {
    return readImplementationType(reader);
  }
}
