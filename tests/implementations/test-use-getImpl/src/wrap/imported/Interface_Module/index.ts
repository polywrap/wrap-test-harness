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

  public static interfaceUri: string = "wrap://ens/interface.eth";

  public uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  public abstractModuleMethod(
    args: Args_abstractModuleMethod
  ): Result<string, string> {
    const argsBuf = serializeabstractModuleMethodArgs(args);
    const result = wrap_subinvokeImplementation(
      "wrap://ens/interface.eth",
      this.uri,
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
