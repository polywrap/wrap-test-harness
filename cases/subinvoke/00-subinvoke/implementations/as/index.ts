import { Args_add, Args_subinvokeThrowError } from "./wrap";

export function add(args: Args_add): i32 {
    return args.a + args.b
}

export function subinvokeThrowError(args: Args_subinvokeThrowError): bool {
    throw new Error(args.a)
}