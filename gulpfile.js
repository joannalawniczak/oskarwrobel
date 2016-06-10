'use strict';

const path = require( 'path' );
const del = require( 'del' );
const gulp = require( 'gulp' );
const gulpIf = require( 'gulp-if' );
const gulpSass = require('gulp-sass');
const gulpCssnano = require( 'gulp-cssnano' );
const gulpAutoprefixer = require( 'gulp-autoprefixer' );

const src = './assets/src';
const dest = './assets/dist';

const config = {
	styles: {
		packages: path.join( src, 'styles', '*.scss' ),
		src: path.join( src, 'styles', '**', '*.scss' ),
		dest: path.join( dest, 'styles' )
	},

	images: {
		src: path.join( src, 'images' ),
		dest
	}
};

const utils = {
	symlink( from, to ) {
		return gulp.src( from )
			.pipe( gulp.symlink( to ) );
	},

	copy( from, to ) {
		return gulp.src( from )
			.pipe( gulp.dest( to ) );
	},

	clean( path ) {
		return del( path );
	}
};

const tasks = {
	styles( options = {} ) {
		return gulp.src( config.styles.packages )
			.pipe( gulpSass().on( 'error', gulpSass.logError ) )
			.pipe( gulpAutoprefixer( { browsers: ['last 2 versions'] } ) )
			.pipe( gulpIf( !options.debug, gulpCssnano() ) )
			.pipe( gulp.dest( config.styles.dest ) );
	},

	images( options = {} ) {
		if ( !options.debug ) {
			const from = path.join( config.images.src, '**', '*.*' );
			const to = path.join( dest, 'images' );

			return utils.copy( from, to );
		}

		return utils.symlink( config.images.src, dest );
	},

	watch() {
		gulp.watch( config.styles.src, gulp.series( 'styles:debug' ) );
	}
};

gulp.task( 'clean', () => utils.clean( dest ) );

gulp.task( 'styles:debug', () => tasks.styles( { debug: true } ) );
gulp.task( 'images:debug', () => tasks.images( { debug: true } ) );

gulp.task( 'styles', tasks.styles );
gulp.task( 'images', tasks.images );

gulp.task( 'watch', tasks.watch );

gulp.task( 'build', gulp.series( 'clean', gulp.parallel( 'styles', 'images' ) ) );
gulp.task( 'build:debug', gulp.series( 'clean', gulp.parallel( 'styles:debug', 'images:debug' ), 'watch' ) );
