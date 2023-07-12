package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodNoEnv(args *types.MethodArgsSubinvokeMethodNoEnv) string {
	value, err := subinvoked.MethodMethodNoEnv(&subinvoked.ArgsMethodNoEnv{Arg: args.Arg})
	if err != nil {
		panic(err)
	}
	return value
}

func SubinvokeMethodRequireEnv() subinvoked.Subinvoked_Env {
	value, err := subinvoked.MethodMethodRequireEnv(&subinvoked.ArgsMethodRequireEnv{})
	if err != nil {
		panic(err)
	}
	return value
}

func SubinvokeMethodOptionalEnv() *subinvoked.Subinvoked_Env {
	value, err := subinvoked.MethodMethodOptionalEnv(&subinvoked.ArgsMethodOptionalEnv{})
	if err != nil {
		panic(err)
	}
	return value
}

