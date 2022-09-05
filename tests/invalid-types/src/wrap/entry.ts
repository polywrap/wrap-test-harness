import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  boolMethodWrapped,
  intMethodWrapped,
  uIntMethodWrapped,
  bytesMethodWrapped,
  arrayMethodWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "boolMethod") {
    return wrap_invoke(args, env_size, boolMethodWrapped);
  }
  else if (args.method == "intMethod") {
    return wrap_invoke(args, env_size, intMethodWrapped);
  }
  else if (args.method == "uIntMethod") {
    return wrap_invoke(args, env_size, uIntMethodWrapped);
  }
  else if (args.method == "bytesMethod") {
    return wrap_invoke(args, env_size, bytesMethodWrapped);
  }
  else if (args.method == "arrayMethod") {
    return wrap_invoke(args, env_size, arrayMethodWrapped);
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
