/**
 * Created by sang on 01/06/14.
 */

var User = require('../models/user');

exports.list = function (ctx, next) {
  console.log(ctx.method + ' /users => list, query: ' + JSON.stringify(ctx.query));

  return User.getAllAsync().then((users)=>{
    return ctx.render('users/index', {
      users : users
    })
  })
};

exports.new = function (ctx, next) {
  console.log(ctx.method + ' /users/new => new, query: ' + JSON.stringify(ctx.query));

  return ctx.render('users/new', {
    user : {
      "_action" : "new"
    }
  })
};

exports.show = function (ctx, next) {
  console.log(ctx.method + ' /users/:id => show, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));
  var id = ctx.params.id;

  return User.getById(id, function(err, user){
    console.log(user);
    return ctx.render('users/show', {
      user : user
    })
  });
};

exports.edit = function (ctx, next) {
  console.log(ctx.method + ' /users/:id/edit => edit, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));

  var id = ctx.params.id;

  return User.getById(id, function(err, user){
    console.log(user);
    user._action = 'edit';

    return ctx.render('users/edit', {
      user : user
    })
  });
};

exports.create = function (ctx, next) {
  console.log(ctx.method + ' /users => create, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

    return User.create({username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function(err, user){
      console.log(user);
      return ctx.render('users/show', {
        user : user
      })
    });
};

exports.update = function (ctx, next) {
  console.log(ctx.method + ' /users/:id => update, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

    var id = ctx.params.id;

    return User.updateById(id,{username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function(err, user){
      console.log(user);

      return ctx.body = ({
        data:{
          redirect : '/users/' + id
        },
        status:{
          code : 0,
          msg  : 'delete success!'
        }
      });
    });
};

exports.destroy = function (ctx, next) {
  console.log(ctx.method + ' /users/:id => destroy, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));
  var id = ctx.params.id;
  return User.deleteById(id, function(err){
    console.log(err);
    return ctx.body= ({
      data:{},
      status:{
        code : 0,
        msg  : 'delete success!'
      }
    });
  });
};

// -- custom

exports.login = function (ctx, next) {
  username = ctx.request.body.username;
  password = ctx.request.body.password;

  user = new User.model({
    username: username,
    password: password
  });
  console.log(user);
  return user.is_exist(function(err, usr) {
    console.log(usr);
    console.log(req.session)

    var half_hour;
    if (err) {
      console.error(err);
      req.session.current_user = void 0;
      return res.status(200).json({
        data: {},
        status: {
          code: err.code,
          msg: err.name + ' : ' + err.err
        }
      });
    } else {
      req.session.current_user = usr;
      half_hour = 3600000 / 2;
      req.session.cookie.expires = new Date(Date.now() + half_hour);
      req.session.cookie.maxAge = half_hour;
      console.dir(req.session.current_user);
      return res.redirect('/');
    }
  });
}

exports.register = function (ctx, next) {
  username = ctx.request.body.username;
  password = ctx.request.body.password;

  user = new User.model({
    username: username,
    password: password
  });

  User.create({
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }, function(err, user){
    console.log(user);
    if(err){
      return res.redirect('/users/register');
    }else{
      return res.redirect('/users/login');
    }
  });
}

exports.login_get = function (ctx, next) {
  if(req.session.current_user){
    return res.redirect('/');
  }

  return ctx.render('users/login',{});
}

exports.register_get = function (ctx, next) {
  return ctx.render('users/register',{});
}

exports.logout = function (ctx, next) {
  return ctx.render('users/register',{});
}


// -- custom api

exports.api = {
  list: function (ctx, next) {
    var user_id = req.api_user._id;

    User.query({}, function (err, users) {
      if (err) {
        return res.api_error(err);
      }

      res.api({
        users : users
      })
    });
  },
  show: function (ctx, next) {
    var user_id = req.api_user._id;
    var id = ctx.params.user_id;

    User.getById(id, function (err, user) {
      if (err) {
        return res.api_error(err);
      }

      res.api({
        user : user
      });
    });
  },
  create: function (ctx, next) {
    var user_id = req.api_user._id;

    User.create({username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function (err, user) {
      if (err) {
        return res.api_error(err);
      }

      res.json({
        user : user
      })
    });
  },
  update: function (ctx, next) {
    var user_id = req.api_user._id;
    var id = ctx.params.user_id;
    User.updateById(id, {username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function (err, user) {
      if (err) {
        return res.api_error(err);
      }

      res.api({
        user : user,
        redirect : '/users/' + id
      })
    });
  },
  delete: function (ctx, next) {
    var user_id = req.api_user._id;
    var id = ctx.params.user_id;

    User.deleteById(id, function (err) {
      if (err) {
        return res.api_error(err);
      }

      res.api({id: id})
    });
  }
}
