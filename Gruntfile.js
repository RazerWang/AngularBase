module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: './less',
                    src: ['*/*.less','*.less'],
                    dest: './css',
                    ext: '.css'
                }]
            }
        },
        // concat: {
        //     css: {
        //         src: ['./resources/css/*.css'],
        //         dest: './release/app.css'
        //     }
        // },
        // cssmin: {
        //     minify: {
        //         expand: true,
        //         cwd: "release",
        //         src: ["*.css", "!*.min.css"],
        //         dest: "./dist/resources/css",
        //         ext: ".min.css"
        //     }
        // },
        // targethtml: {
        //     dist: {
        //         options: {
        //             curlyTags: {
        //                 rlsdate: '00<%= grunt.template.today("yyyymmddss") %>'
        //             }
        //         },
        //         files: {
        //             'dist/index.html': 'index.html'
        //         }
        //     }
        // },
        // htmlmin: {
        //     options: {
        //         removeComments: true,
        //         removeCommentsFromCDATA: true,
        //         collapseWhitespace: true,
        //         collapseBooleanAttributes: true,
        //         removeAttributeQuotes: true,
        //         removeRedundantAttributes: true,
        //         useShortDoctype: true,
        //         removeEmptyAttributes: true,
        //         removeOptionalTags: true
        //     },
        //     html: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'release',
        //                 src: ['*.html'],
        //                 dest: './dist'
        //             }
        //         ]
        //     }
        // },
        // copy: {
        //     image: {
        //         src: "resources/images/*",
        //         dest: "dist/"
        //     },
        //     css: {
        //         src: "dist/base.css",
        //         dest: "dist/app.css"
        //     },
        //     iconfont: {
        //         src: "resources/iconfont/*",
        //         dest: "dist/"
        //     },
        //     js:{
        //         src:"lib/fetch/*",
        //         dest:"dist/"
        //     },
        //     fonts:{
        //         src:"resources/fonts/*",
        //         dest:"dist/"
        //     }
        // },
        // replace: {
        //     release: {
        //         src: ['index.html'],
        //         overwrite: true,
        //         replacements: [
        //             {
        //                 from: './dist',
        //                 to: './release'
        //             }, {
        //                 from: /templates.*\.js/,
        //                 to: 'templates-<%= pkg.version %>.js'
        //             }, {
        //                 from: /all.*\.js/,
        //                 to: 'all-<%= pkg.version %>.js'
        //             }, {
        //                 from: /app.*\.css/,
        //                 to: 'app-<%= pkg.version %>.css'
        //             }, {
        //                 from: /\.\/resources\/css\/login_jsp.*\.css/,
        //                 to: './release/login_jsp-<%= pkg.version %>.css'
        //             }, {
        //                 from: /\.\/resources\/js\/login\/messages.*\.js/,
        //                 to: './release/messages-<%= pkg.version %>.js'
        //             }
        //         ]
        //     }
        // }
        // concat: {
        //     options: {
        //         stripBanners: true,
        //         banner: '/*!<%= pkg.name %> - <%= pkg.version %>-' + '<%=grunt.template.today("yyyy-mm-dd") %> */'
        //     },

        //     jsConcat: {
        //         src: ['js/highcharts.js', 'js/highcharts-more.js', 'js/exporting.js', 'js/solid-gauge.js'],
        //         dest: 'js/highcharts-mix.js'
        //     }
        // },
        //压缩css
        // cssmin: {
        //     //文件头部输出信息
        //     options: {
        //         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        //         //美化代码
        //         beautify: {
        //             //中文ascii化，非常有用！防止中文乱码的神配置
        //             ascii_only: true
        //         }
        //     },
        //     my_target: {
        //         files: [{
        //             expand: true,
        //             cwd: 'css/',
        //             // 排除.min的文件
        //             // src: ['commonLib.js', 'diagnosed.js', 'highcharts-mix.js'],
        //             src: ['*.css', '!*.min.css'],
        //             // 输出和输入在同一目录
        //             dest: 'css',
        //             ext: '.min.css'
        //         }]

        //     },
        // },
        //压缩js
        // uglify: {
        //     my_target: {
        //         options: {
        //             banner: '/*!<%= pkg.name %> - <%= pkg.version %>-' + '<%=grunt.template.today("yyyy-mm-dd") %> */\n'
        //         },
        //         // build:{
        //         //     src:'js/highcharts.mix.js',//压缩是要压缩合并了的
        //         //     dest:'js/highcharts.mix.min.js'//dest 是目的地输出
        //         // },
        //         files: [{
        //             expand: true,
        //             cwd: 'js/',
        //             // 排除.min的文件
        //             src: ['commonLib.js', 'diagnosed.js', 'highcharts-mix.js'],
        //             // src: ['*.js', '!*.min.js'],
        //             // 输出和输入在同一目录
        //             dest: 'js',
        //             ext: '.min.js'
        //         }]
        //     }
        // },
        watch: {
            build: {
                files: ['less/*.less','less/*/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        },

    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-less');
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    //  'uglify', 'cssmin', 'watch'
    grunt.registerTask('default', ['less','watch']);

};