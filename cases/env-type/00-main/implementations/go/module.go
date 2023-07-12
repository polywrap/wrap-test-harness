package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func MethodNoEnv(args *types.MethodArgsMethodNoEnv) string {
	return args.Arg
}

func MethodRequireEnv(env *types.Env) types.Env {
	return *env
}

func MethodOptionalEnv(env *types.Env) *types.Env {
	return env
}
