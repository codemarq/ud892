/*eslint-env node */

const gulp 					= require('gulp');
const sass 					= require('gulp-sass');
const autoprefixer 	= require('gulp-autoprefixer');
const browserSync 	= require('browser-sync').create();
const eslint 				= require('gulp-eslint');
const jasmine 			= require('gulp-jasmine-phantom');
const concat				=	require('gulp-concat');

gulp.task('default', ['styles', 'lint', 'copy-html', 'copy-image'], () => {
	// console.log('gulp is running');

	gulp.watch('./sass/**/*.scss', ['styles']);
	gulp.watch('./js/**/*.js', ['lint']);
	gulp.watch('./index.html', ['copy-html']);
	gulp.watch('/build/index.html')
		.on('change', browserSync.reload);

	browserSync.init({
		server: './build'
	});
	
	browserSync.stream();
});

gulp.task('styles', () => {
	gulp.src('./sass/**/*.scss')
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // logs error and continues with build instead of break
			.pipe(autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(gulp.dest('./build/css'));
});

gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths.
	// So, it's best to have gulp ignore the directory as well.
	// Also, Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['**/*.js','!node_modules/**'])
		// eslint() attaches the lint output to the "eslint" property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});

gulp.task('tests', () => {
	gulp.src('./tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: './js/*.js'}));
});

gulp.task('copy-html', () => {
	gulp.src('./index.html')
		.pipe(gulp.dest('./build'));
});


gulp.task('copy-image', () => {
	gulp.src('./img/*')
		.pipe(gulp.dest('./build/img'));
});

gulp.task('scripts', () => {
	gulp.src('./js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('scripts-build', () => {
	gulp.src('./js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./build/js'));
});