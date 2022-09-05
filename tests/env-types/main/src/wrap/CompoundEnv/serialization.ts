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
import { CompoundEnv } from "./";
import * as Types from "..";

export function serializeCompoundEnv(type: CompoundEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: CompoundEnv");
  const sizer = new WriteSizer(sizerContext);
  writeCompoundEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: CompoundEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeCompoundEnv(encoder, type);
  return buffer;
}

export function writeCompoundEnv(writer: Write, type: CompoundEnv): void {
  writer.writeMapLength(2);
  writer.context().push("local", "Types.Env", "writing property");
  writer.writeString("local");
  Types.Env.write(writer, type.local);
  writer.context().pop();
  writer.context().push("external", "Types.ExternalEnvApi_Env", "writing property");
  writer.writeString("external");
  Types.ExternalEnvApi_Env.write(writer, type.external);
  writer.context().pop();
}

export function deserializeCompoundEnv(buffer: ArrayBuffer): CompoundEnv {
  const context: Context = new Context("Deserializing object-type CompoundEnv");
  const reader = new ReadDecoder(buffer, context);
  return readCompoundEnv(reader);
}

export function readCompoundEnv(reader: Read): CompoundEnv {
  let numFields = reader.readMapLength();

  let _local: Types.Env | null = null;
  let _localSet: bool = false;
  let _external: Types.ExternalEnvApi_Env | null = null;
  let _externalSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "local") {
      reader.context().push(field, "Types.Env", "type found, reading property");
      const object = Types.Env.read(reader);
      _local = object;
      _localSet = true;
      reader.context().pop();
    }
    else if (field == "external") {
      reader.context().push(field, "Types.ExternalEnvApi_Env", "type found, reading property");
      const object = Types.ExternalEnvApi_Env.read(reader);
      _external = object;
      _externalSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_local || !_localSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'local: Env'"));
  }
  if (!_external || !_externalSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'external: ExternalEnvApi_Env'"));
  }

  return {
    local: _local,
    external: _external
  };
}
