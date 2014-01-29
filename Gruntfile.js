'use strict';

var LIVERELOAD_PORT = 1337,
    APP_PORT = 666,
    lrSnippet = require('connect-livereload')({port:LIVERELOAD_PORT}),
    mountFolder = function(connect, dir){
        return connect.static(require("path").resolve(dir));
    }

module.exports = function(grunt) {
    grunt.initConfig({
        stylus: {
            compile: {
                files: {
                    "css/styles.css" : ["styl/styles.styl" ]
                },
                options: {
                    compress: false
                }
            }
        },
        connect: {
            options: {
                port: APP_PORT
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: "http://localhost:" + APP_PORT
            }
        },
        watch: {
            options: {
                livereload: LIVERELOAD_PORT
            },
            stylus: {
                files: ["styl/*.styl" ],
                tasks: ['stylus'],
                options: {
                    spawn: false
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version', 'ie 10']
            },
            css: {
                expand: true,
                flatten: true,
                src: 'css/*.css',
                dest: 'css/'
            }
        },
        clean: {
            css: ["css/_*.css"],
        }
    });

    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.registerTask('default', ['connect',"open:server",'watch']);
};