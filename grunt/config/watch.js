module.exports = {
    options: {
        livereload: true,
        hostname:'*',
        nospawn: true
    },

    concat:{
        files: "contents/js/**/*.js",
        tasks: [ "concat:main"]
    },

    /*uglify:{
        files: "js/*.js",
        tasks: "uglify:dist"
    },*/

    compass: {
        files: "contents/sass/**/*.scss",
        tasks: "compass:dist"
    }
};
