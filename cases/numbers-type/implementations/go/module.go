package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func I8Method(args *types.MethodArgsI8Method) int8 {
	return args.First + args.Second
}

func U8Method(args *types.MethodArgsU8Method) uint8 {
	return args.First + args.Second
}

func I16Method(args *types.MethodArgsI16Method) int16 {
	return args.First + args.Second
}

func U16Method(args *types.MethodArgsU16Method) uint16 {
	return args.First + args.Second
}

func I32Method(args *types.MethodArgsI32Method) int32 {
	return args.First + args.Second
}

func U32Method(args *types.MethodArgsU32Method) uint32 {
	return args.First + args.Second
}
