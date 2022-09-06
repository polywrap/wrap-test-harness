import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  getDataWrapped,
  setDataWithLargeArgsWrapped,
  setDataWithManyArgsWrapped,
  setDataWithManyStructuredArgsWrapped,
  localVarMethodWrapped,
  globalVarMethodWrapped,
  subsequentInvokesWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "getData") {
    return wrap_invoke(args, env_size, getDataWrapped);
  }
  else if (args.method == "setDataWithLargeArgs") {
    return wrap_invoke(args, env_size, setDataWithLargeArgsWrapped);
  }
  else if (args.method == "setDataWithManyArgs") {
    return wrap_invoke(args, env_size, setDataWithManyArgsWrapped);
  }
  else if (args.method == "setDataWithManyStructuredArgs") {
    return wrap_invoke(args, env_size, setDataWithManyStructuredArgsWrapped);
  }
  else if (args.method == "localVarMethod") {
    return wrap_invoke(args, env_size, localVarMethodWrapped);
  }
  else if (args.method == "globalVarMethod") {
    return wrap_invoke(args, env_size, globalVarMethodWrapped);
  }
  else if (args.method == "subsequentInvokes") {
    return wrap_invoke(args, env_size, subsequentInvokesWrapped);
  }
  else {
    return wrap_invoke(args, env_size, null);
  }
}

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  wrap_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
