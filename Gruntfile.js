'use strict';

module.exports = function(grunt) {  
    var CONFIG = grunt.file.readJSON('config/main.json');  

    grunt.initConfig({
        //Init grunt config
        config : CONFIG,

        //Watcher
        watch: {
            block : {
                files: '<%= config.blockSrc %>/*',
                tasks: ['stylus:blocks']
            },
            css: {
                files: '<%= config.cssSrc %>/*',
                tasks: ['stylus:common']
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
                    {expand: true, cwd: '<%= config.bowerSrc %>', src: ['**'], dest: '<%= config.bowerDest %>'}
                ]
            }
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-csso'); 
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.registerTask('default', ['watch']);
};