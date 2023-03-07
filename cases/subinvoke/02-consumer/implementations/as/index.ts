import {
  Args_throwError,
  Args_addAndIncrement,
  ImportedInvoke_Module,
  ModuleBase
} from "./wrap";
import {
  Args_addAndIncrement as ImportedArgs_add
} from "./wrap/imported/ImportedInvoke_Module/serialization";

export class Module extends ModuleBase {
  addAndIncrement(args: Args_addAndIncrement): i32 {
    let importedArgs: ImportedArgs_add = {
      a: args.a,
      b: args.b
    }
    return ImportedInvoke_Module.addAndIncrement(importedArgs).unwrap() + 1
  }

  throwError(args: Args_throwError): bool {
    return ImportedInvoke_Module.invokeThrowError({ a: args.a }).unwrap();
  }
}
