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

var PostModel= mongoose.model('posts');
var UsersModel= mongoose.model('users');


router.get('/add',function(req,resp){
  UsersModel.find({},function(err,users){
    resp.render('posts/add',{users:users});
  });

});

router.post('/add',uploadMid.single('image'),function(req,resp){
    // req.file uploaded file info ....
    //fs.renameSync(req.file.path,req.file.destination+"/"+req.file.originalname)
    // Fixed Schema
    var post = new PostModel({
      title : req.body.title,
      _id:req.body._id,
      user:req.body.user,
      image:req.file.filename
    });
    post.save(function(err,doc){
      if(!err){
        resp.redirect("/posts/list");
      }else{
        resp.json(err);
      }
    });
    // Dynamic Schema
    /*mongoose.model('posts').collection.insert({
      title : req.body.title,
      _id:req.body._id
    },function(err,doc){
      resp.json(doc);
    });*/

});

router.get('/list',function(req,resp){
  /*PostModel.find({},function(err,result){
    // to populate FK
    UsersModel.populate(result,{path:"user",select:"name"},function(err,result){
      if(!err){
        resp.render('posts/list',{data:result,msg:req.flash('msg')})
      }else{
        resp.json(err);
      }
    });
  })*/
  PostModel.find({})
  .sort({_id:-1})
  .populate({path:"user",select:"name"})
  .then(function(result,err){
    if(result){
      //resp.json("Here!!");
      resp.render('posts/list',{data:result,msg:req.flash('msg')})
    }else{
      //resp.json(err);
    }
  });
});



router.get('/search',function(req,resp){
  PostModel.find({title:{"$regex":req.query.keyword,"$options":"i"}})
  .sort({_id:-1})
  .populate({path:"user",select:"name"})
  .then(function(result,err){
    if(result){
      resp.render('posts/list',{data:result,msg:req.flash('msg')})
    }else{
      resp.json(err);
    }
  });

});
// Dynamic Routing ...
router.get('/edit/:id',function(req,resp){
  PostModel.findOne({_id:parseInt(req.params.id)},function(err,doc){
    resp.render('posts/edit',{obj:doc});
  });
});

// Dynamic Routing ...
router.post('/edit/:id',[bodyParserMid],function(req,resp){

  PostModel.update({_id:parseInt(req.params.id)},
  {"$set":{title:req.body.title } },function(err,doc){
    if(!err)
      resp.redirect('/posts/list');
    else
      resp.json(err);
  });
})


// Dynamic Routing ...
router.get('/delete/:id',function(req,resp){
  PostModel.remove({_id:req.params.id},function(err,result){
    if(!err){
      req.flash("msg","Done");
      resp.redirect("/posts/list");
    }
  });
})
module.exports = router;
