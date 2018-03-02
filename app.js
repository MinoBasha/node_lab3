// Create HTTP Server ..
var express = require('express');
var server = express();

// Models
require('./models/posts');
require('./models/users')
//Static Mid
server.use(express.static('public'));
var authRoutes =require('./controllers/auth');
var postsRoutes =require('./controllers/posts');
var usersRoutes =require('./controllers/users');

var mongoose= require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');

// Auth Mod
// mongoose.connect("mongodb://username:password@localhost:27017/iti_38_blog");

mongoose.connect("mongodb://localhost:27017/iti_38_blog");



server.use(session({
  secret:"@#%#$^$%",
  cookie:{maxAge:1000*60*60*24*7}
}));

server.use(flash());
server.use('/auth',authRoutes);
// Auth Mid
/*server.use(function(req,resp,next){
  if(!(req.session.username && req.session.password))
  {
    resp.redirect('/auth/login')
  }else{
    resp.locals={
      name:req.session.username
    }
    next();
  }
})*/
// http://localhost:9090/auth/login
// Routes Mid
server.use('/users',usersRoutes);
server.use('/posts',postsRoutes);

server.set('view engine','ejs');
server.set('views','./views');

server.listen(9090,function(){
  console.log("Starting ...");
});
