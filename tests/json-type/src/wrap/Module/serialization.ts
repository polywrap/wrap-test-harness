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
import * as Types from "..";

export class Args_parse {
  value: string;
}

export function deserializeparseArgs(argsBuf: ArrayBuffer): Args_parse {
  const context: Context = new Context("Deserializing module-type: parse");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _value: string = "";
  let _valueSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "value") {
      reader.context().push(field, "string", "type found, reading property");
      _value = reader.readString();
      _valueSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'value: String'"));
  }

  return {
    value: _value
  };
}

export function serializeparseResult(result: JSON.Value): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: parse");
  const sizer = new WriteSizer(sizerContext);
  writeparseResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: parse");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeparseResult(encoder, result);
  return buffer;
}

export function writeparseResult(writer: Write, result: JSON.Value): void {
  writer.context().push("parse", "JSON.Value", "writing property");
  writer.writeJSON(result);
  writer.context().pop();
}

export class Args_stringify {
  values: Array<JSON.Value>;
}

export function deserializestringifyArgs(argsBuf: ArrayBuffer): Args_stringify {
  const context: Context = new Context("Deserializing module-type: stringify");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _values: Array<JSON.Value> = [];
  let _valuesSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "values") {
      reader.context().push(field, "Array<JSON.Value>", "type found, reading property");
      _values = reader.readArray((reader: Read): JSON.Value => {
        return reader.readJSON();
      });
      _valuesSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_valuesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'values: [JSON]'"));
  }

  return {
    values: _values
  };
}

export function serializestringifyResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: stringify");
  const sizer = new WriteSizer(sizerContext);
  writestringifyResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: stringify");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writestringifyResult(encoder, result);
  return buffer;
}

export function writestringifyResult(writer: Write, result: string): void {
  writer.context().push("stringify", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Args_stringifyObject {
  object: Types.Object;
}

export function deserializestringifyObjectArgs(argsBuf: ArrayBuffer): Args_stringifyObject {
  const context: Context = new Context("Deserializing module-type: stringifyObject");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _object: Types.Object | null = null;
  let _objectSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "object") {
      reader.context().push(field, "Types.Object", "type found, reading property");
      const object = Types.Object.read(reader);
      _object = object;
      _objectSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_object || !_objectSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'object: Object'"));
  }

  return {
    object: _object
  };
}

export function serializestringifyObjectResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: stringifyObject");
  const sizer = new WriteSizer(sizerContext);
  writestringifyObjectResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: stringifyObject");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writestringifyObjectResult(encoder, result);
  return buffer;
}

export function writestringifyObjectResult(writer: Write, result: string): void {
  writer.context().push("stringifyObject", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Args_methodJSON {
  valueA: i32;
  valueB: string;
  valueC: bool;
}

export function deserializemethodJSONArgs(argsBuf: ArrayBuffer): Args_methodJSON {
  const context: Context = new Context("Deserializing module-type: methodJSON");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _valueA: i32 = 0;
  let _valueASet: bool = false;
  let _valueB: string = "";
  let _valueBSet: bool = false;
  let _valueC: bool = false;
  let _valueCSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "valueA") {
      reader.context().push(field, "i32", "type found, reading property");
      _valueA = reader.readInt32();
      _valueASet = true;
      reader.context().pop();
    }
    else if (field == "valueB") {
      reader.context().push(field, "string", "type found, reading property");
      _valueB = reader.readString();
      _valueBSet = true;
      reader.context().pop();
    }
    else if (field == "valueC") {
      reader.context().push(field, "bool", "type found, reading property");
      _valueC = reader.readBool();
      _valueCSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_valueASet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueA: Int'"));
  }
  if (!_valueBSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueB: String'"));
  }
  if (!_valueCSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueC: Boolean'"));
  }

  return {
    valueA: _valueA,
    valueB: _valueB,
    valueC: _valueC
  };
}

export function serializemethodJSONResult(result: JSON.Value): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: methodJSON");
  const sizer = new WriteSizer(sizerContext);
  writemethodJSONResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: methodJSON");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodJSONResult(encoder, result);
  return buffer;
}

export function writemethodJSONResult(writer: Write, result: JSON.Value): void {
  writer.context().push("methodJSON", "JSON.Value", "writing property");
  writer.writeJSON(result);
  writer.context().pop();
}
