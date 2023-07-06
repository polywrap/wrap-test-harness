package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func BoolMethod(args *types.ArgsBoolMethod) (bool, error) {
	return args.Arg, nil
}

func IntMethod(args *types.ArgsIntMethod) (int32, error) {
	return args.Arg, nil
}

func UIntMethod(args *types.ArgsUIntMethod) (uint32, error) {
	return args.Arg, nil
}

func BytesMethod(args *types.ArgsBytesMethod) ([]uint8, error) {
	return args.Arg, nil
}

func ArrayMethod(args *types.ArgsArrayMethod) ([]string, error) {
	return args.Arg, nil
}
