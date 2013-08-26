Discourse.KbObjPage = Discourse.Model.extend({
  page_id: null,
  is_active: false,
  objs: null,
  other_pages: null,

  get_stub: function(page_id) {
    return Discourse.KbObjPage.create({page_id: page_id})
  },

  multiple_pages: function() {
    return this.other_pages.length > 1;
  }.property('other_pages')
});

Discourse.KbObjPage.reopenClass({
  find: function(data_type, page_id) {
    page_id = parseInt(page_id);

    return Discourse.ajax("/kb/" + data_type.name + "/page/" + page_id).then(function (data) {

      // compute how many pages there will be and generate stub Page objects for them
      var page_count = Math.ceil(data.total_count / data.per_page);

      // if the current page is too high, trim it
      if (page_id > page_count)
        page_id = page_count;

      // start the obj
      var this_page = Discourse.KbObjPage.create({
        page_id: page_id, 
        is_active: true,
        objs: Em.A(),
        other_pages: Em.A()
      });

      // create the Objs
      data.objs.forEach(function (g) {
        // create Obj object from returned JSON and add to this page
        this_page.objs.pushObject(Discourse.KbObj.create(g));
      });

      // insert the current page
      this_page.other_pages.pushObject(this_page);

      // insert some pages to the right of the current page
      for (var i = 1; i < Math.max(6 - page_id, 3); i++)
        if (page_id + i < page_count)
          this_page.other_pages.pushObject(this_page.get_stub(page_id + i));

      // insert a gap if needed
      if (page_id + i < page_count)
        this_page.other_pages.pushObject(Ember.Object.create({is_gap: true}));
      
      // insert the last page unless we've already done so
      if (page_id != page_count)
        this_page.other_pages.pushObject(this_page.get_stub(page_count));

      // insert some pages to the left of the current page
      for (var i = 1; i < Math.max(6 - (page_count - page_id), 3); i++)
        if (page_id - i > 1)
          this_page.other_pages.insertAt(0, this_page.get_stub(page_id - i));

      // insert a gap if needed
      if (page_id - i > 1)
        this_page.other_pages.insertAt(0, Ember.Object.create({is_gap: true}));

      // insert the first page unless we've already done so
      if (page_id != 1)
        this_page.other_pages.insertAt(0, this_page.get_stub(1));

      return this_page;
    });
  }
});