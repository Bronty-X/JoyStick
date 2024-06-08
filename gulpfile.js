const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const buffer = require('vinyl-buffer');
const typescript = require('gulp-typescript');

// TypeScriptファイルをJavaScriptにコンパイル後ミニファイ化
gulp.task('compile-ts', function () {
    return gulp.src('src/ts/*.ts')
        .pipe(typescript({
            target: 'ES5',
            removeComments: true
        }))
        .pipe(uglify())
        .pipe(buffer())
        .pipe(concat('joystick.min.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('minify-css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('all.min.css'))
        .pipe(cleanCSS())
        .pipe(buffer())
        .pipe(gulp.dest('dist/css'));
});


// デフォルトタスク
gulp.task('default', gulp.series('compile-ts', 'minify-css'));
