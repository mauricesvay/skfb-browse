var browserify = require('browserify');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var pkg = require('./package.json');

var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var concat = require('gulp-concat');

gulp.task('browserify', function() {
    return browserify(['./js/main.js'], {
            'debug': false,
        })
        .transform(stringify(['.tpl']))
        .bundle()
        .pipe(source('main.js' ))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('assets', function(){
    gulp.src('./assets/**/*')
        .pipe(gulp.dest('./dist/assets'))
});

gulp.task('minify-css', function() {
    gulp.src('./css/*.css')
        .pipe(minifyCSS({
            keepBreaks: true
        }))
        .pipe(concat('main.css'))
        .pipe(prefix({ cascade: true }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function(){
    gulp.watch('js/**', ['browserify']);
    gulp.watch('css/**', ['minify-css']);
});

gulp.task('build', ['assets','browserify','minify-css']);

gulp.task('default', ['build']);
