---
title: Observing TypeScript Never With Conditional With Parameter
date: 2025-04-18
---

I was surprised by something in TypeScript today regarding the combination of:

1. Type Conditional
2. Type Parameter
3. Never Type 

Here are some basic sub/super type tests with never:

```ts
type is_1_extends_never = 1 extends never ? true : false
// false
type is_never_extends_1 = never extends 1 ? true : false
// false
type is_never_extends_never = never extends never ? true : false
// true
```

No surprise (to me).

But something happens when a type parameter is introduced which I did not expect.

```ts
namespace check_is_never_extends_parameter {
	type $<p> = never extends p ? true : false

	type is_never_extends = $<1> //           never extends 1 ? true : false
	// true

	type is_never_extends_never = $<never> // never extends never ? true : false
	// true
}

namespace check_is_parameter_extends_never {
	type $<p> = p extends never ? true : false

	type is_never_extends_never = $<never> // never extends never ? true : false
	// never <------------------------------------------------------------------ ???

	type is_1_extends_never = $<1> //         1 extends never ? true : false
	// false
}

namespace check_is_1_extends_parameter {
	type $<p> = 1 extends p ? true : false

	type is_1_extends_never = $<never> // 1 extends never ? true : false
	// false

	type is_1_extends_1 = $<1> //         1 extends 1 ? true : false
	// true
}

namespace check_is_parameter_extends_1 {
	type $<p> = p extends 1 ? true : false

	type is_1_extends_never = $<never> // 1 extends never ? true : false
	// never <---------------------------------------------------------- ???

	type is_1_extends_1 = $<1> //         1 extends 1 ? true : false
	// true
}
```

The difference is that:
1. `never` given as a type argument
2. ... to a conditional type
3. ... where the respective parameter is referenced in the sub-type-position of the conditional (`x (<-- sub-type position) extends y (<-- super-type position)`)
4. ... evaluates to `never`
5. ... instead of the conditional being evaluated (in this case, `true`/`false`).

I find this behavior counterintuitive.

Perhaps there is a good reason for it, but to me right now it feels like a bug.

I am using TypeScript version `5.8.3`.

Here is a [TypeScript Playground](https://www.typescriptlang.org/play/?#code/HYQwtgpgzgDiDGEAE8AWF4GsD6BLK2wEAbhAE7YQAeALhMACYFxngR1lIDeAUAJA0AnjGQASADwwAfEgC8SIqU7U6jKEhhIA-EhpkArsgBcSAGYgANlAg9+QkUnyES5SrXpM5SCQEYZAen8kYJDQhRdldzUkH21dA2MzS2t+QPjDWwFhZCdFVxUPAjzOeQligKDipALoqp09QyQTcysbPjSGmwBfW1BIWARkNAwcJxY2DjdVJmclbjts70kZeU0azzr0xJaUhYdciKnC2fIvMoiK8Ln19U3OpqTW1MqIpHEAWk+v75-fv-+AYCgdotFpMvYcgQfEc1CcSks-Eg0mEQrEbldTvUEg8dm00rieD0eH1oHBECh0Fg8FCYTNxpAOPMsg4JNIvGiop5NFjGs1kjY9pDsNCbnCzuJykighzprdXjztvzno9dsyhSLOVDxYjkSiYtVNfqFTile0gp1Cb02ANycMqWMQKwGflNcKmRClmzVgbZUatianoLHDTRVVShKLlL9ei7ti+U8zRjOB8gam0+m-iCwUGnBrZW7wzqgnro4bYsb4ylExaukA).
