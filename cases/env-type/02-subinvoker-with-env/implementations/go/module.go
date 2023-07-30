package module

import (
	subinvoked "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodRequireEnv(_ *types.Env) subinvoked.Subinvoked_Env {
	res, _ := subinvoked.MethodRequireEnv(&subinvoked.ArgsMethodRequireEnv{})
	return res
}
