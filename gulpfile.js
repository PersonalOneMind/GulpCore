// import pkg from 'gulp';
// const { src, dest } = pkg;
// import sass from 'gulp-sass';
// import concat from 'gulp-concat';
/*Может когда то перепишу под ES6...*/

const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

function styles() {
	return src('./src/style/sass/style.sass')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat('style.min.css'))
		.pipe(dest('dist/style/style.css'))
		.pipe(browserSync.stream());
}

function watching() {
	watch(['./src/style/sass/**/*.sass'], styles);
	watch(['./src/*.pug']).on('change', browserSync.reload);
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: "./src"
		}
	});
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(browsersync, watching)
