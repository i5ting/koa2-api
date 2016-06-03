var $middlewares = require('mount-middlewares')(__dirname);

var router = require('koa-router')();

router.get('/',  (ctx, next) => {
  console.log("../")
  return ctx.render('index', { 
    title: '欢迎使用Moajs-Api' 
  });
})

module.exports = router;

