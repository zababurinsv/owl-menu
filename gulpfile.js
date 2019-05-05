let gulp = require("gulp");
let ts = require("gulp-typescript");
// let tsProject = ts.createProject("tsconfig.json");
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
const del = require('del')
var inject = require('gulp-inject');
var rename = require("gulp-rename");
var replace = require('gulp-string-replace');
var fs = require('fs');
connect = require('gulp-connect');

const isDevelopement = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
let obj = {}
obj['path'] = {}
obj['path']['path-old'] = 'src/test-dev'
obj['path']['path-new'] = 'src/test-prod'
obj['component'] = 'owl-menu'
// gulp.task("rename", function () {
//     return gulp.src("./src/main/text/hello.txt")
//         .pipe(rename("main/text/ciao/goodbye.md"))
//         .pipe(gulp.dest("./dist"));
// });
// gulp.task("ts:component", function () {
//     return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest("docs"));
// });

gulp.task('connect:component', function () {
    connect.server({
        name: 'component',
        root: ['docs'],
        port: 8000,
        livereload: true
    });
});

gulp.task('rename:dir', function(done) {
    if (fs.existsSync(obj['path']['path-old'])) {
        fs.rename(obj['path']['path-old'], obj['path']['path-new'], function (err) {
            if (err) {
                throw err;
            }
            done();
        });
    }else{
        done();
    }
});


// gulp.task('replace:css', function(){
//    return  gulp.src(['./src/html/components/owl-menu/owl-menu.js'])
//         .pipe(replace(
//             '${obj[component]}'
//             ,
//             `@import 'sssss`
//         ))
//         .pipe(gulp.dest('docs/'));
// });
gulp.task('js:copy', function () {
    return  gulp.src('./src/html/components/owl-menu/owl-menu.mjs')
        .pipe(gulp.dest('./docs/'));
});
gulp.task("clean", function () {
    return del('./docs')
});
// gulp.task("html:inject", function () {
//     let target = gulp.src('./src/index.html');
//     let sources = gulp.src('./docs/owl-menu.mjs', {read: false});
//     return target.pipe(inject(sources))
//         .pipe(gulp.dest('./docs'));
// });
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
gulp.task('img:component', function () {
    return  gulp.src('./src/webComponent.jpg')
        .pipe(gulp.dest('./docs/'));
});
gulp.task('html:index', function () {
    return  gulp.src('./src/index.html')
        .pipe(gulp.dest('./docs/'));
});
gulp.task('html:external', function () {
    return  gulp.src('./src/html/components/owl-menu/external/owl-menu-external.html')
        .pipe(gulp.dest('./docs/'));
});
gulp.task('copy:html-component', function () {
    return  gulp.src('./src/html/components/owl-menu/owl-menu.html')
        .pipe(gulp.dest('./docs/'));
});


gulp.task('default', gulp.series('clean','rename:dir', gulp.parallel('styles:light', 'styles:shadow','copy:html-component','copy:favicon',"html:index",'copy:CNAME', 'img:component','html:external','js:copy')));

gulp.task('watch', function () {
    gulp.watch('./src/html/components/owl-menu/shadow/**/*.*', gulp.series("styles:shadow"))
    gulp.watch('./src/html/components/owl-menu/light/**/*.*' , gulp.series("styles:light"))
    gulp.watch('./src/html/components/owl-menu/owl-menu.html', gulp.series('copy:html-component'))
});

gulp.task('dev', gulp.series('default', 'connect:component','watch'))