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

export class Args_getData {
}

export function serializegetDataArgs(args: Args_getData): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getData");
  const sizer = new WriteSizer(sizerContext);
  writegetDataArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetDataArgs(encoder, args);
  return buffer;
}

export function writegetDataArgs(
  writer: Write,
  args: Args_getData
): void {
  writer.writeMapLength(0);
}

export function deserializegetDataResult(buffer: ArrayBuffer): i32 {
  const context: Context = new Context("Deserializing imported module-type: getData");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getData", "i32", "reading function output");
  const res: i32 = reader.readInt32();
  reader.context().pop();

  return res;
}

export class Args_setData {
  value: i32;
}

export function serializesetDataArgs(args: Args_setData): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: setData");
  const sizer = new WriteSizer(sizerContext);
  writesetDataArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: setData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataArgs(encoder, args);
  return buffer;
}

export function writesetDataArgs(
  writer: Write,
  args: Args_setData
): void {
  writer.writeMapLength(1);
  writer.context().push("value", "i32", "writing property");
  writer.writeString("value");
  writer.writeInt32(args.value);
  writer.context().pop();
}

export function deserializesetDataResult(buffer: ArrayBuffer): bool {
  const context: Context = new Context("Deserializing imported module-type: setData");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("setData", "bool", "reading function output");
  const res: bool = reader.readBool();
  reader.context().pop();

  return res;
}
