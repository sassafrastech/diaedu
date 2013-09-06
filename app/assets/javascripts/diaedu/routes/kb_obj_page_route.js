Discourse.KbObjPageRoute = Discourse.Route.extend({
  model: function(params) {
    // on first load, create empty shell that will be updated by setupController
    return Discourse.KbObjPage.create({page_id: params.page_id, filter_params: params.filter_params});
  },

  setupController: function(controller, model) {
    // setup promise variables for multiple loading processes
    var modelLoaded = $.Deferred();
    var filterLoaded = $.Deferred();

    // let the view know we are loading
    controller.set('loading', true);

    // pass the data type to the controller
    var data_type = this.modelFor('kb_obj');
    controller.set('data_type', data_type);

    // if the model is just a shell, populate it
    controller.set('model', null);
    // start fetch and get promise
    Discourse.KbObjPage.find(data_type, model.page_id, model.filter_params).then(function(loaded){
      controller.set('model', loaded);
      modelLoaded.resolve();
    }, function(e) {
      console.log("FETCH ERROR:", e.message)
    });

    // get filter types, one for each filter block
    var filterTypes = data_type.get('filterTypes');

    // if filter set matches current filter_params, no need to change it
    var currentFilterSet = controller.get('filterSet');
    if (currentFilterSet && currentFilterSet.get('filterParams') == model.filter_params) {

      // in this case, resolve the promise so the loading indicator doesn't hang
      filterLoaded.resolve();

    } else {

      // if we get in here, we do need to rebuild the filter block, so do it
      controller.set('filterSet', null);
      
      // start fetch and get promise
      Discourse.KbFilterSet.generate(data_type, filterTypes, model.filter_params).then(function(filterSet){
        controller.set('filterSet', filterSet);
        console.log('RESOLVING FILTER LOADED');
        filterLoaded.resolve();
      }, function(e) {
        console.log("FETCH ERROR:", e.message)
      });
    }

    // when everything is loaded, turn off the indicator
    $.when(modelLoaded, filterLoaded).done(function() { controller.set('loading', false); });
  },

  renderTemplate: function() {
    this.render('diaedu/templates/kb_objs/index');
  },
    
  serialize: function(model) {
    return {data_type: this.modelFor('kb_obj').name, page_id: model.page_id, filter_params: model.filter_params};
  }
});
