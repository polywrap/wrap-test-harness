import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  i8MethodWrapped,
  u8MethodWrapped,
  i16MethodWrapped,
  u16MethodWrapped,
  i32MethodWrapped,
  u32MethodWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "i8Method") {
    return wrap_invoke(args, env_size, i8MethodWrapped);
  }
  else if (args.method == "u8Method") {
    return wrap_invoke(args, env_size, u8MethodWrapped);
  }
  else if (args.method == "i16Method") {
    return wrap_invoke(args, env_size, i16MethodWrapped);
  }
  else if (args.method == "u16Method") {
    return wrap_invoke(args, env_size, u16MethodWrapped);
  }
  else if (args.method == "i32Method") {
    return wrap_invoke(args, env_size, i32MethodWrapped);
  }
  else if (args.method == "u32Method") {
    return wrap_invoke(args, env_size, u32MethodWrapped);
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
