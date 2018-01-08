# serviceless

[![Build Status](http://circleci-badges-max.herokuapp.com/img/8bites/serviceless?token=4482e2625fab30eeca954eec94a73091532f7883)](https://circleci.com/gh/8bites/serviceless) [![codecov](https://codecov.io/gh/8bites/serviceless/branch/master/graph/badge.svg)](https://codecov.io/gh/8bites/serviceless)
 [![npm version](https://badge.fury.io/js/serviceless.svg)](https://badge.fury.io/js/serviceless)
 [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

**Serviceless** - cli tool on top of Serverless framework, that simplifies workflow with multiple services.

Quick start
===

<img align="right" width="400" src="./assets/deploy_all.gif" />

1. Install serverless framework
```sh
npm install serverless
```
2. Install serviceless cli
```sh
npm install serviceless
```
3. Deploy
```sh
slx deploy all
```

How to
===

Deploy
------

#### Deploy all services in a folder
```sh
slx deploy all
```

#### Deploy service with command line prompt

```sh
slx deploy
```
then select service or folder from the list.  

#### Deploy service, matching string

```sh
slx deploy <query>
```

#### Flags

`-b`, `--runInBand` - deploy services one by one (parallel by default)

`-e`, `--exitOnFailure` - stop deployment of other services on failure

Help
------
```sh
slx --help
slx deploy --help
```

What's next
===

- [ ] add option to rollback to previous state on fail
- [ ] aggregate logs for multiple services
- [ ] add configuration file to deploy in band services that rely on each other
- [ ] save and restore `.serverless` folders to use as deployment artifacts for CI/CD tools 
- [ ] git integration to show and deploy changed services

Contributions
===

Yes, please!

Clone repo, then
```sh
npm install
npm test
```

LICENCE
===
MIT
