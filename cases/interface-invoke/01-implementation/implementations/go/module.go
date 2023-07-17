package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func ModuleMethod(args *types.ArgsModuleMethod) types.ImplementationType {
	return args.Arg
}

func AbstractModuleMethod(args *types.ArgsAbstractModuleMethod) string {
	return args.Arg.Str
}
