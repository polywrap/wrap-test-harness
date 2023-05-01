import {
  Subinvoked_Module,
  Args_subinvokeEnvMethod,
  ModuleBase,
} from "./wrap";

export class Module extends ModuleBase {
  subinvokeEnvMethod(args: Args_subinvokeEnvMethod): string {
    const result = Subinvoked_Module.envMethod({}).unwrap()

    return result;
  }
}
