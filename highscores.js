///////////////////////////////////////////////////////////
///// Script for storing and displaying highscores    /////
///////////////////////////////////////////////////////////

setupHighscores();
console.log(getScores());



///// Helper function to initialize name and score list
///// if necessary
///////////////////////////////////////////////////////////
function setupHighscores() {
  if (localStorage.getItem('highscores') == null) {
    var initialJson = { namesAndScores:[] }
    var stringJson = JSON.stringify(initialJson);
    localStorage.setItem('highscores', stringJson);
  }
}

///// Helper function to store a new name and score
///////////////////////////////////////////////////////////
function storeName(aName, aScore){
  var newEntry = {name: aName, score: aScore}
  var data = getScores();
  data.namesAndScores.push(newEntry);
  sortScores(data);
  var stringJson = JSON.stringify(data);
  localStorage.setItem('highscores', stringJson);
}

/////Helper function to sort highscores list
///////////////////////////////////////////////////////////
function sortScores(object){
	object.namesAndScores.sort(function(a, b){
		var score1 = a.score;
		var score2 = b.score;
		return score1-score2
	});
}

///// Returns JSON object of highscores
///////////////////////////////////////////////////////////
function getScores() {
  var stringJson = localStorage.getItem('highscores');
  var object = JSON.parse(stringJson);
  return object;
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
