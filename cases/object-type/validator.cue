"method1": {
	$0: {
		data: [
      {
        "prop": "arg1 prop",
        "nested": {
          "prop": "arg1 nested prop"
        }
      },
      {
        "prop": "",
        "nested": {
          "prop": ""
        }
      }
    ]
	}
}
"method1b": {
	$0: {
		data: [
      {
        "prop": "arg1 prop",
        "nested": {
          "prop": "arg1 nested prop"
        }
      },
      {
        "prop": "arg2 prop",
        "nested": {
          "prop": "arg2 circular prop"
        }
      }
    ]
	}
}
"method2": {
	$0: {
		data: {
			"prop": "arg prop",
			"nested": {
				"prop": "arg nested prop"
			}
		}
	}
}
"method2b": {
	$0: {
		data: null
	}
}
"method3": {
	$0: {
		data: [
      null,
      {
        "prop": "arg prop",
        "nested": {
          "prop": "arg nested prop"
        }
      }
    ]
	}
}
"method4": {
	$0: {
		data: {
      "prop": "1234",
      "nested": {
        "prop": "nested prop"
      }
    }
	}
}