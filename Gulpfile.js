'use strict';

var gulp = require('gulp'),
    plug = require('gulp-load-plugins')();

var base = {
    src: './src',
    dist: './dist'
};

var src = {
    css: base.src + '/css/*.css',
    html: base.src + '/html/**',
    images: base.src + '/images/**',
    javascript: base.src + '/javascript/*.js',
    static: base.src + '/static/**'
};

var dest = {
    images: base.dist + '/images',
    scripts: base.dist + '/scripts',
    styles: base.dist + '/styles'
};

gulp.task('jshint', function() {
    return gulp.src( src.javascript )
        .pipe( plug.jshint() )
        .pipe( plug.jshint.reporter('jshint-stylish') )
        .pipe( plug.jshint.reporter('fail') );
});

gulp.task('scripts', [ 'jshint' ], function() {
    return gulp.src( src.javascript )
        .pipe( gulp.dest( dest.scripts ) );
});

gulp.task('styles', function() {
    return gulp.src( src.css )
        .pipe( gulp.dest( dest.styles ) );
});

gulp.task('images', function() {
    return gulp.src( src.images )
        .pipe( gulp.dest( dest.images ) );
});

gulp.task('static', function() {
    return gulp.src( src.static )
        .pipe( gulp.dest( base.dist ) );
});

gulp.task('html', function() {
    return gulp.src( src.html )
        .pipe( gulp.dest( base.dist ) );
});

gulp.task('default', [ 'html', 'static', 'images', 'styles', 'scripts' ]);
