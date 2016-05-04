var gulp = require('gulp');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('styles', function(done) {
  gulp.src(paths.sass)
    .pipe(compass({
      config_file: './config.rb',
      sass: 'src/scss',
      css: 'www/css'
    }))
    .on('error', errorAlert)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
