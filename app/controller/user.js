'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx, app } = this;
    const { name } = app.jwt.verify(ctx.header.authorization, app.config.jwt.secret);
    const result = await ctx.service.user.info({
      username: name,
    });
    ctx.body = result;
  }
  async update() {
    const { ctx, app } = this;
    await ctx.validate(
      {
        name: { required: false, type: 'string' },
        description: { required: false, type: 'string' },
        avatar: { required: false, type: 'string', format: ctx.helper.urlRegExp },
        github: { required: false, type: 'string', format: ctx.helper.urlRegExp },
        gitee: { required: false, type: 'string', format: ctx.helper.urlRegExp },
      },
      ctx.request.body
    );
    const { name } = app.jwt.verify(ctx.header.authorization, app.config.jwt.secret);
    const result = await ctx.service.user.update({
      username: name,
      ...ctx.request.body,
    });
    ctx.body = result;
  }
  async editPwd() {
    const { ctx, app } = this;
    await ctx.validate(
      {
        password: { required: true, type: 'string' },
        newPassword: { required: true, type: 'string' },
      },
      ctx.request.body
    );
    const { name } = app.jwt.verify(ctx.header.authorization, app.config.jwt.secret);
    const result = await ctx.service.user.editPwd({
      username: name,
      ...ctx.request.body,
    });
    ctx.body = result;
  }
  async blogUser() {
    const { ctx } = this;
    const result = await ctx.service.user.info({});
    ctx.body = result;
  }
  async login() {
    const { ctx } = this;
    await ctx.validate(
      {
        username: { required: true, type: 'string' },
        password: { required: true, type: 'string' },
      },
      ctx.request.body
    );
    // 从service文件中拿到返回结果
    const { username, password } = ctx.request.body;
    const result = await ctx.service.user.login({
      username,
      password: ctx.helper.createMD5(password),
    });
    ctx.body = result;
  }
}

module.exports = UserController;
