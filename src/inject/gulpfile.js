(function(console) {
  'use strict';

  var gulp = require('gulp');
  var watch = require('gulp-watch');
  var io = require('socket.io');
  var browserSync = require('browser-sync').create();

  // Default task
  gulp.task('default', [
    // 'browser-sync',
    'chrome-watch'
  ]);

  // gulp.task('browser-sync', function() {
  //   browserSync.init({
  //     proxy: "https://app.yodiz.com/plan/pages/scrum-board.vz"
  //   });
  // });

  gulp.task('chrome-watch', function () {
    var WEB_SOCKET_PORT = 8890;

    io = io.listen(WEB_SOCKET_PORT);

    watch('**/*.*', function(file) {
      console.log('change detected', file.relative);
      io.emit('file.change', {});
      browserSync.reload();
    });
  });

})(global.console);
