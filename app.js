const express    = require('express'),
      app        = express(),
      morgan     = require('morgan'),
      User       = require("./database/user.js"),
      passport   = require('passport'),
      LocalStrategy =require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      bodyParser  = require('body-parser'),
      binaryserver =require('./myapi/binaryserver.js'),
      context = require("./database/context.js"),
      textconverted = require("./database/textconverted.js"),
      mailsender = require("./myapi/sendmail.js");


      
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
   
    res.render("index",{CurrentUser:req.user});
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


//   Login routes using passport
// register route 
app.post("/register",function(req,res){



    User.register(new User({ 
     username:req.body.username,emailid:req.body.email
                         }),req.body.password,function(err,user){
                if(err){
                    console.log(err);
                    return res.render("register");
                }
                passport.authenticate("local")(req,res,function(){
                      res.redirect("/profile");
                });
    });
 
 });
 // login route
 app.post("/login",passport.authenticate("local",{
     successRedirect:"/profile",
     failureRedirect:"/login"
 }),function(req,res){
 
 
 });
 // logout route
 app.get("/logout",function(req,res){
     req.logout();
     res.redirect("/");
 });


// api for data

app.get("/api/data/texttospeech",function(req,res){
    textconverted.find({},function(err,data){
        res.send(data);
    });
});

app.get("/api/data/summarization",function(req,res){
    context.find({},function(err,data){
        res.send(data);

    });
});

// send mail 
app.get("/api/data/mail",mailsender.sendmymail);

// save data
app.get("/api/data/save",function(req,res){
     
    User.update({ username: req.user.username },{ $push: { datastore:{
        name:req.query.eventname,desp:req.query.desp,context:req.query.context
       
     } } },function(err,data){
         if(err){
             console.log(err);

         }
         else{
             res.send("saved successfully");
         }
     })

})

app.get('/userminute',function(req,res){
    res.render("userminutes",{CurrentUser:req.user,eventname:req.query.eventname});
})



 
 

    


app.listen("3000",function(req,res){
    console.log("server has started");
})    

binaryserver.soundrecserver();