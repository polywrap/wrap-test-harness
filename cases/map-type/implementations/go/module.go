package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func GetKey(args *types.ArgsGetKey) int32 {
	value, exists := args.Foo.M_map[args.Key]
	if !exists {
		// Return a default value or handle the case when the key is not found
		return 0
	}
	return value
}

func ReturnMap(args *types.ArgsReturnMap) map[string]int32 {
	return args.M_map
}

func ReturnCustomMap(args *types.ArgsReturnCustomMap) types.CustomMap {
	return args.Foo
}

func ReturnNestedMap(args *types.ArgsReturnNestedMap) map[string]map[string]int32 {
	return args.Foo
}
