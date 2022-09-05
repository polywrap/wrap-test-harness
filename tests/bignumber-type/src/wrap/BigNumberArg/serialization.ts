import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import { BigNumberArg } from "./";
import * as Types from "..";

export function serializeBigNumberArg(type: BigNumberArg): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: BigNumberArg");
  const sizer = new WriteSizer(sizerContext);
  writeBigNumberArg(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: BigNumberArg");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeBigNumberArg(encoder, type);
  return buffer;
}

export function writeBigNumberArg(writer: Write, type: BigNumberArg): void {
  writer.writeMapLength(2);
  writer.context().push("prop1", "BigNumber", "writing property");
  writer.writeString("prop1");
  writer.writeBigNumber(type.prop1);
  writer.context().pop();
  writer.context().push("prop2", "BigNumber | null", "writing property");
  writer.writeString("prop2");
  writer.writeOptionalBigNumber(type.prop2);
  writer.context().pop();
}

export function deserializeBigNumberArg(buffer: ArrayBuffer): BigNumberArg {
  const context: Context = new Context("Deserializing object-type BigNumberArg");
  const reader = new ReadDecoder(buffer, context);
  return readBigNumberArg(reader);
}

export function readBigNumberArg(reader: Read): BigNumberArg {
  let numFields = reader.readMapLength();

  let _prop1: BigNumber = new BigNumber(BigInt.fromUInt16(0), 0, 0);
  let _prop1Set: bool = false;
  let _prop2: BigNumber | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop1") {
      reader.context().push(field, "BigNumber", "type found, reading property");
      _prop1 = reader.readBigNumber();
      _prop1Set = true;
      reader.context().pop();
    }
    else if (field == "prop2") {
      reader.context().push(field, "BigNumber | null", "type found, reading property");
      _prop2 = reader.readOptionalBigNumber();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_prop1Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop1: BigNumber'"));
  }

  return {
    prop1: _prop1,
    prop2: _prop2
  };
}
