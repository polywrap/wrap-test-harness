package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	big "github.com/polywrap/go-wrap/msgpack/big"
)

func Method(args *types.MethodArgsMethod) (*big.Int) {
	result := big.NewInt(0).Mul(args.Arg1, args.Obj.Prop1)

	if args.Arg2 != nil {
		result.Mul(result, args.Arg2)
	}
	if args.Obj.Prop2 != nil {
		result.Mul(result, args.Obj.Prop2)
	}

	return result
}
