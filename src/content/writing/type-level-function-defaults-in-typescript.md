---
title: Type-level Function Defaults in TypeScript
date: 2024-12-14
---

Here is the scenario:

1. You have a function that takes an optional configuration object.
2. If none is given then a default configuration is used.
3. In addition to runtime behaviour, you want the type system to track this such that the literal type of the default configuration is tracked.

This article is about achieving point (3).

The specifics of the function really don't matter here. This technique is useful in particular for library authors that need a high degree of type safety in their API. For example in my library [Graffle](https://graffle.js.org), this technique is used in its constructors.

Let's dive in.

Let's begin by getting requirements (1) and (2) out of the way.

```ts
interface Config {
  foo: string
  qux: number
}

type ConfigInit = Partial<Config>

const defaultConfig: Config = {
  foo: 'bar',
  qux: 1
}

const create = (configInit?: ConfigInit): Config => {
  return {
    ...defaultConfig,
    ...configInit,
  }
}
```

Simple.

Now, when we consider requirement (3) we see our problem. At the type level `create` returns a `Config` but that is _not_ the literal type of the default configuration. The literal type is a combination of whatever the user supplies merged with the literal type of the default configuration. So for example given this function call:

```ts
const config = create()
```

The literal type of `config` would be:

```ts
type config = {
  foo: 'bar'
  qux: 1
}
```

because those are the defaults.

Conversely, given this function call:

```ts
const config = create({ foo: 'baz' })
```

The literal type of `config` would be:

```ts
type config = {
  foo: 'baz'
  qux: 1
}
```

because that's the merge between the defaults and the user provided values.

And so on.

Let's get to work.

Note: From now on we will work with type declarations for `create` as the runtime is already solved above.

In order to track the literal type of value given by user we must move our type to a parameter constraint. We also use `const` to make TypeScript infer _the most specific type_ from the given value (e.g. `'foo'` get inferred as the string literal `'foo'` instead of `string`):

```ts
declare const create:
  <const $ConfigInit extends ConfigInit>(configInit?: $ConfigInit) =>
    $ConfigInit

const config = create({ foo: 'baz' })
```
Now we get this type:

```ts
type config = {
  foo: 'baz'
}
```

This successfully tracks the given values, but the defaults are missing at the type level.

We fix that by by passing the inferred type to a utility type that will supply the defaults for us at the type level:

```ts
type WithDefaults<$Input extends object, $Defaults extends object> = {
  [$Key in keyof $Defaults]:
    $Key extends keyof $Input ? $Input[$Key] : $Defaults[$Key]
}

// Note: `extends Config` is not needed but
// does help ensure that the type is a subtype
// of `Config` which it should be.

interface ConfigDefaults extends Config {
  foo: 'some_default_foo'
  qux: 99
}

// Note: we can improve the type of our runtime default
// config by using our new explicit defaults type.

const defaultConfig: ConfigDefaults = {
  foo: 'some_default_foo',
	qux: 99
}

declare const create:
  <const $ConfigInit extends ConfigInit>(configInit?: $ConfigInit) =>
    WithDefaults<$ConfigInit, ConfigDefaults>

const config0 = create({})
const config1 = create({ foo: 'baz' })
const config2 = create({ qux: 2 })
```

Now we get these types:

```ts
type config0 = {
  foo: 'some_default_foo' // default value at type level
  qux: 99 // default value at type level
}

type config1 = {
  foo: 'baz'
  qux: 99 // default value at type level
}

type config2 = {
  foo: 'some_default_foo'
  qux: 2
}
```

Pretty good! But there's still a problem. Consider when no argument is given:

```ts
const config = create()
```

TypeScript infers the type parameter `$ConfigInit` to be its constraint `ConfigInit` which is `Partial<Config>` which from the point of view of our utility type looks like the user has provided input for each property. Therefore we get this undesired type:

```ts
type config = {
  foo: string | undefined
  qux: number | undefined
}
```

What we actually want is for `create()` to return the same type as `create({})`.

A first attempt to solve this might try to leverage the type parameter default feature of TypeScript:

```ts
declare const create:
  <const $ConfigInit extends ConfigInit = {}>
    (configInit?: $ConfigInit) =>
      WithDefaults<$ConfigInit, ConfigDefaults>

const config = create()
```

And indeed looking at the type, we appear to have achieved our goal:

