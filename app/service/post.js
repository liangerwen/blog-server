'use strict';

const Service = require('egg').Service;

class PostService extends Service {
  async list({
    pageSize,
    current,
    title,
    startCreateTime,
    endCreateTime,
    startUpdateTime,
    endUpdateTime,
  }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createListResponse;
    let whereSql = 'select * from posts where 1 = 1';
    let whereVal = [];
    if (title) {
      whereSql += ' and title = ?';
      whereVal.push(title);
    }
    if (startCreateTime && endCreateTime) {
      whereSql += ' and create_time between ? and ? ';
      whereVal.push(new Date(Number(startCreateTime)), new Date(Number(endCreateTime)));
    }
    if (startUpdateTime && endUpdateTime) {
      whereSql += ' and update_time between ? and ?';
      whereVal.push(new Date(Number(startUpdateTime)), new Date(Number(endUpdateTime)));
    }
    whereSql += ' order by create_time desc';
    const data = await app.mysql.query(whereSql, whereVal);
    const res = await Promise.all(
      data.map(async (i) => {
        const categories_posts_link = await app.mysql.select('categories_posts_link', {
          where: {
            post_id: i.id,
          },
        });
        const tags_posts_link = await app.mysql.select('tags_posts_link', {
          where: {
            post_id: i.id,
          },
        });
        return {
          ...i,
          categories: categories_posts_link.map((r) => r.category_id),
          tags: tags_posts_link.map((r) => r.tag_id),
        };
      })
    );
    return successRes({
      data: res,
      pageSize,
      current,
    });
  }

  async blogList({ id = -1, mark = 'page', page = 1 }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createListResponse;
    let list = [];
    switch (mark) {
      case 'page': {
        list = await app.mysql.select('posts', {
          orders: [['update_time', 'desc']],
        });
        break;
      }
      case 'tag': {
        if (id !== -1) {
          list = await app.mysql.query(
            'select posts.* from posts,tags_posts_link where posts.id=tags_posts_link.post_id and tags_posts_link.tag_id=? order by update_time desc;',
            [id]
          );
        }
        break;
      }
      case 'category': {
        if (id !== -1) {
          list = await app.mysql.query(
            'select posts.* from posts,categories_posts_link where posts.id=categories_posts_link.post_id and categories_posts_link.category_id=? order by update_time desc;',
            [id]
          );
        }
        break;
      }
      case 'archive': {
        if (id !== -1) {
          const beginDate = new Date(id);
          const endDate = new Date(id);
          if (beginDate.getMonth() === 11) {
            endDate.setFullYear(beginDate.getFullYear() + 1);
            endDate.setMonth(0);
          } else {
            endDate.setMonth(beginDate.getMonth() + 1);
          }
          list = await app.mysql.select('posts');
          list = list.filter((i) => i.create_time >= beginDate && i.create_time <= endDate);
        }
        break;
      }
      default: {
        break;
      }
    }
    list = await Promise.all(
      list.map(async (r) => {
        const tags = await app.mysql.select('tags_posts_link', {
          where: {
            post_id: r.id,
          },
        });
        const tagIds = tags.map((i) => i.tag_id);
        const categories = await app.mysql.select('categories_posts_link', {
          where: {
            post_id: r.id,
          },
        });
        const categoryIds = categories.map((i) => i.category_id);
        return {
          ...r,
          tags: tagIds,
          categories: categoryIds,
        };
      })
    );

    return successRes({
      data: list,
      pageSize: 8,
      current: page,
    });
  }

