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

export class Args_getData {
  address: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetDataArgs(argsBuf: ArrayBuffer): Args_getData {
  const context: Context = new Context("Deserializing module-type: getData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address,
    connection: _connection
  };
}

export function serializegetDataResult(result: i32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getData");
  const sizer = new WriteSizer(sizerContext);
  writegetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetDataResult(encoder, result);
  return buffer;
}

export function writegetDataResult(writer: Write, result: i32): void {
  writer.context().push("getData", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export class Args_tryGetData {
  address: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializetryGetDataArgs(argsBuf: ArrayBuffer): Args_tryGetData {
  const context: Context = new Context("Deserializing module-type: tryGetData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address,
    connection: _connection
  };
}

export function serializetryGetDataResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: tryGetData");
  const sizer = new WriteSizer(sizerContext);
  writetryGetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: tryGetData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetryGetDataResult(encoder, result);
  return buffer;
}

export function writetryGetDataResult(writer: Write, result: string): void {
  writer.context().push("tryGetData", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Args_throwGetData {
  address: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializethrowGetDataArgs(argsBuf: ArrayBuffer): Args_throwGetData {
  const context: Context = new Context("Deserializing module-type: throwGetData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address,
    connection: _connection
  };
}

export function serializethrowGetDataResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: throwGetData");
  const sizer = new WriteSizer(sizerContext);
  writethrowGetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: throwGetData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writethrowGetDataResult(encoder, result);
  return buffer;
}

export function writethrowGetDataResult(writer: Write, result: string): void {
  writer.context().push("throwGetData", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Args_setData {
  address: string;
  value: i32;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesetDataArgs(argsBuf: ArrayBuffer): Args_setData {
  const context: Context = new Context("Deserializing module-type: setData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _value: i32 = 0;
  let _valueSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "i32", "type found, reading property");
      _value = reader.readInt32();
      _valueSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'value: Int'"));
  }

  return {
    address: _address,
    value: _value,
    connection: _connection
  };
}

export function serializesetDataResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: setData");
  const sizer = new WriteSizer(sizerContext);
  writesetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: setData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataResult(encoder, result);
  return buffer;
}

export function writesetDataResult(writer: Write, result: string): void {
  writer.context().push("setData", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Args_deployContract {
  connection: Types.Ethereum_Connection | null;
}

export function deserializedeployContractArgs(argsBuf: ArrayBuffer): Args_deployContract {
  const context: Context = new Context("Deserializing module-type: deployContract");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    connection: _connection
  };
}

export function serializedeployContractResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: deployContract");
  const sizer = new WriteSizer(sizerContext);
  writedeployContractResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: deployContract");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writedeployContractResult(encoder, result);
  return buffer;
}

export function writedeployContractResult(writer: Write, result: string): void {
  writer.context().push("deployContract", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
