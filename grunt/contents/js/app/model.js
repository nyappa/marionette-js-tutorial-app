Apps.module('Model', function (Model, App, Backbone) {
    
    Model.Word = Backbone.Model.extend({
        url : '/word.json'
    });
    Model.Words = Backbone.Collection.extend({
        url : '/words.json'
    });
    
    Model.Apps = Backbone.Model.extend({
        url : '/generate_data.json'
    });
    Model.AppsCollection  = Backbone.Collection.extend({
        model: Model.Apps,
        url : '/generate_data.json'
    });
    Model.TextDetail = Backbone.Model.extend({
        url : '/text_detail.json'
    });

});
