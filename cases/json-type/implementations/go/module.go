package module

import (
	"encoding/json"
	"github.com/valyala/fastjson"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func Stringify(args *types.MethodArgsStringify) (string) {
	var newString string
	for _, object := range args.Values {
		newString += object.String()
	}
	return newString
}

func Parse(args *types.MethodArgsParse) *fastjson.Value {
	p := fastjson.Parser{}
	value, err := p.Parse(args.Value)
	if err != nil {
		panic(err)
	}
	return value
}

func StringifyObject(args *types.MethodArgsStringifyObject) (string) {
	var newString string
	newString += args.Object.JsonA.String()
	newString += args.Object.JsonB.String()
	return newString
}

func MethodJSON(args *types.MethodArgsMethodJSON) *fastjson.Value {
	jsonValue, jsonErr := json.Marshal(args)
	if jsonErr != nil {
		panic(jsonErr)
	}
	value, err := fastjson.ParseBytes(jsonValue)
	if err != nil {
		panic(err)
	}
	return value
}

func ParseReserved(args *types.MethodArgsParseReserved) types.Reserved {
	var reserved types.Reserved
	err := json.Unmarshal([]byte(args.Json), &reserved)
	if err != nil {
		panic(err)
	}
	return reserved
}

func StringifyReserved(args *types.MethodArgsStringifyReserved) (string) {
	jsonString, err := json.Marshal(args.Reserved)
	if err != nil {
		panic(err)
	}
	return string(jsonString)
}
