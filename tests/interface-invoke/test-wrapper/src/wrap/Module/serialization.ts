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

export class Args_moduleMethod {
  arg: Types.ImplementationType;
}

export function deserializemoduleMethodArgs(argsBuf: ArrayBuffer): Args_moduleMethod {
  const context: Context = new Context("Deserializing module-type: moduleMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Types.ImplementationType | null = null;
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Types.ImplementationType", "type found, reading property");
      const object = Types.ImplementationType.read(reader);
      _arg = object;
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg || !_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: ImplementationType'"));
  }

  return {
    arg: _arg
  };
}

export function serializemoduleMethodResult(result: Types.ImplementationType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: moduleMethod");
  const sizer = new WriteSizer(sizerContext);
  writemoduleMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: moduleMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemoduleMethodResult(encoder, result);
  return buffer;
}

export function writemoduleMethodResult(writer: Write, result: Types.ImplementationType): void {
  writer.context().push("moduleMethod", "Types.ImplementationType", "writing property");
  Types.ImplementationType.write(writer, result);
  writer.context().pop();
}
