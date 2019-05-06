let gulp = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");
let sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const debug = require('gulp-debug');
let sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
let gulpif = require('gulp-if');
let uglify = require('gulp-uglify');
const del = require('del')
let rename = require("gulp-rename");
let replace = require('gulp-string-replace');
let fs = require('fs');
connect = require('gulp-connect');
let lambdaNow = require('./task/taskflower.js')
let lambdaAWS = require('./task/taskowl.js')
inject = require('gulp-inject-string');
const path = require('path')

let webpack = require("webpack");
let WebpackDevServer = require("webpack-dev-server");
let stream = require('webpack-stream');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { rules, plugins, loaders } = require('webpack-atoms');
let   SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// sw-precache-webpack-plugin configurations
const SERVICE_WORKER_FILENAME = './service-worker.js'
const SERVICE_WORKER_CACHEID = 'owl'
const SERVICE_WORKER_IGNORE_PATTERNS = [/dist\/.*\.html/]
const SW_PRECACHE_CONFIG = {
    minify: false,
    cacheId: SERVICE_WORKER_CACHEID,
    filename: SERVICE_WORKER_FILENAME,
    staticFileGlobsIgnorePatterns: SERVICE_WORKER_IGNORE_PATTERNS
}
const HTML_WEBPACK_OPTIONS = {
    main: {
        title: 'firebase',
        template: './src/index.html',
        appMountId: 'firebase',
        serviceWorker: `/${SERVICE_WORKER_FILENAME}`,
        filename: './index.html',
        inject: true
        // minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        // },
        // chunksSortMode: 'dependency',
    }
}

let functionHandler = 'handler'
let obj = {}
obj['path'] = {}
obj['path']['path-old'] = 'src/test-dev'
obj['path']['path-new'] = 'src/test-dev'
obj['name'] = 'Sergey'
obj['component'] = 'owl-menu'
obj['dir'] = 'frontend-server'
obj['ts'] = false
obj['webpack'] = false
obj['host'] = {}
obj['host']['GitHub'] = true
obj['host']['Firebase'] = true
obj['host']['Now'] = false

const isDevelopement = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

function callback(error, data) {
    console.log(error);
    console.log(data);
}




