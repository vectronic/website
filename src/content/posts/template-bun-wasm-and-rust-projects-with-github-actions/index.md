---
title: Bun, WASM and Rust projects with GitHub Actions
date: 2025-07-29
tags:
- bun
- wasm
- rust

---

Following on from a [previously outlined move to Deno](/posts/migrate-to-deno) I've now moved to [Bun](https://bun.com) 😅

The main thing I moved **to** Deno for was a nice way to acheive:

* A single executable binary via [Deno Compile](https://deno.land/manual/tools/compiler).
* Cross platform executables via [cross-compilation support in Deno](https://deno.land/manual/tools/compiler#cross-compilation).
* Ability to dynamically load and run additional logic after installation via Deno's support for the [Javascript import() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

After a while I discovered these items don't all work well together. It came to light that dynamic loading of modules external to the compiled Deno application was not really supported: https://github.com/denoland/deno/issues/18327 Fair enough, everyone has their priorities...

I then read (but can't remember where) that Bun **does** support this. 🥳  Ok, game on!

<!--more-->

But (there is always a but...) in Bun there is no support for loading from a remote URL: https://github.com/oven-sh/bun/issues/38 Again, everyone has their priorities... 😣

So in Bun, dynamic imports can reference a local filesystem URL only. However, they CAN be loaded from a compiled executable and they can be loaded from absolute paths or paths relative to the compiled executable. To workaround lack of remote URL support, I wrote a little helper to pull remote modules locally:

https://github.com/flowscripter/dynamic-plugin-framework/blob/main/src/plugin_manager/util/PluginLoader.ts#L26-L47

after which I can import OK here:

https://github.com/flowscripter/dynamic-plugin-framework/blob/main/src/plugin_manager/util/PluginLoader.ts#L85

So we're good and I am still mostly sane!

So, after previously presenting: "a set of template Deno, Rust and WASM projects on GitHub" in [this post](/posts/template-deno-wasm-and-rust-projects-with-github-actions-ci) I am now presenting:

"a set of [template Bun, Rust and WASM projects on GitHub](https://github.com/orgs/flowscripter/repositories?q=template)" together with GitHub [Actions](https://github.com/flowscripter/.github/tree/v1/actions), [Shared Workflows](https://github.com/flowscripter/.github/tree/v1/.github/workflows) and [Template Workflows](https://github.com/flowscripter/.github/tree/v1/workflow-templates) for continuous integration.

For my use cases I am looking to achieve:

* A scriptable high-level layer (Bun TypeScript) controlling a performant lower-level core (Rust).
* A single executable binary which can be cross-compiled.
* Ability for the executable to dynamically load and run additional logic after installation via the [Javascript import() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
* Support for running as much as possible agnostically as an OS process or in a browser runtime with the ability to compile Rust to WASM.
* Simple project scaffolding via Bun's all-in-one approach

Just on that last point... turns out Bun doesn't do linting or documentation generation https://github.com/oven-sh/bun/issues/2246 There we are with priorities again... 😣 So for this I am actually still using Deno 🤪 as it "just works" (and seems to handle running on a Bun biased codebase):

* `deno fmt`
* `deno lint index.ts`
* `deno doc --html index.ts`

## Features

Before getting into details, some of the feature highlights I've managed to achieve are:

* A [single executable](https://github.com/flowscripter/template-bun-executable/releases) available for Linux, MacOS (available via brew) and Windows (available via winget) with Rust FFI and dynamic import.
* Roughly the same functionality [running in a browser](https://flowscripter.github.io/template-bun-webapp/) with WASM (dynamic import not applicable here).
* [Instrumented test coverage analysis](https://app.codecov.io/gh/flowscripter)
* Working example projects with GitHub actions for testing, compiling, versioning and releasing for:
  * Rust
  * Bun
  * Rust + Bun via FFI Bindings
  * Rust + Bun via WASM
* Automated PRs, testing, merging, versioning and releasing for internal and 3rd party dependencies
* Automatically updated API documentation

## Repositories

The GitHub repositories involved in this effort are as follows:

### "Application" Projects

* [flowscripter/template-bun-executable](https://github.com/flowscripter/template-bun-executable): Project template for a Bun executable.
* [flowscripter/template-bun-webapp](https://github.com/flowscripter/template-bun-webapp): Project template for a Bun based webapp with Bun and Rust based WASM library dependencies.

### "Simple Library" Projects

* [flowscripter/template-bun-library](https://github.com/flowscripter/template-bun-library): Project template for a Bun library.
* [flowscripter/template-rust-library](https://github.com/flowscripter/template-rust-library): Project template for a Rust library.

### "Glue Library" Projects

* [flowscripter/template-bun-rust-library](https://github.com/flowscripter/template-bun-rust-library): Project template for a Rust library with Bun FFI bindings.
* [flowscripter/template-bun-wasm-rust-library](https://github.com/flowscripter/template-bun-wasm-rust-library): Project template for a Rust library compiled to WASM exposed as a Bun module.

### "CI" Projects

* [flowscripter/.github](https://github.com/flowscripter/.github): GitHub Actions, Shared Workflows and Workflow Templates

## A picture is worth a 1000 words... or maybe its just confusing...

It's big and complex, but I hope the following describes things visually. It shows the projects (together with their
artifacts and inter-dependencies).

Click on it to open in a larger form.

[{{< figure src="images/flowscripter-ci.png" caption="Flowscripter CI - click to enlarge" width="50%">}}](images/flowscripter-ci.svg)

## Feedback

If anyone is interested in this and has actually read this far, I would love some feedback on:

* suggested improvements or recommendations
* any issues discovered
