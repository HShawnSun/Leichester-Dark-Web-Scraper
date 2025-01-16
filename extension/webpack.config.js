const path = require('path');
const webpackCopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

let config = {
    entry: {
        background: './src/background-scripts/background.js',
        processPage: './src/content-scripts/processPage.js',
        displayImage: './src/content-scripts/displayImage.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    // mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new webpackCopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/popup', to: 'popup'},
            ],
        })
    ]
}

module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        config.plugins.push(new ZipPlugin({
            path: path.resolve(__dirname, 'release'),
            extension: 'xpi',
            filename: 'scraper-extension',
        }))
    }
    return config;
};
