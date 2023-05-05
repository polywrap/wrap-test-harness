import {
  Env,
  Subinvoked_Module,
  ModuleBase,
  Args_subinvokeMethodRequireEnv,
} from "./wrap";

import {
  Subinvoked_Env
} from "./wrap/imported";

export class Module extends ModuleBase {
  subinvokeMethodRequireEnv(_: Args_subinvokeMethodRequireEnv, _env: Env): Subinvoked_Env {
    return Subinvoked_Module.methodRequireEnv({}).unwrap();
  }
}
