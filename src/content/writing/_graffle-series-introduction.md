---
title: Graffle Series Introduction
date: 2024-05-08
---

I have been working on an experimental type-safe TypeScript GraphQL client that will become the next major version of `graphql-request`. I have been calling this new API _Graffle_.

Already there is a functional but unstable library available to try out. I will be writing a series of small articles about it, releasing one daily. Each article will demonstrate one aspect of the library.

Here is an outline of the series. In will be published in this order.

1. Graffle Series Introduction (you're reading it!)
1. Graffle CLI
1. Graffle Scalars and the four methods: Raw, Document, Batch, Field
1. Graffle Enums
1. Graffle Interfaces
1. Graffle Unions
1. Graffle Custom Scalars
1. Graffle Aliases
1. Graffle Directives
1. Graffle Select Utility
1. Graffle Selection Groups
1. Graffle Scalars Wildcard
1. Graffle Errors Handling
1. Graffle Constructor Options
1. Graffle Roadmap
   - Introspection Query
   - Variable Rendering
   - Relay `Input` eliding
   - Subscriptions
   - Plugins
   - Caching
   - Fragments

I'm excited to share this content with you and hear what you think about Graffle, it you would use it, what you like, what you don't.

Graffle's tagline is "Your GraphQL grappling hook". It aims to achieve these things:

1. Feature parity with GraphQL query language.
1. As type safe as possible.
1. Great DX, delightful to use.
1. Performant.
1. Simple.

My motivation and design thinking has been influenced by these projects:

- Prisma Client
- Genql

A few preemptive questions and answers:

1. Why use the `graphql-request` library to ship this project?

   I have chosen to evolve the `graphql-request` library rather than start a new project because of its existing audience and how its current form can still serve a role in the new API (the raw method).

1. When will it be stable?

   A couple weeks or months I hope. There will be many pre-releases along the way that you will be able to use.

1. What about `TypedDocumentNode` and [GraphQL Generator](https://the-guild.dev/graphql/codegen)?

   I am actually not a user of that tool and surrounding techniques. I've always felt like it would be too much hassle and just never got into it. Maybe I haven't been the audience for it. I have a lot of knowledge working with TypeScript and want a premier DX with that technology.
