'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { installPlugins } = require('1log');
const { Observable } = require('rxjs');
const { observablePlugin } = require('../..');

expect.addSnapshotSerializer({
  test: (value) =>
    value !== null && value !== undefined && value.constructor === Observable,
  serialize: () => `[Observable]`,
});
installPlugins(observablePlugin);
