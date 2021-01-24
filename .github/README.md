# 1log-rxjs

[![npm version](https://img.shields.io/npm/v/1log-rxjs.svg?style=flat&color=brightgreen)](https://github.com/ivan7237d/1log-rxjs)
[![gzip size](https://badgen.net/bundlephobia/minzip/1log-rxjs?color=green)](https://bundlephobia.com/result?p=1log-rxjs)
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/1log-rxjs)](https://bundlephobia.com/result?p=1log-rxjs)

[1log](https://github.com/ivan7237d/1log) plugin for logging [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) observables.

## Installing

Assuming you have RxJS installed,

1. [Install 1log](https://github.com/ivan7237d/1log#installing).

2. Install the npm package:

   ```
   yarn add 1log-rxjs
   ```

   or

   ```
   npm install 1log-rxjs --save
   ```

3. Where you import `'1log/defaultConfig'`, also `import '1log-rxjs/defaultConfig'`, which runs `installPlugins(statePlugin)`. Where you import `'1log/defaultJestConfig'`, also `import '1log-rxjs/defaultJestConfig'`, which is the same as importing a file with the following contents:

   ```ts
   import { installPlugins } from '1log';
   import { observablePlugin } from '1log-rxjs';
   import { Observable } from 'rxjs';

   // Add a serializer for observables.
   expect.addSnapshotSerializer({
     test: (value) =>
       value !== null &&
       value !== undefined &&
       value.constructor === Observable,
     serialize: () => `[Observable]`,
   });

   installPlugins(observablePlugin);
   ```

## Usage

```ts
import { log } from '1log';
import { timer } from 'rxjs';

timer(500).pipe(log).subscribe();
```

<img src="https://github.com/ivan7237d/1log-rxjs/raw/master/images/basic.png" alt="screenshot">

## Usage in tests

```ts
import { getMessages, log } from '1log';
import { timer } from 'rxjs';

test('timer', () => {
  timer(500).pipe(log).subscribe();
  jest.runAllTimers();
  expect(getMessages()).toMatchInlineSnapshot(`
    [create 1] +0ms [Observable]
    [create 1] [subscribe 1] +0ms
    [create 1] [subscribe 1] [next] +500ms 0
    [create 1] [subscribe 1] [complete] +0ms
    · [create 1] [subscribe 1] [unsubscribe] +0ms
  `);
});
```

---

[Contributing guidelines](https://github.com/ivan7237d/antiutils/blob/master/.github/CONTRIBUTING.md)
