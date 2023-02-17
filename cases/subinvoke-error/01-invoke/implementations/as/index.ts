import {
  Args_subInvokeWillThrow,
  SubInvoke_Module
} from "./wrap";

export function subInvokeWillThrow(args: Args_subInvokeWillThrow): i32 {
  const subInvokeResult = SubInvoke_Module.iThrow({
    a: 0
  }).unwrap();
  return args.a + args.b + subInvokeResult;
}
