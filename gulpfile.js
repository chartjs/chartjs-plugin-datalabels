'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var file = require('gulp-file');
var replace = require('gulp-replace');
var streamify = require('gulp-streamify');
var zip = require('gulp-zip');
var karma = require('karma');
var merge = require('merge2');
var path = require('path');
var {exec} = require('child_process');
var pkg = require('./package.json');

var argv = require('yargs')
	.option('output', {alias: 'o', default: 'dist'})
	.option('samples-dir', {default: 'samples'})
	.option('docs-dir', {default: 'docs'})
	.option('www-dir', {default: 'www'})
	.argv;

function run(bin, args, done) {
	var exe = '"' + process.execPath + '"';
	var src = require.resolve(bin);
	var ps = exec([exe, src].concat(args || []).join(' '));

	ps.stdout.pipe(process.stdout);
	ps.stderr.pipe(process.stderr);
	ps.on('close', () => done());
}

gulp.task('default', ['build']);

gulp.task('build', function(done) {
	run('rollup/bin/rollup', ['-c', argv.watch ? '--watch' : ''], done);
});

gulp.task('test', function(done) {
	new karma.Server({
		configFile: path.join(__dirname, 'karma.config.js'),
		singleRun: !argv.watch,
		args: {
			coverage: !!argv.coverage,
			inputs: (argv.inputs || 'test/specs/**/*.js').split(';'),
			watch: argv.watch
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
	var mode = argv.watch ? 'dev' : 'build';
	var out = path.join(argv.output, argv.docsDir);
	var args = argv.watch ? '' : '--dest ' + out;
	run('vuepress/bin/vuepress.js', [mode, 'docs', args], done);
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

	return streams.pipe(gulp.dest(out));
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

