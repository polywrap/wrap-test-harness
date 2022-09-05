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
  writer.writeMapLength(12);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeOptionalString(type.optStr);
  writer.context().pop();
  writer.context().push("optFilledStr", "string | null", "writing property");
  writer.writeString("optFilledStr");
  writer.writeOptionalString(type.optFilledStr);
  writer.context().pop();
  writer.context().push("number", "i8", "writing property");
  writer.writeString("number");
  writer.writeInt8(type.m_number);
  writer.context().pop();
  writer.context().push("optNumber", "Option<i8>", "writing property");
  writer.writeString("optNumber");
  writer.writeOptionalInt8(type.optNumber);
  writer.context().pop();
  writer.context().push("bool", "bool", "writing property");
  writer.writeString("bool");
  writer.writeBool(type.m_bool);
  writer.context().pop();
  writer.context().push("optBool", "Option<bool>", "writing property");
  writer.writeString("optBool");
  writer.writeOptionalBool(type.optBool);
  writer.context().pop();
  writer.context().push("en", "Types.EnvEnum", "writing property");
  writer.writeString("en");
  writer.writeInt32(type.en);
  writer.context().pop();
  writer.context().push("optEnum", "Option<Types.EnvEnum>", "writing property");
  writer.writeString("optEnum");
  writer.writeOptionalInt32(type.optEnum);
  writer.context().pop();
  writer.context().push("object", "Types.EnvObject", "writing property");
  writer.writeString("object");
  Types.EnvObject.write(writer, type.object);
  writer.context().pop();
  writer.context().push("optObject", "Types.EnvObject | null", "writing property");
  writer.writeString("optObject");
  if (type.optObject) {
    Types.EnvObject.write(writer, type.optObject as Types.EnvObject);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("array", "Array<u32>", "writing property");
  writer.writeString("array");
  writer.writeArray(type.array, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.context().pop();
}

export function deserializeEnv(buffer: ArrayBuffer): Env {
  const context: Context = new Context("Deserializing env-type Env");
  const reader = new ReadDecoder(buffer, context);
  return readEnv(reader);
}

export function readEnv(reader: Read): Env {
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _optStr: string | null = null;
  let _optFilledStr: string | null = null;
  let _number: i8 = 0;
  let _numberSet: bool = false;
  let _optNumber: Option<i8> = Option.None<i8>();
  let _bool: bool = false;
  let _boolSet: bool = false;
  let _optBool: Option<bool> = Option.None<bool>();
  let _en: Types.EnvEnum = 0;
  let _enSet: bool = false;
  let _optEnum: Option<Types.EnvEnum> = Option.None<Types.EnvEnum>();
  let _object: Types.EnvObject | null = null;
  let _objectSet: bool = false;
  let _optObject: Types.EnvObject | null = null;
  let _array: Array<u32> = [];
  let _arraySet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string", "type found, reading property");
      _str = reader.readString();
      _strSet = true;
      reader.context().pop();
    }
    else if (field == "optStr") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optStr = reader.readOptionalString();
      reader.context().pop();
    }
    else if (field == "optFilledStr") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optFilledStr = reader.readOptionalString();
      reader.context().pop();
    }
    else if (field == "number") {
      reader.context().push(field, "i8", "type found, reading property");
      _number = reader.readInt8();
      _numberSet = true;
      reader.context().pop();
    }
    else if (field == "optNumber") {
      reader.context().push(field, "Option<i8>", "type found, reading property");
      _optNumber = reader.readOptionalInt8();
      reader.context().pop();
    }
    else if (field == "bool") {
      reader.context().push(field, "bool", "type found, reading property");
      _bool = reader.readBool();
      _boolSet = true;
      reader.context().pop();
    }
    else if (field == "optBool") {
      reader.context().push(field, "Option<bool>", "type found, reading property");
      _optBool = reader.readOptionalBool();
      reader.context().pop();
    }
    else if (field == "en") {
      reader.context().push(field, "Types.EnvEnum", "type found, reading property");
      let value: Types.EnvEnum;
      if (reader.isNextString()) {
        value = Types.getEnvEnumValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeEnvEnumValue(value);
      }
      _en = value;
      _enSet = true;
      reader.context().pop();
    }
    else if (field == "optEnum") {
      reader.context().push(field, "Option<Types.EnvEnum>", "type found, reading property");
      let value: Option<Types.EnvEnum>;
      if (!reader.isNextNil()) {
        if (reader.isNextString()) {
          value = Option.Some(
            Types.getEnvEnumValue(reader.readString())
          );
        } else {
          value = Option.Some(
            reader.readInt32()
          );
          Types.sanitizeEnvEnumValue(value.unwrap());
        }
      } else {
        value = Option.None<Types.EnvEnum>();
      }
      _optEnum = value;
      reader.context().pop();
    }
    else if (field == "object") {
      reader.context().push(field, "Types.EnvObject", "type found, reading property");
      const object = Types.EnvObject.read(reader);
      _object = object;
      _objectSet = true;
      reader.context().pop();
    }
    else if (field == "optObject") {
      reader.context().push(field, "Types.EnvObject | null", "type found, reading property");
      let object: Types.EnvObject | null = null;
      if (!reader.isNextNil()) {
        object = Types.EnvObject.read(reader);
      }
      _optObject = object;
      reader.context().pop();
    }
    else if (field == "array") {
      reader.context().push(field, "Array<u32>", "type found, reading property");
      _array = reader.readArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
      _arraySet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }
  if (!_numberSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'number: Int8'"));
  }
  if (!_boolSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'bool: Boolean'"));
  }
  if (!_enSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'en: EnvEnum'"));
  }
  if (!_object || !_objectSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'object: EnvObject'"));
  }
  if (!_arraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'array: [UInt32]'"));
  }

  return {
    str: _str,
    optStr: _optStr,
    optFilledStr: _optFilledStr,
    m_number: _number,
    optNumber: _optNumber,
    m_bool: _bool,
    optBool: _optBool,
    en: _en,
    optEnum: _optEnum,
    object: _object,
    optObject: _optObject,
    array: _array
  };
}
