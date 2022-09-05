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

export class Args_getEnv {
  arg: string;
}

export function deserializegetEnvArgs(argsBuf: ArrayBuffer): Args_getEnv {
  const context: Context = new Context("Deserializing module-type: getEnv");
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

export function serializegetEnvResult(result: Types.Env | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getEnv");
  const sizer = new WriteSizer(sizerContext);
  writegetEnvResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetEnvResult(encoder, result);
  return buffer;
}

export function writegetEnvResult(writer: Write, result: Types.Env | null): void {
  writer.context().push("getEnv", "Types.Env | null", "writing property");
  if (result) {
    Types.Env.write(writer, result as Types.Env);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
