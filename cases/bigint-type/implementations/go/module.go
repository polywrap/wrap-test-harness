package module

import (
	"errors"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	"github.com/polywrap/wasm-as"
)

func Method(args *types.ArgsMethod) (*wasm.BigInt, error) {
	result := new(wasm.BigInt).Mul(args.Arg1, args.Obj.Prop1)

	if args.Arg2 != nil {
		result.Mul(result, args.Arg2)
	}
	if args.Obj.Prop2 != nil {
		result.Mul(result, args.Obj.Prop2)
	}

	return result, nil
}
