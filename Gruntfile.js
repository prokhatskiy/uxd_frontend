'use strict';

module.exports = function(grunt) {  
    var CONFIG = grunt.file.readJSON('config/main.json');  

    grunt.initConfig({
        //Init grunt config
        config : CONFIG,

        //Watcher
        watch: {
            options : {
                livereload: CONFIG.livereload
            }, 
            block : {
                files: '<%= config.source %>/<%= config.blockSrc %>/**',
                tasks: ['<%= config.core %>:blocks']               
            },
            css: {
                files: '<%= config.source %>/<%= config.cssSrc %>/**',
                tasks: ['<%= config.core %>:css'] 
            },
            html: {
                files: '<%= config.source %>/*.html',
                tasks: ['copy:html'] 
            },
            js: {
                files: '<%= config.source %>/<%= config.jsSrc %>/**',
                tasks: ['copy:js']
            },
            components: {
                files: '<%= config.source %>/<%= config.componentsSrc %>/**',
                tasks: ['copy:components']
            },
            img : {
                files: '<%= config.source %>/<%= config.imgSrc %>/**',
                tasks: ['copy:img']
            },
            fonts : {
                files: '<%= config.source %>/<%= config.fontsSrc %>/**',
                tasks: ['copy:fonts']
            },
            data : {
                files: '<%= config.data %>/*.json',
                tasks: ['jsonlint:all', 'concat:data', 'jsonlint:result']
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
                    '<%= config.dest %>/<%= config.cssDest %>/blocks.css': '<%= config.source %>/<%= config.blockSrc %>/blocks.styl'
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
                    '<%= config.dest %>/<%= config.cssDest %>/main.css' : '<%= config.source %>/<%= config.cssSrc %>/main.styl'
                }
            }
        },

        //Autoprefixer
        autoprefixer: {
            blocks : {
                options: {
                    browsers: CONFIG.browerSupport 
                },
                src: '<%= config.dest %>/<%= config.cssDest %>/blocks.css',
                dest: '<%= config.dest %>/<%= config.cssDest %>/blocks.css'
            },
            css : {
                options: {
                    browsers: CONFIG.browerSupport 
                },
                src: '<%= config.dest %>/<%= config.cssDest %>/main.css',
                dest: '<%= config.dest %>/<%= config.cssDest %>/main.css'
            }
        },

        //CSS minification
        csso: {
            min : {
                files: {
                    '<%= config.dest %>/<%= config.cssDest %>/min/styles.min.css': ['<%= config.dest %>/<%= config.cssDest %>/main.css' , '<%= config.dest %>/<%= config.cssDest %>/blocks.css']
                }
            }
        },

        //Copy files
        copy: {
            //Main js copy
            js: {
                files: [
                    {expand: true, cwd: '<%= config.source %>/<%= config.jsSrc %>', src: ['**'], dest: '<%= config.dest %>/<%= config.jsDest %>'}
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
                    {expand: true, cwd: '<%= config.source %>/<%= config.componentsSrc %>', src: ['**'], dest: '<%= config.dest %>/<%= config.componentsDest %>'}
                ]
            },

            //images copy
            img: {
                files: [
                    {expand: true, cwd: '<%= config.source %>/<%= config.imgSrc %>', src: ['**'], dest: '<%= config.dest %>/<%= config.imgDest %>'}
                ]
            },


            //fonts copy
            fonts: {
                files: [
                    {expand: true, cwd: '<%= config.source %><%= config.fontsSrc %>', src: ['**'], dest: '<%= config.dest %>/<%= config.fontsDest %>'}
                ]
            },
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
        },

        //clean tasks
        clean: {
            all: ['<%= config.dest %>', '<%= config.temp %>'],
            css: ['<%= config.dest %>/<%= config.cssDest %>'],
            html: ['<%= config.dest %>/<%= config.dest %>/*.html'],
            js: ['<%= config.dest %>/<%= config.jsDest %>'],
            fonts: ['<%= config.dest %>/<%= config.fontsDest %>'],
            components: ['<%= config.dest %>/<%= config.componentsDest %>'],
            temp : ['<%= config.temp %>']
        },

        //files concatinations
        concat : {
            options : {
                banner : '{\n',
                footer : '\n}',
                separator : ',\n',
                process : function(src, filepath) {
                    var filename = filepath.split('/')[filepath.split('/').length - 1].split('.json')[0];
                    return '"filename"' + ' : ' + src;
                }
            },
            data : {
                src: ['<%= config.data %>/*.json'],
                dest: '<%= config.temp %>/data.json',
            }
        },

        //jsonlint
        jsonlint: {
            all: {
                src: [ '<%= config.data %>/*.json' ]
            },
            result: {
                src: [ '<%= config.data %>/data.json' ]
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsonlint');

    grunt.registerTask('build', ['clean:all', CONFIG.core, 'copy']);
    grunt.registerTask('min', ['csso:min']);

    grunt.registerTask('default', ['build', 'open', 'connect', 'watch']);
};