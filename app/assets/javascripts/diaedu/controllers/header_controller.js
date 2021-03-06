Discourse.HeaderController.reopen({
  needs: "application",

  isKbActive: function() {
    return !!this.get('controllers.application.currentPath').match(/^kb/);
  }.property('controllers.application.currentPath'),

  isCommunityActive: function() {
    return !this.get('controllers.application.currentPath').match(/^kb/);
  }.property('controllers.application.currentPath'),

  dataTypes: function() {
    return Discourse.KbDataType.instances;
  }.property()
})
