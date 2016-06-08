"use strict";

/**
 * Created by Moajs on June 8th 2016, 2:35:18 pm.
 */
 
var $models = require('mount-models')(__dirname);

var Cup = $models.cup;

exports.list = async (ctx, next) => {
  console.log(ctx.method + ' /cups => list, query: ' + JSON.stringify(ctx.query));
  
  let cups = await Cup.getAllAsync();
  
  await ctx.render('cups/index', {
    cups : cups
  })
};

exports.new = async (ctx, next) => {
  console.log(ctx.method + ' /cups/new => new, query: ' + JSON.stringify(ctx.query));

  await ctx.render('cups/new', {
    cup : {
      "_action" : "new"
    }
  });
};

exports.show = async (ctx, next) => {
  console.log(ctx.method + ' /cups/:id => show, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));
  let id = ctx.params.id;
  let cup = await Cup.getByIdAsync(id);
  
  console.log(cup);
  
  await ctx.render('cups/show', {
    cup : cup
  });
};

exports.edit = async (ctx, next) => {
  console.log(ctx.method + ' /cups/:id/edit => edit, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params));

  let id = ctx.params.id;

  let cup = await Cup.getByIdAsync(id);
  
  console.log(cup);
  cup._action = 'edit';

  await ctx.render('cups/edit', {
    cup : cup
  });
};

exports.create = async (ctx, next) => {
  console.log(ctx.method + ' /cups => create, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

  let cup = await Cup.createAsync({name: ctx.request.body.name,password: ctx.request.body.password});
  
  console.log(cup);
  await ctx.render('cups/show', {
    cup : cup
  });
};

exports.update = async (ctx, next) => {
  console.log(ctx.method + ' /cups/:id => update, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));

  let id = ctx.params.id;

  let cup = await Cup.updateByIdAsync(id,{name: ctx.request.body.name,password: ctx.request.body.password});
  
  ctx.body = ({
    data:{
      redirect : '/cups/' + id
    },
    status:{
      code : 0,
      msg  : 'delete success!'
    }
  });
};

exports.destroy = async (ctx, next) => {
  console.log(ctx.method + ' /cups/:id => destroy, query: ' + JSON.stringify(ctx.query) +
    ', params: ' + JSON.stringify(ctx.params) + ', body: ' + JSON.stringify(ctx.request.body));
  let id = ctx.params.id;
  
  await Cup.deleteByIdAsync(id);
  
  ctx.body = ({
    data:{},
    status:{
      code : 0,
      msg  : 'delete success!'
    }
  });
};

// -- custom

// -- custom api
exports.api = {
  list: async (ctx, next) => {
    let cup_id = ctx.api_cup._id;

    let cups = await Cup.queryAsync({});
    
    await ctx.api({
      cups : cups
    })
  },
  show: async (ctx, next) => {
    let cup_id = ctx.api_cup._id;
    let id = ctx.params.cup_id;

    let cup = await Cup.getByIdAsync(id);
    
    await ctx.api({
      cup : cup
    });
  },
  create: async (ctx, next) => {
    let cup_id = ctx.api_cup._id;

    let cup = await Cup.createAsync({name: ctx.request.body.name,password: ctx.request.body.password});
    
    ctx.body = ({
      cup : cup
    });
  },
  update: async (ctx, next) => {
    let cup_id = ctx.api_cup._id;
    let id = ctx.params.cup_id;
    
    let cup = await Cup.updateByIdAsync(id, {name: ctx.request.body.name,password: ctx.request.body.password});
    
    await ctx.api({
      cup : cup,
      redirect : '/cups/' + id
    });
  },
  delete: async (ctx, next) => {
    let cup_id = ctx.api_cup._id;
    let id = ctx.params.cup_id;

    await Cup.deleteByIdAsync(id);
    
    await ctx.api({id: id});
  }
}
