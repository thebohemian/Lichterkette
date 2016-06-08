var browserify = require('browserify'),
  watchify = require('watchify'),
  gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  source = require('vinyl-source-stream'),
  sourceFile = './web/src/app.js',
  destFolder = './web/dist/',
  destFile = 'app.js',
  sourceFileOutput = './web/src/app-output.js',
  destFileOutput = 'app-output.js';
 
gulp.task('browserify', function() {
  return browserify(sourceFile)
    .bundle()
    .pipe(source(destFile))
    .pipe(gulp.dest(destFolder))
    && browserify(sourceFile)
    .bundle()
    .pipe(source(destFileOutput))
    .pipe(gulp.dest(destFolder));
});

gulp.task('watch', function() {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    plugin: [watchify]
  }).add(sourceFile);
  
  bundler.on('update', rebundle);
  rebundle();

  function rebundle() {
    return bundler.bundle()
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  }
});

gulp.task('test', function() {
  return gulp
    .src('test/*.js')
    .pipe(mocha());
});

gulp.task('default', ['browserify']);