  async newPosts() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createListResponse;
    const data = await app.mysql.select('posts', { orders: [['create_time', 'desc']] });
    return successRes({
      data: data,
      pageSize: 5,
    });
  }

  async allPosts() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.select('posts');
    return successRes(data);
  }

  async add({
    content,
    cover_img = null,
    title,
    top_img = null,
    categories = [],
    tags = [],
    newCategories = [],
    newTags = [],
  }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const { insertId } = await app.mysql.insert('posts', {
      content,
      cover_img,
      title,
      top_img,
      create_time: new Date(),
      update_time: new Date(),
    });
    const newTagsIds = await this.addTags(newTags);
    const newCategoriesIds = await this.addCategories(newCategories);
    await Promise.all(
      [...newTagsIds, ...tags].map((i) =>
        app.mysql.insert('tags_posts_link', {
          post_id: insertId,
          tag_id: i,
        })
      )
    );
    await Promise.all(
      [...newCategoriesIds, ...categories].map((i) =>
        app.mysql.insert('categories_posts_link', {
          post_id: insertId,
          category_id: i,
        })
      )
    );
    return successRes();
  }

  async detail({ id }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.get('posts', { id });
    const categories_posts_link = await app.mysql.select('categories_posts_link', {
      where: {
        post_id: id,
      },
    });
    const tags_posts_link = await app.mysql.select('tags_posts_link', {
      where: {
        post_id: id,
      },
    });
    return successRes({
      ...data,
      categories: categories_posts_link.map((r) => r.category_id),
      tags: tags_posts_link.map((r) => r.tag_id),
    });
  }

  async edit({ id, content, cover_img, title, top_img, categories, tags, newCategories, newTags }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    await app.mysql.update(
      'posts',
      {
        content,
        cover_img,
        title,
        top_img,
        update_time: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
    await app.mysql.delete('tags_posts_link', { post_id: id });
    await app.mysql.delete('categories_posts_link', { post_id: id });
    const newTagsIds = await this.addTags(newTags);
    const newCategoriesIds = await this.addCategories(newCategories);
    await Promise.all(
      [...newTagsIds, ...tags].map((i) =>
        app.mysql.insert('tags_posts_link', {
          post_id: id,
          tag_id: i,
        })
      )
    );
    await Promise.all(
      [...newCategoriesIds, ...categories].map((i) =>
        app.mysql.insert('categories_posts_link', {
          post_id: id,
          category_id: i,
        })
      )
    );
    await this.deleteRedundantTagsAndCategories();
    return successRes();
  }

  async delete({ ids }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const inSql = ids.map(() => '?').join(', ');
    await app.mysql.query(`delete from categories_posts_link where post_id in (${inSql});`, ids);
    await app.mysql.query(`delete from tags_posts_link where post_id in (${inSql});`, ids);
    await app.mysql.query(`delete from posts where id in (${inSql});`, ids);
    return successRes();
  }

  async categories() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.select('categories');
    return successRes(data);
  }

  async blogCategories() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.query(
      'select C.*,count(CPL.post_id) as count from categories as C,categories_posts_link as CPL where C.id = CPL.category_id group by C.id;'
    );
    return successRes(data);
  }

  async addCategories(categories) {
    if (categories && categories.length === 0) {
      return [];
    }
    const { app } = this;
    const insertList = categories.map((r) =>
      app.mysql.insert('categories', {
        name: r,
      })
    );
    const res = await Promise.all(insertList);
    return res.map((i) => i.insertId);
  }

  async tags() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.select('tags');
    return successRes(data);
  }

  async addTags(tags) {
    if (tags && tags.length === 0) {
      return [];
    }
    const { app } = this;
    const insertList = tags.map((r) =>
      app.mysql.insert('tags', {
        name: r,
      })
    );
    const res = await Promise.all(insertList);
    return res.map((i) => i.insertId);
  }

  // 删除未使用的标签和分类
  async deleteRedundantTagsAndCategories() {
    const { app } = this;
    const allTags = (await app.mysql.select('tags', { columns: ['id'] })).map((i) => i.id);
    const allCategories = (await app.mysql.select('categories', { columns: ['id'] })).map(
      (i) => i.id
    );
    const usedTagIds = (await app.mysql.select('tags_posts_link', { columns: ['tag_id'] })).map(
      (i) => i.tag_id
    );
    const usedCategoryIds = (
      await app.mysql.select('categories_posts_link', {
        columns: ['category_id'],
      })
    ).map((i) => i.category_id);
    const unUsedTagIds = allTags.filter((i) => !usedTagIds.includes(i));
    const unUsedCategoryIds = allCategories.filter((i) => !usedCategoryIds.includes(i));
    unUsedTagIds.length &&
      (await this.app.mysql.delete('tags', {
        id: unUsedTagIds,
      }));
    unUsedCategoryIds.length &&
      (await this.app.mysql.delete('categories', {
        id: unUsedCategoryIds,
      }));
  }

  async archives({ type = 'month', page = 1 }) {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.select('posts', {
      orders: [['create_time', 'desc']],
    });
    let resByMonth = [],
      resByYear = [];
    const beginTime = data[0].create_time;
    const endTime = data[data.length - 1].create_time;
    const benginYear = beginTime.getFullYear();
    const endYear = endTime.getFullYear();
    for (let year = benginYear; year <= endYear; year++) {
      const startYearDate = new Date(year, 0);
      const endYearDate = new Date(year + 1, 0);
      resByYear.push({
        date: startYearDate.getTime(),
        posts: data
          .slice((page - 1) * 10, page * 10)
          .filter((i) => i.create_time >= startYearDate && i.create_time <= endYearDate),
      });
      for (let month = 0; month <= 11; month++) {
        const startMonthDate = new Date(year, month);
        const endMonthDate = new Date(year, month + 1);
        resByMonth.push({
          date: startMonthDate.getTime(),
          posts: data.filter(
            (i) => i.create_time >= startMonthDate && i.create_time <= endMonthDate
          ),
        });
      }
    }
    return successRes(type === 'month' ? resByMonth : { total: data.length, list: resByYear });
  }

  async websiteInfo() {
    const { app, ctx } = this;
    const successRes = ctx.helper.createSuccessResponse;
    const data = await app.mysql.get('website');
    return successRes(data);
  }
}

module.exports = PostService;
