module.exports = (options) => {
  return async function isUser(ctx, next) {
    const token = ctx.request.header.authorization;
    const errRes = ctx.helper.createNoAuthResponse;
    if (!token) {
      ctx.body = errRes('未登录，请先登录！');
    } else {
      // 当前token值存在
      let decode;
      decode = ctx.app.jwt.verify(token, options.secret);
      if (!decode) {
        ctx.body = errRes('没有权限！');
      }
      if (Date.now() > decode.exp) {
        ctx.body = errRes('身份已过期，请重新登录！');
        return;
      }
      const user = await ctx.service.user.find({
        username: decode.name,
      });
      if (user) {
        await next();
      } else {
        ctx.body = errRes('身份验证失败，请重新登录！');
      }
    }
  };
};
