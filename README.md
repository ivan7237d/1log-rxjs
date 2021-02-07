<!-- README for NPM; the one for GitHub is in .github directory. -->

[![gzip size](https://badgen.net/bundlephobia/minzip/1log-rxjs?color=green)](https://bundlephobia.com/result?p=1log-rxjs)
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/1log-rxjs)](https://bundlephobia.com/result?p=1log-rxjs)
[![types](https://img.shields.io/npm/types/1log-rxjs?color=brightgreen)](https://www.npmjs.com/package/1log-rxjs)

[1log](https://github.com/ivan7237d/1log) plugin for logging RxJS observables. In addition to logging nexts, errors, and completions, this plugin creates log messages when an observable is created, subscribed, or unsubbed. When an observable is subscribed multiple times, numbered badges let you attribute each next, error, completion, or unsubscription to a specific subscription. The plugin can also be used in combination with Jest's snapshots feature to test observables by creating snapshots of log messages.

Please refer to the [GitHub README](https://github.com/ivan7237d/1log-rxjs#readme) for full documentation.
