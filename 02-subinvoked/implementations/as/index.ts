import {
  Env,
  Args_envMethod,
  ModuleBase,
} from "./wrap";

function createEnv(env: Env): Env {
  return {
    str: env.str,
  };
}

export class Module extends ModuleBase {
  envMethod(_: Args_envMethod, env: Env): string {
    return env.str;
  }
}