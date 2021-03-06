Discourse.KbFilterSetController = Discourse.ObjectController.extend({
  needs: 'kbObj',

  actions: {
    // handles changes to the filter set
    filterChanged: function() {

      // serialize the current filter set
      var newFilterParams = this.get('model').serialize();

      // get current data type from the kb_obj controller
      var dataType = this.get('controllers.kbObj.model');

      // build new obj page shell (objs to be fetched by obj page route)
      var objPage = Discourse.KbObjPage.create({pageId: 1, filterParams: newFilterParams})

      // transition to new filter results
      this.transitionToRoute('kbObj.filteredPage', objPage);
    }
  }
});
