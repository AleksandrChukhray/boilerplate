'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');

// Собираем SASS
gulp.task('sass', () => {
  return gulp.src(['./src/style/*.sass', '!./src/style/_*.sass'])
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Styles Sass',
          message: err.message
        }
      })
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream())
});

//собирам скрипты
gulp.task('js', () => {
  return gulp.src('./src/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Scripts JS',
          message: err.message
        }
      })
    }))
    .pipe(rename('script.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream())
});

gulp.task('pug', function buildHTML() {
  return gulp.src(['src/templates/*.pug', '!src/templates/_*.pug'])
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Pug Files',
          message: err.message
        }
      })
    }))
    .pipe(pug())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
});


//Минимизируем изображения
gulp.task('images', () => {
  return gulp.src('./src/img/**/*.{jpg,png}')
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Images',
          message: err.message
        }
      })
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
});

//Минимизируем изображения
gulp.task('fonts', () => {
  return gulp.src('./src/fonts/*.*')
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Fonts',
          message: err.message
        }
      })
    }))
    .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('vendor', () => {
    return gulp.src('./src/vendor/**/*.*')
        .pipe(plumber({
            errorHandler: notify.onError((err) => {
                return {
                    title: 'Vendor',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest('./dist/vendor/'))
});


//dev server
gulp.task('build', gulp.series('sass', 'pug', 'images', 'fonts', 'js', 'vendor'));

gulp.task('watch', () => {
  gulp.watch('./src/style/**/*.*', gulp.series('sass'));
  gulp.watch('./src/templates/**/*.*', gulp.series('pug'));
  gulp.watch('./src/js/**/*.*', gulp.series('js'));
});


gulp.task('server', () => {
  browserSync.init({
    server: './dist/'
  });

  browserSync.watch('./**/*.{css,js}').on('change', browserSync.reload);
  browserSync.watch('./**/*.html').on('change', browserSync.reload);
});


gulp.task('dev',
  gulp.series('build', gulp.parallel('watch', 'server'))
);
