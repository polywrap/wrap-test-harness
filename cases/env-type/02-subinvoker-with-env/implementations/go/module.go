package module

import (
	subinvoked "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodRequireEnv(_ *types.ArgsSubinvokeMethodRequireEnv, _ types.Env) subinvoked.SubinvokedEnv {
	return subinvoked.RequireEnv(&subinvoked.ArgsMethodRequireEnv{})
}
