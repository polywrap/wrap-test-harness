package module

import "github.com/polywrap/wrap-test-harness/go/module/wrap/types"

func Method1(args *types.ArgsMethod1) []types.Output {
	outputs := []types.Output{
		{
			Prop: args.Arg1.Prop,
			Nested: types.Nested{
				Prop: args.Arg1.Nested.Prop,
			},
		},
	}
	if args.Arg2 != nil {
		arg2 := args.Arg2
		outputs = append(outputs, types.Output{
			Prop: arg2.Prop,
			Nested: types.Nested{
				Prop: arg2.Circular.Prop,
			},
		})
	} else {
		outputs = append(outputs, types.Output{
			Prop: "",
			Nested: types.Nested{
				Prop: "",
			},
		})
	}
	return outputs
}

func Method2(args *types.ArgsMethod2) *types.Output {
	if args.Arg.Prop == "null" {
		return nil
	}
	return &types.Output{
		Prop: args.Arg.Prop,
		Nested: types.Nested{
			Prop: args.Arg.Nested.Prop,
		},
	}
}

func Method3(args *types.ArgsMethod3) []*types.Output {
	outputs := []*types.Output{
		nil,
	}
	outputs = append(outputs, &types.Output{
		Prop: args.Arg.Prop,
		Nested: types.Nested{
			Prop: args.Arg.Nested.Prop,
		},
	})
	return outputs
}

func Method4(args *types.ArgsMethod4) types.Output {
	return types.Output{
		Prop: string(args.Arg.Prop),
		Nested: types.Nested{
			Prop: "nested prop",
		},
	}
}
