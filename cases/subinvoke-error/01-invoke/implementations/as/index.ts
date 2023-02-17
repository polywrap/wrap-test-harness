import {
  Args_subInvokeWillThrow,
  SubInvokeError_Module
} from "./wrap";

export function subInvokeWillThrow(args: Args_subInvokeWillThrow): i32 {
  const subInvokeResult = SubInvokeError_Module.iThrow({
    a: 0
  }).unwrap();
  return args.a + args.b + subInvokeResult;
}
