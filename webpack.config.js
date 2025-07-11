const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env) => {
    const isDevelopment = env.development === true;
    const isProduction = env.production === true;
    return {
        entry: './src/index.js',
        // 输出配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'static/js/main.[contenthash:8].bundle.js',
            chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
            publicPath: '/', // 告诉webpack打包后资源的访问路径
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
                                presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
                                plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean)
                            }
                        }
                    ]
                },
                // 处理 CSS 文件
                {
                    test: /\.css$/i,
                    // include: path.resolve(__dirname, 'src'), // 影响处理reactflow库中的样式
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader'
                        },
                    ].filter(Boolean)
                },
                // 处理图片等资源
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset',// file-loader + url-loader
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024
                        },
                    },
                    generator: {
                        filename: 'static/images/[name].[hash:8][ext]'
                    }
                }
            ]
        },

        // 插件配置
        plugins: [
            // 修改DefinePlugin配置部分
            new webpack.DefinePlugin({
                'process.env.API_BASE_URL':
                    JSON.stringify('/api'),
                'process.env.WS_BASE_URL':
                    JSON.stringify('/api/ws'),
                'process.env.MINIO_BASE_URL':
                    JSON.stringify('/minio/bucket1')
            }),
            new HtmlWebpackPlugin({
                template: './index.html', // 指定 HTML 模板文件
                filename: 'index.html'
            }),
            isDevelopment && new ReactRefreshWebpackPlugin(), // 热更新支持
            isProduction && new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'public'),
                        // to: path.resolve(__dirname, 'dist'),
                        to: 'public',
                        globOptions: {
                            ignore: ['**/index.html']
                        }
                    }
                ]
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
            compress: false,
            historyApiFallback: true,
            allowedHosts: "all",
            // 配置额外资源路径
            static: {
                directory: path.join(__dirname, 'public')
            },
            port: 3000,
            hot: true,
            // proxy:
            //     [
            //         {
            //             context: '/api',
            //             target: 'http://localhost:8080',
            //             changeOrigin: true,
            //             selfHandleResponse: true,
            //             onProxyRes: function (proxyRes, req, res) {
            //                 res.status(proxyRes.statusCode);
            //                 // 确保所有后端响应头都被传递给客户端
            //                 Object.keys(proxyRes.headers).forEach(key => {
            //                     res.setHeader(key, proxyRes.headers[key]);
            //                 });
            //                 // 直接流式传递响应，避免缓冲
            //                 proxyRes.pipe(res);
            //             },
            //             onProxyReq: function (proxyReq, req, res) {
            //                 // 可以设置请求头，确保后端不缓冲
            //                 proxyReq.setHeader('Cache-Control', 'no-cache');
            //             }
            //         }]
        },
        // 别名配置
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            },
            extensions: ['.js', '.jsx', './index.js']
        },
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'cheap-module-source-map' : 'hidden-source-map'
    };
};
