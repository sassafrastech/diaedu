Discourse.KbObj = Discourse.Model.extend(Discourse.KbLazyLoadable, {
  // the data type of this object
  dataType: null,

  tagsToShow: 4,

  tags: null,

  // used for showing the new dialog and indicating which (if any) parent object should be preselected
  preselectedParentId: null,

  // the parent of this object in the present navigation path
  navParent: null,

  init: function() {
    this._super();

    // init tags to empty array if not already set
    if (!this.get('tags'))
      this.set('tags', []);
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
  },

  // gets the breadcrumb trail for this object based on its navParent
  breadcrumb: function() {
    // get breadcrumb from parent if available or create new otherwise
    var c = this.get('navParent') ? this.get('navParent.breadcrumb') : Discourse.KbBreadcrumb.create();

    // add self and return the new Breadcrumb
    return c.addCrumb(this);
  }.property('navParent'),

  hasRelatedParents: function() {
    return this.get('dataType.rank') > 1;
  }.property('dataType.rank'),

  // gets full list of related parent objs
  relatedParents: function() { var self = this;
    return this.lazyLoad('_relatedParents', Em.A(), function() {
      var k = self.get('dataType.prev.modelClass');
      if (k) {
        // if this object has an id, then we should filter on it
        var filter = self.get('id') ? self.get('dataType.shortName') + '-' + self.get('id') : 'all';
        return k.findAll({filter: filter});
      } else
        return null;
    });
  }.property('dataType.prev', '_relatedParents')
});

Discourse.KbObj.reopenClass({
  dataTypeName: null,

  dataType: function() {
    return Discourse.KbDataType.get(this.dataTypeName);
  },

  find: function(options) {
    // setup a jquery deferred b/c it's better than Ember.Deferred
    var def = $.Deferred();

    Discourse.ajax("/kb/" + options.dataType.get('name') + '/' + options.id, {
      method: 'GET'
    
    // on ajax success
    }).then(function(data) {
      // store the dataType and navParent in the object also
      data.dataType = options.dataType;
      data.navParent = options.navParent;

      // create the object and send it to deferred resolve
      def.resolve(options.dataType.get('modelClass').create(data));
      
    // on ajax error
    }, function(resp){

      // reject the deferred and pass a dummy object
      def.reject(resp, Discourse.KbObj.create(options));
    });

    return def;  
  },

  // gets minimally populated versions of all objects
  findAll: function(options) { var self = this;
    var def = $.Deferred();

    Discourse.ajax(this.dataType().get('backendPath') + '/' + options.filter, {
      method: 'GET',
      data: {for_select: true}

    // on ajax success
    }).then(function(data) {
      // create objs from the returned array of attribs and resolve
      var k = self.dataType().get('modelClass');
      def.resolve(data.map(function(attribs){ return k.create(attribs); }));
      
    // on ajax error
    }, function(resp){

      def.reject(resp);
    });

    return def;
  }
});