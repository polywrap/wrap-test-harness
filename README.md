# WASM Test Harness
### What
System for running integration tests against WRAP wasm implementations.

### Why
The purpose of this structure is to be able to create a WASM file (aka `wrap.wasm`) from different
implementations in an easy and scalable way; allowing us to make sure that built files are compatible 
with the WRAP Protocol.

### How
Test lives in `tests` folder, organized by features/use-cases (i.e: `json-type`, `union-type`),
inside each feature folder, we have every supported implementation (i.e: `rust`, `assemblyscript`) inside an `implementations`
folder, along with the [common files](#common-files) between implementations.

The problem this architecture solves is that for every case, we need to give opinionated
input per WASM implementation (i.e: `index.ts|lib.rs` or `Cargo.toml|package.json`), being able
to easily add new features and/or implementations.

It consists of three main steps:
- Build folder generation
- Wrapper build
- Wrapper test

#### Common files
Implementation agnostic files. It allows to add different behavior to build & test different implementations 
- Client config (`client-config.ts`)
- Manifest JSON (`polywrap.json`)
- Test template JSON (`workflow.json`)
- Any ABI import


## Build & Contribute

### Prerequisites
- node 16.13
- rust
- cargo
- npx
- [polywrap cli](https://github.com/polywrap/toolchain/tree/origin/packages/cli) 

> Note: It's recommended to run `npm i -D polywrap` to make sure polywrap cli is installed locally
> or link Polywrap CLI locally with the [environment variable](#environment-variables)
### Run

> cargo run

#### Accepted arguments:

- implementation (-i | --implementation)
- feature (-f | --feature)
- build only (-b | --build)
- reset (-r | --reset)

#### Environment Variables

- `POLYWRAP_CLI_PATH`: Allows to pass the absolute path of local [Polywrap CLI package](https://github.com/polywrap/toolchain/tree/origin-dev/packages/cli)
- `POLYWRAP_WASM_PATH`: Allows to pass the absolute path of local [Polywrap WASM packages](https://github.com/polywrap/toolchain/tree/origin-dev/packages/wasm)

Example of how commands can be run:

```shell
# note: the -r attribute it's to remove the autogenerated `build`
# folder (if exists), that's why is being added in examples

# only build and test the implementations of subinvoke feature
cargo run -- -r -f=subinvoke

# only build and test wrappers in assemblyscript implementation
cargo run -- -r -i=as

# run custom-feat feature with local CLI path in rust
POLYWRAP_CLI_PATH="/absolute/path/to/cli" cargo run -- -r -f=custom-feat -i=rust

# only build wrappers and create a folder only with output files
cargo run -- -r -b
```

