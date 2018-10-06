var context = require("../database/context.js");
var sendgridapikey = require("../config/auth.json").SENDGRID_API_KEY;
var request = require('request');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgridapikey);

module.exports={


sendmymail:function(req,res){
    


    var msg ={
        to: req.query.email,
        from: 'minutemaker4@gmail.com',
        subject:' Summarized Context',
        html:'<strong>Summary</strong><br>'+req.query.summarydata
    }
    sgMail.send(msg);       
    
    

}

}



