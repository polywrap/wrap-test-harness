package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodNoEnv(args *types.ArgsSubinvokeMethodNoEnv) string {
	value, err := subinvoked.NoEnv(&subinvoked.ArgsMethodNoEnv{Arg: args.Arg})
	if err != nil {
		panic(err.Error())
	}
	return value
}

func SubinvokeMethodRequireEnv() subinvoked.Subinvoked_Env {
	value, err := subinvoked.RequireEnv(&subinvoked.ArgsMethodRequireEnv{})
	if err != nil {
		panic(err.Error())
	}
	return value
}

func SubinvokeMethodOptionalEnv() *subinvoked.Subinvoked_Env {
	value, err := subinvoked.OptionalEnv(&subinvoked.ArgsMethodOptionalEnv{})
	if err != nil {
		panic(err.Error())
	}
	return value
}

