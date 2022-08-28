'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  const isUser = app.middleware.user(app.config.jwt);
  /***********************  管理端接口  *************************/
  // 数据表初始化
  router.post('/manage/db/init', controller.db.init);
  // 数据表是否已经完整
  router.get('/manage/db/complete', controller.db.complete);
  // 登录
  router.post('/manage/user/login', controller.user.login);
  // 用户信息
  router.get('/manage/user', isUser, controller.user.index);
  // 更新用户信息
  router.post('/manage/user/update', isUser, controller.user.update);
  // 更新密码
  router.post('/manage/user/editPwd', isUser, controller.user.editPwd);
  // 上传文件
  router.post('/manage/upload', isUser, controller.upload.index);
  // 查询所有文章
  router.get('/manage/post/list', isUser, controller.post.list);
  // 新增文章
  router.post('/manage/post/add', isUser, controller.post.add);
  // 文章详情
  router.get('/manage/post/detail', isUser, controller.post.detail);
  // 编辑文章
  router.post('/manage/post/edit', isUser, controller.post.edit);
  // 删除文章
  router.post('/manage/post/delete', isUser, controller.post.delete);
  // 获取所有分类
  router.get('/manage/post/categories', isUser, controller.post.categories);
  // 获取所有标签
  router.get('/manage/post/tags', isUser, controller.post.tags);
  // 获取博客配置
  router.get('/manage/blog/config', isUser, controller.blog.configuration);
  // 更改博客配置
  router.post('/manage/blog/config/update', isUser, controller.blog.update);
  /*************************************************************/

  /***********************  客户端接口  *************************/
  // 用户信息
  router.get('/client/user', controller.user.blogUser);
  // 查询文章
  router.get('/client/post/list', controller.post.blogList);
  // 文章详情
  router.get('/client/post/detail', controller.post.detail);
  // 获取所有分类
  router.get('/client/post/categories', controller.post.blogCategories);
  // 获取所有标签
  router.get('/client/post/tags', controller.post.tags);
  // 获取归档
  router.get('/client/post/archives', controller.post.archives);
  // 查询新文章
  router.get('/client/post/newPosts', controller.post.newPosts);
  // 查询所有文章
  router.get('/client/post/allPosts', controller.post.allPosts);
  // 查询网站信息
  router.get('/client/websiteInfo', controller.post.websiteInfo);
  // 获取博客配置
  router.get('/client/blog/config', controller.blog.configuration);
  /**************************************************************/
};
