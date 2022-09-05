import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeOutput,
  deserializeOutput,
  writeOutput,
  readOutput
} from "./serialization";
import * as Types from "..";

export class Output {
  prop: string;
  nested: Types.Nested;

  static toBuffer(type: Output): ArrayBuffer {
    return serializeOutput(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Output {
    return deserializeOutput(buffer);
  }

  static write(writer: Write, type: Output): void {
    writeOutput(writer, type);
  }

  static read(reader: Read): Output {
    return readOutput(reader);
  }
}
