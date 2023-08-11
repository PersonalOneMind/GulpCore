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
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');

function style() {
	return src('./src/style/sass/style.sass')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version']
		}))
		.pipe(concat('style.min.css'))
		.pipe(dest('dist/style/'))
		.pipe(browserSync.stream());
}

function script() {
	return src([
		'./src/js/index.js'
	])
		.pipe(concat('index.min.js'))
		.pipe(uglify())
		.pipe(dest('./dist/js'))
		.pipe(browserSync.stream());
}

function html() {
	return src('./src/**/*.pug')
		.pipe(pug())
		.pipe(dest('./dist'))
		.pipe(browserSync.stream());
}

function watching() {
	watch(['./src/style/sass/**/*.sass'], style);
	watch(['./src/js/**/*.js'], script);
	watch(['./src/**/*.pug'], html).on('change', browserSync.reload);
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: "./src"
		}
	});
}

exports.style = style;
exports.script = script;
exports.html = html;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(browsersync, watching)
