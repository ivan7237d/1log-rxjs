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
import { applyPipe } from 'antiutils';
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
    this.logWithSubscribe(
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
    this.logWithSubscribe([{ caption: `error`, color: logPalette.red }], error);
    applyPipe(
      () => this.destination.error?.(error),
      includeInTimeDelta,
      increaseStackLevel,
    )();
  });

  protected _complete = excludeFromTimeDelta(() => {
    this.logWithSubscribe([{ caption: `complete`, color: logPalette.orange }]);
    applyPipe(
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
      applyPipe(
        () => super.unsubscribe(),
        includeInTimeDelta,
        increaseStackLevel,
      )();
    }
  });
}
