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
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

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

function image() {
	return src(['src/images/**/*.*', '!./src/images/icons/*.svg'])
		.pipe(avif({ quality: 50 }))

		.pipe(src('src/images/**/*.*'))
		.pipe(webp())

		.pipe(src('src/images/**/*.*'))
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('./dist/images'))
}

function watching() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	watch(['./src/style/sass/**/*.sass'], style);
	watch(['./src/js/**/*.js'], script);
	watch(['./src/**/*.pug'], html).on('change', browserSync.reload);
}

function cleanDist() {
	return del('./dist')
}

exports.style = style;
exports.script = script;
exports.html = html;
exports.image = image;
exports.watching = watching;
exports.cleanDist = cleanDist;

exports.default = parallel(style, script, html, image, watching)
