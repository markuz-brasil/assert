/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Clean Output Directory
gulp.task('clean', del.bind(null, ['./index.js', './assertRank.js', './specs.js']));

gulp.task('es6', ['clean'], function () {
  return gulp.src(['./src/**/*.js'])
    // .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($['6to5']()).on('error', console.error.bind(console))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.'))
    .pipe($.size({title: 'es6'}))
})

gulp.task('browserify', ['es6'], function () {
  return gulp.src(['./specs.js'])
    .pipe($.browserify({debug: false}))
    .pipe(gulp.dest('.'))
    .pipe($.size({title: 'browserify'}))
})

// Watch Files For Changes & Reload
gulp.task('serve', ['browserify'], function () {
  browserSync({
    notify: false, browser: 'skip', ghostMode: false,

    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    port: 3010,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.', 'src']
  });

  gulp.watch(['gulpfile.js'], process.exit)
  gulp.watch(['./src/**/*.{js,html}'], ['browserify', reload]);
});

gulp.task('default', ['es6'])

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
