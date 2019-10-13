// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  });

  // app.use 表示该中间件会适用于所有的路由
  app.use(async(ctx, next) => {
    // 创建返回data对象
    ctx.data = {}
    // 执行下一中间件
    await next()
  })

  // 路由为数组表示，该中间件适用于多个路由
  // app.router(['x', 'y'], async (ctx, next) => {
  //   ctx.data.from = 'cloud';
  //   await next();
  // });

  app.router('router', async(ctx, next) => {
    ctx.data.openId = event.userInfo.openId
    await next();
  }, async(ctx) => {
    ctx.data.other = event.other;
    // ctx.body 返回数据到小程序端
    ctx.body = {
      code: 0,
      data: ctx.data
    }
  })

  return app.serve()
}