'use strict';

module.exports = function(grunt) {  
    var CONFIG = grunt.file.readJSON('config/main.json');  

    grunt.initConfig({
        //Init grunt config
        config : CONFIG,

        //Watcher
        watch: {
            block : {
                files: '<%= config.blockSrc %>/**',
                tasks: ['stylus:blocks'],
                options : {
                    livereload: CONFIG.livereload
                }                
            },
            css: {
                files: '<%= config.cssSrc %>/**',
                tasks: ['stylus:css'],
                options : {
                    livereload: CONFIG.livereload
                } 
            },
            html: {
                files: '<%= config.source %>/*.html',
                tasks: ['copy:html'],
                options : {
                    livereload: CONFIG.livereload
                } 
            },
            js: {
                files: '<%= config.jsSrc %>/**',
                tasks: ['copy:js'],
                options : {
                    livereload: CONFIG.livereload
                } 
            },
            components: {
                files: '<%= config.componentsSrc %>/**',
                tasks: ['copy:components'],
                options : {
                    livereload: CONFIG.livereload
                } 
            }
        },

        //Stylus task
        stylus: {
            blocks: {
                options: {
                    linenos : '<%= config.linenos %>',
                    urlfunc: 'embedurl',
                    import: [     
                        '../css/variables/variables',    
                        '../css/mixins/mixins'
                    ],
                    define : grunt.file.readJSON('config/stylusVars.json')
                },
                files : {
                    '<%= config.cssDest %>/blocks.css': '<%= config.blockSrc %>/blocks.styl'
                }
            },
            css: {
                options: {
                    linenos : '<%= config.linenos %>',
                    import: [     
                        'variables/variables',    
                        'mixins/mixins'
                    ],
                    define : grunt.file.readJSON('config/stylusVars.json')
                },
                files : {
                    '<%= config.cssDest %>/main.css' : '<%= config.cssSrc %>/main.styl'
                }
            }
        },

        //Autoprefixer
        autoprefixer: {
            blocks : {
                options: {
                    browsers: CONFIG.browerSupport 
                },
                src: '<%= config.cssDest %>/blocks.css',
                dest: '<%= config.cssDest %>/blocks.css'
            },
            css : {
                options: {
                    browsers: CONFIG.browerSupport 
                },
                src: '<%= config.cssDest %>/main.css',
                dest: '<%= config.cssDest %>/main.css'
            }
        },

        //CSS minification
        csso: {
            min : {
                files: {
                    '<%= config.cssDest %>/min/styles.min.css': ['<%= config.cssDest %>/main.css' , '<%= config.cssDest %>/blocks.css']
                }
            }
        },

        //Copy files
        copy: {
            //Main js copy
            js: {
                files: [
                    {expand: true, cwd: '<%= config.jsSrc %>', src: ['**'], dest: '<%= config.jsDest %>'}
                ]
            },

            //Will be deleted
            html: {
                files: [
                    {expand: true, cwd: '<%= config.source %>', src: ['*.html'], dest: '<%= config.dest %>'}
                ]
            },

            //Bower components copy
            components: {
                files: [
                    {expand: true, cwd: '<%= config.componentsSrc %>', src: ['**'], dest: '<%= config.componentsDest %>'}
                ]
            }
        },

        //Open browser
        open : {
            browser : {
                path: 'http://localhost:<%= config.PORT %>'
            }            
        },

        //Start server
        connect : {
            server : {
                options: {
                    port: '<%= config.PORT %>',
                    keepalive : false
                }
            }
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-csso'); 
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');

    grunt.registerTask('default', ['open', 'connect', 'watch']);
    grunt.registerTask('min', ['csso:min']);
};