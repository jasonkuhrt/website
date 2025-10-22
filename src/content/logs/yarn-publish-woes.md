---
title: 'Yarn publish woes'
date: 2017-06-08
---

Given the following, the only reasonable solution is that for publishing modules, we still have to use `npm`.

- [does not act like `npm publish` in that it forces a TTY (TeleTYpewriter)](https://github.com/yarnpkg/yarn/issues/722)
- [`npm publish` within `yarn run` fails with `ENEEDAUTH` error](https://github.com/yarnpkg/yarn/issues/2445#issuecomment-273284359).
- [`yarn publish` sometimes hangs](https://github.com/yarnpkg/yarn/issues/1694) (this happened at the ssense office today)
- [`yarn publish` does not honour .npmignore](https://github.com/yarnpkg/yarn/issues/754). Consequently builds that are gitignored but should be part of the published package does not work.
- Example failure:

*

```
❯ yarn version
yarn version v0.24.6
info Current version: 0.0.5
question New version: 0.0.6
$ yarn build
yarn build v0.24.6
$ babel source --out-dir build
source/data.js -> build/data.js
source/index.js -> build/index.js
source/pages.js -> build/pages.js
source/pages.spec.js -> build/pages.spec.js
source/tags.js -> build/tags.js
source/tags.spec.js -> build/tags.spec.js
source/validations.js -> build/validations.js
✨  Done in 0.85s.
info New version: 0.0.6
$ npm publish
npm ERR! Darwin 16.6.0
npm ERR! argv "/Users/jason.kuhrt/.nvm/versions/node/v7.10.0/bin/node" "/Users/jason.kuhrt/.nvm/versions/node/v7.10.0/bin/npm" "publish"
npm ERR! node v7.10.0
npm ERR! npm  v4.2.0
npm ERR! code ENEEDAUTH

npm ERR! need auth auth required for publishing
npm ERR! need auth You need to authorize this machine using `npm adduser`

npm ERR! Please include the following file with any support request:
npm ERR!     /Users/jason.kuhrt/.npm/_logs/2017-06-09T00_31_45_869Z-debug.log
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/version for documentation about this command.
```
