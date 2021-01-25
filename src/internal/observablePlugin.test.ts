import { badgePlugin, getMessages, log } from '1log';
import { applyPipe } from 'antiutils';
import { EMPTY, from, throwError, timer } from 'rxjs';
import { catchError, concatAll } from 'rxjs/operators';

test('basic usage', () => {
  timer(500)
    .pipe(log)
    .subscribe(
      log(badgePlugin('next')),
      log(badgePlugin('error')),
      log(badgePlugin('complete')),
    );
  jest.runAllTimers();
  expect(getMessages()).toMatchInlineSnapshot(`
    [create 1] +0ms [Observable]
    [create 1] [subscribe 1] +0ms [Subscriber]
    [create 1] [subscribe 1] [next] +500ms 0
    · [next] +0ms 0
    [create 1] [subscribe 1] [complete] +0ms
    · [complete] +0ms
    · [create 1] [subscribe 1] [unsubscribe] +0ms
  `);

  throwError(42)
    .pipe(log)
    .subscribe(
      log(badgePlugin('next')),
      log(badgePlugin('error')),
      log(badgePlugin('complete')),
    );
  expect(getMessages()).toMatchInlineSnapshot(`
    [create 2] +0ms [Observable]
    [create 2] [subscribe 1] +0ms [Subscriber]
    · [create 2] [subscribe 1] [error] +0ms 42
    · · [error] +0ms 42
    · · [create 2] [subscribe 1] [unsubscribe] +0ms
  `);
});

test('multiple subscriptions', () => {
  const observable = applyPipe(from([1]), log);
  observable.subscribe();
  observable.subscribe();
  expect(getMessages()).toMatchInlineSnapshot(`
    [create 1] +0ms [Observable]
    [create 1] [subscribe 1] +0ms [Subscriber]
    · [create 1] [subscribe 1] [next] +0ms 1
    · [create 1] [subscribe 1] [complete] +0ms
    · · [create 1] [subscribe 1] [unsubscribe] +0ms
    [create 1] [subscribe 2] +0ms [Subscriber]
    · [create 1] [subscribe 2] [next] +0ms 1
    · [create 1] [subscribe 2] [complete] +0ms
    · · [create 1] [subscribe 2] [unsubscribe] +0ms
  `);
});

test('stack level', () => {
  const observable = applyPipe(
    from([[1], throwError(2)]),
    concatAll(),
    log,
    catchError(() => EMPTY),
    log,
  );
  observable.subscribe();
  expect(getMessages()).toMatchInlineSnapshot(`
    [create 1] +0ms [Observable]
    [create 2] +0ms [Observable]
    [create 2] [subscribe 1] +0ms [Subscriber]
    · [create 1] [subscribe 1] +0ms [Subscriber]
    · · [create 1] [subscribe 1] [next] +0ms 1
    · · · [create 2] [subscribe 1] [next] +0ms 1
    · · [create 1] [subscribe 1] [error] +0ms 2
    · · · [create 1] [subscribe 1] [unsubscribe] +0ms
    · · · [create 2] [subscribe 1] [complete] +0ms
    · · · · [create 2] [subscribe 1] [unsubscribe] +0ms
  `);
});
