# DWeb Tool5

A simple typescript cli to simplify interacting with Web5 primitives.

## Summary

This repo is meant to be instructional. Use the code and cli to experiement with interacting with the core Web5 primitives: DIDs, VCs, and DWNs.
This repo is not meant to be a substitute for the Web5-js library. It leverages the Web5-js library to interact with the primitives.
To implement Web5 into your project or to build a DWA (decentralized web app) with Web5, visit the TBD web5-js repo: https://github.com/TBD54566975/web5-js

## Usage

1. Clone repo & install deps
```bash
git clone git@github.com:bnonni/web5-tools.git
cd web5-tools
npm install
```
2. Build the cli
```bash
npm run build
```
3. Install the cli locally (optional). This will install terminal command called `tool5`. Exclusive to bash or zsh shells.
```bash
npm run install:cli
```
4. Run `tool5` help menu
```bash
tool5 --help
```
5. Run `tool5` with a command
```bash
tool5 -p did -a create
```

### did

Actions you can take on DIDs

- create: creates a new did
- recover: recovers an existing did (coming soon)
- publish: publishes a did to the dht network (coming soon)
- resolve: resolves a did from the dht network (coming soon)

### vc (coming soon)

Actions you can take on VCs

- create: creates a new verifiable credential
- verify: verifies an existing credential

### dwn (coming soon)

Actions you can take on DWNs

- create: creates a new dwn record
- read: reads dwn records
- update: updates an existing dwn record
- delete: deletes a dwn record