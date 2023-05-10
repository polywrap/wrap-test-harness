import {
  Args_noArgsMethod,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  noArgsMethod(_: Args_noArgsMethod): boolean {
    return true;
  }
}