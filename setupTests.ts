import '1log/defaultJestConfig';
import { installPlugin } from '1log';
import { isObservable } from 'rxjs';
import { observablePlugin } from './src';

expect.addSnapshotSerializer({
  test: isObservable,
  serialize: () => `[Observable]`,
});

installPlugin(observablePlugin);
