/**
 * Created by sang on 01/06/14.
 */

var User = require('../models/user');

exports.list = function (req, res, next) {
  console.log(req.method + ' /users => list, query: ' + JSON.stringify(req.query));
  User.getAll(function(err, users){
    console.log(users);
    res.render('users/index', {
      users : users
    })
  });
};

exports.new = function (req, res, next) {
  console.log(req.method + ' /users/new => new, query: ' + JSON.stringify(req.query));
  
  res.render('users/new', {
    user : {
      "_action" : "new"
    }
  })
};

exports.show = function (req, res, next) {
  console.log(req.method + ' /users/:id => show, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params));
  var id = req.params.id;
  
  User.getById(id, function(err, user){
    console.log(user);
    res.render('users/show', {
      user : user
    })
  });
};

exports.edit = function (req, res, next) {
  console.log(req.method + ' /users/:id/edit => edit, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params));
    
  var id = req.params.id; 
  
  User.getById(id, function(err, user){
    console.log(user);
    user._action = 'edit';
    
    res.render('users/edit', {
      user : user
    })
  });
};

exports.create = function (req, res, next) {
  console.log(req.method + ' /users => create, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
  
    User.create({username: req.body.username,password: req.body.password,avatar: req.body.avatar,phone_number: req.body.phone_number,address: req.body.address}, function(err, user){
      console.log(user);
      res.render('users/show', {
        user : user
      })
    });
   
};

exports.update = function (req, res, next) {
  console.log(req.method + ' /users/:id => update, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    
    var id = req.params.id; 
  
    User.updateById(id,{username: req.body.username,password: req.body.password,avatar: req.body.avatar,phone_number: req.body.phone_number,address: req.body.address}, function(err, user){
      console.log(user);
    
      res.json({
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

exports.destroy = function (req, res, next) {
  console.log(req.method + ' /users/:id => destroy, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
  var id = req.params.id;
  User.deleteById(id, function(err){
    console.log(err);
    res.json({
      data:{},
      status:{
        code : 0,
        msg  : 'delete success!'
      }
    });
  });
};

// -- custom

exports.login = function (req, res, next) {  
  username = req.body.username;
  password = req.body.password;
  
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

exports.register = function (req, res, next) {
  username = req.body.username;
  password = req.body.password;
  
  user = new User.model({
    username: username,
    password: password
  });
  
  User.create({
    username: req.body.username,
    password: req.body.password
  }, function(err, user){
    console.log(user);
    if(err){
      return res.redirect('/users/register');
    }else{
      return res.redirect('/users/login');
    }
  });
}

exports.login_get = function (req, res, next) {
  if(req.session.current_user){
    return res.redirect('/');
  }
  
  res.render('users/login',{});
}

exports.register_get = function (req, res, next) {
  res.render('users/register',{});
}

exports.logout = function (req, res, next) {
  res.render('users/register',{});
}


// -- custom api

exports.api = {
  list: function (req, res, next) {
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
  show: function (req, res, next) {
    var user_id = req.api_user._id;
    var id = req.params.user_id;
    
    User.getById(id, function (err, user) {
      if (err) {
        return res.api_error(err);
      }
      
      res.api({
        user : user
      });
    }); 
  },
  create: function (req, res, next) {
    var user_id = req.api_user._id;
  
    User.create({username: req.body.username,password: req.body.password,avatar: req.body.avatar,phone_number: req.body.phone_number,address: req.body.address}, function (err, user) {
      if (err) {
        return res.api_error(err);
      }
      
      res.json({
        user : user
      })
    });
  },
  update: function (req, res, next) {
    var user_id = req.api_user._id;
    var id = req.params.user_id; 
    User.updateById(id, {username: req.body.username,password: req.body.password,avatar: req.body.avatar,phone_number: req.body.phone_number,address: req.body.address}, function (err, user) {
      if (err) {
        return res.api_error(err);
      }
  
      res.api({
        user : user,
        redirect : '/users/' + id
      })
    });
  },
  delete: function (req, res, next) {
    var user_id = req.api_user._id;
    var id = req.params.user_id; 
    
    User.deleteById(id, function (err) {
      if (err) {
        return res.api_error(err);
      }
    
      res.api({id: id})
    });
  }
}
