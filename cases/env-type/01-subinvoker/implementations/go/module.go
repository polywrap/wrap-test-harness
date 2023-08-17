package module

import (
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodNoEnv(args *types.ArgsSubinvokeMethodNoEnv) string {
	value, err := Subinvoked_MethodNoEnv(&Subinvoked_ArgsMethodNoEnv{Arg: args.Arg})
	if err != nil {
		panic(err.Error())
	}
	return value
}

func SubinvokeMethodRequireEnv() Subinvoked_Env {
	value, err := Subinvoked_MethodRequireEnv(&Subinvoked_ArgsMethodRequireEnv{})
	if err != nil {
		panic(err.Error())
	}
	return value
}

func SubinvokeMethodOptionalEnv() *Subinvoked_Env {
	value, err := Subinvoked_MethodOptionalEnv(&Subinvoked_ArgsMethodOptionalEnv{})
	if err != nil {
		panic(err.Error())
	}
	return value
}
