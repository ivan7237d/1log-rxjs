import '1log/defaultJestConfig';
import { installPlugins } from '1log';
import { Observable, Subscriber } from 'rxjs';
import { observablePlugin } from './src';

expect.addSnapshotSerializer({
  test: (value) =>
    value !== null && value !== undefined && value.constructor === Observable,
  serialize: () => `[Observable]`,
});
expect.addSnapshotSerializer({
  test: (value) => value instanceof Subscriber,
  serialize: () => `[Subscriber]`,
});

installPlugins(observablePlugin);
