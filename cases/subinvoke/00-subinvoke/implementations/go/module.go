package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func Add(args *types.ArgsAdd) int32 {
	return args.A + args.B
}

func SubinvokeThrowError(args *types.ArgsSubinvokeThrowError) bool {
	panic(args.A)
}
