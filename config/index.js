/*
 * Copyright 2018 Asknow Solutions B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');
const packageConfig = require('../package.json');

// Used for handling commandline arguments
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

// Config the commandLine arg parser
const commandLineArgDefinitions = [
  {
    name: 'release',
    alias: 'r',
    type: Boolean,
    description: 'When options is: a release version is created.',
  },
  {
    name: 'minify',
    alias: 'm',
    type: Boolean,
    description: 'When options is: minify all output',
  },
  {
    name: 'singlefile',
    alias: 's',
    type: Boolean,
    description: 'When options is: a single file is created',
  },
];

// Print the options
const commandLineUsageInfo = [
  {
    header: 'ConsentCookie',
    content: 'build script for testing and building ConsentCookie. \n e.g. npm run build -- -f -m -r',
  },
  {
    header: 'Options',
    optionList: commandLineArgDefinitions,
  },
];
console.log(commandLineUsage(commandLineUsageInfo));

// Get the options (partial so we don`t fall over unknown given options)
const commandLineOptions = commandLineArgs(commandLineArgDefinitions, { partial: true });

// The options parse to build flags
const isRelease = commandLineOptions.release === true;
const isMinify = isRelease || commandLineOptions.minify === true;
const isSingleFile = isRelease || commandLineOptions.singlefile === true;

console.log(`Building with build flags: ${JSON.stringify({
  release: String(isRelease),
  minify: String(isMinify),
  singlefile: String(isSingleFile),
})}`);

module.exports = {
  build: {
    env: require('./prod.env'), // eslint-disable-line global-require
    ver: JSON.stringify(packageConfig.version),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsRootRelease: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Release flag. If its a release version, set flag true
    release: isRelease,
    minify: isMinify,
    singlefile: isSingleFile,
  },
  dev: {
    env: require('./dev.env'), // eslint-disable-line global-require
    port: 8090,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    devtool: 'source-map',
  },
};
