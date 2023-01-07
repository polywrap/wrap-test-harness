pub mod wrap;
pub use wrap::*;
use imported::imported_module::ArgsAdd;
use imported::imported_module::ArgsThrowError;

pub fn add_and_increment(args: ArgsAddAndIncrement) -> i32 {
    ImportedModule::add(&ArgsAdd { a: args.a, b: args.b }).unwrap() + 1
}

pub fn throw_from_subinvoke(args: ArgsThrowFromSubinvoke) -> i32 {
    ImportedModule::throw_error(&ArgsThrowError { message: "Error from invoke".to_string() }).unwrap()
}