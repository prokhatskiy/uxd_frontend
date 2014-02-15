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
                    '<%= config.cssDist %>/blocks.css': '<%= config.blockSrc %>/blocks.styl'
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
                    '<%= config.cssDist %>/main.css' : '<%= config.cssSrc %>/main.styl'
                }
            }
        },

        //Autoprefixer
        autoprefixer: {
            blocks : {
                options: {
                    browsers: CONFIG.browerSupport 
                },
                src: '<%= config.cssDist %>/blocks.css',
                dest: '<%= config.cssDist %>/blocks.css'
            },
            css : {
                options: {
                    browsers: CONFIG.browerSupport 
                },
                src: '<%= config.cssDist %>/main.css',
                dest: '<%= config.cssDist %>/main.css'
            }
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.registerTask('default', ['watch']);
};