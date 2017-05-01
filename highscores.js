///////////////////////////////////////////////////////////
///// Script for storing and displaying highscores    /////
///////////////////////////////////////////////////////////




///// Helper function to initialize name and score list
///// if necessary
///////////////////////////////////////////////////////////
function setupHighscores() {
  if (localStorage.getItem('highscores') == null) {
    var initialJson = { names: [], scores: [], length: 0}
    var stringJson = JSON.stringify(initialJson);
    localStorage.setItem('highscores', stringJson);
  }
}

///// Helper function to store a new name and score
///////////////////////////////////////////////////////////
function storeName(aName, aScore){
  // TODO: this part
}

///// from 
///// http://www.jquerybyexample.net/2012/06/
///// get-url-parameters-using-jquery.html
///// Helper function to parse URL parameters 
///////////////////////////////////////////////////////////
function getURLParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}
