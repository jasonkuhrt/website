---
title: Hybrid ESM/CJS Node Packages using TypeScript
date: 2022-9-3
---

Update 2023/2/17: I found a new simpler way detailed [here](./hybrid-esm-cjs-node-packages-using-typescript-take-2.md)
Update 2022/9/5: There is a [TS issue](https://github.com/microsoft/TypeScript/issues/46786#issuecomment-1237243821) covering the topic herein.

---

I worked out a solution to creating hybrid CJS/ESM Node packages using TypeScript's new ([since 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#ecmascript-module-support-in-nodejs)) ESM support.

## Understanding What Needs to be Emitted

I thought that `"import"` under the `exports` systems/field of `package.json` would force the consumer to see those files pointed at as ESM. This was wrong. It seems that in modern ESM there are only two ways to achieve this:

1. The package `"type"` is `"module"` and the files pointed at are `.js`
2. The files pointed at have `.mjs` extension.

The extension takes precedence over the `type` field. There's also the combination of `type` `module` with `.mjs` which I haven't tried but presumably just "doubly" works.

With this knowledge I realized that for a hybrid package it is insufficient to use `.js` extension. That extension leads to being interpreted as whatever is in the aforementioned `"type"` field. And that field is mutually exclusive between modes.

Instead I must decide which way I'm going with `type` and then for the other mode apply its explicit extension. Further, I can choose to ignore `type` and and use explicit extensions everywhere. To recap all of the following will work:

```
"type"      dist/esm   dist/cjs
-------------------------------
"module"    *.js       *.cjs      [2]
"module"    *.mjs      *.cjs
"commonjs"  *.mjs      *.js
"commonjs"  *.mjs      *.cjs
<unset>     *.mjs      *.cjs      [1]
```

1. [1] I am currently using this variation because it is most explicit.
2. [2] I will probably transition to this approach because it is future facing.

## Figuring Out How to Emit It

This was more work than I expected. Once TS is configured with compiler options:

```json
"module": "NodeNext",
"moduleResolution": "nodenext",
```

it then seems to emit ESM only in two cases:

1. Package `"type"` is `"module"`
2. Source file extension is `mts`

Furthermore TS only emits `.cjs` and `.mjs` extensions if file names have respectively `.cts` and `mts`. And recall that we _need_ to emit these file extensions for hybrid packages (for the opposite side of however "type" is set).

The following is the current solution, I do hope it can be simplified in the future:

1. Package `.type` is left unspecified (that means it defaults to `commonjs`)
1. Source files are all written `.mts`
1. `tsconfig.json` has:

   ```json
   "module": "NodeNext",
   "moduleResolution": "nodenext",
   ```

1. `tsconfig.esm.json` has:

   ```json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "outDir": "dist/esm",
       "rootDir": "src",
       "sourceMap": true,
       "declaration": true,
       "declarationMap": true
     },
     "include": ["src"],
     "exclude": ["**/*.spec.*"]
   }
   ```

1. `tsconfig.cjs.json` has:

   ```json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "outDir": "dist/cjs",
       "module": "commonjs",
       "moduleResolution": "node",
       "rootDir": "src",
       "sourceMap": true,
       "declaration": true,
       "declarationMap": true
     },
     "include": ["src"],
     "exclude": ["**/*.spec.*"]
   }
   ```

1. Package build runs `tsc` twice, once against each mode-specific tsconfig. However, having `.mts` files makes it impossible for `tsc` to emit CJS...

1. Therefore we have a build script that, on CJS build, performs the following transforms before `tsc`, and then after, undoes them:

   1. Rename all source files from `.mts` to `.cts`

   1. Rewrite all imports from `... from './abc.mjs` to `... from './abc.cjs'`. (I haven't mentioned the nuance of how TS uses import paths of _what will be emitted_ which is funky but not having impact on this work since I would just the same have had to transform `.mts` to `.cjs`. If ESM had not required explicit file paths or TS supported found a way to omit it then _that_ would have made this easier. )

That is the solution, and you can see it in use working (as far as I am aware) in the repo [jasonkuhrt/floggy](https://github.com/jasonkuhrt/floggy). Soon it will be ported over to [jasonkuhrt/template-typescript-lib](https://github.com/jasonkuhrt/template-typescript-lib).

The amount of complexity here is not nice. I want in the future something better. That could be for example:

1. Stop writing hybrid packages
2. TS team at Microsoft delivers more flexible ways of working with `tsc`
3. Encapsulate the logic in a reusable CLI

I will do (1) once I feel it doesn't burden users much to do so. I am far from sure that will be soon. Its a feeling I guess. For me I'm not close to it yet. I will raise an issue with the TS team about (2) to see if there's any hope there. Finally I might consider (3) as I can see needing this build system in already half a dozen or so packages and more to come. I also think the community needs it, or at least, I am not aware of any other solution to this problem using the same constraints (e.g. only using `tsc`).
