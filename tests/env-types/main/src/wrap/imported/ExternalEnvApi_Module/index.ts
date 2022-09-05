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
  serializeexternalEnvMethodArgs,
  deserializeexternalEnvMethodResult,
  Args_externalEnvMethod
} from "./serialization";
import * as Types from "../..";

export class ExternalEnvApi_Module {

  public static uri: string = "ens/externalenv.polywrap.eth";

  public static externalEnvMethod(
    args: Args_externalEnvMethod
  ): Result<Types.ExternalEnvApi_Env, string> {
    const argsBuf = serializeexternalEnvMethodArgs(args);
    const result = wrap_subinvoke(
      "ens/externalenv.polywrap.eth",
      "externalEnvMethod",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<Types.ExternalEnvApi_Env, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.ExternalEnvApi_Env, string>(
      deserializeexternalEnvMethodResult(result.unwrap())
    );
  }
}
