---
title: Hybrid ESM/CJS Node Packages using TypeScript (Take 2)
date: 2023-2-17
---

A colleague of mine at Prisma ([Tyler](https://twitter.com/rtbenfield)) tipped me off to a simpler approach to creating hybrid CJS/ESM packages. His insight was how Node.js respects the presence and contents of `package.json` files...

1. First have two `tsconfig` files, one for CJS and one for ESM. Make both inherit from a base `tsconfig.json` that contains non emit configuration (e.g. `strict` mode):

   ```json
   // tsconfig.cjs.json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "outDir": "build/cjs",
       "module": "commonjs",
       "moduleResolution": "node",
       "rootDir": "src"
     },
     "include": ["src"],
     "exclude": ["**/*.spec.*"]
   }
   ```

   ```json
   // tsconfig.esm.json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "outDir": "build/esm",
       "rootDir": "src"
     },
     "include": ["src"],
     "exclude": ["**/*.spec.*"]
   }
   ```

1. Have a `package.json` that looks something like the following. Importantly notice that the build for `CJS` includes an emit of a `package.json` file containing the `type: "commonjs"` entry. **This is small tweak will cause Node.js to view all JavaScript files within that emit directory to be CJS**, easy! Thanks Tyler 🙌 ! In the following I also believe that the explicit `types` fields are optional when their names match the name of the entrypoint. Furthermore only TS 4.7 using its new ESM mode or TS 5.0 using its [new flag](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/#resolvepackagejsonexports) can read from those `exports` field. Thus it might be a good idea for backwards compatibility (at least until TS 5+ gains widespread adoption... say 6 months??) to include a `types` field pointing at one of the `*.d.ts` entrypoints. Note that `types` does not support multi-entrypoint packages and thus is to be ditched as soon as practical. In my opinion a few months post TS 5.0 will be good enough.

   ```json
   {
     "name": "foobar",
     "type": "module",
     "files": ["build"],
     "exports": {
       ".": {
         "require": {
           "types": "./build/cjs/index.d.ts",
           "default": "./build/cjs/index.js"
         },
         "import": {
           "types": "./build/esm/index.d.ts",
           "default": "./build/esm/index.js"
         }
       }
     },
     "scripts": {
       "build": "pnpm build:cjs && pnpm build:esm",
       "build:cjs": "pnpm tsc --project tsconfig.cjs.json && echo '{\"type\":\"commonjs\"}' > build/cjs/package.json",
       "build:esm": "pnpm tsc --project tsconfig.esm.json"
     }
   }
   ```

   Thanks Tyler!
