'use strict';

var gulp        = require( 'gulp' ),
	bower       = require( 'gulp-bower' ),
	del         = require( 'del' ),
	cdnizer     = require( 'gulp-cdnizer' ),
	htmlreplace = require( 'gulp-html-replace' ),
	minifyHTML  = require( 'gulp-minify-html' ),
	concat      = require( 'gulp-concat' ),
	ngAnnotate  = require( 'gulp-ng-annotate' ),
	uglify      = require( 'gulp-uglify' ),
	minifyCSS   = require( 'gulp-minify-css' ),
	ngHtml2Js   = require( 'gulp-ng-html2js' ),
	sourcemaps  = require( 'gulp-sourcemaps' ),
	path        = require( 'path' ),
	crypto      = require( 'crypto' ),
	revisions   = {};

function revisionMap() {

	function md5( str ) {
		return crypto.createHash( 'md5' ).update( str ).digest( 'hex' ).slice( 0, 8 );
	}

	function saveRevision( file, callback ) {
		revisions[file.relative] = file.relative + '?rev=' + md5( file.contents );
		callback( null, file );
	}

	return require( 'event-stream' ).map( saveRevision );
}

gulp.task( 'clean', function ( callback ) {
	del( ['dist'], callback );
} );

gulp.task( 'html', ['clean', 'bower', 'application', 'scripts', 'partials', 'styles', 'htaccess'], function () {
	return gulp.src( 'src/*.php' )
		.pipe( cdnizer( {
			allowMin: true,
			files:    [
				// JavaScript
				'google:jquery',
				'google:angular-loader',
				'google:angular-resource',
				'google:angular',
				{
					file:    'bower_components/angular-bootstrap/*.js',
					package: 'angular-bootstrap',
					cdn:     'cdnjs:angular-ui-bootstrap:${ filenameMin }'
				},
				{
					file:    'bower_components/angular-ui-router/**/*.js',
					package: 'angular-ui-router',
					cdn:     'cdnjs:angular-ui-router:${ filenameMin }'
				},
				{
					file:    'bower_components/moment/*.js',
					package: 'moment',
					cdn:     'cdnjs:moment.js:${ filenameMin }'
				},
				{
					file:    'bower_components/underscore/underscore.js',
					package: 'underscore',
					cdn:     'cdnjs:underscore.js:underscore-min.js'
				},
				{
					file:    'bower_components/papaparse/papaparse.js',
					package: 'papaparse',
					cdn:     '//cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.1/papaparse.min.js'
				},

				// CSS
				{
					file:    'bower_components/bootstrap/**/*.css',
					package: 'bootstrap',
					cdn:     'cdnjs:twitter-bootstrap:css/${ filenameMin }'
				}
			]
		} ) )
		.pipe( htmlreplace( {
			application: [
				'js/' + revisions['app.min.js'],
				'js/' + revisions['templates.min.js']
			],
			styles:      'css/' + revisions['styles.min.css'],
			scripts:     'js/' + revisions['scripts.min.js']
		} ) )
		.pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'application', ['clean'], function () {
	return gulp.src( ['src/js/**/*.module.js', 'src/js/**/*.js'] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'app.min.js' ) )
		.pipe( ngAnnotate() )
//		.pipe( uglify() )
		.pipe( revisionMap() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( 'dist/js' ) );
} );

gulp.task( 'scripts', ['clean'], function () {
	return gulp.src( [
		'src/bower_components/angular-growl-v2/build/angular-growl.js'
	] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'scripts.min.js' ) )
		.pipe( ngAnnotate() )
//		.pipe( uglify() )
		.pipe( revisionMap() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( 'dist/js' ) );
} );

gulp.task( 'partials', ['clean'], function () {
	return gulp.src( ['src/js/**/*.html'] )
		.pipe( sourcemaps.init() )
		.pipe( minifyHTML() )
		.pipe( ngHtml2Js( {
			moduleName:    'globalProfile',
			prefix:        'js/',
			declareModule: false
		} ) )
		.pipe( concat( 'templates.min.js' ) )
		.pipe( uglify() )
		.pipe( revisionMap() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( 'dist/js' ) );
} );

gulp.task( 'styles', ['clean'], function () {
	return gulp.src( [
		'src/bower_components/angular-growl-v2/build/angular-growl.css',
		'src/css/**/*.css'
	] )
		.pipe( concat( 'styles.min.css' ) )
//		.pipe( minifyCSS() )
		.pipe( revisionMap() )
		.pipe( gulp.dest( 'dist/css' ) );
} );

gulp.task( 'images', ['clean'], function () {
	return gulp.src( ['src/img/**/*.png'] )
		.pipe( gulp.dest( 'dist/img' ) );
} );

gulp.task( 'htaccess', ['clean'], function () {
	return gulp.src( 'src/.htaccess' )
		.pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'bower', function () {
	return bower();
} );

gulp.task( 'build', ['images', 'html'] );

gulp.task( 'default', ['build'] );
