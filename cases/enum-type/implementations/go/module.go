package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func Method1(args *types.MethodArgsMethod1) types.SanityEnum {
	return args.En
}

func Method2(args *types.MethodArgsMethod2) []types.SanityEnum {
	return args.EnumArray
}
