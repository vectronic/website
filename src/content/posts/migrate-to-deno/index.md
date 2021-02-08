---
title: Migrate to Deno?
date: 2021-01-08
tags:
- deno
- flowscripter

---

The plan for [Flowscripter](https://github.com/flowscripter) has always included the following goals:

- Use TypeScript.
- Use dynamic import of ES modules.
- Rely on existing module dependency directives to auto-install plugin dependencies i.e. not inventing a new module dependency framework.
- Providing Flowscripter as a single downloadable binary with no need for pre-installed dependencies e.g. Node.js, ffmpeg.
- Support native extensions written in Rust.

<!--more-->

To meet these requirements Flowscripter started with:

- TypeScript running on Node.js.
- Requiring Node.js 10.x onwards which had the first experimental support for ES modules.
- The [esm-dynamic-plugins](https://github.com/flowscripter/esm-dynamic-plugins) library made use of the [npmjs.com repository](https://www.npmjs.com) and Node.js `package.js` definitions.
  For browser runtimes, using [https://unpkg.com](https://unpkg.com) was the intention.
- The intention was to use [nexe](https://github.com/nexe/nexe) to build a single distributable binary.
- The intention was to use NodeJS N-API C++/C addon support and develop Rust based native add-ons as per this [tutorial](https://blog.logrocket.com/rust-and-node-js-a-match-made-in-heaven/).

Of course with the above technologies, came the usual (and painful) need to configure and debug a build toolchain providing TypeScript, a test framework ([Jest](https://jestjs.io)),
a packaging system ([RollupJs](https://rollupjs.org/guide/en/)) and a documentation generator ([TypeDoc](https://typedoc.org)).

More difficult was the need for these
tools to support ES modules natively (or via transpiling) and for the Flowscripter ES Modules to depend on existing non-ES module NodeJS packages ....
I think I spent just as much time getting the toolchain working together as I did writing 'actual code'...

Although, the Flowscripter 'actual code' it still in a state of infancy, the main concerns so far with the above are the following:

- Making use of the NodeJS `package.json` and [npm repository](https://www.npmjs.com) either necessitated:
    - Calling out to a locally installed `npm` thereby defeating the purpose of a single installable binary.
    - Importing the underlying `npm` implementation: a horrible rabbit hole I discovered and then exited!
    - Implementing support from scratch - which was done but with some severe limitations (see [here](https://github.com/flowscripter/cli-framework/blob/master/src/plugin/command/NpmPackageUtils.ts#L34-L45) and
      [here](https://github.com/flowscripter/esm-dynamic-plugins/issues/281)).
- Despite the excellence of nexe, support for native addons, externally sourced modules and ESM modules still seems to be work in progress... see [here](https://github.com/nexe/nexe/issues/811), [here](https://github.com/nexe/nexe/issues/639) and [here](https://github.com/nexe/nexe/issues/815).

Around the time of starting out on Flowscripter I had seen the [announcement of Deno](https://www.youtube.com/watch?v=M3BM9TB-8yA).
Obviously bleeding edge would have been an understatement at that point...

However, since then, time has passed (mostly working on the toolchain issues mentioned above, or more importantly on actual paid work....) and Deno v1 has been released.

It's tempting. Let's review given the initially stated Flowscripter goals and the current concerns for the Node.js based implementation:

- TypeScript :white_check_mark:
- ES Modules :white_check_mark:
- [Rust plugins](https://github.com/keroxp/deno_plugin_example) :white_check_mark:
- [Compiled executables](https://deno.land/manual/tools/compiler#compiling-executables) :white_check_mark:
- [Simple dependency mechanism](https://deno.land/manual#comparison-to-nodejs) :white_check_mark:

Additionally, the support for importing a module from a URL would (hopefully) completely obviate the need for [esm-dynamic-plugins](https://github.com/flowscripter/esm-dynamic-plugins) to implement
separate a `UrlPluginRepository.ts` and `NodeModulesPluginRepository.ts`.

Of course there are arguments against Deno. These are mostly based on it's relative immaturity. Fair enough, you don't want to back the wrong horse... And also is it really ready for production?

To answer that, I'm going to take some time out to do an analysis of whether the above mentioned features can currently meet the Flowscripter goals and my concerns on the current path taken.
Findings to follow....

P.S. I'm also going to take time to make use of the fact that GitHub seems to be swallowing the CI/CD world. Hence I'm planning to port away from [npmjs.com](https://www.npmjs.com)
(well maybe with Deno this won't be relevant - any hoo...), [Travis](https://travis-ci.com) and [Renovate](https://github.com/renovatebot/renovate) and use GitHub for everything.  
