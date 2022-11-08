pub mod wrap;
pub use wrap::*;
use imported::add_module::ArgsAdd;

pub fn add_and_increment(args: ArgsAddAndIncrement) -> i32 {
    AddModule::add(&ArgsAdd { a: args.a, b: args.b }).unwrap() + 1
}