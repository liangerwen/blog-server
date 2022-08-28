/* eslint valid-jsdoc: "off" */

'use strict';

const { join } = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1630293081684_5136';

  // add your middleware config here
  config.middleware = [];

  config.onerror = {
    all(err, ctx) {
      let msg = err.message;
      if (err.errors && Array.isArray(err.errors)) {
        msg = err.errors.map((r) => `${r.field} is ${r.message}`).join(';');
      }
      ctx.response.body = {
        code: ctx.status,
        msg: msg,
        data: {},
      };
      ctx.response.status = 200;
    },
  };

  config.security = {
    csrf: {
      enable: false,
      //设置跨域白名单
      domainWhiteList: ['http://127.0.0.1:8000'],
    },
  };
  config.static = {
    dir: [
      {
        prefix: '/',
        dir: join(appInfo.baseDir, 'app/public/dist'),
      },
      {
        prefix: '/public',
        dir: join(appInfo.baseDir, 'app/public/static'),
      },
    ],
    dynamic: true,
    preload: false,
    buffer: false,
    maxFiles: 1000,
  };

  config.jwt = {
    secret: 'liangerwen',
    expTime: 1000 * 3600 * 24,
    // expTime: 60 * 1000,
  };

  config.cors = {
    origin: '*',
    allowMetnods: 'GET,POST',
  };

  exports.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'blog',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  exports.multipart = {
    mode: 'file',
    whitelist: [
      '.jpg',
      '.jpeg',
      '.png',
      '.ico',
      '.gif',
      '.bmp',
      '.wbmp',
      '.webp',
      '.tif',
      '.psd',
      '.svg',
    ],
  };

  //设置网页图标
  // config.siteFile = {
  //   '/favicon.ico': readFileSync(join(appInfo.baseDir, 'app/public/dist/favicon.ico')),
  // };

  // add your user config here
  const userConfig = {
    myAppName: 'blog-server',
  };

  return {
    ...config,
    ...userConfig,
  };
};