if(obj['host']['GitHub'] === false){

    if(obj['host']['Firebase'] === false){




        if(obj['host']['Now'] === false){
            gulp.task('dev', function (callback) {
                console.log('нет ни одной сборки')
                callback()
            })
        }
    }else{

        gulp.task("clean:webpack", function () {
            return del('./dist')
        });

        gulp.task('webpack', function() {
            return gulp.src('./src/z.config.mjs')
                .pipe(stream({
                    mode: 'production',
                    cache: true,
                    name: 'firebase',
                    resolve: {
                        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
                    },
                    output: {
                        filename: '[name].bundle.mjs',
                        chunkFilename: '[name].bundle.mjs',
                        library: 'bundle',
                    },
                    module: {
                        rules: [
                            rules.js(),
                            rules.images(),
                            rules.css(),
                        ]
                    },
                    optimization: {
                        splitChunks: {
                            chunks: 'all'
                        },
                        minimizer: [
                            new UglifyJsPlugin({
                                cache: true,
                                parallel: true,
                                uglifyOptions: {
                                    output: {
                                        comments: false
                                    }
                                }
                            })
                        ]
                    },
                    plugins: [
                        plugins.loaderOptions(),
                        new SWPrecacheWebpackPlugin(SW_PRECACHE_CONFIG),
                        new CompressionPlugin(
                            {
                                test: /\.js/,
                                include: /\/includes/,
                                exclude: /\/excludes/,
                                cache: true
                            }
                        ),
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, './src/manifest/manifest.json'),
                                to: './',
                                ignore: ['.*']
                            }
                        ]),
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, './src/favicon.ico'),
                                to: './',
                                ignore: ['.*']
                            }
                        ]),
                        new HtmlWebpackPlugin(HTML_WEBPACK_OPTIONS.main)
                    ],


                }))
                .pipe(gulp.dest('dist/'));
        });

        gulp.task('copy:manifest-webpack', function () {
            return  gulp.src('./src/manifest/manifest.json')
                .pipe(gulp.dest('./dist/'));
        });
        gulp.task('copy:16x16-webpack', function () {
            return  gulp.src('./src/manifest/16x16.png')
                .pipe(gulp.dest('./dist/'));
        });

        gulp.task('copy:48x48-webpack', function () {
            return  gulp.src('./src/manifest/48x48.png')
                .pipe(gulp.dest('./dist/'));
        });

        gulp.task('copy:128x128-webpack', function () {
            return  gulp.src('./src/manifest/128x128.png')
                .pipe(gulp.dest('./dist/'));
        });

        gulp.task('copy:192x192-webpack', function () {
            return  gulp.src('./src/manifest/192x192.png')
                .pipe(gulp.dest('./docs/'));
        });


        gulp.task('copy:512x512-webpack', function () {
            return  gulp.src('./src/manifest/512x512.png')
                .pipe(gulp.dest('./docs/'));
        });
        gulp.task('inject:manifest-webpack', function(){
            return  gulp.src('./src/index.html')
                .pipe(inject.before('<title', ' <link rel="manifest" href="./manifest.json">\n'))
                .pipe(gulp.dest('./dist'));
        });
        // gulp.task("webpack-dev-server", function(callback) {
        //     modify some webpack config options
            // var myConfig = Object.create(webpackConfig);
            // myConfig.devtool = "eval";
            // myConfig.debug = true;
            //
            // Start a webpack-dev-server
            // new WebpackDevServer(webpack(myConfig), {
            //     publicPath: "/" + myConfig.output.publicPath,
            //     stats: {
            //         colors: true
            //     }
            // }).listen(8080, "localhost", function(err) {
            //
            // });
        // });



        // gulp.task('watch', function() {
        //     gulp.watch(path.ALL, ['webpack']);
        // });


        if(obj['host']['Now'] === false){

            gulp.task('default', gulp.series('clean:webpack', gulp.parallel( 'webpack','copy:manifest-webpack','copy:16x16-webpack','copy:48x48-webpack','copy:128x128-webpack','copy:192x192-webpack','copy:512x512-webpack', 'inject:manifest-webpack')));

            // gulp.task('watch', function () {
                // gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                // gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                // gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
            // });

            gulp.task('dev', gulp.series('default'))


        }
    }
}else{
    gulp.task("clean", function () {
        return del('./docs')
    });
    gulp.task('copy:manifest', function () {
        return  gulp.src('./src/manifest/manifest.json')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('copy:16x16', function () {
        return  gulp.src('./src/manifest/16x16.png')
            .pipe(gulp.dest('./docs/'));
    });

    gulp.task('copy:48x48', function () {
        return  gulp.src('./src/manifest/48x48.png')
            .pipe(gulp.dest('./docs/'));
    });

    gulp.task('copy:128x128', function () {
        return  gulp.src('./src/manifest/128x128.png')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('copy:192x192', function () {
        return  gulp.src('./src/manifest/192x192.png')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('copy:512x512', function () {
        return  gulp.src('./src/manifest/512x512.png')
            .pipe(gulp.dest('./docs/'));
    });
    if(obj['ts'] === false){
        gulp.task('copy:js', function () {
            return  gulp.src('./src/html/components/owl-menu/owl-menu.mjs')
                .pipe(lambdaAWS[functionHandler](obj,'gitHub', callback))
                .pipe(gulp.dest('./docs/'));
        });
    }else{
        gulp.task("copy:js", function () {
            return tsProject.src()
                .pipe(tsProject())
                .js.pipe(gulp.dest("docs"));
        });
    }
    gulp.task("styles:light", function () {
        return gulp.src('./src/html/components/owl-menu/light/owl-menu.scss')
            .pipe(gulpif(isDevelopement, sourcemaps.init()))
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(debug({title: 'sass:'}))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulpif(isDevelopement,sourcemaps.write()))
            .pipe(debug({title: 'prefix:'}))
            .pipe(gulp.dest('./docs'))
    });
    gulp.task("styles:shadow", function () {
        return gulp.src('./src/html/components/owl-menu/shadow/owl-menu-custom.scss')
            .pipe(gulpif(isDevelopement, sourcemaps.init()))
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(debug({title: 'sass:'}))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulpif(isDevelopement,sourcemaps.write()))
            .pipe(debug({title: 'prefix:'}))
            .pipe(gulp.dest('./docs'))
    });
    gulp.task('copy:favicon', function () {
        return  gulp.src('./src/favicon.ico')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('copy:CNAME', function () {
        return  gulp.src('./src/CNAME')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('copy:image', function () {
        return  gulp.src('./src/webComponent.jpg')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('html:index', function () {
        return  gulp.src('./src/index.html')
            .pipe(lambdaNow({key:'value'}))
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('html:external', function () {
        return  gulp.src('./src/html/components/owl-menu/external/owl-menu-external.html')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('html:component', function () {
        return  gulp.src('./src/html/components/owl-menu/owl-menu.html')
            .pipe(gulp.dest('./docs/'));
    });

    gulp.task('html:inject', function(){
        return  gulp.src('./src/index.html')
            .pipe(inject.before('</html', '<script src="./owl-menu.mjs"></script>\n'))
            .pipe(gulp.dest('./docs'));
    });
    gulp.task('inject:manifest', function(){
        return  gulp.src('./src/index.html')
            .pipe(inject.before('<title', ' <link rel="manifest" href="./manifest.json">\n'))
            .pipe(gulp.dest('./docs'));
    });

    gulp.task('connect:server', function () {
        connect.server({
            name: 'component',
            root: ['docs'],
            port: 8000,
            livereload: true
        });
    });
    if(obj['host']['Firebase'] === false){




        if(obj['host']['Now'] === false){
            gulp.task('default', gulp.series('clean', gulp.parallel('copy:CNAME','styles:light', 'styles:shadow','copy:favicon','html:component','html:inject','html:external','copy:image','copy:js','copy:manifest','copy:16x16','copy:48x48','copy:128x128','copy:192x192','copy:512x512','inject:manifest')));

            gulp.task('watch', function () {
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
            });

            gulp.task('dev', gulp.series('default', 'connect:server','watch'))
        }
    }else{

        gulp.task("clean:webpack", function () {
            return del('./dist')
        });

        gulp.task('webpack', function() {
            return gulp.src('./src/z.config.mjs')
                .pipe(stream({
                    mode: 'production',
                    cache: true,
                    name: 'firebase',
                    resolve: {
                        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
                    },
                    output: {
                        filename: '[name].bundle.mjs',
                        chunkFilename: '[name].bundle.mjs',
                        library: 'bundle',
                    },
                    module: {
                        rules: [
                            rules.js(),
                            rules.images(),
                            rules.css(),
                        ]
                    },
                    optimization: {
                        splitChunks: {
                            chunks: 'all'
                        },
                        minimizer: [
                            new UglifyJsPlugin({
                                cache: true,
                                parallel: true,
                                uglifyOptions: {
                                    output: {
                                        comments: false
                                    }
                                }
                            })
                        ]
                    },
                    plugins: [
                        plugins.loaderOptions(),
                        new SWPrecacheWebpackPlugin(SW_PRECACHE_CONFIG),
                        new CompressionPlugin(
                            {
                                test: /\.js/,
                                include: /\/includes/,
                                exclude: /\/excludes/,
                                cache: true
                            }
                        ),
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, './src/manifest/manifest.json'),
                                to: './',
                                ignore: ['.*']
                            }
                        ]),
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, './src/favicon.ico'),
                                to: './',
                                ignore: ['.*']
                            }
                        ]),
                        new HtmlWebpackPlugin(HTML_WEBPACK_OPTIONS.main)
                    ],


                }))
                .pipe(gulp.dest('dist/'));
        });

        gulp.task('copy:manifest-webpack', function () {
            return  gulp.src('./src/manifest/manifest.json')
                .pipe(gulp.dest('./dist/'));
        });
        gulp.task('copy:16x16-webpack', function () {
            return  gulp.src('./src/manifest/16x16.png')
                .pipe(gulp.dest('./dist/'));
        });

        gulp.task('copy:48x48-webpack', function () {
            return  gulp.src('./src/manifest/48x48.png')
                .pipe(gulp.dest('./dist/'));
        });

        gulp.task('copy:128x128-webpack', function () {
            return  gulp.src('./src/manifest/128x128.png')
                .pipe(gulp.dest('./dist/'));
        });

        gulp.task('copy:192x192-webpack', function () {
            return  gulp.src('./src/manifest/192x192.png')
                .pipe(gulp.dest('./docs/'));
        });
        gulp.task('inject:manifest-webpack', function(){
            return  gulp.src('./src/index.html')
                .pipe(inject.before('<title', ' <link rel="manifest" href="./manifest.json">\n'))
                .pipe(gulp.dest('./dist'));
        });

        gulp.task('copy:512x512-webpack', function () {
            return  gulp.src('./src/manifest/512x512.png')
                .pipe(gulp.dest('./docs/'));
        });

        // gulp.task("webpack-dev-server", function(callback) {
        //     modify some webpack config options
        // var myConfig = Object.create(webpackConfig);
        // myConfig.devtool = "eval";
        // myConfig.debug = true;
        //
        // Start a webpack-dev-server
        // new WebpackDevServer(webpack(myConfig), {
        //     publicPath: "/" + myConfig.output.publicPath,
        //     stats: {
        //         colors: true
        //     }
        // }).listen(8080, "localhost", function(err) {
        //
        // });
        // });



        // gulp.task('watch', function() {
        //     gulp.watch(path.ALL, ['webpack']);
        // });

        if(obj['host']['Now'] === false){
            gulp.task('default', gulp.series('clean','clean:webpack', gulp.parallel('copy:CNAME','styles:light', 'styles:shadow','copy:favicon','html:component','html:inject','html:external','copy:image','copy:js','copy:manifest','copy:16x16','copy:48x48','copy:128x128','copy:192x192','copy:512x512',  'webpack','copy:manifest-webpack','copy:16x16-webpack','copy:48x48-webpack','copy:128x128-webpack','copy:192x192-webpack','copy:512x512-webpack','inject:manifest-webpack','inject:manifest-webpack')));

            gulp.task('watch', function () {
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
            });

            gulp.task('dev', gulp.series('default', 'connect:server', 'watch'))
        }


    }
}

