const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    entry: './src/index.ts',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
           "@": path.resolve(__dirname, './src')
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|json)$/,
                type: 'asset/resource',
            }
        ]
    },

    devServer: {
        port: 8080,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Isometric room client'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ]
        })
    ]
};
