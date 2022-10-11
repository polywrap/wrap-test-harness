# WASM Test Harness
### What
System for running integration tests against WRAP wasm implementations.

### Why
The purpose of this structure is to be able to create a WASM file (aka `wrap.wasm`) from different
implementations in an easy and scalable way; allowing us to make sure that built files are compatible 
with the WRAP Protocol.

### How
Test lives in `tests` folder, organized by features/use-cases (i.e: `json-type`, `union-type`),
inside each feature folder, we have every supported implementation (i.e: `rust`, `assemblyscript`).
The problem this architecture solves is that for every case, we need to give opinionated
input per WASM implementation (i.e: `index.ts|lib.rs` or `Cargo.toml|package.json`), being able
to easily add new features and/or implementations.

Inside every feature folder, an `implementations` sub-folder is going to live, along with the [common files](#common-files)
between implementations.

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

### Run

> cargo build

### Accepted arguments:

- implementations
- feature
- verbose
- 

