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
import * as Types from "../..";

export class Args_abstractModuleMethod {
  arg: Types.Interface_Argument;
}

export function serializeabstractModuleMethodArgs(args: Args_abstractModuleMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: abstractModuleMethod");
  const sizer = new WriteSizer(sizerContext);
  writeabstractModuleMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: abstractModuleMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeabstractModuleMethodArgs(encoder, args);
  return buffer;
}

export function writeabstractModuleMethodArgs(
  writer: Write,
  args: Args_abstractModuleMethod
): void {
  writer.writeMapLength(1);
  writer.context().push("arg", "Types.Interface_Argument", "writing property");
  writer.writeString("arg");
  Types.Interface_Argument.write(writer, args.arg);
  writer.context().pop();
}

export function deserializeabstractModuleMethodResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: abstractModuleMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("abstractModuleMethod", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}
