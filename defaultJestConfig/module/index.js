import { installPlugin } from '1log';
import { observablePlugin } from '../..';

expect.addSnapshotSerializer({
  test: isObservable,
  serialize: () => `[Observable]`,
});
installPlugin(observablePlugin);
