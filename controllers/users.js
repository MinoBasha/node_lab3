var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bodyParserMid = bodyParser.urlencoded();
var fs = require('fs');
var mongoose = require('mongoose');
// To upload file
var multer = require('multer');
var uploadMid = multer({
  dest:"./public/imgs"
});

var UserModel= mongoose.model('users');


router.get('/add',function(req,resp){
  resp.render('users/add');
});

router.post('/add',bodyParserMid,function(req,resp){
    // req.file uploaded file info ....
    //fs.renameSync(req.file.path,req.file.destination+"/"+req.file.originalname)
    // Fixed Schema
    var user = new UserModel({
      name : req.body.name,
      _id:req.body._id
    });
    user.save(function(err,doc){
      if(!err){
        resp.redirect("/users/list");
      }else{
        resp.json(err);
      }
    });
    // Dynamic Schema
    /*mongoose.model('users').collection.insert({
      title : req.body.name,
      _id:req.body._id
    },function(err,doc){
      resp.json(doc);
    });*/

});

router.get('/list/:page?',function(req,resp){
  var pageNumber = 1;
  if(req.params.page)
    pageNumber = req.params.page

  UserModel.paginate({}, { page: pageNumber, limit: 10 },function(err,result){
    if(!err){
      resp.render('users/list',{data:result,msg:req.flash('msg')})
    }else{
      resp.json(err);
    }
  })

});

// Dynamic Routing ...
router.get('/edit/:id',function(req,resp){
  UserModel.findOne({_id:parseInt(req.params.id)},function(err,doc){
    resp.render('users/edit',{obj:doc});
  });
});

// Dynamic Routing ...
router.post('/edit/:id',[bodyParserMid],function(req,resp){

  UserModel.update({_id:parseInt(req.params.id)},
  {"$set":{title:req.body.name } },function(err,doc){
    if(!err)
      resp.redirect('/users/list');
    else
      resp.json(err);
  });
})


// Dynamic Routing ...
router.get('/delete/:id',function(req,resp){
  UserModel.remove({_id:req.params.id},function(err,result){
    if(!err){
      req.flash("msg","Done");
      resp.redirect("/users/list");
    }
  });
})
module.exports = router;
