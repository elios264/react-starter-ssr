require('env2')('./env.json');

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const ifDev = (then) => (isDev ? then : null);
const ifProd = (then) => (!isDev ? then : null);

module.exports = {
  target: 'web',
  profile: true,
  mode: isDev ? 'development' : 'production',
  entry: [ifDev('webpack-hot-middleware/client'), ifDev('react-hot-loader/patch'), './appLoader'].filter(_.identity),
  optimization: {
    runtimeChunk: isDev,
    minimizer: [
      new TerserPlugin({ cache: true, parallel: true, terserOptions: { toplevel: true, output: { comments: false } } }),
      new OptimizeCSSAssetsPlugin({ cssProcessorPluginOptions: { preset: ['default', { discardComments: { removeAll: true } }] } })
    ],
    splitChunks: {
      chunks: 'initial',
      name: 'common',
      cacheGroups: { styles: { name: 'styles', test: /\.css$/, chunks: 'all', enforce: true } }
    }
  },
  performance: { hints: false },
  context: path.resolve(__dirname, './src'),
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: { path: path.resolve(__dirname, './dist'), filename: isDev ? 'app.bundle.js' : 'app.bundle.[contenthash].js', },
  resolve: {
    modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './assets'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, './src'), // include your file like this in less files: ~@/yourFile.less
      '../../theme.config$': path.join(__dirname, './src/theme/semantic/theme.config.less'), //semantic requirement
      'react-dom': isDev ? '@hot-loader/react-dom' : 'react-dom'
    }
  },
  plugins: [
    ifProd(new CleanWebpackPlugin({ verbose: true })),
    ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })),
    new webpack.EnvironmentPlugin({ DEBUG: isDev, NODE_ENV: isDev ? 'development' : 'production' }),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true, cwd: path.resolve(__dirname, './src') }),
    new HtmlWebpackPlugin({ template: 'index.html', inject: true, minify: { collapseWhitespace: true } }),
    ifDev(new webpack.HotModuleReplacementPlugin()),
    new MiniCssExtractPlugin({ filename: isDev ? 'app.css' : 'app.bundle.[contenthash].css' })
  ].filter(_.identity),
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, './src')],
      use: [{ loader: 'babel-loader' }]
    }, {
      test: /\.(css|less)$/,
      use: [
        { loader: MiniCssExtractPlugin.loader, options: { hmr: isDev } },
        { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev } },
        { loader: 'postcss-loader', options: { ident: 'postcss', sourceMap: isDev,
          plugins: () => [require('postcss-custom-media')()] } },
        { loader: 'less-loader', options: { noIeCompat: true, sourceMap: isDev } }
      ]
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{ loader: 'file-loader', options: { name: '[name].[hash].[ext]' } }]
    }]
  }
};