import {
  Subinvoked_Module,
  ModuleBase,
  Args_subinvokeMethodNoEnv,
  Args_subinvokeMethodRequireEnv,
  Args_subinvokeMethodOptionalEnv,
} from "./wrap";

import {
  Subinvoked_Env
} from "./wrap/imported";

export class Module extends ModuleBase {
  subinvokeMethodNoEnv(args: Args_subinvokeMethodNoEnv): string {
    return Subinvoked_Module.methodNoEnv({arg: args.arg}).unwrap();
  }

  subinvokeMethodRequireEnv(_: Args_subinvokeMethodRequireEnv): Subinvoked_Env {
    return Subinvoked_Module.methodRequireEnv({}).unwrap();
  }

  subinvokeMethodOptionalEnv(_: Args_subinvokeMethodOptionalEnv): Subinvoked_Env | null {
    return Subinvoked_Module.methodOptionalEnv({}).unwrap();
  }
}
