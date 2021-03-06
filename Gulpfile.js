'use strict';

var gulp = require('gulp'),
    g$ = require('gulp-load-plugins')();




var CONNECT_PORT = 9000;

var base = {
    src: './src',
    dist: './dist'
};

var src = {
    audio: base.src + '/audio/**',
    fonts: base.src + '/fonts/**',
    html: base.src + '/html/**',
    images: base.src + '/images/**',
    javascript: base.src + '/javascript/**/*.js',
    static: base.src + '/static/**',
    stylus: base.src + '/stylus/*.styl'
};

var watch = {
    html: src.html,
    images: src.images,
    javascript: src.javascript,
    static: src.static,
    stylus: base.src + '/stylus/**/*.styl'
};

var dest = {
    audio: base.dist + '/audio',
    fonts: base.dist + '/fonts',
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
    return gulp.src( src.stylus )
        .pipe( g$.stylus() )
        .pipe( gulp.dest( dest.styles ) );
});

gulp.task('images', function() {
    return gulp.src( src.images )
        .pipe( gulp.dest( dest.images ) );
});

gulp.task('fonts', function() {
    return gulp.src( src.fonts )
        .pipe( gulp.dest( dest.fonts ) );
});

gulp.task('audio', function() {
    return gulp.src( src.audio )
        .pipe( gulp.dest( dest.audio ) );
});

gulp.task('static', function() {
    return gulp.src( src.static )
        .pipe( gulp.dest( base.dist ) );
});

gulp.task('html', function() {
    return gulp.src( src.html )
        .pipe( g$.usemin({
            css: [ g$.rev() ]
        }) )
        .pipe( gulp.dest( base.dist ) );
});




gulp.task('clean', function( cb ) {
    var del = require('del');

    del( [ base.dist ], function() {
        cb();
    });
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

    gulp
        .watch( watch.html, ['html'])
        .on('change', function() {
            setTimeout(function() {
                g$.livereload.changed();
            }, 300 );
        });

    gulp
        .watch( watch.static, ['static'])
        .on('change', function() {
            setTimeout(function() {
                g$.livereload.changed();
            }, 300 );
        });

    gulp
        .watch( watch.images, ['images'])
        .on('change', function() {
            setTimeout(function() {
                g$.livereload.changed();
            }, 300 );
        });

    gulp
        .watch( watch.stylus, ['styles'])
        .on('change', function() {
            setTimeout(function() {
                g$.livereload.changed();
            }, 300 );
        });

    gulp
        .watch( watch.javascript, ['scripts'])
        .on('change', function() {
            setTimeout(function() {
                g$.livereload.changed();
            }, 300 );
        });
});

gulp.task('serve', [ 'connect' ], function () {
    require('opn')('http://localhost:' + CONNECT_PORT );
});




gulp.task('default', [ 'html', 'static', 'audio', 'fonts', 'images', 'styles', 'scripts' ]);
