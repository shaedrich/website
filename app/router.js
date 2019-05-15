import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  init() {
    this._super(...arguments);
    this.on('routeDidChange', () => {
      window.Prism && window.Prism.highlightAll();
    });
  },
});

Router.map(function() {
  this.route('demos', function() {
    this.route('todo-mvc');
  });
});

export default Router;
