'use strict';

module.exports = function(grunt) {      
    grunt.initConfig({
        config : grunt.file.readJSON('config/main.json'),
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
        stylus: {
            block: {
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
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.registerTask('default', ['watch']);
};