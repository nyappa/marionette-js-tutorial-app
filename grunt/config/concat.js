module.exports = {
    main:{
        src: [
            //vender
            "contents/js/lib/jquery.js",
            "contents/js/lib/underscore.js",
            "contents/js/lib/backbone.js",
            "contents/js/lib/backbone.marionette.js",
            "contents/js/lib/*.js",
            //contents
            "contents/js/common.js",
            "contents/js/**/*.js"
        ],
        dest: "../public/js/contents_all.js"
    }
};
