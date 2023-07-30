package module

import (
	"encoding/json"
	"github.com/valyala/fastjson"
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
)

func Stringify(args *types.ArgsStringify) (string) {
	var newString string
	for _, object := range args.Values {
		newString += object.String()
	}
	return newString
}

func Parse(args *types.ArgsParse) *fastjson.Value {
	p := fastjson.Parser{}
	value, err := p.Parse(args.Value)
	if err != nil {
		panic(err)
	}
	return value
}

func StringifyObject(args *types.ArgsStringifyObject) (string) {
	var newString string
	newString += args.Object.JsonA.String()
	newString += args.Object.JsonB.String()
	return newString
}

func MethodJSON(args *types.ArgsMethodJSON) *fastjson.Value {
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

func ParseReserved(args *types.ArgsParseReserved) types.Reserved {
	var reserved types.Reserved
	err := json.Unmarshal([]byte(args.Json), &reserved)
	if err != nil {
		panic(err)
	}
	return reserved
}

func StringifyReserved(args *types.ArgsStringifyReserved) (string) {
	jsonString, err := json.Marshal(args.Reserved)
	if err != nil {
		panic(err)
	}
	return string(jsonString)
}
