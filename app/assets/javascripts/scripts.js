(function() {
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };

    // Change ERB interpolation to mustache style
    _.templateSettings = {
        interpolate : /\{\{([\s\S]+?)\}\}/g
    };

    window.template = function (id) {
        return _.template( $('#' + id).html() );
    };


    App.Models.Contact = Backbone.Model.extend({
        defaults: {
            first_name: 'dave',
            last_name: '',
            phone: '(555) 555-5555'
        }
    });

    App.Views.Contact = Backbone.View.extend({
        tagName: 'li',

        template: template('contactTemplate'),

        render: function() {
            var template = this.template( this.model.toJSON() );

            this.$el.html(template);

            return this;
        }
    });

    App.Collections.Contacts = Backbone.Collection.extend({
        model: App.Models.Contact,
        url: '/contacts'
    });

    App.Views.Contacts = Backbone.View.extend({
        tagName: 'ul',

        initialize: function() {
            this.collection.on('add', this.addContact, this);
        },

        addContact: function(contact) {
            var contactView = new App.Views.Contact({ model: contact });

            this.$el.append( contactView.render().el );

            return this;
        },

        render: function() {
            this.collection.each(this.addContact, this);

            return this;
        }
    });

})();


$(function(){


var contacts = new App.Collections.Contacts();

contacts.fetch();

var contactsView = new App.Views.Contacts({ collection: contacts });

contactsView.render().$el.appendTo('body');

});