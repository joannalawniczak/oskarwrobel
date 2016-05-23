'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

const config = {
	styles: {
		src: './styles/scss/*.scss',
		dest: './styles/css/'
	}
};

const tasks = {
	styles() {
		return gulp.src(config.styles.src)
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest(config.styles.dest));
	}
};

gulp.task('styles', tasks.styles);
gulp.task('default', ['styles'], () => gulp.watch(config.styles.src, ['styles']));
