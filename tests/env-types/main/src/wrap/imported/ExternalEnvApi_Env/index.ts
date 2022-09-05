import {
  Read,
  Write,
  BigInt,
  BigNumber,
  JSON,
} from "@polywrap/wasm-as";
import {
  serializeExternalEnvApi_Env,
  deserializeExternalEnvApi_Env,
  writeExternalEnvApi_Env,
  readExternalEnvApi_Env
} from "./serialization";
import * as Types from "../..";

@serializable
export class ExternalEnvApi_Env {

  public static uri: string = "ens/externalenv.polywrap.eth";

  externalArray: Array<u32>;
  externalString: string;

  static toBuffer(type: ExternalEnvApi_Env): ArrayBuffer {
    return serializeExternalEnvApi_Env(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ExternalEnvApi_Env {
    return deserializeExternalEnvApi_Env(buffer);
  }

  static write(writer: Write, type: ExternalEnvApi_Env): void {
    writeExternalEnvApi_Env(writer, type);
  }

  static read(reader: Read): ExternalEnvApi_Env {
    return readExternalEnvApi_Env(reader);
  }
}
