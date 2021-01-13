'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { installPlugin } = require('1log');
const { isObservable } = require('rxjs');
const { observablePlugin } = require('../..');

expect.addSnapshotSerializer({
  test: isObservable,
  serialize: () => `[Observable]`,
});
installPlugin(observablePlugin);
