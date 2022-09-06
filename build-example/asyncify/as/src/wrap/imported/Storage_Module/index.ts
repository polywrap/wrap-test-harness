import {
  wrap_subinvoke,
  wrap_subinvokeImplementation,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Result
} from "@polywrap/wasm-as";
import {
  serializegetDataArgs,
  deserializegetDataResult,
  Args_getData,
  serializesetDataArgs,
  deserializesetDataResult,
  Args_setData
} from "./serialization";
import * as Types from "../..";

export class Storage_Module {

  public static uri: string = "wrap://ens/memory-storage.polywrap.eth";

  public static getData(
    args: Args_getData
  ): Result<i32, string> {
    const argsBuf = serializegetDataArgs(args);
    const result = wrap_subinvoke(
      "wrap://ens/memory-storage.polywrap.eth",
      "getData",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<i32, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<i32, string>(
      deserializegetDataResult(result.unwrap())
    );
  }

  public static setData(
    args: Args_setData
  ): Result<bool, string> {
    const argsBuf = serializesetDataArgs(args);
    const result = wrap_subinvoke(
      "wrap://ens/memory-storage.polywrap.eth",
      "setData",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<bool, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<bool, string>(
      deserializesetDataResult(result.unwrap())
    );
  }
}
