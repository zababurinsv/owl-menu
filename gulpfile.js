let gulp = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");
let sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const debug = require('gulp-debug');
let sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
let gulpif = require('gulp-if');
const del = require('del')
let rename = require("gulp-rename");
let replace = require('gulp-string-replace');
let fs = require('fs');
var connect = require('gulp-connect');
let lambdaNow = require('./task/taskflower.js')
let lambdaAWS = require('./task/taskowl.js')
let taskNowCopy = require('./task/replace:deploy:now.js')
let shadowRoot = require('./task/shadowRoot.js')

let replaceCssGitHub = require('./task/replace:css:GitHub.js')
inject = require('gulp-inject-string');
var uglify = require('gulp-uglify');
var webpackConfig = require("./webpack.config.js");
let webpack = require("webpack");
let WebpackDevServer = require("webpack-dev-server");
let stream = require('webpack-stream');
var log = require('fancy-log');
let path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { rules, plugins, loaders } = require('webpack-atoms');
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const WorkboxPlugin = require('workbox-webpack-plugin');
var gls = require('gulp-live-server');
livereload = require('gulp-livereload');
var exec = require('child_process').exec;

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
obj['host']['Firebase'] = false
obj['host']['Now'] = true

var PluginError = require('plugin-error');

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
        }else{
            /////////////////////////// only now start/////////////////////////////////
            gulp.task("clean:now", function () {
                return del('./now')
            });
            gulp.task('copy:now', function () {
                return  gulp.src('./src/now/**/*.*')
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('copy:ingore:now', function () {
                return  gulp.src('./src/now/.nowignore')
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('copy:favicon:now', function () {
                return  gulp.src('./src/favicon.ico')
                    .pipe(gulp.dest('./now/static'));
            });
            gulp.task('connect:now', function (cb) {
                exec('cd now && nodemon --experimental-modules server.mjs && cd ..', function (err, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    cb(err);
                });
            });
            gulp.task('deploy-start:now', function (cb) {
                exec('cd now && now && cd ..', function (err, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    cb(err);
                });
            });
            gulp.task('replace:js:now:deploy', function () {
                return  gulp.src('./now/app.mjs')
                    .pipe(taskNowCopy[functionHandler](obj,'gitHub', callback))
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('default', gulp.series('clean:now',gulp.parallel('copy:favicon:now','copy:now','copy:ingore:now')));
            gulp.task('watch', function (callback) {

                gulp.watch('./src/now/**/*.*', gulp.series("copy:now"))
                // gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                // gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
                callback()


            });
            gulp.task('dev', gulp.series('default'))

            gulp.task('deploy:now', gulp.series('default', 'replace:js:now:deploy', 'deploy-start:now'))

            /////////////////////////// only now start/////////////////////////////////
        }
    }else{

        gulp.task("clean:webpack", function () {
            return del('./dist')
        });

        gulp.task('webpack', function() {
            return gulp.src('./src/z.config.mjs')
                .pipe(stream( {
                    mode: 'production',
                    cache: true,
                    name: 'firebase',
                    devtool: 'eval',
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
                        new WorkboxPlugin.GenerateSW({

                            exclude: [/\.(?:png|jpg|jpeg|svg)$/],

                            runtimeCaching: [{

                                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

                                handler: 'CacheFirst',

                                options: {

                                    cacheName: 'images',
                                    expiration: {
                                        maxEntries: 10,
                                    },
                                }

                            }]

                        }),
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
                        new HtmlWebpackPlugin({
                            // filename: config.build.index,
                            title: process.env.npm_package_description,
                            template: './src/index.html',
                            filename: './index.html',
                            inject: true,
                            // minify: {
                            //     removeComments: true,
                            //     collapseWhitespace: true,
                            //     removeAttributeQuotes: true
                            // },
                            // chunksSortMode: 'dependency',

                        })
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
                .pipe(gulp.dest('./dist/'));
        });
        gulp.task('copy:512x512-webpack', function () {
            return  gulp.src('./src/manifest/512x512.png')
                .pipe(gulp.dest('./dist/'));
        });
        gulp.task('copy:component-webpack', function () {
            return  gulp.src('./src/html/components/owl-menu/**/*.*')
                .pipe(gulp.dest('./dist/static/html/components/owl-menu'));
        });

        gulp.task("clean:webpack", function () {
            return del('./dist')
        });
        gulp.task("styles:light-webpack", function () {
            return gulp.src('./dist/static/html/components/owl-menu/light/**')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(debug({title: 'sass:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html/components/owl-menu/light/'))
        });
        gulp.task("styles:shadow-webpack", function () {
            return gulp.src('./dist/static/html/components/owl-menu/shadow/**')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(debug({title: 'sass:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html/components/owl-menu/shadow/'))
        });
        gulp.task("clean:scss-shadow-webpack", function () {
            return del('./dist/static/html/components/owl-menu/light/**.scss')
        });
        gulp.task("clean:scss-light-webpack", function () {
            return del('./dist/static/html/components/owl-menu/shadow/**.scss')
        });
        gulp.task('inject:manifest-webpack', function(){
            return  gulp.src('./dist/index.html')
                .pipe(inject.before('<title', ' <link rel="manifest" href="./manifest.json">\n'))
                .pipe(inject.before('</head', ' <style> @import"/static/html/light.css"</style>\n'))
                .pipe(gulp.dest('./dist'));
        });

        gulp.task("styles:html-light-webpack", function () {
            return gulp.src('./src/static/light.css')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(debug({title: 'sass:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html'))
        });
        gulp.task("styles:html-shadow-webpack", function () {
            return gulp.src('./src/static/shadow.css')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(debug({title: 'shadow:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html'))
        });
        gulp.task('copy:secure-webpack', function () {
            return  gulp.src('./src/static/index.html')
                .pipe(gulp.dest('./dist/static/html/components/'));
        });

        gulp.task('connect-webpack', function () {
           return  connect.server({
                name: 'WebPack',
                root: 'dist',
                port: 8001,
                livereload: true
            });
        });


        if(obj['host']['Now'] === false){

            gulp.task('default', gulp.series('clean:webpack','webpack','copy:secure-webpack','copy:component-webpack',"styles:shadow-webpack","styles:light-webpack", gulp.parallel("styles:html-shadow-webpack","styles:html-light-webpack",'copy:manifest-webpack','copy:16x16-webpack','copy:48x48-webpack','copy:128x128-webpack','copy:192x192-webpack','copy:512x512-webpack','inject:manifest-webpack','inject:manifest-webpack',  "clean:scss-shadow-webpack", "clean:scss-light-webpack",'connect-webpack')));

            // gulp.task('watch', function () {
                // gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                // gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                // gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
            // });

            gulp.task('dev', gulp.series('default'))


        }
    }
}else{
    //GitHub only start/////////////////////////////////////////////////////////////////////////////////
    gulp.task("clean", function () {
        return del('./docs')
    });
    gulp.task('copy:manifest', function () {
        return  gulp.src('./src/manifest/manifest.json')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('copy:static-light:GitHub', function () {
        return  gulp.src('./src/static/light.css')
            .pipe(gulp.dest('./docs'));
    });
    gulp.task('copy:static-shadow:GitHub', function () {
        return  gulp.src('./src/static/shadow.css')
            .pipe(gulp.dest('./docs'));
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
    gulp.task('replace:index:GitHub', function () {
        return  gulp.src('./docs/index.html')
            .pipe(replaceCssGitHub[functionHandler](obj,'gitHub', callback))
            .pipe(gulp.dest('./docs'));
    });
    gulp.task('shadowRoot:GitHub', function () {
        return  gulp.src('./docs/index.html')
            .pipe(shadowRoot[functionHandler](obj,'gitHub', callback))
            .pipe(gulp.dest('./docs'));
    });

    gulp.task('html:external', function () {
        return  gulp.src('./src/html/components/owl-menu/external/owl-menu-external.html')
            .pipe(gulp.dest('./docs/'));
    });
    gulp.task('html:component', function () {
        return  gulp.src('./src/html/components/owl-menu/owl-menu.html')
            .pipe(gulp.dest('./docs/'));
    });

    gulp.task('inject:html:GitHub', function(){
        return  gulp.src('./docs/index.html')
            .pipe(inject.before('</html', '<script src="./owl-menu.mjs"></script>\n'))
            .pipe(inject.before('<title', ' <link rel="manifest" href="./manifest.json">\n'))
            .pipe(gulp.dest('./docs'));
    });
    gulp.task('copy:index:GitHub', function () {
        return  gulp.src('./src/index.html')
            .pipe(gulp.dest('./docs'));
    });
    gulp.task('connect-gitHub', function () {
        connect.server({
            name: 'GitHub',
            root: 'docs',
            port: 8000,
            livereload: true
        });
    });
    if(obj['host']['Firebase'] === false){
        if(obj['host']['Now'] === false){
            gulp.task('default', gulp.series('clean', gulp.parallel('copy:CNAME','styles:light', 'styles:shadow','copy:favicon','html:component','html:external','copy:image','copy:js','copy:manifest','copy:16x16','copy:48x48','copy:128x128','copy:192x192','copy:512x512','copy:static-light:GitHub','copy:static-shadow:GitHub')));

            gulp.task('watch', function (callback) {
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
                gulp.watch('./src/index.html', gulp.series('copy:index:GitHub','replace:index:GitHub','inject:html:GitHub'))
                callback()
            });
            gulp.task('dev', gulp.series('default','copy:index:GitHub', 'replace:index:GitHub', 'inject:html:GitHub', gulp.parallel( 'connect-gitHub', 'watch')))

            //GitHub only end//////////////////////////////////////////////////////////////////////////
        }else{
            ///////////////////////////////////// git hub && now start //////////////////////////////
            gulp.task("clean:now", function () {
                return del('./now')
            });
            gulp.task('copy:now', function () {
                return  gulp.src('./src/now/**/*.*')
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('copy:ignore:now', function () {
                return  gulp.src('./src/now/.nowignore')
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('copy:favicon:now', function () {
                return  gulp.src('./src/favicon.ico')
                    .pipe(gulp.dest('./now/static'));
            });
            gulp.task('connect:now', function (cb) {
                exec('cd now && nodemon --experimental-modules server.mjs && cd ..', function (err, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    cb(err);
                });
            });
            gulp.task('deploy-start:now', function (cb) {
                exec('cd now && now && cd ..', function (err, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    cb(err);
                });
            });
            gulp.task('replace:js:now:deploy', function () {
                return  gulp.src('./now/app.mjs')
                    .pipe(taskNowCopy[functionHandler](obj,'gitHub', callback))
                    .pipe(gulp.dest('./now'));
            });

            gulp.task('watch', function (callback) {
                gulp.watch('./src/now/**', gulp.series("copy:now"))
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
                gulp.watch('./src/index.html', gulp.series('copy:index:GitHub','replace:index:GitHub','inject:html:GitHub'))
                callback()
            });
            gulp.task('default', gulp.series('clean','clean:now',  gulp.parallel('copy:favicon:now','copy:now','copy:ignore:now','copy:CNAME','styles:light', 'styles:shadow','copy:favicon','html:component','html:external','copy:image','copy:js','copy:manifest','copy:16x16','copy:48x48','copy:128x128','copy:192x192','copy:512x512','copy:static-light:GitHub','copy:static-shadow:GitHub')));

            gulp.task('dev', gulp.series('default','copy:index:GitHub', 'replace:index:GitHub', 'inject:html:GitHub', gulp.parallel( 'connect-gitHub','connect:now', 'watch')))

            gulp.task('deploy:now', gulp.series('default', 'replace:js:now:deploy', 'deploy-start:now'))


            ///////////////////////////////////// git hub && now end //////////////////////////////
        }
    }else{


        gulp.task("clean:webpack", function () {
            return del('./dist')
        });

        gulp.task('webpack', function() {
            return gulp.src('./src/z.config.mjs')
                .pipe(stream(webpackConfig))
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
                .pipe(gulp.dest('./dist/'));
        });
        gulp.task('copy:512x512-webpack', function () {
            return  gulp.src('./src/manifest/512x512.png')
                .pipe(gulp.dest('./dist/'));
        });
        gulp.task('copy:component-webpack', function () {
            return  gulp.src('./src/html/components/owl-menu/**/*.*')
                .pipe(gulp.dest('./dist/static/html/components/owl-menu'));
        });

        gulp.task("clean:webpack", function () {
            return del('./dist')
        });
        gulp.task("styles:light-webpack", function () {
            return gulp.src('./dist/static/html/components/owl-menu/light/**')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(debug({title: 'sass:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html/components/owl-menu/light/'))
        });
        gulp.task("styles:shadow-webpack", function () {
            return gulp.src('./dist/static/html/components/owl-menu/shadow/**')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(debug({title: 'sass:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html/components/owl-menu/shadow/'))
        });
        gulp.task("clean:scss-shadow-webpack", function () {
            return del('./dist/static/html/components/owl-menu/light/**.scss')
        });
        gulp.task("clean:scss-light-webpack", function () {
            return del('./dist/static/html/components/owl-menu/shadow/**.scss')
        });
        gulp.task('inject:manifest-webpack', function(){
            return  gulp.src('./dist/index.html')
                .pipe(inject.before('<title', ' <link rel="manifest" href="./manifest.json">\n'))
                .pipe(inject.before('</head', ' <style> @import"/static/html/light.css"</style>\n'))
                .pipe(gulp.dest('./dist'));
        });

        gulp.task("styles:html-light-webpack", function () {
            return gulp.src('./src/static/light.css')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(debug({title: 'sass:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html'))
        });
        gulp.task("styles:html-shadow-webpack", function () {
            return gulp.src('./src/static/shadow.css')
                .pipe(gulpif(isDevelopement, sourcemaps.init()))
                .pipe(debug({title: 'shadow:'}))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(isDevelopement,sourcemaps.write()))
                .pipe(debug({title: 'prefix:'}))
                .pipe(gulp.dest('./dist/static/html'))
        });
        gulp.task('copy:secure-webpack', function () {
            return  gulp.src('./src/static/index.html')
                .pipe(gulp.dest('./dist/static/html/components/'));
        });


        gulp.task('connect-webpack', function () {
            return  connect.server({
                name: 'WebPack',
                root: 'dist',
                port: 8001,
                livereload: true
            });
        });


        if(obj['host']['Now'] === false){
            gulp.task('default', gulp.series('clean','clean:webpack','webpack','copy:secure-webpack','copy:component-webpack',"styles:shadow-webpack","styles:light-webpack", gulp.parallel('copy:CNAME','styles:light',"styles:html-shadow-webpack","styles:html-light-webpack",'copy:favicon','html:component','inject:html:GitHub','html:external','copy:image','copy:js','copy:manifest','copy:16x16','copy:48x48','copy:128x128','copy:192x192','copy:512x512','copy:manifest-webpack','copy:16x16-webpack','copy:48x48-webpack','copy:128x128-webpack','copy:192x192-webpack','copy:512x512-webpack','inject:manifest-webpack','inject:manifest-webpack',  "clean:scss-shadow-webpack", "clean:scss-light-webpack",'connect-webpack','connect-gitHub')));

            gulp.task('watch', function () {
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))

            });

            gulp.task('dev', gulp.series('default', 'watch'))
        }else{

            gulp.task("clean:now", function () {
                return del('./now')
            });
            gulp.task('copy:now', function () {
                return  gulp.src('./src/now/**/*.*')
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('copy:ingore:now', function () {
                return  gulp.src('./src/now/.nowignore')
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('copy:favicon:now', function () {
                return  gulp.src('./src/favicon.ico')
                    .pipe(gulp.dest('./now/static'));
            });
            gulp.task('connect:now', function (cb) {
                exec('cd now && nodemon --experimental-modules server.mjs && cd ..', function (err, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    cb(err);
                });
            });
            gulp.task('deploy-start:now', function (cb) {
                exec('cd now && now && cd ..', function (err, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    cb(err);
                });
            });
            gulp.task('replace:js:now:deploy', function () {
                return  gulp.src('./now/app.mjs')
                    .pipe(taskNowCopy[functionHandler](obj,'gitHub', callback))
                    .pipe(gulp.dest('./now'));
            });
            gulp.task('default', gulp.series('clean','clean:webpack','webpack','copy:secure-webpack','copy:component-webpack',"styles:shadow-webpack","styles:light-webpack", gulp.parallel('copy:CNAME','styles:light',"styles:html-shadow-webpack","styles:html-light-webpack",'copy:favicon','html:component','inject:html:GitHub','html:external','copy:image','copy:js','copy:manifest','copy:16x16','copy:48x48','copy:128x128','copy:192x192','copy:512x512','copy:manifest-webpack','copy:16x16-webpack','copy:48x48-webpack','copy:128x128-webpack','copy:192x192-webpack','copy:512x512-webpack','inject:manifest-webpack','inject:manifest-webpack',  "clean:scss-shadow-webpack", "clean:scss-light-webpack",'connect-webpack','connect-gitHub','copy:favicon:now','copy:now','copy:ingore:now')));
            gulp.task('watch', function (callback) {

                gulp.watch('./src/now/**/*.*', gulp.series("copy:now"))
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
                callback()


            });
            gulp.task('dev', gulp.series('default'),gulp.parallel( 'connect:now','connect-webpack', 'connect-gitHub'))

            gulp.task('deploy:now', gulp.series('default', 'replace:js:now:deploy', 'deploy-start:now'))


        }
    }
}

