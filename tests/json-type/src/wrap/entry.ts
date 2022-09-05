import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  parseWrapped,
  stringifyWrapped,
  stringifyObjectWrapped,
  methodJSONWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "parse") {
    return wrap_invoke(args, env_size, parseWrapped);
  }
  else if (args.method == "stringify") {
    return wrap_invoke(args, env_size, stringifyWrapped);
  }
  else if (args.method == "stringifyObject") {
    return wrap_invoke(args, env_size, stringifyObjectWrapped);
  }
  else if (args.method == "methodJSON") {
    return wrap_invoke(args, env_size, methodJSONWrapped);
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
