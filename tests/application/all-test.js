import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Application', function (hooks) {
  setupApplicationTest(hooks);

  test('home page', async function (assert) {
    await visit('/');

    assert.dom('.post-card').exists();
  });
});
