var router = require('koa-router')();
const co = require('co');

var $ = require('mount-controllers')(__dirname).users_controller;


// router.get('/', function (ctx, next) {
//   ctx.body = 'this a users response!';
// });

/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /users[/]        => user.list()
 *  GET    /users/new       => user.new()
 *  GET    /users/:id       => user.show()
 *  GET    /users/:id/edit  => user.edit()
 *  POST   /users[/]        => user.create()
 *  PATCH  /users/:id       => user.update()
 *  DELETE /users/:id       => user.destroy()
 *
 */

router.get('/new', $.new);  
// router.get('/:id/edit', $.edit);

router.get('/', co.wrap($.list));

router.post('/', $.create);

router.get('/:id', $.show);

router.patch('/:id', $.update);

router.delete('/:id', $.destroy);
//
// router.route('/:id')
//   .patch($.update)
//   .get($.show)
//   .delete($.destroy);
  

module.exports = router;
