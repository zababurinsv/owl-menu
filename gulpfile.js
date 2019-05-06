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
let lambdaNow = require('./lambdaNow.js')
let lambdaAWS = require('./lambdaAWS.js')
const webpack = require('webpack-stream');
inject = require('gulp-inject-string');



// sw-precache-webpack-plugin configurations
const SERVICE_WORKER_FILENAME = './service-worker.js'
const SERVICE_WORKER_CACHEID = 'lain'
const SERVICE_WORKER_IGNORE_PATTERNS = [/dist\/.*\.html/]
const SW_PRECACHE_CONFIG = {
    minify: false,
    cacheId: SERVICE_WORKER_CACHEID,
    filename: SERVICE_WORKER_FILENAME,
    staticFileGlobsIgnorePatterns: SERVICE_WORKER_IGNORE_PATTERNS
}
const HTML_WEBPACK_OPTIONS = {
    main: {
        title: 'client',
        template: './src/index.html',
        appMountId: 'lain',
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
obj['host']['Firebase'] = false
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
    }
}else{



    gulp.task("clean", function () {
        return del('./docs')
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

    gulp.task('webpack:config', function () {
        return gulp.src('src/entry.js')
            .pipe(webpack( require('./webpack.config.js') ))
            .pipe(gulp.dest('dist/'));
    });

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
            gulp.task('default', gulp.series('clean', gulp.parallel('copy:CNAME','styles:light', 'styles:shadow','copy:favicon','html:component','html:inject','html:external','copy:image','copy:js')));

            gulp.task('watch', function () {
                gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
                gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
                gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('html:component'))
            });

            gulp.task('dev', gulp.series('default', 'connect:server','watch'))
        }
    }
}

