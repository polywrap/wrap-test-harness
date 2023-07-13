package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	imported_invoke "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/imported_invoke"
)

func AddAndIncrement(args *types.ArgsAddAndIncrement) int32 {
	value, err := imported_invoke.AddAndIncrement(&imported_invoke.ArgsAddAndIncrement{
		A: args.A,
		B: args.B,
	})
	if err != nil {
		panic(err.Error())
	}
	return value + 1
}

func ThrowError(args *types.ArgsThrowError) bool {
	result, err := imported_invoke.InvokeThrowError(&imported_invoke.ArgsInvokeThrowError{
		A: args.A,
	})
	if err != nil {
		panic(err.Error())
	}
	return result
}

func RethrowError(args *types.ArgsRethrowError) bool {
	result, err := imported_invoke.InvokeThrowError(&imported_invoke.ArgsInvokeThrowError{
		A: args.A,
	})
	if err != nil {
		panic(err.Error())
	}
	return result
}
