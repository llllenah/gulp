const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries')
const plumber = require('gulp-plumber');
const notify = require('gulp-notify')




gulp.task('clean', function(done){
    if (fs.existsSync('./dist/')){
        return gulp.src('./dist/', {read: false})
            .pipe(clean({force: true}));
    }
    done();
})


const fileIncludeSettings ={
    prefix: '@@',
    basepath: '@file'
}

const plumberNotify =(title) =>{
    return {
        errorHandler: notify.onError({
            title: 'title',
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}



gulp.task('html', function () {
   return gulp
    .src('./src/*.html')
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest('./dist/'))
});



gulp.task('sass',function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(plumber(plumberNotify('Styles')))
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(groupMedia())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))
});


gulp.task('images', function(){
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img/'))
})


const serverOptions = {
    livereload: true,
    open: true
}

gulp.task('server', function(){
    return gulp.src('./dist/').pipe(server(serverOptions))
})

gulp.task('watch', function(){
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
})

gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images'),
    gulp.parallel('server', 'watch')
    
));