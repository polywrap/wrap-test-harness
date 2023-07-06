package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func BytesMethod(args *types.ArgsBytesMethod) ([]byte, error) {
	s := string(args.Arg.Prop)
	result := []byte(s + " Sanity!")
	return result, nil
}
