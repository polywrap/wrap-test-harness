package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	imported_subinvoke "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/imported_subinvoke"
)

func AddAndIncrement(args *types.ArgsAddAndIncrement) int32 {
	value, err := imported_subinvoke.Add(&imported_subinvoke.ArgsAdd{
		A: args.A,
		B: args.B,
	})
	if err != nil {
		panic(err.Error())
	}
	return value + 1
}

func SubinvokeThrowError(args *types.ArgsSubinvokeThrowError) bool {
	result, err := imported_subinvoke.InvokeThrowError(&imported_subinvoke.ArgsInvokeThrowError{
		A: args.A,
	})
	if err != nil {
		panic(err.Error())
	}
	return result
}
