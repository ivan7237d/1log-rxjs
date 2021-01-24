import '1log/defaultJestConfig';
import { installPlugins } from '1log';
import { Observable } from 'rxjs';
import { observablePlugin } from './src';

expect.addSnapshotSerializer({
  test: (value) =>
    value !== null && value !== undefined && value.constructor === Observable,
  serialize: () => `[Observable]`,
});

installPlugins(observablePlugin);
