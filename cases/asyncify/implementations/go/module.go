package module

import (
	"errors"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/storage_module"
	"strconv"
)

func GetData(args *types.ArgsGetData) (uint32, error) {
	v, err := storage_module.GetData(&storage_module.ArgsGetData{})
	if err != nil {
		return 0, errors.New(err.Error())
	}
	return uint32(v), nil
}

func SetDataWithLargeArgs(args *types.ArgsSetDataWithLargeArgs) (string, error) {
	largeString := args.Value
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 66})
	if err != nil {
		return "", errors.New(err.Error())
	}
	return largeString, nil
}

func SetDataWithManyArgs(args *types.ArgsSetDataWithManyArgs) (string, error) {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 55})
	if err != nil {
		return "", errors.New(err.Error())
	}
	return args.ValueA + args.ValueB + args.ValueC + args.ValueD + args.ValueE + args.ValueF + args.ValueG + args.ValueH + args.ValueI + args.ValueJ + args.ValueK + args.ValueL, nil
}

func SetDataWithManyStructuredArgs(args *types.ArgsSetDataWithManyStructuredArgs) (bool, error) {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 44})
	if err != nil {
		return false, errors.New(err.Error())
	}
	return true, nil
}

func LocalVarMethod(args *types.ArgsLocalVarMethod) (bool, error) {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 88})
	if err != nil {
		return false, errors.New(err.Error())
	}
	return true, nil
}

func GlobalVarMethod(args *types.ArgsGlobalVarMethod) (bool, error) {
	_, err := storage_module.SetData(&storage_module.ArgsSetData{Value: 77})
	if err != nil {
		return false, errors.New(err.Error())
	}
	return true, nil
}

func SubsequentInvokes(args *types.ArgsSubsequentInvokes) ([]string, error) {
	var result []string
	var err error

	for i := 0; i < int(args.NumberOfTimes); i++ {
		_, errSet := storage_module.SetData(&storage_module.ArgsSetData{Value: i})
		if errSet != nil {
			err = errSet
			break
		}
		data, errGet := storage_module.GetData(&storage_module.ArgsGetData{})
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
