'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { installPlugins } = require('1log');
const { Observable, Subscriber } = require('rxjs');
const { observablePlugin } = require('../..');

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
