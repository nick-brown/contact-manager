HTMLFormElement.prototype.boom = function() {
    return this.find('input:text, input:password, input:file, select, textarea').val('');
    //this.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
};

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


    // Model and View
    App.Models.Contact = Backbone.Model.extend({
        defaults: {
            first_name: 'dave',
            last_name: '',
            phone: '5555555555'
        }
    });

    App.Views.Contact = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            this.model.on('change', this.render, this);
        },

        template: template('contactTemplate'),

        render: function() {
            var template = this.template( this.model.toJSON() );

            this.$el.html(template);

            return this;
        }
    });


    // Collection and View
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


    // Add Contact View
    App.Views.Add = Backbone.View.extend({
        el: '#addContact',

        events: {
            'submit': 'submit'
        },

        submit: function(e) {
            e.preventDefault();

            this.el.boom();

            var data = Backbone.Syphon.serialize(this);
            var contact = new App.Models.Contact(data);

            this.collection.add(contact);

            contact.save();

            this.$el.find('input:text, input:password, input:file, select, textarea').val('');
            this.$el.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
        },

        render: function() {
            var template = this.template( this.model.toJSON() );

            this.$el.html( template );

            return this;
        }
    });

})();


$(function(){

    window.contacts = new App.Collections.Contacts();

    contacts.fetch();

    var contactsView = new App.Views.Contacts({ collection: contacts });

    contactsView.render().$el.appendTo('body');

    new App.Views.Add({ collection: contacts });


});