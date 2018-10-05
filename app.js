const express    = require('express'),
      app        = express(),
      morgan     = require('morgan'),
      User       = require("./database/user.js"),
      passport   = require('passport'),
      LocalStrategy =require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      bodyParser  = require('body-parser');


      
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('express-session')({
    secret:"RSquare Corporation will be there soon",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static(__dirname + '/styles'));
app.use(morgan('combined'));


//  isloggedIn function -- checking for user logged in using session
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// initial routes
app.get("/",function(req,res){
    res.render("index");
});

// show profile 
app.get("/profile",isLoggedIn,function(req,res){

    res.render("profile",{CurrentUser:req.user});
    
})


// show login page
app.get("/login",function(req,res){
    res.render("login",{CurrentUser:req.user});
});
//show sign up page
app.get("/signup",function(req,res){
   res.render("register",{CurrentUser:req.user});
});




    


app.listen("3000",function(req,res){
    console("server has started");
})    