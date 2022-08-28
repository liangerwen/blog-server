'use strict';

const Service = require('egg').Service;

class DbService extends Service {
  //表是否完整
  async complete() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const tables = Object.keys(ctx.helper.DbInit());
    const data = (await app.mysql.query('show tables;')).map((r) => r.Tables_in_blog);
    const isComplete = tables.every((r) => data.includes(r));
    const hasUser = data.includes('users') ? await app.mysql.select('users') : [];
    return successRes(isComplete && hasUser.length === 1);
  }
  //初始化数据表
  async init() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    await this.dropTables();
    const InitSql = Object.values(ctx.helper.DbInit());
    await Promise.all(InitSql.map((r) => app.mysql.query(r)));
    await app.mysql.insert('website', {
      views: 0,
      visitors: 0,
      create_time: new Date(),
      announcement: '感谢访问本站，若喜欢请收藏 ^_^',
    });
    await app.mysql.insert('config', {
      id: 1,
      music_server: 'tencent',
      music_id: '8052692129',
      quotes: '谢谢光顾;万分感谢',
      wx_exceptional: '',
      alipay_exceptional: '',
    });
    return successRes();
  }
  //清除所有表格
  async dropTables() {
    const { app } = this;
    await app.mysql.query(`drop table if exists categories_posts_link,tags_posts_link;`);
    await app.mysql.query(`drop table if exists website,config,categories,posts,tags,users;`);
    await app.mysql.query(
      `SELECT CONCAT('ALTER TABLE ',TABLE_SCHEMA,'.',TABLE_NAME,' DROP FOREIGN KEY ',CONSTRAINT_NAME,' ;') FROM information_schema.TABLE_CONSTRAINTS c WHERE c.TABLE_SCHEMA='blog' AND c.CONSTRAINT_TYPE='FOREIGN KEY';`
    );
  }
}

module.exports = DbService;
