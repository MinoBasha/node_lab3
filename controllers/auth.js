var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bodyParserMid = bodyParser.urlencoded();

router.get('/login',function(req,resp){
  resp.render('auth/login',{
    msg : req.flash("msg")
  });
});

router.post('/login',bodyParserMid,function(req,resp){
  var username = req.body.username;
  var pass = req.body.password;
  if(username == "ahmed" && pass=='123456'){
    req.session.username = "ahmed";
    req.session.password = "123456"
    resp.redirect('/posts/list');
  }else{
    req.flash("msg","invalid username & password");
    resp.redirect('/auth/login');
  }

});

router.get('/register',function(req,resp){
  resp.render('auth/register');
});

router.post('/register',bodyParserMid,function(req,resp){

});

router.get('/logout',function(req,resp){
  req.session.destroy(function(){
    resp.redirect('auth/login');
  });

});

module.exports = router;
