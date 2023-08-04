import {
  Args_addAndIncrement,
  Args_subinvokeThrowError,
  ImportedSubinvoke_Module,
  ModuleBase
} from "./wrap";
import {
  Args_add as ImportedArgs_add,
  Args_invokeThrowError
} from "./wrap/imported/ImportedSubinvoke_Module/serialization";

export class Module extends ModuleBase {
  addAndIncrement(args: Args_addAndIncrement): i32 {
    let importedArgs: ImportedArgs_add = {
      a: args.a,
      b: args.b
    }
    return ImportedSubinvoke_Module.add(importedArgs).unwrap() + 1
  }

  subinvokeThrowError(args: Args_subinvokeThrowError): boolean {
    let importedArgs_throwError: Args_invokeThrowError = {
      error: args.error
    }
    return ImportedSubinvoke_Module.invokeThrowError(importedArgs_throwError).unwrap();
  }
}
