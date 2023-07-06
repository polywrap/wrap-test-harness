package module

import (
	"errors"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	"math/big"
)

func Method(args *types.ArgsMethod) (*big.Int, error) {
	result := big.NewInt(0).Mul(args.Arg1, args.Obj.Prop1)

	if args.Arg2 != nil {
		result.Mul(result, args.Arg2)
	}
	if args.Obj.Prop2 != nil {
		result.Mul(result, args.Obj.Prop2)
	}

	return result, nil
}
