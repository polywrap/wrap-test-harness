package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	. "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/uri_resolver"

	"fmt"
)

func TryResolveUri(args *types.ArgsTryResolveUri) *UriResolver_MaybeUriOrManifest {
	if args.Authority == "custom-authority" {
		uri := fmt.Sprintf("wrap://%s/%s", args.Authority, args.Path)
		return &UriResolver_MaybeUriOrManifest{
			Uri: &uri,
			Manifest: nil,
		}
	} else {
		uri := fmt.Sprintf("wrap://custom-fs/%s", args.Path)
		return &UriResolver_MaybeUriOrManifest{
			Uri: &uri,
			Manifest: nil,
		}
	}
}

func GetFile(args *types.ArgsGetFile) []byte {
	return nil
}
