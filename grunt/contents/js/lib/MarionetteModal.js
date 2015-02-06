var Modal = new Backbone.Marionette.Application();

Modal.addRegions({
    modal   : '.js-modal',
});

Modal.module('Model', function (Model, App, Backbone) {
    Model.Modal           = Backbone.Model.extend({});
    Model.ModalCollection = Backbone.Collection.extend({
        model: this.Modal
    });
});

Modal.module('Views', function (Views, App, Backbone, Marionette, $) {

    Views.InsideContents = Marionette.ItemView.extend({
        tagName  : "div",
        template : "#modal-template"
    });

    Views.Main = Backbone.Marionette.CompositeView.extend({
        tagName            : "div",
        className          : "ui-modals-common",
        childView          : this.InsideContents,
        childViewContainer : ".js-modal-contents",
        template           : "#modal-template",
        events: {
            "click .js-modal-cancel" : "cancel",
            "click .js-modal-ok"     : "ok",
            "ajax:success form"      : "reqSuccess",
            "ajax:error form"        : "reqError"
        },
        childEvents: {
            'modal:window:resize': function () {
                this.modalSizeSet(false);
            },
            'modal:window:close': function () {
                this.close();
            }
        },
        parentView : {},
        callbackOk : {},
        callbackError  : {},
        callbackOnShow : {},
        extra          : {},
        set: function (options) {
            this.callbackOk     = options.callbackOk;
            this.callbackError  = options.callbackError;
            this.callbackOnShow = options.callbackOnShow;
            this.parentView     = options.parentView;
            this.extra          = options.extra;
            this.ajaxSuccess    = options.ajaxSuccess;
            this.ajaxError      = options.ajaxError;
            this.width          = options.width;
            this.top            = options.top;

            if (options.viewAddData) {
                this.collection.add(options.viewAddData);
            } else {
                this.collection.add({ enabled: "1" });
            }
            if (options.childView) {
                this.childView = options.childView;
            }
            else if (options.template) {
                this.childView.prototype.template = options.template;
            }
        },
        deleteText: function () {
            this.close();
        },
        reqSuccess: function(res) {
            if ( this.ajaxSuccess ) {
                this.ajaxSuccess(res);
            }
            //モーダル出現時にbody側でスクロールさせなくしたため
            //ちゃんとcloseさせないとスクロールできなくなる
            this.close();
        },
        reqError: function(res) {
            if ( this.ajaxError ) {
                this.ajaxError(res);
            }
        },
        ok : function () {
            this.$el.find(".js-ui-loading-overlay").hide();
            this.callbackOk(this);
        },
        cancel: function () {
            this.close();
            return false;
        },
        onShow: function() {
            var that = this;
            if ( this.callbackOnShow ) {
                this.callbackOnShow(that, that.extra);
            }
            that.modalSizeSet(true);
            window.onresize = function(){
                that.modalSizeSet(false);
            };
            $("body").css("overflow","hidden");
        },
        modalSizeSet: function(initFlg) {
            var $modal     = this.$el.find(".js-ui-modals"),
                modalWidth = this.getNowModalWidth($modal, initFlg);

            this.imageWidthAdjust($modal);
            this.$el.find(".js-modal-background-layer").css({
                height : $(window).height()
            }).show();
            $modal.css({
                top   : this.getNowModalHeight($modal),
                left  : Math.floor(($(window).width() - modalWidth) / 2),
                width : modalWidth
            }).show();
        },
        imageWidthAdjust : function ($modal) {
            this.$el.find("img").each(function(){
                $(this).css("width", "auto");
                if ( $(this).width() >= $modal.width() ) {
                    $(this).css("width", $modal.width() - $modal.width()*0.2);
                }
            });
        },
        getNowModalHeight : function ($modal) {
            if ( ($(window).height()/2) > $modal.height() ) {
                return this.top ? this.top : Math.floor(($(window).height() - $modal.height()) / 2);
            }
            $modal.css("height", $(window).height() - 20);
            $modal.find("h3").css("margin-bottom","0px");
            $modal.find(".js-modal-body").css({
                "height"     : $(window).height() - 90,
                "overflow-y" : "scroll"
            });
            return 10;
        },
        getNowModalWidth : function($modal, initFlg) {
            if ( this.width ) {
                return this.setModalWidth($modal, initFlg);
            }
            return  this.getModalMaxWidth()*1 + (initFlg ? 30 : 0);
        },
        setModalWidth : function($modal, initFlg) {
            if (  this.width.indexOf("%") !== -1 ) {
                $modal.show().css("width", this.width);
                return this.getModalMaxWidth()*1 + (initFlg ? 30 : 0);
            }
            return this.width;
        },
        close: function() {
            this.$el.unbind();
            this.$el.remove();
            $("body").css("overflow","auto");
        },
        getModalMaxWidth: function() {
            var elmSize    = [],
                getMaxSize = 0;
            this.$el.find(".js-ui-modals").find("*:not(img)").each(function(){
                elmSize.push($(this).width());
            });
            getMaxSize = Math.max.apply(null, elmSize);
            if ( getMaxSize < 200 ) {
                getMaxSize = 220;
            }
            return getMaxSize;
        }
    });

});
