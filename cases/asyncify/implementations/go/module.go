package module

import (
	"errors"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	storage_module "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/storage"
	"strconv"
)

func GetData(args *types.MethodArgsGetData) (uint32, error) {
	v, err := storage_module.MethodGetData(&storage_module.ArgsGetData{})
	if err != nil {
		return 0, errors.New(err.Error())
	}
	return uint32(v), nil
}

func SetDataWithLargeArgs(args *types.MethodArgsSetDataWithLargeArgs) (string, error) {
	largeString := args.Value
	_, err := storage_module.MethodSetData(&storage_module.ArgsSetData{Value: 66})
	if err != nil {
		return "", errors.New(err.Error())
	}
	return largeString, nil
}

func SetDataWithManyArgs(args *types.MethodArgsSetDataWithManyArgs) (string, error) {
	_, err := storage_module.MethodSetData(&storage_module.ArgsSetData{Value: 55})
	if err != nil {
		return "", errors.New(err.Error())
	}
	return args.ValueA + args.ValueB + args.ValueC + args.ValueD + args.ValueE + args.ValueF + args.ValueG + args.ValueH + args.ValueI + args.ValueJ + args.ValueK + args.ValueL, nil
}

func SetDataWithManyStructuredArgs(args *types.MethodArgsSetDataWithManyStructuredArgs) (bool, error) {
	_, err := storage_module.MethodSetData(&storage_module.ArgsSetData{Value: 44})
	if err != nil {
		return false, errors.New(err.Error())
	}
	return true, nil
}

func LocalVarMethod(args *types.MethodArgsLocalVarMethod) (bool, error) {
	_, err := storage_module.MethodSetData(&storage_module.ArgsSetData{Value: 88})
	if err != nil {
		return false, errors.New(err.Error())
	}
	return true, nil
}

func GlobalVarMethod(args *types.MethodArgsGlobalVarMethod) (bool, error) {
	_, err := storage_module.MethodSetData(&storage_module.ArgsSetData{Value: 77})
	if err != nil {
		return false, errors.New(err.Error())
	}
	return true, nil
}

func SubsequentInvokes(args *types.MethodArgsSubsequentInvokes) ([]string, error) {
	var result []string
	var err error

	for i := 0; i < int(args.NumberOfTimes); i++ {
		_, errSet := storage_module.MethodSetData(&storage_module.ArgsSetData{Value: i})
		if errSet != nil {
			err = errSet
			break
		}
		data, errGet := storage_module.MethodGetData(&storage_module.ArgsGetData{})
		if errGet != nil {
			err = errGet
			break
		}
		result = append(result, strconv.Itoa(data))
	}
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return result, nil
}
