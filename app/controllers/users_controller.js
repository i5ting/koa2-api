/**
 * Created by Moajs on June 8th 2016, 12:55:48 am.
 */
 
var $models = require('mount-models')(__dirname);

var User = $models.user;


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

    return User.createAsync({name: req.body.name,password: req.body.password}).then( user => {
      console.log(user);
      return ctx.render('users/show', {
        user : user
      })
    })
};

exports.update = (ctx, next) => {
  console.log(ctx.method + ' /users/:id => update, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

    var id = ctx.params.id;

    return User.updateById(id,{name: req.body.name,password: req.body.password}).then( user => {
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
  return User.deleteByIdAsync(id).then( () =>{
    return ctx.body= ({
      data:{},
      status:{
        code : 0,
        msg  : 'delete success!'
      }
    });
  }).catch((err)=>{
      return ctx.api_error(err);
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
    var user_id = ctx.api_user._id;

    return User.createAsync({name: req.body.name,password: req.body.password}).then(user=> {
      return ctx.body = ({
        user : user
      })
    }).catch((err)=>{
      return ctx.api_error(err);
    });

  },
  update: (ctx, next) => {
    var user_id = ctx.api_user._id;
    var id = ctx.params.user_id;
    return User.updateByIdAsync(id, {name: req.body.name,password: req.body.password}).then(user=> {
      return ctx.api({
        user : user,
        redirect : '/users/' + id
      })
    }).catch((err)=>{
      return ctx.api_error(err);
    });
  },
  delete: (ctx, next) => {
    var user_id = ctx.api_user._id;
    var id = ctx.params.user_id;

    return User.deleteByIdAsync(id).then(function(){
      return ctx.api({id: id})
    }).catch((err)=>{
      return ctx.api_error(err);
    }); 
  }
}
