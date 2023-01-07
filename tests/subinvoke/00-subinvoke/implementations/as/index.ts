import { Args_add, Args_throwError } from "./wrap";

export function add(args: Args_add): i32 {
    return args.a + args.b
}

export function throwError(args: Args_throwError): i32 {
    throw new Error(args.message)
}