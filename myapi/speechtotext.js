var lexrak=require('lexrank');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var context = require("../database/context.js");
var textconverted = require("../database/textconverted.js");
var Q= require('q');
function dataready(transcript){
  

    var superarray=[];

   for(var i=0;i<transcript.results.length;i++){
     var temp =transcript.results[i].alternatives[0].timestamps;
     for(var j=0;j<temp.length;j++){
       var temparray =temp[j];
      if(transcript.speaker_labels){
        for(var z=0;z<transcript.speaker_labels.length;z++){
            var temp2 = transcript.speaker_labels[z];
            if(temp2.from==temparray[1] && temp2.to==temparray[2]){
                temparray.push(temp2.speaker);
                superarray.push(temparray);
            }
  

      }
       
       }
     }
   }

   var str="";

   for(var i=0;i<superarray.length-1;i++){
        var b=0;
        if(superarray[i][3]==superarray[i+1][3])
        {
          if(b==0)
          {
            console.log("Speaker:"+superarray[i][3]);
            str+=superarray[i][3];
            b=1;
          }
          console.log(superarray[i][0]);
            str+=superarray[i][0];
        }
        else {
          //printnewline
          //console.log("\n");
          str+='<br>';
          b=0;

        }
        

//console.log(superarray);
   }


}
var promisedisplay = Q.denodeify(dataready);
function summarize(content){

    
var c =content.split(/\r\n|\r|\n/).length
var max=Math.max(c/20,1);

    var topLines=lexrak.summarize(content,max,function(err,toplines,text){
        if(err){
            console.log(err);
        }
        console.log(text);
        context.findOneAndUpdate({tid:1},{tid:1,desp:text},{ upsert: true, new: true, setDefaultsOnInsert: true },function(err,description){
            if(!err){
              console.log(description);
            }
        })
        });
        

}
module.exports={
  
 

  textspeech:function(filename){

   


    var speechToText = new SpeechToTextV1({
        username: 'f0151a44-47a1-480b-8fa2-aab0195fe1ef',
        password: 'KyYQl1KG3aoJ',
        url: 'https://stream.watsonplatform.net/speech-to-text/api'
      });
    
    
    var fs = require('fs');
    
    var files = [filename];
    
    
    
    for (var file in files) {
     var params = {
        audio: fs.createReadStream(files[file]),
        content_type: 'audio/wav',
        model: 'en-US_NarrowbandModel',
        timestamps: true,
        word_alternatives_threshold: 0.9,
        keywords: ['colorado', 'tornado', 'tornadoes'],
        keywords_threshold: 0.5
     };
    speechToText.recognize(params, function (error, transcript) {
     if (error)
          console.log('Error:', error);
     else{
         console.log(transcript);
         
        //console.log(JSON.stringify(transcript, null, 2));
        if(transcript.results.length!=0){
            var temp="";
            for(var i=0;i<transcript.results.length;i++){
               temp +=transcript.results[i].alternatives[0].transcript+" ";
              }
           summarize(temp);
          var promise = dataready(transcript);
          promise.then(function(){

             
            textconverted.findOneAndUpdate({tid:1},{tid:1,desp:text},{ upsert: true, new: true, setDefaultsOnInsert: true },function(err,description){
                if(!err){
                  console.log(description);
                }
            });




            

          })



        }
      
               }
      });
     }




  }



}



