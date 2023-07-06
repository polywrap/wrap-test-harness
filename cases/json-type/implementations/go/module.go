package module

import (
	"encoding/json"
	"errors"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func Stringify(args *types.ArgsStringify) (string, error) {
	var newString string
	for _, object := range args.Values {
		newString += object.String()
	}
	return newString, nil
}

func Parse(args *types.ArgsParse) (interface{}, error) {
	var value interface{}
	err := json.Unmarshal([]byte(args.Value), &value)
	if err != nil {
		return nil, err
	}
	return value, nil
}

func StringifyObject(args *types.ArgsStringifyObject) (string, error) {
	var newString string
	newString += args.Object.JSONA.String()
	newString += args.Object.JSONB.String()
	return newString, nil
}

func MethodJSON(args *types.ArgsMethodJSON) (interface{}, error) {
	value := map[string]interface{}{
		"valueA": args.ValueA,
		"valueB": args.ValueB,
		"valueC": args.ValueC,
	}
	return value, nil
}

func ParseReserved(args *types.ArgsParseReserved) (interface{}, error) {
	var reserved interface{}
	err := json.Unmarshal([]byte(args.JSON), &reserved)
	if err != nil {
		return nil, err
	}
	return reserved, nil
}

func StringifyReserved(args *types.ArgsStringifyReserved) (string, error) {
	jsonString, err := json.Marshal(args.Reserved)
	if err != nil {
		return "", err
	}
	return string(jsonString), nil
}
