package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/imported_subinvoke"
)

func AddAndIncrement(args *types.ArgsAddAndIncrement) int32 {
	value, err := ImportedSubinvoke_Add(&ImportedSubinvoke_ArgsAdd{
		A: args.A,
		B: args.B,
	})
	if err != nil {
		panic(err.Error())
	}
	return value + 1
}

func SubinvokeThrowError(args *types.ArgsSubinvokeThrowError) bool {
	result, err := ImportedSubinvoke_InvokeThrowError(&ImportedSubinvoke_ArgsInvokeThrowError{
		Error: args.Error,
	})
	if err != nil {
		panic(err.Error())
	}
	return result
}
