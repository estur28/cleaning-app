const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass");

const concat = require("gulp-concat");

const browserSync = require("browser-sync").create();

const uglify = require('gulp-uglify-es').default;

const autoprefixer = require('gulp-autoprefixer');

const imagemin = require('gulp-imagemin');

const del = require('del');



function cleanDist() {
    return del('dist')
}


function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream()) 
}


function images() {
    return src('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}


function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({outputStyle: "compressed"})) //конвертация + компрессор(или expanded разложеный)
    .pipe(concat("style.min.css"))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true
    }))
    .pipe(dest("app/css"))  //куда его выкинуть
    .pipe(browserSync.stream())  //когда в css что то закинулось-мы можем обновить страницу
}


function build() {
    return src([
        'app/css/style.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], { base: 'app'})  //кидает файлы отсчитывая от ее внутренностей, а не как попало 
    .pipe(dest('dist'))
}

function watching() {
  watch(['app/scss/**/*.scss'], styles); //слежение за всеми файлами и папками в папке scss и запуск функции styles
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
  watch('app/*.html').on('change', browserSync.reload)
}


exports.styles = styles; //благодаря этому ключевому слову выполняется этот таск, вызвать gulp styles
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, scripts, browsersync, watching);
