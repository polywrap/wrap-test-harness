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

export class Args_methodNoEnv {
  arg: string;
}

export function deserializemethodNoEnvArgs(argsBuf: ArrayBuffer): Args_methodNoEnv {
  const context: Context = new Context("Deserializing module-type: methodNoEnv");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: string = "";
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "string", "type found, reading property");
      _arg = reader.readString();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: String'"));
  }

  return {
    arg: _arg
  };
}

export function serializemethodNoEnvResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: methodNoEnv");
  const sizer = new WriteSizer(sizerContext);
  writemethodNoEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: methodNoEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodNoEnvResult(encoder, result);
  return buffer;
}

export function writemethodNoEnvResult(writer: Write, result: string): void {
  writer.context().push("methodNoEnv", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Args_methodRequireEnv {
  arg: string;
}

export function deserializemethodRequireEnvArgs(argsBuf: ArrayBuffer): Args_methodRequireEnv {
  const context: Context = new Context("Deserializing module-type: methodRequireEnv");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: string = "";
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "string", "type found, reading property");
      _arg = reader.readString();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: String'"));
  }

  return {
    arg: _arg
  };
}

export function serializemethodRequireEnvResult(result: Types.Env): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: methodRequireEnv");
  const sizer = new WriteSizer(sizerContext);
  writemethodRequireEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: methodRequireEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodRequireEnvResult(encoder, result);
  return buffer;
}

export function writemethodRequireEnvResult(writer: Write, result: Types.Env): void {
  writer.context().push("methodRequireEnv", "Types.Env", "writing property");
  Types.Env.write(writer, result);
  writer.context().pop();
}

export class Args_methodOptionalEnv {
  arg: string;
}

export function deserializemethodOptionalEnvArgs(argsBuf: ArrayBuffer): Args_methodOptionalEnv {
  const context: Context = new Context("Deserializing module-type: methodOptionalEnv");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: string = "";
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "string", "type found, reading property");
      _arg = reader.readString();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: String'"));
  }

  return {
    arg: _arg
  };
}

export function serializemethodOptionalEnvResult(result: Types.Env | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: methodOptionalEnv");
  const sizer = new WriteSizer(sizerContext);
  writemethodOptionalEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: methodOptionalEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodOptionalEnvResult(encoder, result);
  return buffer;
}

export function writemethodOptionalEnvResult(writer: Write, result: Types.Env | null): void {
  writer.context().push("methodOptionalEnv", "Types.Env | null", "writing property");
  if (result) {
    Types.Env.write(writer, result as Types.Env);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export class Args_subinvokeEnvMethod {
  arg: string;
}

export function deserializesubinvokeEnvMethodArgs(argsBuf: ArrayBuffer): Args_subinvokeEnvMethod {
  const context: Context = new Context("Deserializing module-type: subinvokeEnvMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: string = "";
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "string", "type found, reading property");
      _arg = reader.readString();
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: String'"));
  }

  return {
    arg: _arg
  };
}

export function serializesubinvokeEnvMethodResult(result: Types.CompoundEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: subinvokeEnvMethod");
  const sizer = new WriteSizer(sizerContext);
  writesubinvokeEnvMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: subinvokeEnvMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesubinvokeEnvMethodResult(encoder, result);
  return buffer;
}

export function writesubinvokeEnvMethodResult(writer: Write, result: Types.CompoundEnv): void {
  writer.context().push("subinvokeEnvMethod", "Types.CompoundEnv", "writing property");
  Types.CompoundEnv.write(writer, result);
  writer.context().pop();
}
