var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var concat = require('gulp-concat');

gulp.task('scripts', function (done) {

  function getFolders(dir){
    return fs.readdirSync(dir)
      .filter(function(file){
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
  }

  var scriptsPath = './src/js/';
  var scriptsDest = './www/js/';
  var folders = getFolders(scriptsPath);

  gulp.src(['src/js/*.js'])
    .pipe(gulp.dest(scriptsDest))

  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(scriptsPath, folder, '/*.js'))
      .pipe(concat(folder + '.js'))
      .pipe(gulp.dest(scriptsDest));
  });

  return es.concat.apply(null, tasks);

});
