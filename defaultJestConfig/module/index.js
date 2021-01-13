import { installPlugin } from '1log';
import { isObservable } from 'rxjs';
import { observablePlugin } from '../..';

expect.addSnapshotSerializer({
  test: isObservable,
  serialize: () => `[Observable]`,
});
installPlugin(observablePlugin);
