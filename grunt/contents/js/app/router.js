Apps.module('Route', function (Route, App, Backbone, Marionette, $, _) {
    Route.Router = Marionette.AppRouter.extend({
        appRoutes: {
            ''           : 'lists',
            'add'        : 'add',
            'detail/:id' : 'detail'
        }
    });

    Route.addInitializer(function () {
        Apps.router = new Route.Router({
            controller: new Apps.Controller.set()
        });
    });
});
