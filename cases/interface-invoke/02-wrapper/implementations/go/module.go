package module

import (
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/interfaces"
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/pkginterface"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func ModuleMethod(args *types.ArgsModuleMethod) types.ImplementationType {
	return args.Arg
}

func AbstractModuleMethod(args *types.ArgsAbstractModuleMethod) string {
	impls := Interface_GetImplementations()
	uri := impls[1]
	methodArgs := &Interface_ArgsAbstractModuleMethod{
		Arg: args.Arg,
	}
	result, err := Interface_AbstractModuleMethod(uri, methodArgs)
	if err != nil {
		panic(err.Error())
	}
	return result
}
