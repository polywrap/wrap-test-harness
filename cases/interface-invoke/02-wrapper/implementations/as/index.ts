import {
  Interface,
  Interface_Module,
  Args_moduleMethod,
  Args_abstractModuleMethod,
  ImplementationType
} from "./wrap";

import {

} from "./wrap/imported/"

export function moduleMethod(args: Args_moduleMethod): ImplementationType {
  return args.arg;
}

export function abstractModuleMethod(args: Args_abstractModuleMethod): String {
  const uris = Interface.getImplementations();
  return new Interface_Module(uris[0]).abstractModuleMethod({
    arg: {
      str: args.arg.str
    }
  }).unwrap();
}
