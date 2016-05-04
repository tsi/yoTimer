// var gulp = require('gulp');
// var fs = require('fs');
// var path = require('path');
// var es = require('event-stream');
// var gutil = require('gulp-util');
// var bower = require('bower');
// var concat = require('gulp-concat');
// var compass = require('gulp-compass');
// var notify = require("gulp-notify");
// var templateCache = require('gulp-angular-templatecache');
// var minifyCss = require('gulp-minify-css');
// var rename = require('gulp-rename');
// var sh = require('shelljs');
// var extend = require('gulp-extend');
// var wrap = require('gulp-wrap');
// var gettext = require('gulp-angular-gettext');

/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any file in that folder gets automatically
  required by the loop in ./gulp/index.js (required below).

  To add a new task, simply add a new task file to gulp/tasks.
*/

require('./gulp');
