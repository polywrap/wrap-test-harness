package module

import (
	subinvoked_module "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked_module_wrapped"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodRequireEnv(_ *types.MethodArgsSubinvokeMethodRequireEnv, _ types.Env) subinvoked_module.SubinvokedEnv {
	return subinvoked_module.MethodRequireEnv(&subinvoked_module.ArgsMethodRequireEnv{})
}
