package module

import (
	"github.com/polywrap/go-wrap/wrap"
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

func SubinvokeMethodNotFound() bool {
	argsAdd := &ImportedSubinvoke_ArgsAdd{
		A: 1,
		B: 1,
	}
	argsBuf := SerializeImportedSubinvoke_AddArgs(argsAdd)
	_, err := wrap.WrapSubinvoke("authority/imported-subinvoke", "methodNotFound", argsBuf)
	if err != nil {
		return false
	}
	return true
}

func SubinvokeArgsIncorrect() bool {
	wrongArgs := &ImportedSubinvoke_ArgsInvokeThrowError{
		Error: "Oops!",
	}
	argsBuf := SerializeImportedSubinvoke_InvokeThrowErrorArgs(wrongArgs)
	_, err := wrap.WrapSubinvoke("authority/imported-subinvoke", "add", argsBuf)
	if err != nil {
		return false
	}
	return true
}
