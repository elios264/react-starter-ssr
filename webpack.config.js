require('env2')('./env.json');

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { ChunksAssetsPlugin } = require('./server/webpack');
const nodeExternals = require('webpack-node-externals');

const isDev = process.env.NODE_ENV !== 'production';
const ifDev = (then) => (isDev ? then : null);
const ifProd = (then) => (!isDev ? then : null);

const csr = {
  target: 'web',
  profile: true,
  mode: isDev ? 'development' : 'production',
  entry: { app: [ifDev('webpack-hot-middleware/client'), ifDev('react-hot-loader/patch'), './appLoader'].filter(_.identity) },
  optimization: {
    runtimeChunk: isDev,
    minimizer: [
      new TerserPlugin({ cache: true, parallel: true, terserOptions: { toplevel: true, output: { comments: false } } }),
      new OptimizeCSSAssetsPlugin({ cssProcessorPluginOptions: { preset: ['default', { discardComments: { removeAll: true } }] } })
    ],
    splitChunks: {
      cacheGroups: { styles: { name: 'styles', test: /\.css$/, chunks: 'all', enforce: true } }
    }
  },
  performance: { hints: false },
  context: path.resolve(__dirname, './src'),
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: { path: path.resolve(__dirname, './dist'), filename: isDev ? '[name].bundle.js' : '[name].bundle.[contenthash].js', },
  resolve: {
    modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './assets'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, './src'), // include your file like this in less files: ~@/yourFile.less
      '../../theme.config$': path.join(__dirname, './src/theme/semantic/theme.config.less'), //semantic requirement
      'react-dom': isDev ? '@hot-loader/react-dom' : 'react-dom'
    }
  },
  plugins: [
    ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })),
    new webpack.EnvironmentPlugin({ DEBUG: isDev, NODE_ENV: isDev ? 'development' : 'production' }),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true, cwd: path.resolve(__dirname, './src') }),
    ifDev(new webpack.HotModuleReplacementPlugin()),
    new MiniCssExtractPlugin({ filename: isDev ? '[name].css' : '[name].bundle.[contenthash].css' }),
    new ChunksAssetsPlugin()
  ].filter(_.identity),
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, './src')],
      use: 'babel-loader'
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
      use: [{ loader: 'file-loader', options: { name: isDev ? '[name].[ext]' : '[name].[hash].[ext]' } }]
    }]
  }
};

const ssr = {
  ...csr,
  target: 'node',
  externals: [nodeExternals()],
  devtool: false,
  entry: { server: [ifDev('react-hot-loader/patch'), './appLoader.server'].filter(_.identity) },
  optimization: { minimizer: [new TerserPlugin({ cache: true, parallel: true, terserOptions: { toplevel: true, output: { comments: false } } })] },
  output: { ...csr.output, filename: '[name].bundle.js', libraryTarget: 'commonjs-module', library: 'library' },
  plugins: [
    ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })),
    new webpack.EnvironmentPlugin({ DEBUG: isDev, NODE_ENV: isDev ? 'development' : 'production' }),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true, cwd: path.resolve(__dirname, './src') }),
    ifDev(new webpack.HotModuleReplacementPlugin()),
  ].filter(_.identity),
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, './src')],
      use: 'babel-loader'
    }, {
      test: /\.(css|less)$/,
      use: 'null-loader'
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{ loader: 'file-loader', options: { name: isDev ? '[name].[ext]' : '[name].[hash].[ext]' } }]
    }]
  }
};


module.exports = [csr, ssr];