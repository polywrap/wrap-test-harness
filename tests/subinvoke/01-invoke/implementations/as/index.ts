import { Args_addAndIncrement, Imported_Module, Args_throwFromSubinvoke } from "./wrap";
import { Args_add as ImportedArgs_add } from "./wrap/imported/Imported_Module/serialization";

export function addAndIncrement(args: Args_addAndIncrement): i32 {
    let importedArgs: ImportedArgs_add = {
        a: args.a,
        b: args.b
    }
    return Imported_Module.add(importedArgs).unwrap() + 1
}

export function throwFromSubinvoke(args: Args_throwFromSubinvoke): i32 {
    Imported_Module.throwError({ message: "Error from invoke" });
    return 0;
}