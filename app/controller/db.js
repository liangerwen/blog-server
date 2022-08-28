'use strict';

const Controller = require('egg').Controller;

class DbController extends Controller {
  async init() {
    const { ctx } = this;
    await ctx.validate(
      {
        username: { required: true, type: 'string' },
        password: { required: true, type: 'string' },
      },
      ctx.request.body
    );
    await ctx.service.db.init();
    const result = await ctx.service.user.resetUser(ctx.request.body);
    ctx.body = result;
  }

  async complete() {
    const { ctx } = this;
    const result = await ctx.service.db.complete();
    ctx.body = result;
  }
}

module.exports = DbController;
