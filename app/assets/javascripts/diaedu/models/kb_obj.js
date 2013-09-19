Discourse.KbObj = Discourse.Model.extend({
  tagsToShow: 4,

  init: function() {
    this.set('tags', []);
    this._super();
  },

  firstNTags: function() {
    return this.get('tags').slice(0, this.get('tagsToShow'));
  }.property('tags'),

  hasMoreTags: function() {
    return this.get('tags').length > this.get('tagsToShow');
  }.property('tags'),

  moreTagCount: function() {
    return this.get('tags').length - this.get('tagsToShow');
  }.property('tags'),

  // gets a string to use as a row ID in an index list
  rowId: function() {
    return 'obj-' + this.get('id');
  }.property('id'),

  // saves this object to the db
  save: function() { var self = this;
    // setup a jquery deferred b/c it's better than Ember.Deferred
    var def = $.Deferred();

    // do ajax request
    Discourse.ajax("/kb/" + this.get('dataType.name'), {
      method: 'POST',
      data: {obj: this.serialize()},
    
    // on ajax success
    }).then(function(data) {
      def.resolve(data);

    // on ajax error
    }, function(resp){
      if (resp.status == 422) {
        
        // join error messages into strings, and change any .'s in keys to _'s, for cases like event.name
        var errors = {};
        for (var f in resp.responseJSON.errors) 
          errors[f.replace(/\./g, '_')] = resp.responseJSON.errors[f].join(', ');

        // save on model
        self.set('errors', errors);
      }

      def.reject();
    });

    return def;
  },

  // serializes the tags array to a Rails compatible format
  // stores in the passed data object
  serializeTags: function(data) {
    // add tags
    data.taggings_attributes = this.get('tags').map(function(t){
      var tagging = {id: t.id};
      // if the tag has no id (it's new), we need to add the tag attributes
      if (t.id == null)
        return {tag_attributes: {name: t.name}}
      else
        return {tag_id: t.id, _destroy: t._destroy};
    });
  }
});

Discourse.KbObj.reopenClass({
  // factory method to create a subclass object of the appropriate type
  generateForDataType: function(dataType) {
    return Discourse['Kb' + dataType.get('singular').capitalize()].create({dataType: dataType});
  }
});