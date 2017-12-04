  var gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      sourcemaps   = require('gulp-sourcemaps'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      browser      = require('browser-sync').create(),
      iconfont     = require("gulp-iconfont"),
      svgstore     = require('gulp-svgstore'),
      svgmin       = require('gulp-svgmin'),
      plumber      = require('gulp-plumber'),
      consolidate  = require("gulp-consolidate");

gulp.task('svgstore', function () {
    return gulp
        .src('assets/icons/*.svg')
        .pipe(svgmin(function (file) {
           
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix:'svg-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('dist/svg'));//path to my folder
});



gulp.task('sass', function () {
  return gulp.src('assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      output_style: 'compressed',
      includePaths: [
                     'node_modules/foundation-sites/scss',
                     'node_modules/normalize-scss/sass'
                     ]
    }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 version'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browser.stream({match: '**/*.css'}));
});

// Starts a BrowerSync instance
gulp.task('serve', ['sass'], function(){
  browser.init({
        server: {
            baseDir: "./"
        }
    });
});

// Runs all of the above tasks and then waits for files to change
gulp.task("build:icons", function() {
    return gulp.src(["./assets/icons/*.svg"]) //path to svg icons
      .pipe(iconfont({
        fontName: "myicons",
        formats: ["ttf", "eot", "woff", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true,
        fontHeight: 1000
      }))
      .on("glyphs", (glyphs) => {

        gulp.src("./assets/icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myicons",
                fontPath: "../assets/fonts/"
            }))
            .pipe(gulp.dest("./assets/scss/icons/")); // generated scss files with classes
      })
      .pipe(gulp.dest("./dist/assets/fonts/")); //icon font destination
});
  gulp.task('default', ['serve'], function() {
  gulp.watch(['assets/scss/**/*.scss'], ['sass']);
  gulp.watch('./**/*.html').on('change', browser.reload);
});




  

  gulp.task('clean', function(){
    return del('./dist/css');
  });

  gulp.task('imgreplace', function(){
    return gulp.src('assets/img/**/*')
    .pipe(gulp.dest('dist/img/'));
  });

  gulp.task('iconreplace', function(){
    return gulp.src('assets/icons/**/*.svg')
    .pipe(gulp.dest('dist/icons/'));
  });

  gulp.task('js:replace', function(){
    return gulp.src('assets/libs/*.js')
    .pipe(gulp.dest('dist/libs/'));
  });