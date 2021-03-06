var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulp = require('gulp');
var changeCase = require('change-case');
var gulputil = require('gulp-util');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var fs = require('fs');
var cleanCSS = require('gulp-clean-css');


function do_scss( src ) {
	var dir = src.substring( 0, src.lastIndexOf('/') );
	return gulp.src( './src/scss/' + src + '.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass( { outputStyle: 'nested' } ).on('error', sass.logError) )
		.pipe( autoprefixer({
			browsers:['last 2 versions']
		}) )
		.pipe( gulp.dest( './assets/css/' + dir ) )
        .pipe( sass( { outputStyle: 'compressed' } ).on('error', sass.logError) )
		.pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( './assets/css/' + dir ) );

}

function do_js( src ) {
	var dir = src.substring( 0, src.lastIndexOf('/') );
	return gulp.src( './src/js/' + src + '.js' )
		.pipe( sourcemaps.init() )
		.pipe( gulp.dest( './assets/js/' + dir ) )
		.pipe( uglify().on('error', gulputil.log ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( './assets/js/' + dir ) );
}

function concat_js( src, dest ) {
	return gulp.src( src )
		.pipe( sourcemaps.init() )
		.pipe( concat( dest ) )
		.pipe( gulp.dest( './assets/js/' ) )
		.pipe( uglify().on('error', gulputil.log ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( './assets/js/' ) );

}

// fake leaflet
L = {
	TileLayer: {
		extend: function(o) {
			for ( var s in o )
				L.TileLayer[s] = o[s];
			return L.TileLayer;
		},
//		Provider:{}
	},
	tileLayer:{}
}

// write providers data to ./etc
gulp.task('providers', function(cb){
	require('./node_modules/leaflet-providers/leaflet-providers.js');
	var providers = L.TileLayer.Provider.providers;
	return fs.writeFile( './etc/leaflet-providers.json', JSON.stringify( providers, null, '\t' ), cb );
});



gulp.task('scss', function() {
	return do_scss('acf-input-osm');
});


gulp.task('leaflet-css', function() {

	return gulp.parallel(
		function() {
			// frontend
			return gulp.src([
				'./node_modules/leaflet/dist/leaflet.css',
				'./node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css',
			])
				//.pipe( cleanCSS() )
				.pipe( concat('./assets/css/') )
				.pipe( rename('leaflet.css') )
				.pipe( gulp.dest( './assets/css/' ) );
		},
		function() {
			// copy images to css
			return gulp.src([
				'./node_modules/leaflet/dist/images/*.png',
				// './node_modules/leaflet-minimap/dist/images/*.png',
				'./node_modules/leaflet-control-geocoder/dist/images/*.gif',
				'./node_modules/leaflet-control-geocoder/dist/images/*.png',
			])
				.pipe( gulp.dest( './assets/css/images/' ) );
		},

	);
});


gulp.task('js-admin', function() {
    return concat_js( [
			'./src/js/acf-input-osm.js',
		], 'acf-input-osm.js');
});


gulp.task( 'js', function(){
	return concat_js( [
			'./node_modules/leaflet/dist/leaflet-src.js',
			'./node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js',
			'./node_modules/leaflet-providers/leaflet-providers.js',
			'./src/js/acf-osm-frontend.js',

		], 'acf-osm-frontend.js');
} );


gulp.task('build', gulp.parallel('scss','js','js-admin') );


gulp.task('watch', function() {
	// place code for your default task here
	gulp.watch('./src/scss/**/*.scss',	gulp.parallel( 'scss' ) );
	gulp.watch('./src/js/**/*.js',		gulp.parallel( 'js', 'js-admin' ) );
});
gulp.task('default',  gulp.parallel( 'leaflet-css', 'build', 'watch' ));
