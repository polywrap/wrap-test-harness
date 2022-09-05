import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeInterface_InterfaceType,
  deserializeInterface_InterfaceType,
  writeInterface_InterfaceType,
  readInterface_InterfaceType
} from "./serialization";
import * as Types from "../..";

export class Interface_InterfaceType {

  public static uri: string = "wrap://ens/interface.eth";

  uint8: u8;

  static toBuffer(type: Interface_InterfaceType): ArrayBuffer {
    return serializeInterface_InterfaceType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Interface_InterfaceType {
    return deserializeInterface_InterfaceType(buffer);
  }

  static write(writer: Write, type: Interface_InterfaceType): void {
    writeInterface_InterfaceType(writer, type);
  }

  static read(reader: Read): Interface_InterfaceType {
    return readInterface_InterfaceType(reader);
  }
}
