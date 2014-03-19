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
                files: ['<%= config.source %>/<%= config.layouts %>/*.hbs', '<%= config.source %>/*.hbs', '<%= config.data %>/*.json', 'config/templates_vars.json'],
                tasks: ['render'] 
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
                    define : grunt.file.readJSON('config/stylus_vars.json')
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
                    define : grunt.file.readJSON('config/stylus_vars.json')
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

            //Bower components copy
            components: {
                files: [
                    {expand: true, cwd: '<%= config.source %>/<%= config.componentsSrc %>', src: ['**'], dest: '<%= config.dest %>/<%= config.componentsDest %>'}
                ]
            },

            html : {
                files: [
                    {expand: true, cwd: '<%= config.temp %>/<%= config.source %>/', src: ['*.html'], dest: '<%= config.dest %>/'}
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
                path: 'http://localhost:<%= config.PORT %>/build'
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
            html: ['<%= config.dest %>/*.html'],
            js: ['<%= config.dest %>/<%= config.jsDest %>'],
            fonts: ['<%= config.dest %>/<%= config.fontsDest %>'],
            components: ['<%= config.dest %>/<%= config.componentsDest %>'],
            temp : ['<%= config.temp %>'],
            render : ['<%= config.temp %>/<%= config.source %>/*.html']
        },

        //files concatinations
        concat : {            
            data : {
                options : {
                    banner : '{\n',
                    footer : '\n}',
                    separator : ',\n',
                    process : function(src, filepath) {
                        var filename = filepath.split('/')[filepath.split('/').length - 1].split('.json')[0];
                        return '"filename"' + ' : ' + src;
                    }
                },
                src: ['<%= config.data %>/*.json'],
                dest: '<%= config.temp %>/data.json',
            },
            css : {
                src : ['<%= config.dest %>/<%= config.cssDest %>/main.css', '<%= config.dest %>/<%= config.cssDest %>/blocks.css'],
                dest : '<%= config.dest %>/<%= config.cssDest %>/styles.css'
            }
        },

        //jsonlint
        jsonlint: {
            all: {
                src: [ '<%= config.data %>/*.json' ]
            },
            result: {
                src: [ '<%= config.temp %>/data.json' ]
            }
        },

        //template engine
        assemble: {
            options: {
                assets: 'assets',
                partials: ['<%= config.source %>/<%= config.blocks %>/**/*.hbs'],
                data: ['<%= config.data %>/*.json', 'config/templates_vars.json'],
                layoutdir: '<%= config.source %>/<%= config.layouts %>',
                layout: 'default_layout.hbs' 
            },
            pages: {
                options: {
                    layout: 'default_layout.hbs' 
                },
                src: ['<%= config.source %>/*.hbs'],
                dest: '<%= config.temp %>/'
            }
        },

        //make pretty html code
        prettify: {
            options: {
                "indent": 2
            },
            all: {
                expand: true,
                cwd: '',
                ext: '.html',
                src: ['<%= config.temp %>/<%= config.source %>/*.html'],
                dest: ''
            } 
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-csso'); 
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-prettify');

    grunt.registerTask('build', ['clean:all', 'render', CONFIG.core, 'concat:css', 'copy']);
    grunt.registerTask('render', ['jsonlint:all', 'clean:render', 'assemble', 'prettify', 'copy:html']);

    grunt.registerTask('default', ['build', 'open', 'connect', 'watch']);
};