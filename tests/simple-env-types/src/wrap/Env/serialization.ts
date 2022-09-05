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
import { Env } from "./";
import * as Types from "..";

export function serializeEnv(type: Env): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) env-type: Env");
  const sizer = new WriteSizer(sizerContext);
  writeEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) env-type: Env");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEnv(encoder, type);
  return buffer;
}

export function writeEnv(writer: Write, type: Env): void {
  writer.writeMapLength(2);
  writer.context().push("str", "string | null", "writing property");
  writer.writeString("str");
  writer.writeOptionalString(type.str);
  writer.context().pop();
  writer.context().push("requiredInt", "i32", "writing property");
  writer.writeString("requiredInt");
  writer.writeInt32(type.requiredInt);
  writer.context().pop();
}

export function deserializeEnv(buffer: ArrayBuffer): Env {
  const context: Context = new Context("Deserializing env-type Env");
  const reader = new ReadDecoder(buffer, context);
  return readEnv(reader);
}

export function readEnv(reader: Read): Env {
  let numFields = reader.readMapLength();

  let _str: string | null = null;
  let _requiredInt: i32 = 0;
  let _requiredIntSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string | null", "type found, reading property");
      _str = reader.readOptionalString();
      reader.context().pop();
    }
    else if (field == "requiredInt") {
      reader.context().push(field, "i32", "type found, reading property");
      _requiredInt = reader.readInt32();
      _requiredIntSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_requiredIntSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'requiredInt: Int'"));
  }

  return {
    str: _str,
    requiredInt: _requiredInt
  };
}
