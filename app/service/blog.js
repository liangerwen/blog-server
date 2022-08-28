'use strict';

const Service = require('egg').Service;

class BlogService extends Service {
  //博客配置
  async configuration() {
    const { app, ctx } = this;
    const config = await app.mysql.get('config');
    const successRes = ctx.helper.createSuccessResponse;
    return config
      ? successRes({ ...config, quotes: config.quotes.split(';') })
      : errRes('没有此配置信息！');
  }
  //更改博客配置
  async update({ music_server, music_id, quotes, wx_exceptional, alipay_exceptional }) {
    const { ctx, app } = this;
    const result = await app.mysql.update('config', {
      id: 1,
      music_server,
      music_id,
      quotes: quotes.join(';'),
      wx_exceptional,
      alipay_exceptional,
    });
    const successRes = ctx.helper.createSuccessResponse;
    return result.affectedRows === 1 ? successRes() : errRes('没有配置信息！');
  }
}

module.exports = BlogService;
