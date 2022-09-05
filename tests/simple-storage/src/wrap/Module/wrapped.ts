import { wrap_load_env } from "@polywrap/wasm-as";
import {
  getData,
  tryGetData,
  throwGetData,
  setData,
  deployContract
} from "../../index";
import {
  deserializegetDataArgs,
  serializegetDataResult,
  deserializetryGetDataArgs,
  serializetryGetDataResult,
  deserializethrowGetDataArgs,
  serializethrowGetDataResult,
  deserializesetDataArgs,
  serializesetDataResult,
  deserializedeployContractArgs,
  serializedeployContractResult
} from "./serialization";
import * as Types from "..";

export function getDataWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializegetDataArgs(argsBuf);

  const result = getData(
    {
      address: args.address,
      connection: args.connection
    }
  );
  return serializegetDataResult(result);
}

export function tryGetDataWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializetryGetDataArgs(argsBuf);

  const result = tryGetData(
    {
      address: args.address,
      connection: args.connection
    }
  );
  return serializetryGetDataResult(result);
}

export function throwGetDataWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializethrowGetDataArgs(argsBuf);

  const result = throwGetData(
    {
      address: args.address,
      connection: args.connection
    }
  );
  return serializethrowGetDataResult(result);
}

export function setDataWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializesetDataArgs(argsBuf);

  const result = setData(
    {
      address: args.address,
      value: args.value,
      connection: args.connection
    }
  );
  return serializesetDataResult(result);
}

export function deployContractWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializedeployContractArgs(argsBuf);

  const result = deployContract(
    {
      connection: args.connection
    }
  );
  return serializedeployContractResult(result);
}
