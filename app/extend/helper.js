'use strict';

const md5 = require('md5-node');

module.exports = {
  //密码md5加密
  createMD5(msg) {
    return md5(msg);
  },
  //成功的response
  createSuccessResponse(data = {}) {
    return {
      code: 1,
      msg: 'success!',
      data,
    };
  },
  //失败的response
  createErrorResponse(msg) {
    return {
      code: 10000,
      msg,
      data: {},
    };
  },
  createListResponse({ data, pageSize = 10, current = 1 }) {
    return {
      code: 1,
      msg: 'success!',
      data: {
        total: data.length,
        list: data.slice((current - 1) * pageSize, current * pageSize),
      },
    };
  },
  //身份认证错误的response
  createNoAuthResponse(msg) {
    return {
      code: 401,
      msg,
      data: {},
    };
  },
  unique(arr, key) {
    return arr.reduce((pre, cur) => {
      !pre.find((r) => (key === undefined ? r === cur : r[key] === cur[key])) && pre.push(cur);
      return pre;
    }, []);
  },
  urlRegExp: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
  //数据表的创建sql
  //确保key与tablename一致
  DbInit() {
    return {
      website:
        'CREATE TABLE IF NOT EXISTS `website`(`id` INT AUTO_INCREMENT,`views` INT NOT NULL,`visitors` INT NOT NULL,`create_time` TIMESTAMP NOT NULL,`announcement` VARCHAR(100) NOT NULL,PRIMARY KEY ( `id` ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      config:
        'CREATE TABLE IF NOT EXISTS `config`(`id` INT AUTO_INCREMENT,`quotes` TEXT NOT NULL,`music_server` VARCHAR(20) NOT NULL,`music_id` VARCHAR(20) NOT NULL,`wx_exceptional` VARCHAR(100) NOT NULL,`alipay_exceptional` VARCHAR(100) NOT NULL,PRIMARY KEY ( `id` ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      users:
        'CREATE TABLE IF NOT EXISTS `users`(`id` INT AUTO_INCREMENT,`username` VARCHAR(20) NOT NULL,`password` VARCHAR(32) NOT NULL,`name` VARCHAR(20) NOT NULL,`avatar` VARCHAR(100),`github` VARCHAR(100),`gitee` VARCHAR(100),`description` VARCHAR(100),PRIMARY KEY ( `id` ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      posts:
        'CREATE TABLE IF NOT EXISTS `posts`(`id` INT AUTO_INCREMENT,`title` VARCHAR(20) NOT NULL,`cover_img` VARCHAR(100),`top_img` VARCHAR(100),`content` TEXT NOT NULL,`create_time` TIMESTAMP NOT NULL,`update_time` TIMESTAMP NOT NULL,`views` INT,PRIMARY KEY ( `id` ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      categories:
        'CREATE TABLE IF NOT EXISTS `categories`(`id` INT AUTO_INCREMENT,`name` VARCHAR(20) NOT NULL UNIQUE,PRIMARY KEY ( `id` ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      tags: 'CREATE TABLE IF NOT EXISTS `tags`(`id` INT AUTO_INCREMENT,`name` VARCHAR(20) NOT NULL UNIQUE,PRIMARY KEY ( `id` ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      categories_posts_link:
        'CREATE TABLE IF NOT EXISTS `categories_posts_link`(`category_id` INT NOT NULL,`post_id` INT NOT NULL,KEY `fk_categories_link_category_id` (`category_id`),KEY `fk_categories_link_post_id` (`post_id`),CONSTRAINT `fk_categories_link_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),CONSTRAINT `fk_categories_link_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      tags_posts_link:
        'CREATE TABLE IF NOT EXISTS `tags_posts_link`(`tag_id` INT NOT NULL,`post_id` INT NOT NULL,KEY `fk_tags_link_tag_id` (`tag_id`),KEY `fk_tags_link_post_title` (`post_id`),CONSTRAINT `fk_tags_link_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),CONSTRAINT `fk_tags_link_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
    };
  },
};
