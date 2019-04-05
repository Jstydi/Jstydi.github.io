console.log("main script");
setInterval(function() { 
fetch("https://script.google.com/macros/s/AKfycbzhfFlERekRFbNfAz3tseaQaIMjn8nogAKgqL4g693AdgrccDo/exec?p1='Test sw'&p2='sw'")
    .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.log('Looks like there was a problem. Status Code: ' +  
          response.status);  
        return;  
      }
      // Examine the text in the response  
      response.json().then(function(data) {  
        console.log(data);  
      });  
    }  
    )  
  .catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  })
  }, 10000);
