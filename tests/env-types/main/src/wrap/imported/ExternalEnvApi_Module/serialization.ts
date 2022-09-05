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

export class Args_externalEnvMethod {
}

export function serializeexternalEnvMethodArgs(args: Args_externalEnvMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: externalEnvMethod");
  const sizer = new WriteSizer(sizerContext);
  writeexternalEnvMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: externalEnvMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeexternalEnvMethodArgs(encoder, args);
  return buffer;
}

export function writeexternalEnvMethodArgs(
  writer: Write,
  args: Args_externalEnvMethod
): void {
  writer.writeMapLength(0);
}

export function deserializeexternalEnvMethodResult(buffer: ArrayBuffer): Types.ExternalEnvApi_Env {
  const context: Context = new Context("Deserializing imported module-type: externalEnvMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("externalEnvMethod", "Types.ExternalEnvApi_Env", "reading function output");
  const object = Types.ExternalEnvApi_Env.read(reader);
  const res: Types.ExternalEnvApi_Env =  object;
  reader.context().pop();

  return res;
}
