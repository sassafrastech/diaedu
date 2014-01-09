// controller for the paginated kb obj index
Discourse.KbObjPageController = Discourse.ObjectController.extend({
  needs: ["application", "kbObj", "kbObjShowWithBreadcrumb"],

  actions: {
    // loads the specified page into the model
    changePage: function(newPage) { var self = this;
      // use the same data type and filter params
      var dataType = this.get('model.data_type');
      var filterParams = this.get('model.filter_params');

      // set the model to null so the loading indicator shows up
      self.set('model', null);

      // build objPage params
      var params = {
        dataType: dataType,
        pageNum: newPage,
        filterParams: filterParams
      };

      // start fetch and get promise
      Discourse.KbObjPage.find(params).then(function(loaded) {
        self.set('model', loaded);
      });
    }
  },

  showMode: function() {
    return this.get('controllers.application.currentPath').match(/kb_obj_show/);
  }.property('controllers.application.currentPath'),

  // if model is null, we should show the loading indicator
  loading: function() {
    return !this.get('model');
  }.property('model')

});
