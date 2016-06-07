import test from 'ava';

var superkoa = require('superkoa')

test.cb("superkoa()", t => {
  superkoa()
    .get("/")
    .expect(200, function (err, res) {
      
      t.ifError(err)
      var userId = res.body.id;
      t.is(res.text, 'Hello Koa', 'res.text == Hello Koa')
      t.end()
    });
});