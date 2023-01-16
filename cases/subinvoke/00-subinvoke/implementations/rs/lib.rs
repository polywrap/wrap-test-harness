pub mod wrap;
pub use wrap::*;

pub fn add(args: ArgsAdd) -> i32 {
    args.a + args.b
}

pub fn subinvoke_throw_error(args: ArgsSubinvokeThrowError) -> bool {
    panic!("{}", args.a);
}