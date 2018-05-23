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
const config = require('../config/index');
const utils = require('./utils');
const projectRoot = path.resolve(__dirname, '../');

const env = process.env.NODE_ENV;
// check env & config/index.js to decide whether to enable CSS source maps for the
// constious preprocessor loaders added to vue-loader at the end of this file
const cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap);
const cssSourceMapProd = (env === 'production' && config.build.productionSourceMap);
const useCssSourceMap = cssSourceMapDev || cssSourceMapProd;

module.exports = {
  entry: {
    consentcookie: './src/app.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
    libraryTarget: 'umd',
    // the name exported to window
    library: 'ConsentCookie'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'base': path.resolve(__dirname, '../src/base'),
      'config': path.resolve(__dirname, '../src/config'),
      'components': path.resolve(__dirname, '../src/components'),
      'router': path.resolve(__dirname, '../src/router'),
      'views': path.resolve(__dirname, '../src/views'),
      'services': path.resolve(__dirname, '../src/services'),
      'plugins': path.resolve(__dirname, '../src/plugins'),
      'directives': path.resolve(__dirname, '../src/directives'),
      'mixins': path.resolve(__dirname, '../src/mixins'),
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(yml|yaml)$/,
        loader: 'json-loader!yaml-loader'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: process.env.NODE_ENV === 'production' ? 'base64-image-loader' : 'url',
        query: {
          limit: 1000000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?.*)?$/,
        include: [path.join(projectRoot, 'src/assets/fonts')],
        loader: process.env.NODE_ENV === 'production' ? 'base64-font-loader' : 'url',
        query: {
          limit: 1000000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg$/,
        include: [path.join(projectRoot, 'src/assets/img')],
        loader: 'vue-svg-loader', // `vue-svg` for webpack 1.x
        options: {
          // optional [svgo](https://github.com/svg/svgo) options
          svgo: {
            plugins: [
              {removeDoctype: true},
              {removeComments: true}
            ]
          }
        }
      },
    ]
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
};
