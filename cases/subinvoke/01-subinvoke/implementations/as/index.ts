import {
  Args_addAndIncrement,
  Args_subinvokeThrowError,
  Args_subinvokeMethodNotFound,
  Args_subinvokeArgsIncorrect,
  ImportedSubinvoke_Module,
  ModuleBase
} from "./wrap";
import {
  Args_add as ImportedArgs_add,
  Args_invokeThrowError,
  serializeaddArgs,
  serializeinvokeThrowErrorArgs
} from "./wrap/imported/ImportedSubinvoke_Module/serialization";
import { wrap_subinvoke } from "@polywrap/wasm-as";

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

  subinvokeMethodNotFound(_: Args_subinvokeMethodNotFound): boolean {
    const argsAdd: ImportedArgs_add = { a: 1, b: 1 };
    const argsBuf: ArrayBuffer = serializeaddArgs(argsAdd);
    const result = wrap_subinvoke("authority/imported-subinvoke", "methodNotFound", argsBuf);
    if (result.isErr) {
      throw new Error(result.unwrapErr());
    }
    return true;
  }

  subinvokeArgsIncorrect(_: Args_subinvokeArgsIncorrect): boolean {
    const wrongArgs: Args_invokeThrowError = { error: "Oops!" }
    const argsBuf: ArrayBuffer = serializeinvokeThrowErrorArgs(wrongArgs);
    const result = wrap_subinvoke("authority/imported-subinvoke", "add", argsBuf);
    if (result.isErr) {
      throw new Error(result.unwrapErr());
    }
    return true;
  }
}
