require('env2')('./env.json');

const path = require('path');
const express = require('express');
const compression = require('compression');
const fs = require('fs');
const _ = require('lodash');

const isDev = process.env.NODE_ENV !== 'production';
console.log(`Starting server with NODE_ENV is ${process.env.NODE_ENV}, isDev is ${isDev}`);

const app = express();
app.use(compression());


if (isDev) {
  const webpack = require('webpack');
  const [clientConfig, serverConfig] = require('./webpack.config');
  const compiler = webpack([clientConfig, serverConfig]);
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const middleware = webpackDevMiddleware(compiler, { publicPath: clientConfig.output.publicPath, stats: { colors: true, chunks: false } });
  const hotMiddleware = webpackHotMiddleware(compiler);

  app.use(middleware);
  app.use(hotMiddleware);
  app.get('*', (req, res, next) => { req.url = '/index.html'; return next(); }, middleware);

} else {
  const { serverRender } = require('./dist/server.bundle');
  const renderHtmlPage = _.template(fs.readFileSync('./dist/index.ejs', 'utf8'), { interpolate: /{{([\s\S]+?)}}/g });

  app.use(express.static(path.resolve(__dirname, './dist'), { maxAge: 31536000 }));
  app.get('*', async (req, res) => {
    const { body, helmet, state } = await serverRender();
    res.send(renderHtmlPage({ body, helmet, state }));
  });
}

app.listen(parseInt(process.env.APP_PORT), (err) => {
  if (err)
    console.error(err);
  else
    console.log(`Server started! on port ${process.env.APP_PORT}`);
});