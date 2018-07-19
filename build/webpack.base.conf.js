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

'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    consentcookie: './src/app.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
    libraryTarget: 'umd',
    // the name exported to window
    library: 'ConsentCookie',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'node_modules': resolve('node_modules'),
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'base': resolve('src/base'),
      'config': resolve('src/config'),
      'components': resolve('src/components'),
      'router': resolve('src/router'),
      'views': resolve('src/views'),
      'services': resolve('src/services'),
      'plugins': resolve('src/plugins'),
      'directives': resolve('src/directives'),
      'mixins': resolve('src/mixins'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('node_modules/webpack-dev-server/client')],
        options: {
          babelrc: false
        }
      },
      {
        test: /\.(yml|yaml)$/,
        loader: 'json-loader!yaml-loader'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: process.env.NODE_ENV === 'production' ? 'base64-image-loader' : 'url-loader',
        query: {
          limit: 1000000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?.*)?$/,
        include: [resolve('src/assets/fonts')],
        loader: process.env.NODE_ENV === 'production' ? 'base64-font-loader' : 'url-loader',
        query: {
          limit: 1000000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg$/,
        include: [resolve('src/assets/img')],
        loader: 'vue-svg-loader', // `vue-svg` for webpack 1.x
        options: {
          // optional [svgo](https://github.com/svg/svgo) options
          svgo: {
            plugins: [
              { removeDoctype: true },
              { removeComments: true }
            ]
          }
        }
      },
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
