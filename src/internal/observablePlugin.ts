import {
  addNumberedBadge,
  excludeFromTimeDelta,
  GlobalPlugin,
  globalPluginSymbol,
  includeInTimeDelta,
  logPalette,
  PluginLogger,
} from '1log';
import { applyPipe } from 'antiutils';
import {
  isObservable,
  Observable,
  Operator,
  Subscriber,
  TeardownLogic,
} from 'rxjs';

/**
 * If the piped value is an observable, logs its creation, subscribes, unsubs,
 * nexts, errors, and completions.
 */
export const observablePlugin: GlobalPlugin = {
  type: globalPluginSymbol,
  proxy: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    scope: (value) => isObservable(value),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    transform: (log) => <T>(value: Observable<T>): Observable<T> =>
      value.lift(new LogObservableOperator(log)),
  },
};

class LogObservableOperator<T> implements Operator<T, T> {
  constructor(private log: PluginLogger) {}

  call = excludeFromTimeDelta(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (subscriber: Subscriber<T>, source: any): TeardownLogic => {
      const logWithSubscribe = applyPipe(
        this.log,
        addNumberedBadge('subscribe', logPalette.green),
      );
      const increaseStackLevel = logWithSubscribe([]);
      const logObservableSubscriber = new LogObservableSubscriber(
        subscriber,
        logWithSubscribe,
      );
      return applyPipe(
        () => source.subscribe(logObservableSubscriber),
        includeInTimeDelta,
        increaseStackLevel,
      )();
    },
  );
}

class LogObservableSubscriber<T> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    private logWithSubscribe: PluginLogger,
  ) {
    super(destination);
  }

  protected _next = excludeFromTimeDelta((value: T) => {
    const increaseStackLevel = this.logWithSubscribe(
      [{ caption: `next`, color: logPalette.yellow }],
      value,
    );
    applyPipe(
      () => this.destination.next?.(value),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _error = excludeFromTimeDelta((error: any) => {
    const increaseStackLevel = this.logWithSubscribe(
      [{ caption: `error`, color: logPalette.red }],
      error,
    );
    applyPipe(
      () => this.destination.error?.(error),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  protected _complete = excludeFromTimeDelta(() => {
    const increaseStackLevel = this.logWithSubscribe([
      { caption: `complete`, color: logPalette.orange },
    ]);
    applyPipe(
      () => this.destination.complete?.(),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  unsubscribe = excludeFromTimeDelta((): void => {
    if (!this.closed) {
      const increaseStackLevel = this.logWithSubscribe([
        { caption: `unsubscribe`, color: logPalette.purple },
      ]);
      applyPipe(
        () => super.unsubscribe(),
        includeInTimeDelta,
        increaseStackLevel,
      )();
    }
  });
}
