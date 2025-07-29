---
title: Deno, WASM and Rust projects with GitHub Actions
date: 2022-07-05
tags:
- deno
- wasm
- rust

---

Presenting a set of template Rust, WASM and Deno projects [on GitHub](https://github.com/orgs/flowscripter/repositories?q=template)
which make use of GitHub [Actions](https://github.com/flowscripter/.github/tree/v1/actions) and [Workflows](https://github.com/flowscripter/.github/tree/v1/workflow-templates) for continuous integration.

I've [previously outlined](/posts/migrate-to-deno) my reasons for evaluating Rust and Deno. Using these technologies,
I am looking to achieve:

* A scriptable high-level layer ([Deno REPL](https://deno.land/manual/tools/repl#read-eval-print-loop)) controlling a performant lower-level core (Rust).
* A single executable binary via [Deno Compile](https://deno.land/manual/tools/compiler).
* Cross platform executables via cross-compilation support for [Deno](https://deno.land/manual/tools/compiler#cross-compilation) and [Rust](https://rust-lang.github.io/rustup/cross-compilation.html).
* Ability to dynamically load and run additional logic after installation via Deno's support for the [Javascript import() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
* Agnostic support for running as an OS process or in a browser runtime via Deno's [web platform APIs](https://deno.land/manual/runtime/web_platform_apis) and the ability to compile [Rust to WASM](https://rustwasm.github.io/docs/book/).
* Simple project scaffolding via Deno's stated [goal](https://deno.land/manual/introduction#goals) to _"provide built-in tooling to improve developer experience"_.

I wanted to see if these could all be achieved using free SaaS tooling for continuous integration including:
* code analysis
* automated dependency updates
* automated unit testing and integration/acceptance testing
* automated semantic releases
* automatically generated API documentation

I created the template projects and GitHub workflow and actions discussed here to see if the technologies could deliver on
their promises and thus achieve my aims.

<!--more-->

I should state that I defaulted to using GitHub simply because I have been using it for several years now.
Beyond recent FOSS concerns in the [news](https://sfconservancy.org/blog/2022/jun/30/give-up-github-launch/) I haven't discovered any functional deficiencies which have caused me to look elsewhere.

## Features

Before getting into details (and the inevitable pain points), some of the feature highlights I've managed to achieve are:

* A [single executable](https://github.com/flowscripter/template-deno-executable/releases) available for Linux, MacOS and Windows with the same functionality also [running in a browser](https://flowscripter.github.io/template-deno-webapp/).
* [Instrumented test coverage analysis](https://app.codecov.io/gh/flowscripter)
* Working example projects with GitHub actions for testing, compiling, versioning and releasing for:
  * Rust
  * Deno
  * Rust + Deno via FFI Bindings
  * Rust + Deno via WASM
* Automated PRs, testing, merging, versioning and releasing for internal and 3rd party dependencies
* Automatically updated API documentation

## Repositories

The GitHub repositories involved in this effort are as follows:

### "Application" Projects

* [flowscripter/template-deno-executable](https://github.com/flowscripter/template-deno-executable): Project template for a Deno executable.
* [flowscripter/template-deno-webapp](https://github.com/flowscripter/template-deno-webapp): Project template for a Deno based webapp with Deno and Rust based WASM library dependencies.

### "Simple Library" Projects

* [flowscripter/template-deno-library](https://github.com/flowscripter/template-deno-library): Project template for a Deno library.
* [flowscripter/template-rust-library](https://github.com/flowscripter/template-rust-library): Project template for a Rust library.

### "Glue Library" Projects

* [flowscripter/template-deno-rust-library](https://github.com/flowscripter/template-deno-rust-library): Project template for a Rust library with Deno FFI bindings.
* [flowscripter/template-wasm-rust-library](https://github.com/flowscripter/template-wasm-rust-library): Project template for a Rust library compiled to WASM.
* [flowscripter/template-deno-wasm-rust-library](https://github.com/flowscripter/template-deno-wasm-rust-library): Project template for a Rust library compiled to WASM exposed as a Deno module.

### "CI" Projects

* [flowscripter/.github](https://github.com/flowscripter/.github): GitHub Actions and Workflow Templates

## A picture is worth a 1000 words... or maybe its just confusing...

It's big and complex, but I hope the following describes things visually. It shows the projects (together with their
artifacts and inter-dependencies) and various good and bad things to note.

Click on it to open in a larger form.

[{{< figure src="images/flowscripter-ci.png" caption="Flowscripter CI - click to enlarge" width="50%">}}](images/flowscripter-ci.svg)

## Eclectic Mix of Workarounds

Beyond some outstanding issues outlined further below, there were a few things I discovered which are worth noting:

### .github v1 branch

As far as I am aware, the best approach to managing versioning of GitHub Actions in your own `.github` repository without publishing them
is to use branches for versioning.

Each time I push a new commit to [flowscripter/.github](https://github.com/flowscripter/.github) which involves an Action fix, I re-create the branch `v1` on the `.github` repository so that the updated Action implementation will be used by dependent repositories.

As an example, the reference to the Action `release_deno_library` in the [template-deno-library](https://github.com/flowscripter/template-deno-library/blob/main/.github/workflows/release-deno-library.yml#L20) project is:

`flowscripter/.github/actions/release-deno-library@v1`

### GitHub Pages to host WASM library releases

I used GitHub Pages to host a demo of the webapp.

I also ended up using it as a poor-man's "artifact repository" for hosting pure Javascript Modules which include WASM files. I tried solutions like [esm.sh](https://esm.sh) and
[unpkg.com](https://unpkg.com) however:

* These require opting back into the NodeJS+NPM package ecosystem (something I was trying to opt OUT OF by using Deno)
* It seemed there was nothing available which supported serving WASM files with the mime-type expected by Deno when it fetches WASM files within the modules created with [wasm-pack](https://github.com/rustwasm/wasm-pack).

### Reliance on Node and NPM

The [semantic-release](https://semantic-release.gitbook.io/semantic-release/) project is excellent.
However it is written using Node and NPM. I'd love to find GitHub Actions which fully wrap this functionality or a
single executable which doesn't require an `npm install` which kind of goes against the grain when trying to migrate to Deno...

Following on from this, the semantic release plugin [@qiwi/semantic-release-gh-pages-plugin](https://github.com/qiwi/semantic-release-gh-pages-plugin) expects the project being released to be
Node based and therefore expects a `package.json` file to exist in the repository.
Therefore, as part of releasing a WASM compiled library to GitHub pages, I need to:
* perform an `npm install` so that the `@qiwi/semantic-release-gh-pages-plugin` works
* remove the generated `package.json` BEFORE the [semantic-release-rust](https://github.com/kettleby/semantic-release-rust) tool is used to perform a Cargo publish (Cargo doesn't like files which aren't in Git when publishing).

The fact that this is a workaround for publishing to GitHub Pages which is in itself a workaround for hosting WASM library releases really does bite...

### Git Update of Main Branch

I wanted to apply branch permissions for ALL users, including administrators of the repositories. 

However, for Rust based repositories, the release number needs to be set in the `cargo.toml` file when performing the release from the `main` branch.

To achieve this, I needed the GitHub Action to be able to push directly to the `main` branch.

Thus I needed a Personal Access Token which will **only** work if administrators (i.e. myself) ARE NOT included in branch permissions...

### Bleeding Edge

Whilst writing this blog entry, the Actions making use of [deno_bindgen](https://github.com/denoland/deno_bindgen) stopped working due to this issue:

https://github.com/denoland/deno_bindgen/issues/80

If you play with unstable APIs you're gonna get hurt...

## Outstanding Issues

The items I discovered which are blockers for my stated aims are as follows:

### Dynamic Import of WASM based Javascript Modules

As far as I can tell, I can't use dynamic imports (i.e. the [Javascript import() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)) with WASM based Javascript Modules 
until this is implemented: https://github.com/denoland/deno/issues/2552

### Deno Compile support for dynamic imports

Deno supports:

* compilation to a single binary executable `\(^ヮ^)/`
* dynamic imports i.e. the [Javascript import() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) `\(^ヮ^)/`

However it doesn't support both of these at the same time: https://github.com/denoland/deno/issues/8655 `(>_<)`

### deno_bindgen updated to support the latest unstable Deno API

I mentioned this earlier as a downside to being on the bleeding edge: https://github.com/denoland/deno_bindgen/issues/80

### Automatic Rust API docs for projects using `deno_bindgen`

Glue technologies like [deno_bindgen](https://github.com/denoland/deno_bindgen/issues/72) are excellent, however I seem to be 'stuck' with this: https://github.com/denoland/deno_bindgen/issues/72

Without a change here, my automatically generated docs at https://docs.rs will continue to throw a [massive error](https://docs.rs/crate/flowscripter_template_deno_rust_library/1.0.6/builds/556217).

### Deno signing and notarisation support

It's not great delivering a single binary executable if the OS is reticent to run it... https://github.com/denoland/deno/issues/11154

### GitHub Actions support for Apple Silicon

Not major, but until this is available I can't fully implement cross-platform CI: https://github.com/actions/virtual-environments/issues/2187

## Feedback

If anyone is interested in this and has actually read this far, I would love some feedback on:

* suggested improvements or recommendations
* any issues discovered
