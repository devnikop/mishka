import gulp from "gulp";
import browserSync from "browser-sync";
import del from "del";
import rename from "gulp-rename";
import htmlmin from "gulp-htmlmin";
import sass from "gulp-sass";
import csso from "gulp-csso";

const syncServer = browserSync.create();

const config = {
  style: {
    src: "src/style.scss",
    watch: "src/styles/**/*.scss",
    dest: "build/css"
  },
  html: {
    src: "src/*.html",
    dest: "build"
  },
  font: {
    src: "src/fonts/**/*.woff2",
    dest: "build/fonts"
  }
};

gulp.task("refresh", done => {
  syncServer.reload();
  done();
});

gulp.task("server", () => {
  syncServer.init({
    server: "build/",
    notify: false
  });

  gulp.watch(config.style.watch, gulp.series("css"));
  gulp.watch(config.html.src, gulp.series("html", "refresh"));
});

gulp.task("copy", () => {
  return gulp.src(config.font.src).pipe(gulp.dest(config.font.dest));
});

gulp.task("html", () => {
  return gulp
    .src(config.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task("css", () => {
  return gulp
    .src(config.style.src)
    .pipe(sass())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(config.style.dest))
    .pipe(syncServer.stream());
});

gulp.task("clean", () => del("build"));

gulp.task("build", gulp.series("clean", "copy", "html", "css"));

gulp.task("start", gulp.series("build", "server"));
