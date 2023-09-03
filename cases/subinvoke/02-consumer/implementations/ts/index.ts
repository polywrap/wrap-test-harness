import {
  Args_throwError,
  Args_addAndIncrement,
  Args_rethrowError,
  ImportedInvoke_Module,
  ModuleBase,
} from "./wrap";
import { Args_addAndIncrement as ImportedArgs_add } from "./wrap/imported/ImportedInvoke_Module/serialization";

export class Module extends ModuleBase {
  addAndIncrement(args: Args_addAndIncrement): number {
    let importedArgs: ImportedArgs_add = {
      a: args.a,
      b: args.b,
    };
    return ImportedInvoke_Module.addAndIncrement(importedArgs).unwrap() + 1;
  }

  throwError(args: Args_throwError): boolean {
    return ImportedInvoke_Module.subinvokeThrowError({
      error: args.error,
    }).unwrap();
  }

  rethrowError(args: Args_rethrowError): boolean {
    let result = ImportedInvoke_Module.subinvokeThrowError({
      error: args.error,
    });
    if (result.isErr) {
      throw Error(result.unwrapErr().toString());
    }
    return result.unwrap();
  }
}
