///////////////////////////////////////////////////////////
///// Script for storing and displaying highscores    /////
///////////////////////////////////////////////////////////

setupHighscores();
console.log(getScores());
addScores();



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
//////Get user data from URL and sessionstorage
///////////////////////////////////////////////////////////
function userData(){
	storeName(getURLParameter("firstname"), getStoredScore());
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
///// Helper function to grab top three highscores
///// adds scores to highscores.html
//////////////////////////////////////////////////////////
function addScores() {
	var data = getScores();
	var namesArray = data.namesAndScores;
	var i = 2;
	if (namesArray.length < 2) {
		i = namesArray.length;
	}
	for (i; i >= 0; i--) {
		var newParagraph = "<p>" + namesArray[i].name + " : " + namesArray[i].score + "</p>";
		document.getElementById("scores").innerHTML += newParagraph;
	}
}
///// Returns JSON object of highscores
///////////////////////////////////////////////////////////
function getScores() {
  var stringJson = localStorage.getItem('highscores');
  var object = JSON.parse(stringJson);
  return object;
}

///// Get Score from Session Storage
//////////////////////////////////////////////////////////
function getStoredScore () {
	var scorestring = sessionStorage.getItem('score');
	var scoreint = parseInt(scorestring, 10);
	return scoreint;
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
