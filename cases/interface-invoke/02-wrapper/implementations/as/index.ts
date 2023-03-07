import {
  Args_moduleMethod,
  Args_abstractModuleMethod,
  ImplementationType,
  Interface,
  Interface_Module,
  ModuleBase,
} from "./wrap";

export class Module extends ModuleBase {
  moduleMethod(args: Args_moduleMethod): ImplementationType {
    return args.arg;
  }

  abstractModuleMethod(args: Args_abstractModuleMethod): String {
    const uris = Interface.getImplementations();
    return new Interface_Module(uris[0]).abstractModuleMethod({
      arg: {
        str: args.arg.str
      }
    }).unwrap();
  }
}
