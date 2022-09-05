import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeObject,
  deserializeObject,
  writeObject,
  readObject
} from "./serialization";
import * as Types from "..";

export class Object {
  jsonA: JSON.Value;
  jsonB: JSON.Value;

  static toBuffer(type: Object): ArrayBuffer {
    return serializeObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Object {
    return deserializeObject(buffer);
  }

  static write(writer: Write, type: Object): void {
    writeObject(writer, type);
  }

  static read(reader: Read): Object {
    return readObject(reader);
  }
}
