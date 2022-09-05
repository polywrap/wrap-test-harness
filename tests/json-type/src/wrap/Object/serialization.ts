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
import { Object } from "./";
import * as Types from "..";

export function serializeObject(type: Object): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Object");
  const sizer = new WriteSizer(sizerContext);
  writeObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Object");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeObject(encoder, type);
  return buffer;
}

export function writeObject(writer: Write, type: Object): void {
  writer.writeMapLength(2);
  writer.context().push("jsonA", "JSON.Value", "writing property");
  writer.writeString("jsonA");
  writer.writeJSON(type.jsonA);
  writer.context().pop();
  writer.context().push("jsonB", "JSON.Value", "writing property");
  writer.writeString("jsonB");
  writer.writeJSON(type.jsonB);
  writer.context().pop();
}

export function deserializeObject(buffer: ArrayBuffer): Object {
  const context: Context = new Context("Deserializing object-type Object");
  const reader = new ReadDecoder(buffer, context);
  return readObject(reader);
}

export function readObject(reader: Read): Object {
  let numFields = reader.readMapLength();

  let _jsonA: JSON.Value = JSON.Value.Null();
  let _jsonASet: bool = false;
  let _jsonB: JSON.Value = JSON.Value.Null();
  let _jsonBSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "jsonA") {
      reader.context().push(field, "JSON.Value", "type found, reading property");
      _jsonA = reader.readJSON();
      _jsonASet = true;
      reader.context().pop();
    }
    else if (field == "jsonB") {
      reader.context().push(field, "JSON.Value", "type found, reading property");
      _jsonB = reader.readJSON();
      _jsonBSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_jsonASet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'jsonA: JSON'"));
  }
  if (!_jsonBSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'jsonB: JSON'"));
  }

  return {
    jsonA: _jsonA,
    jsonB: _jsonB
  };
}
