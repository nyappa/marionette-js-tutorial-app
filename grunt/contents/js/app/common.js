var Apps = new Backbone.Marionette.Application();

Apps.addRegions({
    //main   : '.js-app-list',
});

Apps.on("start", function(options){
    if (Backbone.history){
        Backbone.history.start({pushState: false, root:"/"});
    }
});
