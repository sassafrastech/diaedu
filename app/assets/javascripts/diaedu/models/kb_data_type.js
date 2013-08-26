Discourse.KbDataType = Discourse.Model.extend({
  name: null,
  shortName: null,
  title: null
});

Discourse.KbDataType.reopenClass({
  find: function(name) {
    return Discourse.KbDataType.instances[name];
  },

  all: function() {
    var a = [];
    for (var key in Discourse.KbDataType.instances)
      a.push(Discourse.KbDataType.instances[key]);
    return a;
  },

  instances: {
    'glycemic-problems': Discourse.KbDataType.create({
      name: 'glycemic-problems',
      shortName: 'glyprobs',
      title: 'Glycemic Problems'
    }),
    'triggers': Discourse.KbDataType.create({
      name: 'triggers',
      shortName: 'triggers',
      title: 'Triggers'
    }),
    'goals': Discourse.KbDataType.create({
      name: 'goals',
      shortName: 'goals',
      title: 'Goals'
    })
  }
});
