'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async login({ username, password }) {
    const { ctx, app } = this;
    const user = await app.mysql.get('users', { username, password });
    const errRes = ctx.helper.createNoAuthResponse;
    const successRes = ctx.helper.createSuccessResponse;
    return user
      ? successRes({
          token: app.jwt.sign(
            {
              exp: Date.now() + app.config.jwt.expTime,
              name: username,
            },
            app.config.jwt.secret
          ),
        })
      : errRes('用户名或密码错误！');
  }

  async resetUser({ username, password }) {
    const { ctx, app } = this;
    await app.mysql.delete('users');
    const successRes = ctx.helper.createSuccessResponse;
    const result = await app.mysql.insert('users', {
      username,
      password: ctx.helper.createMD5(password),
      name: username,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      description: '介瓜娃子懒的很，啥子都没得留哈...',
    });
    return successRes(result);
  }

  async info({ username }) {
    const { ctx, app } = this;
    const config = username ? { username } : {};
    const user = await app.mysql.get('users', config);
    const errRes = ctx.helper.createNoAuthResponse;
    const successRes = ctx.helper.createSuccessResponse;
    return user
      ? successRes({
          name: user.name,
          avatar: user.avatar,
          github: user.github,
          gitee: user.gitee,
          description: user.description,
        })
      : errRes('没有此用户信息！');
  }

  async editPwd({ username, newPassword, password }) {
    const { ctx, app } = this;
    const md5 = ctx.helper.createMD5;
    const result = await app.mysql.update(
      'users',
      {
        password: md5(newPassword),
      },
      { where: { username, password: md5(password) } }
    );
    const errRes = ctx.helper.createErrorResponse;
    const successRes = ctx.helper.createSuccessResponse;
    return result.affectedRows === 1 ? successRes() : errRes('原密码错误！');
  }

  async update({ username, name, description, avatar, github, gitee }) {
    const { ctx, app } = this;
    const result = await app.mysql.update(
      'users',
      { name, description, avatar, github, gitee },
      { where: { username } }
    );
    const successRes = ctx.helper.createSuccessResponse;
    return result.affectedRows === 1 ? successRes() : errRes('没有此用户信息！');
  }

  async find({ username }) {
    const { app } = this;
    const result = await app.mysql.get('users', { username });
    return result;
  }
}

module.exports = UserService;
