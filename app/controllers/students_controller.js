/**
 * Created by Moajs on June 8th 2016, 9:03:58 am.
 */
 
var $models = require('mount-models')(__dirname);

var Student = $models.student;

exports.list = function *(ctx, next) {
  console.log(ctx.method + ' /students => list, query: ' + JSON.stringify(ctx.query));
  
  var students = yield Student.getAllAsync();
  
  yield ctx.render('students/index', {
    students : students
  })
  // return Student.getAllAsync().then((students)=>{
  //   return ctx.render('students/index', {
  //     students : students
  //   })
  // })
};

exports.new = function *(ctx, next) {
  console.log(ctx.method + ' /students/new => new, query: ' + JSON.stringify(ctx.query));

  return ctx.render('students/new', {
    student : {
      "_action" : "new"
    }
  })
};

exports.show = function *(ctx, next) {
  console.log(ctx.method + ' /students/:id => show, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));
  var id = ctx.params.id;

  return Student.getByIdAsync(id).then(function(student){
    console.log(student);
    return ctx.render('students/show', {
      student : student
    })
  });
};

exports.edit = function *(ctx, next) {
  console.log(ctx.method + ' /students/:id/edit => edit, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));

  var id = ctx.params.id;

  return Student.getById(id, function(err, student){
    console.log(student);
    student._action = 'edit';

    return ctx.render('students/edit', {
      student : student
    })
  });
};

exports.create = function *(ctx, next) {
  console.log(ctx.method + ' /students => create, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

    return Student.createAsync({name: ctx.request.body.name,password: ctx.request.body.password}).then( student => {
      console.log(student);
      return ctx.render('students/show', {
        student : student
      })
    })
};

exports.update = function *(ctx, next) {
  console.log(ctx.method + ' /students/:id => update, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

    var id = ctx.params.id;

    return Student.updateById(id,{name: ctx.request.body.name,password: ctx.request.body.password}).then( student => {
      console.log(student);

      return ctx.body = ({
        data:{
          redirect : '/students/' + id
        },
        status:{
          code : 0,
          msg  : 'delete success!'
        }
      });
    });
};

exports.destroy = function *(ctx, next) {
  console.log(ctx.method + ' /students/:id => destroy, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));
  var id = ctx.params.id;
  return Student.deleteByIdAsync(id).then( () =>{
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
  list: function *(ctx, next) {
    var student_id = ctx.api_student._id;

    return Student.queryAsync({}).then((students) => {
      return ctx.api({
        students : students
      })
    }).catch((err)=>{
      return ctx.api_error(err);
    });
  },
  show: function *(ctx, next) {
    var student_id = ctx.api_student._id;
    var id = ctx.params.student_id;

    return Student.getByIdAsync(id).then((student)=>{
      return ctx.api({
        student : student
      });
    }).catch((err)=>{
      return ctx.api_error(err);
    });
  },
  create: function *(ctx, next) {
    var student_id = ctx.api_student._id;

    return Student.createAsync({name: ctx.request.body.name,password: ctx.request.body.password}).then(student=> {
      return ctx.body = ({
        student : student
      })
    }).catch((err)=>{
      return ctx.api_error(err);
    });

  },
  update: function *(ctx, next) {
    var student_id = ctx.api_student._id;
    var id = ctx.params.student_id;
    return Student.updateByIdAsync(id, {name: ctx.request.body.name,password: ctx.request.body.password}).then(student=> {
      return ctx.api({
        student : student,
        redirect : '/students/' + id
      })
    }).catch((err)=>{
      return ctx.api_error(err);
    });
  },
  delete: function *(ctx, next) {
    var student_id = ctx.api_student._id;
    var id = ctx.params.student_id;

    return Student.deleteByIdAsync(id).then(function(){
      return ctx.api({id: id})
    }).catch((err)=>{
      return ctx.api_error(err);
    }); 
  }
}
