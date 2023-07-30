package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func Method1(args *types.ArgsMethod1) types.SanityEnum {
	return args.En
}

func Method2(args *types.ArgsMethod2) []types.SanityEnum {
	return args.EnumArray
}
