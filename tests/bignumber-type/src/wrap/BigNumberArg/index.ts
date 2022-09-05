import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeBigNumberArg,
  deserializeBigNumberArg,
  writeBigNumberArg,
  readBigNumberArg
} from "./serialization";
import * as Types from "..";

export class BigNumberArg {
  prop1: BigNumber;
  prop2: BigNumber | null;

  static toBuffer(type: BigNumberArg): ArrayBuffer {
    return serializeBigNumberArg(type);
  }

  static fromBuffer(buffer: ArrayBuffer): BigNumberArg {
    return deserializeBigNumberArg(buffer);
  }

  static write(writer: Write, type: BigNumberArg): void {
    writeBigNumberArg(writer, type);
  }

  static read(reader: Read): BigNumberArg {
    return readBigNumberArg(reader);
  }
}
