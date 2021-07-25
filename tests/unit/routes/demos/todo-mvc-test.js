import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | demos/todo-mvc', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:demos/todo-mvc');
    assert.ok(route);
  });
});
