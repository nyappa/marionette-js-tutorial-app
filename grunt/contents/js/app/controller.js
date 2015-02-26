Apps.module('Controller', function (Controller, App, Backbone, Marionette, $, _) {
  Controller.set = Marionette.Controller.extend({
      lists : function() {
          var AppsCollection = new Apps.Model.AppsCollection,
              layout         = new Apps.Views.AppLayout;
          AppsCollection.fetch({
              method   : "GET",
              dataType : "json",
              success  : function () {
                  layout.pageContents.show(new Apps.Views.AppsListView(
                      { collection : AppsCollection }
                  ));
              },
              error    : function () {
              }
          });
      },
      add : function() {
          var layout = new Apps.Views.AppLayout;
          layout.pageContents.show(new Apps.Views.AddView({
              model :  new Apps.Model.App
          }));
      },
      detail : function(id) {
          var layout   = new Apps.Views.AppLayout,
              appModel = new Apps.Model.App;
          appModel.fetch({
              data     : { "id" : id },
              method   : "GET",
              dataType : "json",
              success  : function () {
                  layout.pageContents.show(new Apps.Views.TextDetailView({
                      model : appModel
                  }));
              },
              error    : function () {
                  Apps.router.navigate("/", {trigger:true});
              }
          });
      }
  });
});
