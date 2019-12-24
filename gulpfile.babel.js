import gulp from "gulp";
import browserSync from "browser-sync";
import del from "del";
import rename from "gulp-rename";
import pug from "gulp-pug";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import htmlmin from "gulp-htmlmin";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import rollup from "gulp-better-rollup";
import uglify from "gulp-uglify-es";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";

const syncServer = browserSync.create();

const config = {
  dist: `build`,
  style: {
    src: `src/style.scss`,
    watch: `src/styles/**/*.scss`,
    dest: `build/css`
  },
  html: {
    src: `src/views/pages/*.pug`,
    watch: `src/views/**/*.pug`,
    dest: `build`
  },
  js: {
    src: `src/js/main.js`,
    srcLibs: `src/libs/**/*.js`,
    watch: `src/js/**/*.js`,
    dist: `build/js/`,
    distLibs: `build/js/`
  },
  font: {
    src: `src/fonts/**/*.woff2`,
    dest: `build/fonts`
  },
  image: {
    src: `src/images/**/*.{jpg,jpeg,png,svg}`,
    dest: `build/images`
  }
};

gulp.task(`refresh`, done => {
  syncServer.reload();
  done();
});

gulp.task(`server`, () => {
  syncServer.init({
    server: `build/`,
    notify: false
  });

  gulp.watch(config.image.src, gulp.series(`images`, `webp`, `refresh`));
  gulp.watch(config.html.watch, gulp.series(`pug`, `refresh`));
  gulp.watch(config.style.watch, gulp.series(`cssDev`));
  gulp.watch(config.js.watch, gulp.series(`scriptsDev`, `refresh`));
});

gulp.task(`copy`, () => {
  return gulp.src(config.font.src).pipe(gulp.dest(config.font.dest));
});

gulp.task(`images`, () => {
  return gulp
    .src(config.image.src)
    .pipe(imagemin([imagemin.jpegtran({ progressive: true })]))
    .pipe(gulp.dest(config.image.dest));
});

gulp.task(`webp`, () => {
  return gulp
    .src(config.image.src)
    .pipe(webp())
    .pipe(gulp.dest(config.image.dest));
});

gulp.task(`pug`, () => {
  return gulp
    .src(config.html.src)
    .pipe(pug())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task(`css`, () => {
  return gulp
    .src(config.style.src)
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(sass({ outputStyle: `compressed` }))
    .pipe(rename(`style.min.css`))
    .pipe(gulp.dest(config.style.dest));
});

gulp.task(`cssDev`, () => {
  return gulp
    .src(config.style.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(rename(`style.min.css`))
    .pipe(gulp.dest(config.style.dest))
    .pipe(syncServer.stream());
});

gulp.task(`vendorScripts`, () => {
  return gulp
    .src(config.js.srcLibs)
    .pipe(concat(`vendor.js`))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: `.min`
      })
    )
    .pipe(gulp.dest(config.js.distLibs));
});

gulp.task(`scripts`, () => {
  return gulp
    .src(config.js.src)
    .pipe(
      rollup({
        format: "esm"
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(config.js.dist));
});

gulp.task(`scriptsDev`, () => {
  return gulp
    .src(config.js.src)
    .pipe(sourcemaps.init())
    .pipe(
      rollup({
        format: "esm"
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.js.dist));
});

gulp.task(`clean`, () => del(config.dist));

gulp.task(
  `build`,
  gulp.series(
    `clean`,
    `copy`,
    `images`,
    `webp`,
    `pug`,
    `css`,
    `vendorScripts`,
    `scripts`
  )
);

gulp.task(
  `buildDev`,
  gulp.series(
    `clean`,
    `copy`,
    `images`,
    `webp`,
    `pug`,
    `cssDev`,
    `vendorScripts`,
    `scriptsDev`
  )
);

gulp.task(`start`, gulp.series(`buildDev`, `server`));
