'use strict';

const Controller = require('egg').Controller;
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const publicIp = require('public-ip');

class UploadController extends Controller {
  async index() {
    const { ctx, app } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const file = ctx.request.files[0];
    const save_file = readFileSync(file.filepath);
    const fileNameSuffix = file.filename.split('.').reverse()[0];
    //文件名
    const filename = Date.now() + '.' + fileNameSuffix;
    writeFileSync(join(__dirname, '../public/static/' + filename), save_file);
    const ip = await publicIp.v4();
    ctx.body = successRes({
      url: `http://${ip}:${app.config.cluster.listen.port}/public/` + filename,
    });
  }
}

module.exports = UploadController;
