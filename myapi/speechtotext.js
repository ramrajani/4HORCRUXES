var lexrak=require('lexrank');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var context = require("../database/context.js");
function summarize(content){

    
    var topLines=lexrak.summarize(content,5,function(err,toplines,text){
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
               temp +=transcript.results[i].alternatives[0].transcript;
              }
           summarize(temp);
          


        }
      
               }
      });
     }




  }



}



