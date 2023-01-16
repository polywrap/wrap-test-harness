# WRAP Test Harness
### What
System for running integration tests against WRAP wasm implementations.

### Why
The purpose of this structure is to be able to create a WASM file (aka `wrap.wasm`) from different
implementations in an easy and scalable way; allowing us to make sure that built files are compatible 
with the WRAP Protocol.

### How
Test cases lives in `cases` folder, organized by features/use-cases (i.e: `json-type`, `union-type`),
inside each feature folder, we have every supported implementation (i.e: `rust`, `assemblyscript`) inside an `implementations`
folder, along with the [common files](#common-files) between implementations.

The problem this architecture solves is that for every case, we need to give opinionated
input per WASM implementation (i.e: `index.ts|lib.rs` or `Cargo.toml|package.json`), being able
to easily add new features and/or implementations.

It consists of three main steps:
- Build folder generation
- Wrapper build
- Wrapper test

## Build & Contribute

### Prerequisites
- node 16.13
- rust
- cargo
- npx
- [polywrap cli](https://github.com/polywrap/toolchain/tree/origin-dev/packages/cli) 

### Run

> cargo run

#### Accepted arguments:

- implementation (-i | --implementation)
- feature (-f | --feature)
- wrappers (-w | --wrappers_path) | default: `./wrappers`
- reset (-r | --reset)
- verbose (-v | --verbose)

#### Common files
Implementation agnostic files. It allows to add different behavior to build & test different implementations
- Client config (`client-config.ts`)
- Manifest JSON (`polywrap.json`)
- Test template JSON (`workflow.json`)
- Any ABI import

#### Environment Variables

- `POLYWRAP_CLI_PATH`: Allows to pass the absolute path of local [Polywrap CLI package](https://github.com/polywrap/toolchain/tree/origin-dev/packages/cli)
- `POLYWRAP_WASM_PATH`: Allows to pass the absolute path of local [Polywrap WASM packages](https://github.com/polywrap/toolchain/tree/origin-dev/packages/wasm)

Example of how commands can be run:

```shell
# only build and test the implementations of subinvoke feature
cargo run -- -f=subinvoke

# removes `./wrappers` folder & build and test wrappers in assemblyscript implementation
cargo run -- -r -i=as

# run custom-feat feature with local CLI path in rust
POLYWRAP_CLI_PATH="/absolute/path/to/cli" cargo run -- -r -f=custom-feat -i=rust -w=/absolute/path/to/desired/wrappers

# only build wrappers and create a folder only with output files
cargo run -- -w
```

If you would like to run some changes from your CLI you can use the environment variables to provide the path
