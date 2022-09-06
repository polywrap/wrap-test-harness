import { wrap_load_env } from "@polywrap/wasm-as";
import {
  getData,
  setDataWithLargeArgs,
  setDataWithManyArgs,
  setDataWithManyStructuredArgs,
  localVarMethod,
  globalVarMethod,
  subsequentInvokes
} from "../../index";
import {
  deserializegetDataArgs,
  serializegetDataResult,
  deserializesetDataWithLargeArgsArgs,
  serializesetDataWithLargeArgsResult,
  deserializesetDataWithManyArgsArgs,
  serializesetDataWithManyArgsResult,
  deserializesetDataWithManyStructuredArgsArgs,
  serializesetDataWithManyStructuredArgsResult,
  deserializelocalVarMethodArgs,
  serializelocalVarMethodResult,
  deserializeglobalVarMethodArgs,
  serializeglobalVarMethodResult,
  deserializesubsequentInvokesArgs,
  serializesubsequentInvokesResult
} from "./serialization";
import * as Types from "..";

export function getDataWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {

  const result = getData({}
  );
  return serializegetDataResult(result);
}

export function setDataWithLargeArgsWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializesetDataWithLargeArgsArgs(argsBuf);

  const result = setDataWithLargeArgs(
    {
      value: args.value
    }
  );
  return serializesetDataWithLargeArgsResult(result);
}

export function setDataWithManyArgsWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializesetDataWithManyArgsArgs(argsBuf);

  const result = setDataWithManyArgs(
    {
      valueA: args.valueA,
      valueB: args.valueB,
      valueC: args.valueC,
      valueD: args.valueD,
      valueE: args.valueE,
      valueF: args.valueF,
      valueG: args.valueG,
      valueH: args.valueH,
      valueI: args.valueI,
      valueJ: args.valueJ,
      valueK: args.valueK,
      valueL: args.valueL
    }
  );
  return serializesetDataWithManyArgsResult(result);
}

export function setDataWithManyStructuredArgsWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializesetDataWithManyStructuredArgsArgs(argsBuf);

  const result = setDataWithManyStructuredArgs(
    {
      valueA: args.valueA,
      valueB: args.valueB,
      valueC: args.valueC,
      valueD: args.valueD,
      valueE: args.valueE,
      valueF: args.valueF,
      valueG: args.valueG,
      valueH: args.valueH,
      valueI: args.valueI,
      valueJ: args.valueJ,
      valueK: args.valueK,
      valueL: args.valueL
    }
  );
  return serializesetDataWithManyStructuredArgsResult(result);
}

export function localVarMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {

  const result = localVarMethod({}
  );
  return serializelocalVarMethodResult(result);
}

export function globalVarMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {

  const result = globalVarMethod({}
  );
  return serializeglobalVarMethodResult(result);
}

export function subsequentInvokesWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializesubsequentInvokesArgs(argsBuf);

  const result = subsequentInvokes(
    {
      numberOfTimes: args.numberOfTimes
    }
  );
  return serializesubsequentInvokesResult(result);
}
