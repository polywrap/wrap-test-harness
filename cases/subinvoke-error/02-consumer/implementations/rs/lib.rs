pub mod wrap;
pub use wrap::{*, imported::invoke_module, imported::not_found_module};

pub fn throws_in_two_subinvoke_layers(args: ArgsThrowsInTwoSubinvokeLayers) -> i32 {
  let imported_args = invoke_module::ArgsSubInvokeWillThrow {
    a: args.a,
    b: args.b
  };
  InvokeModule::sub_invoke_will_throw(&imported_args).unwrap()
}

pub fn sub_wrapper_not_found(args: ArgsSubWrapperNotFound) -> i32 {
  let imported_args = not_found_module::ArgsSubInvokeWillThrow {
    a: args.a,
    b: args.b
  };
  NotFoundModule::sub_invoke_will_throw(&imported_args).unwrap()
}
