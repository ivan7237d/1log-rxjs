# 1log-rxjs

[![npm version](https://img.shields.io/npm/v/1log-rxjs.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/1log-rxjs)
[![gzip size](https://badgen.net/bundlephobia/minzip/1log-rxjs?color=green)](https://bundlephobia.com/result?p=1log-rxjs)
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/1log-rxjs)](https://bundlephobia.com/result?p=1log-rxjs)
[![types](https://img.shields.io/npm/types/1log-rxjs?color=brightgreen)](https://www.npmjs.com/package/1log-rxjs)
[![coverage status](https://coveralls.io/repos/github/ivan7237d/1log-rxjs/badge.svg?branch=master)](https://coveralls.io/github/ivan7237d/1log-rxjs?branch=master)

[1log](https://github.com/ivan7237d/1log) plugin for logging [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) observables. Please see an article _[Log and test RxJS observables with 1log](https://www.obvibase.com/dev-blog/log-and-test-rxjs-observables-with-1log)_ for an introduction.

## Installing

> :bulb: TIP
>
> If you just need to quickly install the library to play around with it, install packages `1log` and `1log-rxjs` and add the following imports:
>
> ```ts
> import '1log/defaultConfig';
> import '1log-rxjs/defaultConfig';
> import { log } from '1log';
> ```

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

   // Add a serializer for subscribers.
   expect.addSnapshotSerializer({
     test: (value) => value instanceof Subscriber,
     serialize: () => `[Subscriber]`,
   });

   installPlugins(observablePlugin);
   ```

## Usage

```ts
import { log } from '1log';
import { timer } from 'rxjs';

timer(500).pipe(log).subscribe();
```

<img src="https://github.com/ivan7237d/1log-rxjs/raw/master/images/basic-adjusted.png" alt="screenshot">

> :bulb: TIP
>
> This plugin logs `Observable`s but not instances of classes inheriting from `Observable`. If you need to log a subject, first convert it to an observable using `asObservable` method.

> :bulb: TIP
>
> In Chrome, you can right-click an observable or a subscriber from a create/subscribe log message and say "Store as global variable". The object will be stored with a name like `temp1`, and you'll be able to run `temp1.subscribe()` (observable) or `temp1.next(yourValue)` / `temp1.error(yourError)` / `temp1.complete()` (subscriber).

## Usage in tests

```ts
import { getMessages, log } from '1log';
import { timer } from 'rxjs';

test('timer', () => {
  timer(500).pipe(log).subscribe();
  jest.runAllTimers();
  expect(getMessages()).toMatchInlineSnapshot(`
    [create 1] +0ms [Observable]
    [create 1] [subscribe 1] +0ms [Subscriber]
    [create 1] [subscribe 1] [next] +500ms 0
    [create 1] [subscribe 1] [complete] +0ms
    · [create 1] [subscribe 1] [unsubscribe] +0ms
  `);
});
```

> :bulb: TIP
>
> In older versions of RxJS you had to use `TestScheduler` in tests, but since version 6.2.1, RxJS works well with Jest's fake time.

---

[Contributing guidelines](https://github.com/ivan7237d/antiutils/blob/master/.github/CONTRIBUTING.md)
