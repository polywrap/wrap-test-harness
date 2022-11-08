pub mod wrap;
pub use wrap::*;

pub fn add(args: ArgsAdd) -> i32 {
    args.a + args.b
}