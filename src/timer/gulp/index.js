var gulp = require('gulp');
var requireDir = require('require-dir');
var notify = require("gulp-notify");

// ToDo - this is global, needs work.
errorAlert = function() {
  var args = Array.prototype.slice.call(arguments);
  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  // Keep gulp from hanging on this task
  this.emit('end');
};

paths = {
  sass: ['./src/scss/**/*.scss'],
  js: ['./src/**/*.js'],
  tpls: ['./src/templates/**/*.html'],
  // po: ['./po/**/*.po']
};

// Require all tasks in gulp/tasks, including subfolders
requireDir('./tasks', { recurse: true });
