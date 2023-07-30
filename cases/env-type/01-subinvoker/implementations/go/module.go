package module

import (
	subinvoked "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodNoEnv(args *types.ArgsSubinvokeMethodNoEnv) string {
	value, err := subinvoked.MethodNoEnv(&subinvoked.ArgsMethodNoEnv{Arg: args.Arg})
	if err != nil {
		panic(err.Error())
	}
	return value
}

func SubinvokeMethodRequireEnv() subinvoked.Subinvoked_Env {
	value, err := subinvoked.MethodRequireEnv(&subinvoked.ArgsMethodRequireEnv{})
	if err != nil {
		panic(err.Error())
	}
	return value
}

func SubinvokeMethodOptionalEnv() *subinvoked.Subinvoked_Env {
	value, err := subinvoked.MethodOptionalEnv(&subinvoked.ArgsMethodOptionalEnv{})
	if err != nil {
		panic(err.Error())
	}
	return value
}
