'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {
  async configuration() {
    const { ctx } = this;
    const result = await ctx.service.blog.configuration();
    ctx.body = result;
  }

  async update() {
    const { ctx } = this;
    await ctx.validate(
      {
        music_server: { required: true, type: 'string' },
        music_id: { required: true, type: 'string' },
        quotes: { required: true, type: 'array', itemType: 'string' },
        wx_exceptional: { required: true, type: 'string', format: ctx.helper.urlRegExp },
        alipay_exceptional: { required: true, type: 'string', format: ctx.helper.urlRegExp },
      },
      ctx.request.body
    );
    const result = await ctx.service.blog.update(ctx.request.body);
    ctx.body = result;
  }
}

module.exports = BlogController;
