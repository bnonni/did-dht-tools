# Tool5

A simple typescript cli for interacting with tbd web5-js.

## Summary

This repo is meant to be instructional. Use the code and cli to experiement with interacting with the core web5-js primitives: DIDs, VCs, DWNs.
This repo is not meant to be a substitute for the web5-js library. It exposes a simple cli interface that is using the web5-js library "under the hood."
To add web5 to your project or to build a DWA (decentralized web app) with web5, visit the tbd web5-js repo: <https://github.com/TBD54566975/web5-js>

## Quick Install

To install `tool5`, run one of the following commands

```sh
# quick install clone
git clone git@github.com:bnonni/tool5.git && cd tool5 && npm run cli:install
```

```sh
# quick install script
wget -O - https://raw.githubusercontent.com/bnonni/tool5/main/install-tool5.sh | sh
```

## Step-by-step Install

Run each of the below commands to install `tool5` locally.

```sh
# clone repo & cd into dir
git clone git@github.com:bnonni/tool5.git && cd tool5
# install dependencies & build project
npm install && npm run build
# install cli
npm run install:cli
# show help menu
tool5 --help
# create a new did:dht
tool5 -p did -a create
```

### did

Actions you can take on DIDs

* create: creates a new did
* recover: recovers an existing did (coming soon)
* publish: publishes a did to the dht network (coming soon)
* resolve: resolves a did from the dht network (coming soon)

### vc (coming soon)

Actions you can take on VCs

* create: creates a new verifiable credential
* verify: verifies an existing credential

### dwn (coming soon)

Actions you can take on DWNs

* create: creates a new dwn record
* read: reads dwn records
* update: updates an existing dwn record
* delete: deletes a dwn record
