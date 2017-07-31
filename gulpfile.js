'use strict';

//улучшение производительности
/*
* gulp-newer (полезен когда нужны быстрые и независимые запуски, фильтрует более новые файлы чем те которые указаны)
* gulp-remember (позволяет кешировать цепочку обработки)
* gulp-cached (исключает одинаковые файлы, работает с содержимым)
* gulp-cache (позволяет кешировать результаты обработки потока на диск)
* {since: gulp.lastRun('sass')} (исключает одинаковые файлы, работает с датой модификации)
*
* */

const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const cached = require('gulp-cached'); //запоминает файлы которые через него проходят вместо {since: gulp.lastRun('sass')}
const remember = require('gulp-remember'); //плагин для определения новых файлов.

const path = require('path');

// Собираем SASS
gulp.task('sass', () => {
  return gulp.src(['./src/style/*.sass'])
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Styles Sass',
          message: err.message
        }
      })
    }))
    //.pipe(cached('sass'))
    .pipe(remember('sass'))
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
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
    .pipe(cached('js'))
    .pipe(remember('js'))
    .pipe(rename('script.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream())
});


//cобираем pug
gulp.task('pug', function buildHTML() {
  return gulp.src(['src/templates/*.pug'])
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Pug Files',
          message: err.message
        }
      })
    }))
    //.pipe(cached('pug'))
    .pipe(remember('pug'))
    .pipe(pug())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
});


//Минимизируем изображения
gulp.task('images', () => {
  return gulp.src('./src/img/**/*.{jpg,png,svg}')
    .pipe(cached('images'))
    .pipe(remember('images'))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
});

gulp.task('sprites', function () {
  return  gulp.src('./src/**/png/*.png')
    .pipe(tasks.spritesmith({
      imgName: 'sprite.png',
      styleName: 'sprite.css',
      imgPath: '../img/sprite.png'
    }))
    .pipe(gulpif('*.png', gulp.dest('./dist/img/')))
    .pipe(gulpif('*.css', gulp.dest('./dist/css/')));
});


//Переносим шрифты
gulp.task('fonts', () => {
  return gulp.src('./src/fonts/*.*')
    .pipe(cached('fonts'))
    .pipe(remember('fonts'))
    .pipe(gulp.dest('./dist/fonts'))
});


//переносим папки вендров
gulp.task('vendor', () => {
    return gulp.src('./src/vendor/**/*.*')
        .pipe(gulp.dest('./dist/vendor/'))
});


//dev server
gulp.task('build', gulp.series('sass', 'pug', 'images', 'fonts', 'js', 'vendor'));


//наблюдаем за всем происходящим
gulp.task('watch', () => {
  gulp.watch('./src/style/**/*.sass', gulp.series('sass'))
    .on('change', function (event) {
      if (event.type === 'deleted') { // if a file is deleted, forget about it
        //delete cache.caches['sass'][event.path];
        remember.forget('sass', event.path);
      }
    });

  gulp.watch('./src/templates/**/*.pug', gulp.series('pug'))
    .on('change', function (event) {
      if (event.type === 'deleted') { // if a file is deleted, forget about it
        //delete cache.caches['pug'][event.path];
        remember.forget('pug', event.path);
      }
    });

  gulp.watch('./src/js/**/*.js', gulp.series('js'))
    .on('change', function (event) {
      if (event.type === 'deleted') { // if a file is deleted, forget about it
        delete cache.caches['js'][event.path];
        remember.forget('js', event.path);
      }
    })
});


//подключаем сервер
gulp.task('server', () => {
  browserSync.init({
    server: './dist'
  });
});


//запускаем все подряд
gulp.task('dev',
  gulp.series('build', gulp.parallel('watch', 'server'))
);
