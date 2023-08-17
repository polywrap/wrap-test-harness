package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/imported_invoke"
)

func AddAndIncrement(args *types.ArgsAddAndIncrement) int32 {
	value, err := ImportedInvoke_AddAndIncrement(&ImportedInvoke_ArgsAddAndIncrement{
		A: args.A,
		B: args.B,
	})
	if err != nil {
		panic(err.Error())
	}
	return value + 1
}

func ThrowError(args *types.ArgsThrowError) bool {
	result, err := ImportedInvoke_SubinvokeThrowError(&ImportedInvoke_ArgsSubinvokeThrowError{
		Error: args.Error,
	})
	if err != nil {
		panic(err.Error())
	}
	return result
}

func RethrowError(args *types.ArgsRethrowError) bool {
	result, err := ImportedInvoke_SubinvokeThrowError(&ImportedInvoke_ArgsSubinvokeThrowError{
		Error: args.Error,
	})
	if err != nil {
		panic(err.Error())
	}
	return result
}
