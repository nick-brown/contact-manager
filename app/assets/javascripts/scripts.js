(function( $ ){
    $.fn.clearForm = function() {
        if(this[0].tagName === 'FORM') {
            this.find('input:text, input:password, input:file, select, textarea').val('');
            this.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
        }
    };
})( jQuery );

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


    // Initialize the Application
    App.Init = function() {
        window.contacts = new App.Collections.Contacts();
        contacts.fetch();

        var contactsView = new App.Views.Contacts({ collection: contacts });
        contactsView.render().$el.appendTo('body');

        addContactForm = new App.Views.Add({ collection: contacts }).render().$el;
        $('#addContact').html( addContactForm );
    };


    // Model and View
    App.Models.Contact = Backbone.Model.extend({
        defaults: {
            first_name: '',
            last_name: '',
            phone: ''
        }
    });

    App.Views.Contact = Backbone.View.extend({
        tagName: 'li',

        template: template('contactTemplate'),

        initialize: function() {
            this.model.on('change', this.render, this);
        },

        events: {
            'click .edit': 'edit'
        },

        edit: function() {
            var editView = new App.Views.Add({ model: this.model });

            $('#addContact').html( editView.render().$el );
        },

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
        tagName: 'form',

        template: template('addTemplate'),

        events: {
            'submit': 'submit'
        },


        submit: function(e) {
            e.preventDefault();

            var data = Backbone.Syphon.serialize(this);

            this.model.set(data);

            if( this.model.isNew() ) {
                this.collection.add(this.model);
            }

            this.model.save();

            // TODO: When the form submits a model that is not new, repopulate with a new model

            this.model = new App.Models.Contact();

            console.log( this.model.toJSON() );



            this.$el.clearForm();
        },

        render: function() {
            this.model = typeof(this.model) === 'object' ? this.model : new App.Models.Contact();

            var template = this.template( this.model.toJSON() );

            this.$el.html( template );

            return this;
        }
    });

})();


App.Init();