var lexrak=require('lexrank');

module.exports={
  
  summarize: function(content){

    
            var topLines=lexrak.summarize(content,5,function(err,toplines,text){
                if(err){
                    console.log(err);
                }
                console.log(text);
                
                });


  },

  textspeech:function(filename){

    var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');


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
        console.log(JSON.stringify(transcript, null, 2));
        console.log(transcript.results[0].alternatives[0].transcript);
        
       }
      });
     }




  }



}



