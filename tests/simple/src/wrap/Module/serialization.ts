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

export class Args_simpleMethod {
  arg: string;
}

export function deserializesimpleMethodArgs(argsBuf: ArrayBuffer): Args_simpleMethod {
  const context: Context = new Context("Deserializing module-type: simpleMethod");
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

export function serializesimpleMethodResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: simpleMethod");
  const sizer = new WriteSizer(sizerContext);
  writesimpleMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: simpleMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesimpleMethodResult(encoder, result);
  return buffer;
}

export function writesimpleMethodResult(writer: Write, result: string): void {
  writer.context().push("simpleMethod", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
