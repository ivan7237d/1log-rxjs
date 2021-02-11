<!-- README for NPM; the one for GitHub is in .github directory. -->

[![gzip size](https://badgen.net/bundlephobia/minzip/1log-rxjs?color=green)](https://bundlephobia.com/result?p=1log-rxjs)
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/1log-rxjs)](https://bundlephobia.com/result?p=1log-rxjs)
[![types](https://img.shields.io/npm/types/1log-rxjs?color=brightgreen)](https://www.npmjs.com/package/1log-rxjs)
[![coverage status](https://coveralls.io/repos/github/ivan7237d/1log-rxjs/badge.svg?branch=master)](https://coveralls.io/github/ivan7237d/1log-rxjs?branch=master)

[1log](https://github.com/ivan7237d/1log) plugin for logging RxJS observables. Different events in the lifecycle of an observable are marked with colored badges. Observables and subscriptions are assigned numbers, and these numbers let you tell which subscription a specific next/error/completion/unsub applies to. Log messages include time deltas and use indentation to show synchronous stack level. Besides logging to the console, you can use this plugin to test observables by creating snapshots of log messages in Jest tests.

Please refer to the [GitHub README](https://github.com/ivan7237d/1log-rxjs#readme) for full documentation and screenshots.
