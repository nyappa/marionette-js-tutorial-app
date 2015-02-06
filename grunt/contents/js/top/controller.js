Apps.module('Controller', function (Controller, App, Backbone, Marionette, $, _) {
  Controller.set = Marionette.Controller.extend({
      lists : function(id) {
          var AppsCollection = new Apps.Model.AppsCollection,
              layout         = new Apps.Views.ModerationLayout;
          AppsCollection.fetch({
              data     : { "id" : id },
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
          var layout = new Apps.Views.ModerationLayout;
          layout.pageContents.show(new Apps.Views.AddView({
              collection :  new Apps.Model.AppsCollection
          }));
      },
      detail : function(id) {
          var layout          = new Apps.Views.ModerationLayout,
              textDetailModel = new Apps.Model.TextDetail;
          textDetailModel.fetch({
              data     : { "id" : id },
              method   : "GET",
              dataType : "json",
              success  : function () {
                  layout.pageContents.show(new Apps.Views.TextDetailView({
                      model : textDetailModel
                  }));
              },
              error    : function () {
                  Apps.router.navigate("/", {trigger:true});
              }
          });
      }
  });
});
