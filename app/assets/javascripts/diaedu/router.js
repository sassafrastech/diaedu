Discourse.Route.buildRoutes(function() {
  var router = this;
  this.route('kb_home', {path: '/kb'});
  this.resource('kb_obj', {path: '/kb/:data_type'}, function() {
    this.resource('kb_obj_page', {path: '/:filter_params/page/:page_id'}, function() {
      this.route('index', {path: '/'});
    });
  });

  this.route('kb_filter_set');
});
