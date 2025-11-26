const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./config.webpack')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].bundle.js',
        chunkFilename: '[name].[contenthash].chunk.js',
        clean: true,
        publicPath: './' ,
        publicPath: config.publicPath
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        open: false,
        historyApiFallback: true,
        port: 55000,
        client: {
            overlay: false
        }
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '@': path.resolve(__dirname, 'src')
        },
        extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
            '.scss',
            '.png',
            '.svg',
            '.jpg',
            '.gif',
            '.eot',
            '.ttf',
            '.woff',
            '.woff2',
            '.jpeg',
            '.bmp',
            '.webp',
            '.ico'
        ]
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'BASE_ARCHITECTURE',
            remotes: config.moduleRemotes,
            filename: 'remoteEntry.js',
            exposes: config.moduleExposes,
            shared: config.shared
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].[contenthash].css',
            ignoreOrder: true
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            favicon: './src/app/assets/images/icons/favicon.ico',
            minify: false
        }),
        new ESLintPlugin({
            extensions: ['.tsx', '.ts', '.js', '.jsx']
        }),

        new Dotenv({
            path: path.resolve(__dirname, '.env.development')
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /\.module\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },

            {
                test: /\.module\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            },
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|eot|ttf|woff|woff2|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name].[ext]'
                }
            }
        ]
    }
}
