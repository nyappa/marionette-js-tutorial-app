Apps.module('Model', function (Model, App, Backbone) {
    
    Model.Word = Backbone.Model.extend({
        url : '/word.json'
    });
    Model.Words = Backbone.Collection.extend({
        url : '/words.json'
    });
    
    Model.App = Backbone.Model.extend({
        url : '/text_data.json'
    });
    Model.AppsCollection = Backbone.Collection.extend({
        model: Model.App,
        url : '/text_list.json'
    });

});
