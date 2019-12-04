"use strict";

const gulp = require("gulp");
const del = require("del");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const csso = require("gulp-csso");

const config = {
  styles: {
    src: "src/styles/**/*.scss",
    dest: "build"
  },
  html: {
    src: "src/*.html",
    dest: "build"
  }
};

gulp.task("copy", () => {
  return gulp.src(config.html.src).pipe(gulp.dest(config.html.dest));
});

gulp.task("css", () => {
  return gulp
    .src(config.styles.src)
    .pipe(sass())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(config.styles.dest));
});

gulp.task("clean", () => {
  return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "css"));

gulp.task("start", gulp.series("build"));
