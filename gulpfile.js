let {
    src,
    dest,
    parallel,
    series
} = require("gulp");
let gulp = require("gulp");
let browsersync = require("browser-sync").create();
let fileInclude = require("gulp-file-include");
let del = require("del");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
let groupMedia = require("gulp-group-css-media-queries");
let cleanCss = require("gulp-clean-css");
let rename = require("gulp-rename");
// let uglify = require("gulp-uglify-es").default;
let imagemin = require("gulp-imagemin");
let webp = require("gulp-webp");
let webpHtml = require("gulp-webp-html");
// let webpCss = require("gulp-webpcss");
let svgsprite = require("gulp-svg-sprite");
let ttf2woff = require("gulp-ttf2woff");
let ttf2woff2 = require("gulp-ttf2woff2");
let webpack = require("webpack-stream");

let project_folder = require("path").basename(__dirname);
let source_folder = "#src";

let fs = require("fs");

let path = {
    build: {
        html: `${project_folder}/`,
        css: `${project_folder}/css/`,
        js: `${project_folder}/js/`,
        img: `${project_folder}/images/`,
        fonts: `${project_folder}/fonts/`,
    },
    src: {
        html: [`${source_folder}/**/*.html`, `!${source_folder}/**/_*.html`],
        css: `${source_folder}/sass/index.sass`,
        js: `${source_folder}/js/index.js`,
        img: `${source_folder}/images/**/*.+(jpg|png|svg|gif|ico|webp)`,
        fonts: `${source_folder}/fonts/**/*.ttf`,
    },
    watch: {
        html: `${source_folder}/**/*.html`,
        css: `${source_folder}/sass/**/*.sass`,
        js: `${source_folder}/js/**/*.js`,
        img: `${source_folder}/images/**/*.+(jpg|png|svg|gif|ico|webp)`,
    },
    clean: `./${project_folder}/`
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: `./${project_folder}/`
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileInclude())
        .pipe(webpHtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            sass({
                outputStyle: "expanded"
            })
        )
        .pipe(groupMedia())
        .pipe(autoprefixer({
            overrideBrowserlist: ["last 5 versions"],
            cascade: true
        }))
        // .pipe(webpCss())
        .pipe(dest(path.build.css))
        .pipe(cleanCss())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: false,
            devtool: "source-map",
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]
                            ]
                        }
                    }
                }]
            }
        }))
        // .pipe(dest(path.build.js))
        // .pipe(uglify())
        // .pipe(rename({
        //     extname: ".min.js"
        // }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
    return src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interlaced: true,
            optimizationLevel: 3 // 0 to 7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function svgSprite() {
    return src([`${source_folder}/iconsprite/*.svg`])
        .pipe(svgsprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", //sprite file name 
                    example: true // example result in html file 
                }
            }
        }))
        .pipe(dest(path.build.img))
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

function fontsStyle() {
    let file_content = fs.readFileSync(source_folder + '/sass/helpers/_mixins.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/sass/helpers/_mixins.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/sass/helpers/_mixins.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean);
}

let build = series(clean, parallel(html, css, js, images, svgSprite, fonts), fontsStyle);
let watch = parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.svgSprite = svgSprite;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watch = watch;
exports.default = watch;