/* global Promise */

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

function run(bin, args) {
	return new Promise((resolve, reject) => {
		var exe = path.join('node_modules', '.bin', bin);
		var ps = exec([exe].concat(args || []).join(' '));

		ps.stdout.pipe(process.stdout);
		ps.stderr.pipe(process.stderr);
		ps.on('close', (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

gulp.task('build', function() {
	return run('rollup', ['-c', argv.watch ? '--watch' : '']);
});

gulp.task('test-unit', function(done) {
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

gulp.task('test-types', function() {
	return run('tsc', ['-p', 'types/test/']);
});

gulp.task('test', gulp.parallel('test-unit', 'test-types'));

gulp.task('lint', function() {
	var files = [
		'samples/**/*.js',
		'samples/**/*.html',
		'src/**/*.js',
		'test/**/*.js',
		'*.js'
	];

	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('docs', function() {
	var mode = argv.watch ? 'dev' : 'build';
	var out = path.join(argv.output, argv.docsDir);
	var args = argv.watch ? '' : '--dest ' + out;
	return run('vuepress', [mode, 'docs', args]);
});

gulp.task('samples', function() {
	// since we moved the dist files one folder up (package root), we need to rewrite
	// samples src="../dist/ to src="../ and then copy them in the /samples directory.
	var out = path.join(argv.output, argv.samplesDir);
	return gulp.src('samples/**/*', {base: 'samples'})
		.pipe(streamify(replace(/src="((?:\.\.\/)+)dist\//g, 'src="$1', {skipBinary: true})))
		.pipe(gulp.dest(out));
});

gulp.task('package', gulp.series(gulp.parallel('build', 'samples'), function() {
	var out = argv.output;
	var streams = merge(
		gulp.src(path.join(out, argv.samplesDir, '**/*'), {base: out}),
		gulp.src([path.join(out, '*.js'), 'LICENSE.md'])
	);

	return streams
		.pipe(zip(pkg.name + '.zip'))
		.pipe(gulp.dest(out));
}));

gulp.task('netlify', gulp.series(gulp.parallel('build', 'docs', 'samples'), function() {
	var root = argv.output;
	var out = path.join(root, argv.wwwDir);
	var streams = merge(
		gulp.src(path.join(root, argv.docsDir, '**/*'), {base: path.join(root, argv.docsDir)}),
		gulp.src(path.join(root, argv.samplesDir, '**/*'), {base: root}),
		gulp.src(path.join(root, '*.js'))
	);

	return streams.pipe(gulp.dest(out));
}));

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

gulp.task('default', gulp.parallel('build'));
