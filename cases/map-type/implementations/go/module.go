package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func GetKey(args *types.ArgsGetKey) int32 {
	value, exists := args.Foo.Map[args.Key]
	if !exists {
		// Return a default value or handle the case when the key is not found
		return 0
	}
	return value
}

func ReturnMap(args *types.ArgsReturnMap) map[string]int32 {
	return args.Map
}

func ReturnCustomMap(args *types.ArgsReturnCustomMap) map[string]int32 {
	return args.Foo.Map
}

func ReturnNestedMap(args *types.ArgsReturnNestedMap) map[string]map[string]int32 {
	return args.Foo
}
