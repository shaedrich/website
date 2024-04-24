import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Application', function (hooks) {
  setupApplicationTest(hooks);

  test('home page', async function (assert) {
    await visit('/');

    assert.dom('.post-card').exists();
  });
});
