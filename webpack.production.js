const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const config = require('./config.webpack')
module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].bundle.js',
        clean: true,
        publicPath: './' ,
        publicPath: config.publicPath
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src')
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
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'HOST',
            remotes: config.moduleRemotes,
            filename: 'remoteEntry.js',
            exposes: config.moduleExposes,
            shared: config.shared
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            // favicon: './src/app/assets/images/icons/iconWell.ico',
            favicon: './src/app/assets/images/icons/favicon.ico',

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
                minifyURLs: true
            }
        }),

        new Dotenv({
            path: path.resolve(__dirname, '.env.production')
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
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            modules: {
                                localIdentName: '[hash:base64]'
                            },
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|eot|ttf|woff|woff2|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/media/[name].[contenthash:6][ext]'
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: -10
                }
            }
        }
    }
}
