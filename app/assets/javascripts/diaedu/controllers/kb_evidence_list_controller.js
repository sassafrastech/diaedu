// controller for the list of evidence on an object form
Discourse.KbEvidenceListController = Ember.ArrayController.extend({

  // a hash for storing known file items so that we can look them up when we receive events about them
  fileItems: null,

  init: function() { var self = this;
    self._super();
    self.fileItems = {};
    self.fileCounter = 0;
  },

  actions: {
    // adds a new link-type evidence item
    addLink: function() { var self = this;
      var item = Discourse.KbEvidenceItem.create({type: 'link'});
      self.pushObject(item);
    },

    // called when a file has been added to the evidence area
    // file - a hash of data about the file
    fileAdded: function(file) { var self = this;
      var item = Discourse.KbEvidenceItem.create({type: 'file', fileName: file.name});

      // add a unique (to this controller) counter value
      file.index = self.fileCounter++;

      // save for later
      self.fileItems[file.index] = item;

      // add to model, which will add to view
      self.pushObject(item);
    },

    // called when a file finishes uploading
    fileCompleted: function(file, result) { var self = this;
      var item = self.fileItems[file.index];
      item.set('id', result.id);
      item.set('uploaded', true);
    }
  }
});

// this is just here to specify the template
Discourse.KbEvidenceListView = Discourse.View.extend({
  templateName: 'javascripts/diaedu/templates/evidence_list'
});