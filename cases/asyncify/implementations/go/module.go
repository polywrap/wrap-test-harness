package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	storage_module "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/storage"
	"strconv"
)

func GetData() uint32 {
	v, err := storage_module.GetData(&storage_module.ArgsGetData{})
	if err != nil {
		panic(err.Error())
	}
	return uint32(v)
}

func SetDataWithLargeArgs(args *types.ArgsSetDataWithLargeArgs) string {
	largeString := args.Value
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 66})
	if err != nil {
		panic(err.Error())
	}
	return largeString
}

func SetDataWithManyArgs(args *types.ArgsSetDataWithManyArgs) string {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 55})
	if err != nil {
		panic(err.Error())
	}
	return args.ValueA + args.ValueB + args.ValueC + args.ValueD + args.ValueE + args.ValueF + args.ValueG + args.ValueH + args.ValueI + args.ValueJ + args.ValueK + args.ValueL
}

func SetDataWithManyStructuredArgs(args *types.ArgsSetDataWithManyStructuredArgs) bool {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 44})
	if err != nil {
		panic(err.Error())
	}
	return true
}

func LocalVarMethod() bool {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 88})
	if err != nil {
		panic(err.Error())
	}
	return true
}

func GlobalVarMethod() bool {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 77})
	if err != nil {
		panic(err.Error())
	}
	return true
}

func SubsequentInvokes(args *types.ArgsSubsequentInvokes) []string {
	var result []string
	var err error

	for i := 0; i < int(args.NumberOfTimes); i++ {
		_, errSet := storage_module.SetData(&storage_module.ArgsSetData{Value: int32(i)})
		if errSet != nil {
			err = errSet
			break
		}
		data, errGet := storage_module.GetData(&storage_module.ArgsGetData{})
		if errGet != nil {
			err = errGet
			break
		}
		str := strconv.Itoa(int(data))
		result = append(result, str)
	}
	if err != nil {
		panic(err.Error())
	}
	return result
}
