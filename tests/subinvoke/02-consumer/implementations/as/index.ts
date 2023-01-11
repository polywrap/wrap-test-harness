import { ImportedInvoke_Module, Args_throwError, Args_addAndIncrement } from "./wrap";
import { Args_addAndIncrement as ImportedArgs_add } from "./wrap/imported/ImportedInvoke_Module/serialization";

export function addAndIncrement(args: Args_addAndIncrement): i32 {
    let importedArgs: ImportedArgs_add = {
        a: args.a,
        b: args.b
    }
    return ImportedInvoke_Module.addAndIncrement(importedArgs).unwrap() + 1
}

export function throwError(args: Args_throwError): bool {
    return ImportedInvoke_Module.invokeThrowError({ a: args.a }).unwrap();
}