const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const defaultOptions = {
  fileName: 'assets-manifest.json',
  path: process.cwd(),
  mappings: { 'js': /\.js$/, 'css': /\.css$/ }
};

class ChunksAssetsPlugin {
  constructor(options = {}) {
    this.options = { ...defaultOptions, options };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('ChunksAssetsPlugin', (compilation) => {
      const publicPath = compilation.mainTemplate.getPublicPath({ hash: compilation.hash });
      const document = _.mapValues(Object.fromEntries(compilation.entrypoints), (entry) => {
        const files = _(entry.chunks).flatMap('files').map((file) => publicPath + file).value();
        return _.mapValues(this.options.mappings, (regex) => _.filter(files, (asset) => regex.test(asset)));
      });

      fs.writeFileSync(path.join(this.options.path, this.options.fileName), JSON.stringify(document));
    });
  }

}

module.exports = ChunksAssetsPlugin;