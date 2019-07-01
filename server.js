require('env2')('./env.json');

const path = require('path');
const express = require('express');
const compression = require('compression');

const isDev = process.env.NODE_ENV !== 'production';
console.log(`Starting server with NODE_ENV is ${process.env.NODE_ENV}, isDev is ${isDev}`);

const app = express();
app.use(compression());


if (isDev) {
  const webpack = require('webpack');
  const config = require('./webpack.config');
  const compiler = webpack(config);
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const middleware = webpackDevMiddleware(compiler, { publicPath: config.output.publicPath, stats: { colors: true, chunks: false } });
  const hotMiddleware = webpackHotMiddleware(compiler);

  app.use(middleware);
  app.use(hotMiddleware);
  app.get('*', (req, res, next) => { req.url = '/index.html'; return next(); }, middleware);

} else {
  app.use(express.static(path.resolve(__dirname, './dist'), { maxAge: 31536000 }));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './dist/index.html')));
}

app.listen(parseInt(process.env.APP_PORT), (err) => {
  if (err)
    console.error(err);
  else
    console.log(`Server started! on port ${process.env.APP_PORT}`);
});