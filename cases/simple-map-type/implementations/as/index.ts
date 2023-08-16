import {
  Args_returnCustomMap,
  CustomMap,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  returnCustomMap(args: Args_returnCustomMap): CustomMap {
    return args.foo;
  }
}