var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(['client/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("client/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into our /client/js folder
gulp.task('js', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("client/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

    browserSync.init({
        server: "./client"
    });

    gulp.watch(['client/scss/*.scss'], ['sass']);
    gulp.watch("client/js/*.js").on('change', browserSync.reload);
    gulp.watch("client/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['js', 'serve']);