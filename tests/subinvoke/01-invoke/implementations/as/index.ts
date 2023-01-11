import { Args_addAndIncrement, ImportedSubinvoke_Module, Args_invokeThrowError } from "./wrap";
import { Args_add as ImportedArgs_add, Args_subinvokeThrowError } from "./wrap/imported/ImportedSubinvoke_Module/serialization";

export function addAndIncrement(args: Args_addAndIncrement): i32 {
    let importedArgs: ImportedArgs_add = {
        a: args.a,
        b: args.b
    }
    return ImportedSubinvoke_Module.add(importedArgs).unwrap() + 1
}

export function invokeThrowError(args: Args_invokeThrowError): boolean {
    let importedArgs_throwError: Args_subinvokeThrowError = {
        a: args.a
    }
    return ImportedSubinvoke_Module.subinvokeThrowError(importedArgs_throwError).unwrap();
}