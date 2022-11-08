# WASM Test Harness
### What
System for running integration tests against WRAP wasm implementations.

### Why
The purpose of this structure is to be able to create a WASM file (aka `wrap.wasm`) from different
implementations in an easy and scalable way; allowing us to make sure that built files are compatible 
with the WRAP Protocol.

### How
Test lives in `tests` folder, organized by features/use-cases (i.e: `json-type`, `union-type`),
inside each feature folder, we have every supported implementation (i.e: `rust`, `assemblyscript`) inside an`implementations`
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
### Run

> cargo run

### Accepted arguments:

- implementations
- feature
- build only
- reset


In order to run the arguments with `cargo run` command you need to define them using the 
following way: 
`cargo run -- --arg_name=value`

An example of running a command with the reset option can be:
`cargo run -- -r` or `cargo run -- --reset`. Note how you can use the command with just one letter

