# Web5 Tools

This repo is a simple cli implementation to make it easier for devs to mess around with Web5 primitives.

## Usage

1. Clone repo & Install deps `git clone git@github.com:bnonni/web5-tools.git && cd web5-tools && npm install`
2. Build `npm run build`
3. Run cli `node dist/index.js --primitive <did|vc|dwn> --action <create,publish,verify,read,update,delete>`

### did

Actions you can take on dids

- create: creates a new did
- publish: publishes a did to the dht network

### vc

Actions you can take on verifiable credentials

- create: creates a new verifiable credential
- verify: verifies an existing credential

### dwn

Actions you cna take on dwn records

- create: creates a new dwn record
- read: reads dwn records
- update: updates an existing dwn record
- delete: deletes a dwn record