'use strict';

const Controller = require('egg').Controller;

class PostController extends Controller {
  async list() {
    const { ctx } = this;
    await ctx.validate(
      {
        current: { required: false, type: 'int', convertType: 'int' },
        pageSize: { required: false, type: 'int', convertType: 'int' },
        startCreateTime: { required: false, type: 'string', format: /^[1-9]\d{12}$/ },
        endCreateTime: { required: false, type: 'string', format: /^[1-9]\d{12}$/ },
        startUpdateTime: { required: false, type: 'string', format: /^[1-9]\d{12}$/ },
        endUpdateTime: { required: false, type: 'string', format: /^[1-9]\d{12}$/ },
      },
      ctx.query
    );
    const result = await ctx.service.post.list(ctx.query);
    ctx.body = result;
  }

  async blogList() {
    const { ctx } = this;
    await ctx.validate(
      {
        page: { required: false, type: 'int', convertType: 'int' },
        mark: { required: false, type: 'string', format: /^(page)|(tag)|(category)|(archive)/ },
        id: { required: false, type: 'int', convertType: 'int' },
      },
      ctx.query
    );
    const result = await ctx.service.post.blogList(ctx.query);
    ctx.body = result;
  }

  async add() {
    const { ctx } = this;
    await ctx.validate(
      {
        title: { required: true, type: 'string', max: 20 },
        categories: { required: false, type: 'array', rule: /^[\w\d]+$/ },
        tags: { required: false, type: 'array', rule: /^[\w\d]+$/ },
        content: { required: true, type: 'string' },
        cover_img: {
          required: false,
          type: 'string',
          rule: ctx.helper.urlRegExp,
        },
        top_img: {
          required: false,
          type: 'string',
          rule: ctx.helper.urlRegExp,
        },
        newTags: { required: false, type: 'array', rule: /^[\w\d]+$/ },
        newCategories: { required: false, type: 'array', rule: /^[\w\d]+$/ },
      },
      ctx.request.body
    );
    const result = await ctx.service.post.add(ctx.request.body);
    ctx.body = result;
  }

  async detail() {
    const { ctx } = this;
    await ctx.validate(
      {
        id: { required: false, type: 'int', convertType: 'int' },
      },
      ctx.query
    );
    const result = await ctx.service.post.detail(ctx.query);
    ctx.body = result;
  }

  async edit() {
    const { ctx } = this;
    await ctx.validate(
      {
        id: { required: false, type: 'int', convertType: 'int' },
        title: { required: true, type: 'string', max: 20 },
        categories: { required: false, type: 'array', rule: /^[\w\d]+$/ },
        tags: { required: false, type: 'array', rule: /^[\w\d]+$/ },
        content: { required: true, type: 'string' },
        cover_img: {
          required: false,
          type: 'string',
          format: ctx.helper.urlRegExp,
        },
        top_img: {
          required: false,
          type: 'string',
          format: ctx.helper.urlRegExp,
        },
        newTags: { required: false, type: 'array', rule: /^[\w\d]+$/ },
        newCategories: { required: false, type: 'array', rule: /^[\w\d]+$/ },
      },
      ctx.request.body
    );
    const result = await ctx.service.post.edit(ctx.request.body);
    ctx.body = result;
  }

  async delete() {
    const { ctx } = this;
    await ctx.validate(
      {
        ids: { required: true, type: 'array', rule: /^\d{1,}$/ },
      },
      ctx.request.body
    );
    const result = await ctx.service.post.delete(ctx.request.body);
    ctx.body = result;
  }

  async categories() {
    const { ctx } = this;
    const result = await ctx.service.post.categories();
    ctx.body = result;
  }

  async blogCategories() {
    const { ctx } = this;
    const result = await ctx.service.post.blogCategories();
    ctx.body = result;
  }

  async tags() {
    const { ctx } = this;
    const result = await ctx.service.post.tags();
    ctx.body = result;
  }

  async archives() {
    const { ctx } = this;
    await ctx.validate(
      {
        type: { required: false, type: 'string', format: /^(month)|(year)$/ },
        page: { required: false, type: 'int', convertType: 'int' },
      },
      ctx.query
    );
    const result = await ctx.service.post.archives(ctx.query);
    ctx.body = result;
  }

  async newPosts() {
    const { ctx } = this;
    const result = await ctx.service.post.newPosts();
    ctx.body = result;
  }

  async allPosts() {
    const { ctx } = this;
    const result = await ctx.service.post.allPosts();
    ctx.body = result;
  }

  async websiteInfo() {
    const { ctx } = this;
    const result = await ctx.service.post.websiteInfo();
    ctx.body = result;
  }
}

module.exports = PostController;
