pub mod wrap;
pub use wrap::*;

pub fn add_and_increment(args: ArgsAddAndIncrement) -> i32 {
    AddModule::add(args.a, args.b) + 1
}