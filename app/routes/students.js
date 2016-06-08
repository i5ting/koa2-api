var router = require('koa-router')();
const co = require('co');

// mount all middlewares in app/middlewares, examples:
// 
// router.route('/')
//  .get($middlewares.check_session_is_expired, $.list)
//  .post($.create);
// 
var $middlewares  = require('mount-middlewares')(__dirname);

// core controller
var $ = require('mount-controllers')(__dirname).students_controller;

/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /students[/]        => student.list()
 *  GET    /students/new       => student.new()
 *  GET    /students/:id       => student.show()
 *  GET    /students/:id/edit  => student.edit()
 *  POST   /students[/]        => student.create()
 *  PATCH  /students/:id       => student.update()
 *  DELETE /students/:id       => student.destroy()
 *
 */

router.get('/new', $.new); 
 
router.get('/:id/edit', $.edit);

router.get('/', $.list);

router.post('/', $.create);

router.get('/:id', $.show);

router.patch('/:id', $.update);

router.delete('/:id', $.destroy);


// -- custom routes




module.exports = router;