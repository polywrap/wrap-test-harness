import {
  Args_throwsInTwoSubinvokeLayers,
  Args_subWrapperNotFound,
  Invoke_Module,
  NotFound_Module
} from "./wrap";

export function throwsInTwoSubinvokeLayers(
  args: Args_throwsInTwoSubinvokeLayers
): i32 {
  return Invoke_Module.subInvokeWillThrow({
    a: args.a,
    b: args.b
  }).unwrap();
}

export function subWrapperNotFound(
  args: Args_subWrapperNotFound
): i32 {
  return NotFound_Module.subInvokeWillThrow({
    a: args.a,
    b: args.b
  }).unwrap();
}
