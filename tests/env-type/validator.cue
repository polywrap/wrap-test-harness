"methodRequireEnv": {
		$0: {
				data: {
						str: "string",
						optFilledStr: "optional string",
						optStr: null,
						number: 10,
						optNumber: null,
						bool: true,
						optBool: null,
						object: {
							prop: "object string",
						},
						optObject: null,
						en: 0,
						optEnum: null,
						array: [32, 23],
				}
	 }
}
"subinvokeEnvMethod": {
	$0: {
		data: {
			local: {
				str: "string",
				optFilledStr: "optional string",
				optStr: null,
				number: 10,
				optNumber: null,
				bool: true,
				optBool: null,
				object: {
					prop: "object string",
				},
				optObject: null,
				en: 0,
				optEnum: null,
				array: [32, 23],
			},
			external: {
				externalArray: [1, 2, 3],
				externalString: "iamexternal",
			}
		}
	}
}