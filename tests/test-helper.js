import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from 'website/app';
import config from 'website/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
