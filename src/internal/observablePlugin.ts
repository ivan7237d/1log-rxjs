import {
  addNumberedBadge,
  excludeFromTimeDelta,
  includeInTimeDelta,
  increaseStackLevel,
  logPalette,
  PluginLogger,
  pluginSymbol,
  PluginType,
  ProxyPlugin,
} from '1log';
import { pipe } from 'antiutils';
import { Observable, Operator, Subscriber, TeardownLogic } from 'rxjs';

/**
 * For an observable, logs its creation, subscribes, unsubs, nexts, errors, and
 * completions.
 */
export const observablePlugin: ProxyPlugin = {
  [pluginSymbol]: PluginType.Proxy,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scope: (value: any) =>
    value !== null && value !== undefined && value.constructor === Observable,
  transform: (log) => <T>(value: Observable<T>): Observable<T> =>
    value.lift(
      new LogObservableOperator(
        log,
        addNumberedBadge('subscribe', logPalette.green),
      ),
    ),
};

class LogObservableOperator<T> implements Operator<T, T> {
  constructor(
    private log: PluginLogger,
    private addSubscribeBadge: (log: PluginLogger) => PluginLogger,
  ) {}

  call = excludeFromTimeDelta(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (subscriber: Subscriber<T>, source: any): TeardownLogic => {
      const logWithSubscribe = this.addSubscribeBadge(this.log);
      logWithSubscribe([], subscriber);
      const logObservableSubscriber = new LogObservableSubscriber(
        subscriber,
        logWithSubscribe,
      );
      return pipe(
        () => source.subscribe(logObservableSubscriber),
        includeInTimeDelta,
        increaseStackLevel,
      )();
    },
  );
}

class LogObservableSubscriber<T> extends Subscriber<T> {
  addNextBadge: (log: PluginLogger) => PluginLogger;

  constructor(
    destination: Subscriber<T>,
    private logWithSubscribe: PluginLogger,
  ) {
    super(destination);
    this.addNextBadge = addNumberedBadge('next', logPalette.yellow);
  }

  protected _next = excludeFromTimeDelta((value: T) => {
    this.addNextBadge(this.logWithSubscribe)([], value);
    pipe(
      () => this.destination.next?.(value),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _error = excludeFromTimeDelta((error: any) => {
    this.logWithSubscribe([{ caption: `error`, color: logPalette.red }], error);
    pipe(
      () => this.destination.error?.(error),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  protected _complete = excludeFromTimeDelta(() => {
    this.logWithSubscribe([{ caption: `complete`, color: logPalette.orange }]);
    pipe(
      () => this.destination.complete?.(),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  unsubscribe = excludeFromTimeDelta((): void => {
    if (!this.closed) {
      this.logWithSubscribe([
        { caption: `unsubscribe`, color: logPalette.purple },
      ]);
      pipe(() => super.unsubscribe(), includeInTimeDelta, increaseStackLevel)();
    }
  });
}
