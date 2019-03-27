/**
 * 前端服务端对接Java后端
 * ===================
 */

'use strict';

var logger = require('./logger');
var request = require('request');
var rb = require('./response-builder');

var apiServerUrl = global.MANAGE_CONFIG.proxyTable['/api'];
var apiManageServerUrl = global.MANAGE_CONFIG.proxyTable['/api/manage'];
var apiClientServerUrl = global.MANAGE_CONFIG.proxyTable['/api/client'];

function isJson(req) {
  var str = req.headers['content-type'] || '';
  var contentType = str.split(';')[0];
  return ('application/json' === contentType);
}

function getApiServerUrl(url) {
  var apiServerUrl = apiServerUrl;

  if (url.indexOf('/api/manage/') === 0) {
    apiServerUrl = apiManageServerUrl;
  } else if (url.indexOf('/api/client/') === 0) {
    apiServerUrl = apiClientServerUrl;
  }

  return apiServerUrl;
}

exports.proxy = function (req, res) {
  var method = req.method;
  var url = req.path;
  var apiServerUrl = getApiServerUrl(url);
  var options = {
    url: apiServerUrl + req.path,
    method: method
  };
  if (req.user) {
    logger.info("apiServerUrl: " + options.url, "  user: " + req.user.id);
    if (method === 'POST') {
      if (isJson(req)) {
        options.json = true;
        options.body = req.body;
      } else {
        options.form = req.body;
      }
    } else {
      options.qs = req.query;
    }
  } else {
    if (method === 'POST') {
      if (isJson(req)) {
        options.json = true;
        options.body = req.body;
      } else {
        options.form = req.body;
      }
    } else {
      options.qs = req.query;
    }
  }

  /**
   * ===================================================
   * 数组参数处理 qsStringifyOptions
   * https://github.com/request/request#requestoptions-callback
   * ===================================================
   * qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' });  // 'a[]=b&a[]=c'
   */
  // options.qsStringifyOptions = {arrayFormat: 'brackets'};
  logger.info('options : ',　options);

  // node服务端用request发起请求
  request(options, function (err, response, body) {
    if (err) {
      logger.error('api proxy error.', err);
      res.send(rb.internalServerError());
      return;
    }
    if (response.statusCode !== 200) {
      logger.error("api proxy error. code: " + response.statusCode + ", body: " + body);
      res.send(rb.internalServerError());
      return;
    }
    res.send(body);
  });
};
