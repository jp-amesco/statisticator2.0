const gulp = require('gulp');//biblioteca principal
const $ = require('gulp-load-plugins')();
const pug = require('gulp-pug');
const less = require('gulp-less');
const aliasify = require('aliasify');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');//biblioteca de minificação dos arquivos js
const sourcemaps = require('gulp-sourcemaps');//biblioteca para facilitar o debug via navegador
const eslintify = require('eslintify');//biblioteca para verificar a qualidade de escrita do código
const babelify = require('babelify');
const uglify = require('gulp-uglify-es').default;
const stringify = require('stringify');

const fileJs = './js/app.js';
const fileCss = './css/app.less';

function css() {
	return gulp
		.src(fileCss)
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(gulp.dest('./css'))
}

function js() {
	return gulp
		.src(fileJs)
		.pipe($.bro({
			transform: [
				[eslintify, {'quiet-ignored': true}], babelify, stringify(['.html'])
			],
			error: $.notify.onError('Error: <%= error.message %>'),
			debug: true
		}))
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./js'))
}


function watch() {
	gulp.watch('../*/public/js/*.js', js);
	gulp.watch('../*/public/less/*.less', css);
}

gulp.task('watch', gulp.series(js, css, watch));