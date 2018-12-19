const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const packageJson = require("./package.json");


const entry = "./src/index.js";
const publicPath = "/";
const htmlTemplatePath = "./public";
const localDevHotReloadPort = "8080";
const openBrowser = true;
const buildPath = path.resolve(__dirname, './build');
const entryJsFilename = "static/js/app.js";
const libJsFilename = "static/js/lib.js";
const chunkFilename = 'static/js/[name].[chunkhash:8].chunk.js';
const imageFilename = 'static/media/[name].[hash:8].[ext]';
const alias = {
    "@components": "./src/components",
    "@views": "./src/views",
}
const srcPath = path.resolve(__dirname, './src');

function getAlias(alias) {
    const tAlias = {};
    for (key in alias) {
        tAlias[key] = path.resolve(__dirname, alias[key]);
    }
}

module.exports = {
    mode: "development",
    bail: true,
    devtool: "source-map",
    entry: entry,
    output: {
        path: buildPath,
        filename: entryJsFilename,
        chunkFilename: chunkFilename,
        publicPath: publicPath,
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    filename: libJsFilename,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
            },
        },
        runtimeChunk: false,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: getAlias(alias),
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: imageFilename,
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: srcPath,
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose" : true }]
                            ],
                            cacheDirectory: true,
                        },
                    },
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                }
                            },
                            require.resolve('postcss-loader'),
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 2
                                }
                            },
                            require.resolve('postcss-loader'),
                            require.resolve('sass-loader'),
                        ]
                    },
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, 'public/index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    performance: false,

    devServer: {
        publicPath: publicPath,
        contentBase: htmlTemplatePath,
        port: localDevHotReloadPort,
        compress: true,
        open: openBrowser,
    }
}