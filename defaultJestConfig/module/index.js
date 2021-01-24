import { installPlugins } from '1log';
import { Observable } from 'rxjs';
import { observablePlugin } from '../..';

expect.addSnapshotSerializer({
  test: (value) =>
    value !== null && value !== undefined && value.constructor === Observable,
  serialize: () => `[Observable]`,
});
installPlugins(observablePlugin);
