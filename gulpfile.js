'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var file = require('gulp-file');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var karma = require('karma');
var merge = require('merge2');
var path = require('path');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var {exec} = require('mz/child_process');
var pkg = require('./package.json');

var argv = require('yargs')
	.option('output', {alias: 'o', default: 'dist'})
	.option('samples-dir', {default: 'samples'})
	.option('docs-dir', {default: 'docs'})
	.option('www-dir', {default: 'www'})
	.argv;

function watch(glob, task, done) {
	gutil.log('Waiting for changes...');
	return gulp.watch(glob, task)
		.on('end', done)
		.on('change', function(e) {
			gutil.log('Changes detected for', path.relative('.', e.path), '(' + e.type + ')');
		});
}

gulp.task('default', ['build']);

gulp.task('build', function(done) {
	var out = argv.output;
	var task = function() {
		return rollup('rollup.config.js')
			.pipe(source(pkg.name + '.js'))
			.pipe(gulp.dest(out))
			.pipe(rename(pkg.name + '.min.js'))
			.pipe(streamify(uglify({output: {comments: 'some'}})))
			.pipe(gulp.dest(out));
	};

	return argv.watch
		? [task(), watch('src/**/*.js', task, done)]
		: task();
});

gulp.task('test', function(done) {
	new karma.Server({
		configFile: path.join(__dirname, 'karma.config.js'),
		singleRun: !argv.watch,
		args: {
			coverage: !!argv.coverage,
			inputs: argv.inputs
				? argv.inputs.split(';')
				: ['test/specs/**/*.js']
		}
	},
	function(error) {
		// https://github.com/karma-runner/gulp-karma/issues/18
		error = error ? new Error('Karma returned with the error code: ' + error) : undefined;
		done(error);
	}).start();
});

gulp.task('lint', function() {
	var files = [
		'samples/**/*.js',
		'src/**/*.js',
		'test/**/*.js',
		'*.js'
	];

	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('docs', function(done) {
	var script = require.resolve('gitbook-cli/bin/gitbook.js');
	var out = path.join(argv.output, argv.docsDir);
	var cmd = process.execPath;

	exec([cmd, script, 'install', './'].join(' ')).then(() => {
		return exec([cmd, script, argv.watch ? 'serve' : 'build', './', out].join(' '));
	}).then(() => {
		done();
	}).catch((err) => {
		done(new Error(err.stdout || err));
	});
});

gulp.task('samples', function() {
	// since we moved the dist files one folder up (package root), we need to rewrite
	// samples src="../dist/ to src="../ and then copy them in the /samples directory.
	var out = path.join(argv.output, argv.samplesDir);
	return gulp.src('samples/**/*', {base: 'samples'})
		.pipe(streamify(replace(/src="((?:\.\.\/)+)dist\//g, 'src="$1', {skipBinary: true})))
		.pipe(gulp.dest(out));
});

gulp.task('package', ['build', 'samples'], function() {
	var out = argv.output;
	var streams = merge(
		gulp.src(path.join(out, argv.samplesDir, '**/*'), {base: out}),
		gulp.src([path.join(out, '*.js'), 'LICENSE.md'])
	);

	return streams
		.pipe(zip(pkg.name + '.zip'))
		.pipe(gulp.dest(out));
});

gulp.task('netlify', ['build', 'docs', 'samples'], function() {
	var root = argv.output;
	var out = path.join(root, argv.wwwDir);
	var streams = merge(
		gulp.src(path.join(root, argv.docsDir, '**/*'), {base: path.join(root, argv.docsDir)}),
		gulp.src(path.join(root, argv.samplesDir, '**/*'), {base: root}),
		gulp.src(path.join(root, '*.js'))
	);

	return streams
		.pipe(streamify(replace(/https?:\/\/chartjs-plugin-datalabels\.netlify\.com\/?/g, '/', {skipBinary: true})))
		.pipe(gulp.dest(out));
});

gulp.task('bower', function() {
	var json = JSON.stringify({
		name: pkg.name,
		description: pkg.description,
		homepage: pkg.homepage,
		license: pkg.license,
		version: pkg.version,
		main: argv.output + '/' + pkg.name + '.js'
	}, null, 2);

	return file('bower.json', json, {src: true})
		.pipe(gulp.dest('./'));
});

// Workaround: Gulp process does not end because of karma/node process hanging
// https://github.com/sindresorhus/gulp-mocha/issues/1#issuecomment-55710159
// https://github.com/karma-runner/karma/issues/2867
gulp.doneCallback = function(err) {
	// eslint-disable-next-line no-process-exit
	process.exit(err ? 1 : 0);
};

