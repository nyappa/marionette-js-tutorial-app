Apps.module('Views', function (Views, App, Backbone, Marionette, $) {

    Views.AppLayout = Backbone.Marionette.LayoutView.extend({
        el: ".js-page-layout",
        regions: {
            pageContents: ".js-main"
        }
    });

    Views.OptionsModal = Marionette.ItemView.extend({
        template   : "#text-options-template",
        initialize : function () {},
        events: {
            "click .js-text-delete"   : "deleteText",
            "click .js-change-status" : "changeStatus"
        },
        changeStatus : function (e) {
            var that            = this,
                textDetailModel = new Apps.Model.TextDetail;
            textDetailModel.fetch({
                data : {
                    "id"     : this.model.get("id"),
                    "status" : e.target.dataset.status
                },
                method   : "PATCH",
                dataType : "json",
                success  : function () {
                    that.trigger('modal:window:close');
                    Apps.router.navigate("detail/" + that.model.get("id") + "&" + new Date().getTime(), {trigger:true});
                },
                error    : function () {
                }
            });
            return false;
        },
        deleteText : function () {
            var that            = this,
                textDetailModel = new Apps.Model.TextDetail;
            textDetailModel.fetch({
                data     : { "id" : this.model.get("id") },
                method   : "DELETE",
                dataType : "json",
                success  : function () {
                    that.trigger('modal:window:close');
                    Apps.router.navigate("/", {trigger:true});
                },
                error    : function () {
                }
            });
            return false;
        }
    });

    Views.WordAddModal = Marionette.ItemView.extend({
        template   : "#word-add-template",
        initialize : function () {},
        events: {
            "click .js-add-word" : "addWord"
        },
        addWord : function (e) {
            var that            = this,
                word = new Apps.Model.Word;
            word.fetch({
                data : {
                    "word"    : that.$el.find("input[name=word]").val(),
                    "meaning" : that.$el.find("textarea[name=meaning]").val(),
                    "text_id" : that.model.get("id"),
                    "status"  : "confused"
                },
                method   : "POST",
                dataType : "json",
                success  : function () {
                    that.trigger('modal:window:close');
                    Apps.router.navigate("detail/" + that.model.get("id") + "&" + new Date().getTime(), {trigger:true});
                },
                error    : function () {
                }
            });
            return false;
        }
    });

    Views.WordDetailModal = Marionette.ItemView.extend({
        template   : "#word-detail-template",
        initialize : function () {},
        modelEvents: {
            change: 'render'
        },
        events: {
            "click .js-change-status" : "changeStatus",
            "click .js-delete"        : "deleteDetail"
        },
        onShow : function () {
           var wordModel = new Apps.Model.Word,
               that      = this;
           wordModel.fetch({
               data     : { id: this.model.get("id") },
               method   : "GET",
               dataType : "json",
               success  : function (e) {
                   that.model.set(wordModel.attributes); 
               },
               error    : function () {
               }
           });
        },
        changeStatus : function (e) {
            var that      = this,
                wordModel = new Apps.Model.Word;
            wordModel.fetch({
                data : {
                    "id"     : this.model.get("id"),
                    "status" : e.target.dataset.status
                },
                method   : "PATCH",
                dataType : "json",
                success  : function () {
                    that.model.set(wordModel.attributes); 
                },
                error    : function () {
                }
            });
            return false;
        },
        deleteDetail : function () {
            var that      = this,
                wordModel = new Apps.Model.Word;
            wordModel.fetch({
                data     : { "id" : this.model.get("id") },
                method   : "DELETE",
                dataType : "json",
                success  : function () {
                    that.trigger('modal:window:close');
                    Apps.router.navigate("detail/"+ that.model.get("text_id") + "&" + new Date().getTime(), {trigger:true});
                },
                error    : function () {
                }
            });
            return false;
        }
    });

    Views.TextDetailView = Marionette.ItemView.extend({
        template   : "#text-detail-template",
        initialize: function () {},
        modelEvents: {
            change: 'render'
        },
        events: {
            "click .js-delete"      : "deleteText",
            "click .js-menu"        : "openOptions",
            "click .js-add-word"    : "openWordAdds",
            "click .js-word-detail" : "openWordDetail"
        },
        onShow : function () {
            var Words = new Apps.Model.Words,
                that  = this;
            Words.fetch({
                data     : { id: this.model.get("id") },
                method   : "GET",
                dataType : "json",
                success  : function () {
                    that._replaceText(Words.models);
                },
                error    : function () {
                }
            });
        },
        _replaceText : function (models) {
            var s    = 0,
                text = $("<div/>").text(this.model.get("text")).html();
            for (s;  models.length > s; s++){
                text = text.replace(
                    models[s].get("word"),
                    "<a href='#' class='js-word-detail' data-id='"+ models[s].get("id") +"'>"+models[s].get("word")+"</a>"
                );
            }
            this.model.set({"text": text});
        },
        openWordDetail : function (e) {
            var modal = new Modal.Views.Main({ collection: new Modal.Model.ModalCollection });
            modal.set({
                top         : "10px",
                viewAddData : {
                    "id"      : e.target.dataset.id,
                    "word"    : "",
                    "meaning" : ""
                },
                childView   : Apps.Views.WordDetailModal,
                width       : "90%"
            });
            Modal.modal.show(modal);
            return false;
        },
        deleteText : function () {
            this.model.fetch({
                data     : { id: this.model.get("id") },
                method   : "DELETE",
                dataType : "json",
                success  : function () {
                    Apps.router.navigate("/", {trigger:true});
                },
                error    : function () {
                }
            });
            return false;
        },
        openOptions : function () {
            var modal = new Modal.Views.Main({ collection: new Modal.Model.ModalCollection });
            modal.set({
                top         : "10px",
                viewAddData : {
                    "title"  : this.model.get("title"),
                    "id"     : this.model.get("id"),
                    "status" : this.model.get("status")
                },
                childView   : Apps.Views.OptionsModal,
                width       : "90%"
            });
            Modal.modal.show(modal);
        },
        openWordAdds : function () {
            var modal = new Modal.Views.Main({ collection: new Modal.Model.ModalCollection });
            modal.set({
                top         : "10px",
                viewAddData : {
                    "id" : this.model.get("id"),
                },
                childView   : Apps.Views.WordAddModal,
                width       : "90%"
            });
            Modal.modal.show(modal);
            return false;
        }
    });

    Views.AddView = Marionette.ItemView.extend({
        template   : "#text-add-template",
        initialize : function () {},
        events: {
            "click .js-send-id"      : "sendId",
            "click .js-add-eng-text" : "addEngText"
        },
        addEngText: function () {
            var that = this;
            this.model.fetch({
                data     : {
                    "title"  : that.$el.find("input[name=title]").val(),
                    "text"   : that.$el.find("textarea[name=text]").val(),
                    "status" : "confused"
                },
                method   : "POST",
                dataType : "json",
                success  : function () {
                    Apps.router.navigate("/", {trigger:true});
                },
                error    : function () {
                }
            });
        }
    });

    Views.AppView = Marionette.ItemView.extend({
        tagName    : "li",
        template   : "#app-template",
        className  : function(){ return "icon-"+this.model.get("status") },
        initialize : function () {},
        events     : {
            "click": "openDetail"
        },
        onShow     : function () {},
        openDetail : function () {
            Apps.router.navigate("detail/"+ this.model.get("id"), {trigger:true});
        }
    });

    Views.AppsListView = Backbone.Marionette.CompositeView.extend({
        childView: this.AppView,
        childViewContainer: "ul",
        template: "#example-template",
        events: {
            "click .js-add-text" : "openAdd"
        },
        openAdd : function() {
            Apps.router.navigate("add", {trigger:true});
            return false;
        }
    });
});
