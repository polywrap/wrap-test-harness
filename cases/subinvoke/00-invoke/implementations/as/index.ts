import {
  Args_add,
  Args_invokeThrowError,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  add(args: Args_add): i32 {
    return args.a + args.b
  }

  invokeThrowError(args: Args_invokeThrowError): bool {
    throw new Error(args.error)
  }
}
