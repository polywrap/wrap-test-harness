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
  serializeabstractModuleMethodArgs,
  deserializeabstractModuleMethodResult,
  Args_abstractModuleMethod
} from "./serialization";
import * as Types from "../..";

export class Interface_Module {

  public static uri: string = "wrap://ens/interface.eth";

  public static abstractModuleMethod(
    args: Args_abstractModuleMethod
  ): Result<string, string> {
    const argsBuf = serializeabstractModuleMethodArgs(args);
    const result = wrap_subinvoke(
      "wrap://ens/interface.eth",
      "abstractModuleMethod",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializeabstractModuleMethodResult(result.unwrap())
    );
  }
}
