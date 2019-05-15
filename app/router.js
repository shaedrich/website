import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { later } from '@ember/runloop';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  init() {
    this._super(...arguments);
    this.on('routeDidChange', () => {
      later(() => window.Prism && window.Prism.highlightAll());
    });
  },
});

Router.map(function() {
  this.route('demos', function() {
    this.route('todo-mvc');
  });
});

export default Router;
