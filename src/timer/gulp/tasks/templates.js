var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
// var browserSync = require("browser-sync");

gulp.task('templates', function(done) {
  gulp.src(paths.tpls)
    .pipe(templateCache({
      standalone: true,
      module: "yoTimer.templates",
      root: "templates/"
    }))
    // .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});
