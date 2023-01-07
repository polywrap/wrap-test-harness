pub mod wrap;
pub use wrap::*;

pub fn add(args: ArgsAdd) -> i32 {
    args.a + args.b
}

pub fn throw_error(args: ArgsThrowError) -> i32 {
    panic!("{}", args.message);
}