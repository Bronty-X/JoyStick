const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const inject = require('gulp-inject-string');
const fs = require('fs');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const buffer = require('vinyl-buffer');

// JavaScriptファイルをミニファイするタスク
gulp.task('minify-js', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(buffer())
    .pipe(gulp.dest('dist/js'));
});

// CSSファイルをミニファイするタスク
gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(buffer())
    .pipe(gulp.dest('dist/css'));
});

// ミニファイしたJavaScriptとCSSをHTMLに挿入するタスク
gulp.task('inject-js', function() {
  const jsFileContent = fs.readFileSync('dist/js/all.min.js', 'utf8');
  

  return gulp.src('src/*.html')
    .pipe(inject.before('<!-- endinjectjs -->', `<script>${jsFileContent}</script>`))
    //.pipe(inject.before('<!-- endinjectcss -->', `<style>${cssFileContent}</style>`))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('inject-css', function() {
    const cssFileContent = fs.readFileSync('dist/css/all.min.css', 'utf8');
    return gulp.src('dist/*.html')
    .pipe(inject.before('<!-- endinjectcss -->', `<style>${cssFileContent}</style>`))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

// デフォルトタスク
gulp.task('default', gulp.series('minify-js', 'minify-css', 'inject-js', 'inject-css'));
