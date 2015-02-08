module.exports = function (grunt) {
    require('time-grunt')(grunt);

    var path = require('path');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'config')
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('tests', ['jasmine']);
    grunt.registerTask('compile', [
        'concat:main',
        'compass:dist'
    ]);
};
