const gulp = require('gulp');
require('./gulp/dev.js')

gulp.task('default', gulp.series(
    'clean:dev', 
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'js:dev'),
    gulp.parallel('server:dev', 'watch:dev')
    
));