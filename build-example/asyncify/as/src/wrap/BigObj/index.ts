import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeBigObj,
  deserializeBigObj,
  writeBigObj,
  readBigObj
} from "./serialization";
import * as Types from "..";

export class BigObj {
  propA: string;
  propB: string;
  propC: string;
  propD: string;
  propE: string;
  propF: string;
  propG: string;
  propH: string;
  propI: string;
  propJ: string;
  propK: string;
  propL: string;

  static toBuffer(type: BigObj): ArrayBuffer {
    return serializeBigObj(type);
  }

  static fromBuffer(buffer: ArrayBuffer): BigObj {
    return deserializeBigObj(buffer);
  }

  static write(writer: Write, type: BigObj): void {
    writeBigObj(writer, type);
  }

  static read(reader: Read): BigObj {
    return readBigObj(reader);
  }
}
