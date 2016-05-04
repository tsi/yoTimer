var gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.tpls, ['templates']);
  // gulp.watch(paths.js, ['pot']);
  // gulp.watch(paths.tpls, ['pot']);
  // gulp.watch(paths.po, ['translations']);
});
