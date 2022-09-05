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

export class Args_method {
  arg1: BigNumber;
  arg2: BigNumber | null;
  obj: Types.BigNumberArg;
}

export function deserializemethodArgs(argsBuf: ArrayBuffer): Args_method {
  const context: Context = new Context("Deserializing module-type: method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg1: BigNumber = new BigNumber(BigInt.fromUInt16(0), 0, 0);
  let _arg1Set: bool = false;
  let _arg2: BigNumber | null = null;
  let _obj: Types.BigNumberArg | null = null;
  let _objSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg1") {
      reader.context().push(field, "BigNumber", "type found, reading property");
      _arg1 = reader.readBigNumber();
      _arg1Set = true;
      reader.context().pop();
    }
    else if (field == "arg2") {
      reader.context().push(field, "BigNumber | null", "type found, reading property");
      _arg2 = reader.readOptionalBigNumber();
      reader.context().pop();
    }
    else if (field == "obj") {
      reader.context().push(field, "Types.BigNumberArg", "type found, reading property");
      const object = Types.BigNumberArg.read(reader);
      _obj = object;
      _objSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg1Set) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg1: BigNumber'"));
  }
  if (!_obj || !_objSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'obj: BigNumberArg'"));
  }

  return {
    arg1: _arg1,
    arg2: _arg2,
    obj: _obj
  };
}

export function serializemethodResult(result: BigNumber): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method");
  const sizer = new WriteSizer(sizerContext);
  writemethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodResult(encoder, result);
  return buffer;
}

export function writemethodResult(writer: Write, result: BigNumber): void {
  writer.context().push("method", "BigNumber", "writing property");
  writer.writeBigNumber(result);
  writer.context().pop();
}
