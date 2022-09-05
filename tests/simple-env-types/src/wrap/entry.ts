import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  getEnvWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "getEnv") {
    return wrap_invoke(args, env_size, getEnvWrapped);
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
