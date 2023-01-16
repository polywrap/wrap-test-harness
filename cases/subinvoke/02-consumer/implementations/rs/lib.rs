pub mod wrap;
pub use wrap::*;
use imported::imported_invoke_module::ImportedInvokeModule;

pub fn add_and_increment(args: ArgsAddAndIncrement) -> i32 {
    ImportedInvokeModule::add_and_increment(&imported::imported_invoke_module::ArgsAddAndIncrement { a: args.a, b: args.b }).unwrap() + 1
}

pub fn throw_error(args: ArgsThrowError) -> bool {
    ImportedInvokeModule::invoke_throw_error(&imported::imported_invoke_module::ArgsInvokeThrowError { a: args.a }).unwrap()
}