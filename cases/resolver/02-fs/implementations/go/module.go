package module

import (
	"github.com/polywrap/wrap-test-harness/go/module/wrap/types"
	uri_resolver "github.com/polywrap/wrap-test-harness/go/module/wrap/imported/uri_resolver"

	"fmt"
)

func TryResolveUri(args *types.ArgsTryResolveUri) *uri_resolver.UriResolver_MaybeUriOrManifest {
	if args.Authority == "custom-fs" {
		uri := fmt.Sprintf("wrap://file/%s", args.Path)
		return &uri_resolver.UriResolver_MaybeUriOrManifest{
			Uri: &uri,
			Manifest: nil,
		}
	} else {
		uri := fmt.Sprintf("wrap://%s/%s", args.Authority, args.Path)
		return &uri_resolver.UriResolver_MaybeUriOrManifest{
			Uri: &uri,
			manifest: nil,
		}
	}
}

func GetFile(args *types.ArgsGetFile) []byte {
	return nil
}
