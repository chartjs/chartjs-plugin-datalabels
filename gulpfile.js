'use strict';

var argv = require('yargs').argv;
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var file = require('gulp-file');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var merge = require('merge2');
var path = require('path');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var pkg = require('./package.json');

var srcDir = './src/';
var outDir = './dist/';
var samplesDir = './samples/';

function watch(glob, task) {
	gutil.log('Waiting for changes...');
	return gulp.watch(glob, function(e) {
		gutil.log('Changes detected for', path.relative('.', e.path), '(' + e.type + ')');
		var r = task();
		gutil.log('Waiting for changes...');
		return r;
	});
}

gulp.task('default', ['build']);

gulp.task('build', function() {
	var task = function() {
		return rollup('rollup.config.js')
			.pipe(source(pkg.name + '.js'))
			.pipe(gulp.dest(outDir))
			.pipe(rename(pkg.name + '.min.js'))
			.pipe(streamify(uglify({preserveComments: 'license'})))
			.pipe(gulp.dest(outDir));
	};

	var tasks = [task()];
	if (argv.watch) {
		tasks.push(watch(srcDir + '**/*.js', task));
	}

	return tasks;
});

gulp.task('lint', function() {
	var files = [
		samplesDir + '**/*.js',
		srcDir + '**/*.js',
		'*.js'
	];

	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('package', function() {
	return merge(
		// gather "regular" files landing in the package root
		gulp.src([outDir + '*.js', 'LICENSE.md']),

		// dist files in the package are in the root, so we need to rewrite samples
		// src="../dist/ to src="../ and then copy them in the /samples directory.
		gulp.src(samplesDir + '**/*', {base: '.'})
			.pipe(streamify(replace('src="../dist/', 'src="../')))
	)
	// finally, create the zip archive
	.pipe(zip(pkg.name + '.zip'))
	.pipe(gulp.dest(outDir));
});

gulp.task('bower', function() {
	var json = JSON.stringify({
		name: pkg.name,
		description: pkg.description,
		homepage: pkg.homepage,
		license: pkg.license,
		version: pkg.version,
		main: outDir + pkg.name + '.js'
	}, null, 2);

	return file('bower.json', json, {src: true})
		.pipe(gulp.dest('./'));
});
