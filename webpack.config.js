const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env) => {
    const isDevelopment = env.development === true;
    const isProduction = env.production === true;
    return {
        entry: './src/main.jsx',
        // 输出配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'static/js/[name].[contenthash:8].bundle.js',
            chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
            clean: true
        },
        // 模块加载规则
        module: {
            rules: [
                // 处理 JS/JSX 文件
                {
                    test: /\.(js|jsx)$/,
                    include: path.resolve(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-react'],
                                plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean)
                            }
                        }
                    ]
                },
                // 处理 CSS 文件
                {
                    test: /\.css$/i,
                    // include: path.resolve(__dirname, 'src'),
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {   
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require('autoprefixer'),
                                        require('postcss-preset-env'),
                                        require('@tailwindcss/postcss')
                                    ]
                                }
                            }
                        }
                    ].filter(Boolean)
                },
                // 处理图片等资源
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024
                        }
                    },
                    generator: {
                        filename: 'static/images/[name].[hash:8][ext]'
                    }
                }
            ]
        },

        // 插件配置
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html', // 指定 HTML 模板文件
                filename: 'index.html'
            }),
            isDevelopment && new ReactRefreshWebpackPlugin(), // 热更新支持
            isProduction && new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
            })
        ].filter(Boolean),
        // 优化配置
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10
                    }
                }
            }
        },
        // 开发服务器配置（参考 Vite 配置）
        devServer: {
            historyApiFallback: true,
            static: {
                directory: path.join(__dirname, 'dist')
            },
            port: 3000,
            hot: true,
            proxy:
                [{
                    context: '/api',
                    target: 'http://localhost:8080',
                    changeOrigin: true
                }]
        },
        // 别名配置
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            },
            extensions: ['.js', '.jsx']
        },
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'eval-source-map' : false
    };
};