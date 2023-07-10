package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func BoolMethod(args *types.MethodArgsBoolMethod) (bool) {
	return args.Arg
}

func IntMethod(args *types.MethodArgsIntMethod) (int32) {
	return args.Arg
}

func UIntMethod(args *types.MethodArgsUIntMethod) (uint32) {
	return args.Arg
}

func BytesMethod(args *types.MethodArgsBytesMethod) ([]uint8) {
	return args.Arg
}

func ArrayMethod(args *types.MethodArgsArrayMethod) ([]string) {
	return args.Arg
}
