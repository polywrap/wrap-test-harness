package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func BoolMethod(args *types.ArgsBoolMethod) (bool) {
	return args.Arg
}

func IntMethod(args *types.ArgsIntMethod) (int32) {
	return args.Arg
}

func UIntMethod(args *types.ArgsUIntMethod) (uint32) {
	return args.Arg
}

func BytesMethod(args *types.ArgsBytesMethod) ([]uint8) {
	return args.Arg
}

func ArrayMethod(args *types.ArgsArrayMethod) ([]string) {
	return args.Arg
}
