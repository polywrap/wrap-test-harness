import {
  Env,
  Args_methodNoEnv,
  Args_methodRequireEnv,
  Args_methodOptionalEnv,
  ModuleBase,
} from "./wrap";

export class Module extends ModuleBase {
  methodNoEnv(args: Args_methodNoEnv): string {
    return args.arg;
  }

  methodRequireEnv(args: Args_methodRequireEnv, env: Env): Env {
    return env;
  }

  methodOptionalEnv(args: Args_methodOptionalEnv, env: Env | null): Env | null {
    return env;
  }
}
