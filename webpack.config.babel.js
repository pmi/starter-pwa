import glob from 'glob';
import path from 'path';
const extractTextPlugin = require('extract-text-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));
const toStr = v => JSON.stringify(v, null, 4);

const SRC_DIR = 'src/main/resources';
const SRC_DIR_ABS = path.resolve(__dirname, SRC_DIR);
const SRC_DIR_ABS_ASSETS = path.resolve(__dirname, SRC_DIR, 'assets');

const DST_DIR = 'build/resources/main';
const DST_DIR_ABS = path.join(__dirname, DST_DIR);

const EXTENSIONS_GLOB = '{js,es6,es}';
const ASSETS_GLOB = `${SRC_DIR}/{site/assets,assets}/**/*.${EXTENSIONS_GLOB}`;
const SERVER_SIDE_JS = glob.sync(`${SRC_DIR}/**/*.${EXTENSIONS_GLOB}`, {ignore: ASSETS_GLOB});

const paths = {
    assets: 'src/main/resources/assets/',
    buildAssets: 'build/resources/main/assets/',
    buildPwaLib: 'build/resources/main/lib/pwa/'
};

const assetsPath = path.join(__dirname, paths.assets);
const buildAssetsPath = path.join(__dirname, paths.buildAssets);
const buildPwaLibPath = path.join(__dirname, paths.buildPwaLib);

module.exports = [{ // Server-side
    context: SRC_DIR_ABS, // The base directory, an absolute path, for resolving entry points and loaders from configuration
    devtool: false, // Don't waste time generating sourceMaps
    entry: dict(SERVER_SIDE_JS.map(k => [
        k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
        `.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
    ])),
    externals: [
        /^\/lib\/(enonic|xp)\/.+$/,
        /^\/lib\/http-client$/,
        /^\/lib\/router$/
    ],
    module: {
        rules: [{
            test: /\.(js|es6?)$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    babelrc: false, // The .babelrc file should only be used to transpile *.babel.js files.
                    comments: false,
                    compact: false,
                    minified: false,
                    plugins: [
                        'array-includes',
                        'transform-object-assign',
                        'transform-object-rest-spread'
                    ], // plugins
                    presets: ['es2015']
                } // options
            }] // use
        }] // rules
    }, // modules
    output: {
        path: DST_DIR_ABS, // Must be absolute
        filename: '[name].js',
        libraryTarget: 'commonjs'
    }, // output
    resolve: {
        alias: {
          '/lib': path.resolve(__dirname, SRC_DIR, 'lib')
        }
    }
}, { // Client-side

    entry: path.join(assetsPath, 'js/main.js'),

    output: {
        path: buildAssetsPath,
        filename: 'precache/bundle.js'
    },

    resolve: {
        extensions: ['.js', '.less']
    },

    module: {
        rules: [{
          test: /.js$/,
          use: [{
              loader: 'babel-loader',
              options: {
                  babelrc: false, // The .babelrc file should only be used to transpile config files.
                  comments: false,
                  compact: false,
                  minified: false,
                  plugins: [
                      'array-includes',
                      'transform-object-assign',
                      'transform-object-rest-spread'
                  ],
                  presets: ['env']
              }
            }]
        }, {
            test: /.less$/,
            loader: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: "css-loader!less-loader"
            })
        }]
    },
    plugins: [
        new extractTextPlugin('precache/bundle.css'),
        new workboxPlugin({
            globDirectory: buildAssetsPath,
            globPatterns: ['precache/**\/*'],
            globIgnores: [],
            swSrc: path.join(assetsPath, 'js/sw-dev.js'),
            swDest: path.join(buildPwaLibPath, 'sw-template.js')
        })
    ]
}];


//console.log(`WEBPACK_CONFIG:${toStr(module.exports)}`); process.exit();
