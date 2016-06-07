/**
 * Created by sang on 01/06/14.
 */

var User = require('../models/user');

exports.list = (ctx, next) => {
  console.log(ctx.method + ' /users => list, query: ' + JSON.stringify(ctx.query));

  return User.getAllAsync().then((users)=>{
    return ctx.render('users/index', {
      users : users
    })
  })
};

exports.new = (ctx, next) => {
  console.log(ctx.method + ' /users/new => new, query: ' + JSON.stringify(ctx.query));

  return ctx.render('users/new', {
    user : {
      "_action" : "new"
    }
  })
};

exports.show = (ctx, next) => {
  console.log(ctx.method + ' /users/:id => show, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));
  var id = ctx.params.id;

  return User.getByIdAsync(id).then(function(user){
    console.log(user);
    return ctx.render('users/show', {
      user : user
    })
  });
};

exports.edit = (ctx, next) => {
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

exports.create = (ctx, next) => {
  console.log(ctx.method + ' /users => create, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

    return User.create({username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function(err, user){
      console.log(user);
      return ctx.render('users/show', {
        user : user
      })
    });
};

exports.update = (ctx, next) => {
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

exports.destroy = (ctx, next) => {
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

// -- custom api

exports.api = {
  list: (ctx, next) => {
    var user_id = ctx.api_user._id;

    return User.queryAsync({}).then((users) => {
      return ctx.api({
        users : users
      })
    }).catch((err)=>{
      return ctx.api_error(err);
    });
  },
  show: (ctx, next) => {
    var user_id = ctx.api_user._id;
    var id = ctx.params.user_id;

    return User.getByIdAsync(id).then((user)=>{
      return ctx.api({
        user : user
      });
    }).catch((err)=>{
      return ctx.api_error(err);
    });
  },
  create: (ctx, next) => {
    var user_id = req.api_user._id;

    User.create({username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function (err, user) {
      if (err) {
        return ctx.api_error(err);
      }

      res.json({
        user : user
      })
    });
  },
  update: (ctx, next) => {
    var user_id = req.api_user._id;
    var id = ctx.params.user_id;
    User.updateById(id, {username: ctx.request.body.username,password: ctx.request.body.password,avatar: ctx.request.body.avatar,phone_number: ctx.request.body.phone_number,address: ctx.request.body.address}, function (err, user) {
      if (err) {
        return ctx.api_error(err);
      }

      ctx.api({
        user : user,
        redirect : '/users/' + id
      })
    });
  },
  delete: (ctx, next) => {
    var user_id = req.api_user._id;
    var id = ctx.params.user_id;

    return User.deleteByIdAsync(id).then(function(){
      return ctx.api({id: id})
    }).catch((err)=>{
      return ctx.api_error(err);
    }); 
  }
}
