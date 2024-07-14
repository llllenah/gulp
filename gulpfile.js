const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
var sassGlob = require('gulp-sass-glob')
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries')
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed')




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
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}



gulp.task('html', function () {
   return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./dist/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest('./dist/'))
});



gulp.task('sass',function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./dist/css/'))
        .pipe(plumber(plumberNotify('Styles')))
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(groupMedia())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))
});


gulp.task('images', function(){
    return gulp
        .src('./src/img/**/*')
        .pipe(changed('./dist/img/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./dist/img/'))
})

gulp.task('js', function(){
    return gulp.src('./src/js/*.js')
    .pipe(changed('./dist/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js/'))
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
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
})

gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images', 'js'),
    gulp.parallel('server', 'watch')
    
));