'use strict';

var gulp = require('gulp'),
    g$ = require('gulp-load-plugins')();




var CONNECT_PORT = 9000;

var base = {
    src: './src',
    dist: './dist'
};

var src = {
    css: base.src + '/css/*.css',
    html: base.src + '/html/**',
    images: base.src + '/images/**',
    javascript: base.src + '/javascript/**/*.js',
    static: base.src + '/static/**'
};

var dest = {
    images: base.dist + '/images',
    scripts: base.dist + '/scripts',
    styles: base.dist + '/styles'
};




gulp.task('jshint', function() {
    return gulp.src( src.javascript )
        .pipe( g$.jshint() )
        .pipe( g$.jshint.reporter('jshint-stylish') )
        .pipe( g$.jshint.reporter('fail') );
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




gulp.task('connect', [ 'default' ], function () {
    var serveStatic = require('serve-static'),
        serveIndex = require('serve-index');

    var app = require('connect')()
        .use( require('connect-livereload')({
            port: 35729
        }) )
        .use( serveStatic('dist') )
        .use( serveIndex('dist') );

    require('http')
        .createServer( app )
        .listen( CONNECT_PORT )
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:' + CONNECT_PORT );
        });
});

gulp.task('watch', [ 'connect' ], function () {
    g$.livereload.listen();

    gulp.watch([
        src.html,
        src.static,
        src.javascript,
        src.css
    ]).on('change', function() {
        gulp.run('default');
        g$.livereload.changed();
    });
});

gulp.task('serve', [ 'connect' ], function () {
    require('opn')('http://localhost:' + CONNECT_PORT );
});




gulp.task('default', [ 'html', 'static', 'images', 'styles', 'scripts' ]);
