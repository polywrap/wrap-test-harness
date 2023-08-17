package module

import (
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/subinvoked"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func SubinvokeMethodRequireEnv(_ *types.Env) Subinvoked_Env {
	res, _ := Subinvoked_MethodRequireEnv(&Subinvoked_ArgsMethodRequireEnv{})
	return res
}
