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

export class Args_externalEnvMethod {
}

export function deserializeexternalEnvMethodArgs(argsBuf: ArrayBuffer): Args_externalEnvMethod {
  const context: Context = new Context("Deserializing module-type: externalEnvMethod");

  return {
  };
}

export function serializeexternalEnvMethodResult(result: Types.Env): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: externalEnvMethod");
  const sizer = new WriteSizer(sizerContext);
  writeexternalEnvMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: externalEnvMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeexternalEnvMethodResult(encoder, result);
  return buffer;
}

export function writeexternalEnvMethodResult(writer: Write, result: Types.Env): void {
  writer.context().push("externalEnvMethod", "Types.Env", "writing property");
  Types.Env.write(writer, result);
  writer.context().pop();
}