```ts
type config = {
  foo: 'some_default_foo'
  qux: 99
}
```

However, there is a fatal developer experience flaw here. If the user attempts to trigger autocomplete like so:

```ts
const config = create({|})
//                     ^ | User wants to trigger autocomplete here
//                       | to see the available properties.
```

TypeScript will show nothing because it thinks the type is `{}` rather than our constraint of `ConfigInit` 😔.  We must find another way.

We can use a conditional type in our return type to check if the type still equals our constraint. We do that by seeing if the constraint _extends_ the type parameter. If it does, it means that our type parameter is no more specific than it. The only way that could reasonably happen is if the user provided no argument (there is an esoteric edge case here that we can ignore).

Here's how it looks:

```ts
declare const create:
  <const $ConfigInit extends ConfigInit = {}>
    (configInit?: $ConfigInit) =>
      ConfigInit extends $ConfigInit
//    ^^^^^^^^^^ | IMPORTANT: This is NOT the type parameter, but
//               | the constraint. As stated above we check if its
//               | _assignable_ to the type parameter indicating that
//               | it did not change at all.
        ? ConfigDefaults 
//        ^^^^^^^^^^^^^^ | If the user provided no arguments then we
//                       | can just return the default type as-is.
        : WithDefaults<$ConfigInit, ConfigDefaults>
//        ^^^^^^^^^^^... | Otherwise, like before, we apply
//                       | the defaults to the inferred type
//                       | of value given by the user.

const config0 = create()
const config1 = create({})
const config2 = create({ qux: 2 })
const config3 = create({ foo: 'baz' })
```

Now every case works how we want <3.

```ts
type config0 = { foo: 'some_default_foo'; qux: 99 }
type config1 = { foo: 'some_default_foo'; qux: 99 }
type config2 = { foo: 'some_default_foo'; qux: 2 }
type config3 = { foo: 'baz'; qux: 99 }
```

And that's it!

Here's the code in full:   

```ts
interface Config {
  foo: string
  qux: number
}

type ConfigInit = Partial<Config>

const defaultConfig: Config = {
  foo: 'bar',
  qux: 1
}

const create =
  <const $ConfigInit extends ConfigInit>
    (configInit?: $ConfigInit):
      ConfigInit extends $ConfigInit
        ? ConfigDefaults 
        : WithDefaults<$ConfigInit, ConfigDefaults> => {
          return {
            ...defaultConfig,
            ...configInit,
          } as any
        }

const config0 = create()
const config1 = create({})
const config2 = create({ qux: 2 })
const config3 = create({ foo: 'baz' })
```

And here's a [TypeScript playground link](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAyglgWzAGzgMxAHgCoD4oC8UA3lANoD6UcAdlANYQgD2aU2AugFzuUdQBfKADISAgFDjQkKAHU4wABYARCGgCGAV2TAAzpgAkASRphNwKBAAewCDQAmuqMwBGAKwgBjYABooB1Q1tPUsbO0dndy9gfCJicShyAwBpJmo6RhY2ALUtHV1uBMT-VJBQ2wcnTNZ-EzMLAH5a03MyFKZ+Hhyg-LbSjnEJcVpbACcNT2gAYWYaNDgAc0C8kOsKiJm5xZIitGZmHgByXWYECAp7XOCKPeZDooBHTSseAE5XwclPWd0LS57gJt5gseEDtnFdvsjiczhcrjobvtDj5Hs83h8hiMION1JMoGCFjtErceL9RrQFqiXlAaJoEC5sZ8pOBprNgSYFIQoAAFdSjYBwdTITAE3BfH4WTyjCDqWyEIqYb40X7+AkcixrcJONU0BRi4pQAAUSvZuuADS6OoUAEouEUDVaNWFKqq2Yt1faDVAmgTlsEnJ6DTx4EhUBhMPIlH78oZHX5ffC9LhYvh4l6vdLgJpRnQ0+mvQA6Iv-FYElH5wtFk3us3liuCKDqJzqGggQPFIZKlXVhYABi5UpltkN1vEXclboWAEYB9LZRBDcQBKPx1AewAmWdDhekJ7UzfLscSteTgDMW-ni6gJKghxc6gAXodBNagA).

Thank's for reading.


--

If you liked this article, or didn't, I've love to know why on [Bluesky](https://bsky.app/profile/kuhrt.me) or however you want to get in touch.
