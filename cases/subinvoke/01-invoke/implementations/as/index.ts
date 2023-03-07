import {
  Args_addAndIncrement,
  Args_invokeThrowError,
  ImportedSubinvoke_Module,
  ModuleBase
} from "./wrap";
import {
  Args_add as ImportedArgs_add,
  Args_subinvokeThrowError
} from "./wrap/imported/ImportedSubinvoke_Module/serialization";

export class Module extends ModuleBase {
  addAndIncrement(args: Args_addAndIncrement): i32 {
    let importedArgs: ImportedArgs_add = {
      a: args.a,
      b: args.b
    }
    return ImportedSubinvoke_Module.add(importedArgs).unwrap() + 1
  }

  invokeThrowError(args: Args_invokeThrowError): boolean {
    let importedArgs_throwError: Args_subinvokeThrowError = {
      a: args.a
    }
    return ImportedSubinvoke_Module.subinvokeThrowError(importedArgs_throwError).unwrap();
  }
}
