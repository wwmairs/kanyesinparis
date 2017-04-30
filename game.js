///////////////////////////////////////////////////////////////////////////////
/////                               game.js                               /////
/////          javascript code used to implement the gameplay of          /////
/////                                                                     /////
/////                           Kanye's In Paris™                         /////
/////                      a game of skill and trivia                     /////
/////                                                                     /////
/////                                  by                                 /////
/////           Avery Spratt, Adam Kercheval, and William Mairs           /////
///////////////////////////////////////////////////////////////////////////////

// General TODOs
/*
    - store past scores of each user (and overall high score)
    - data reporting at the end of the game
    - someone with better Kanye-related joke writing abilities
      should come up with some clever directions for the DIRECTIONS
      array (~line 25)
    - MAKE KANYE STAY ON THE ROAD
      he can still drive wherever he pleases
*/

// General notes
/*
    - something WILD: sessionStorage seems to convert boolean
      values false and true into string "false" and "true"
      what a weird language feature
      It does this same thing to floats too... why?
*/

// Global constants
const START_X = 51;
const START_Y = 44;
const destEnum = {EIFFEL : 0, MOULIN : 1, LOUVRE : 2, HOTEL  : 3};
const DIRECTIONS = ["Go to the Eiffel Tower!",
                    "Go to the Moulin Rouge!",
                    "Go to the Louvre!",
                    "Go back to the Hotel!"];
// Boundaries for in_box and at_stop functions
// [left x bound, right x bound, top y bound, bottom y bound]
// THESE ARE ALL RATIOS NOW, of x coord / WID and y coord / HIG
const EIFFEL = [.117, .232, .656, .760];
const MOULIN = [.460, .535, .085, .170];
const LOUVRE = [.876, .964, .360, .444];
const HOTEL  = [.254, .330, .870, .998];

// setting start X, Y coords, eiffel, louvre, moulin, directions
// only initializes if a game is not currently in progress
initializeSessionData();
showDirections();

// Starting values
x = getX();
y = getY();
counter = getCounter();
speed = 1;
angle = 45;
mod = 0;
limit = 5;
// Game starts paused; unpauses when player clicks directions modal
counter_pause = true;

WID = $(window).width() - 10;
HIG = $(window).height() - 10;
HBOUND = HIG + 50;
LBOUND = WID + 50;


// Countdown Timer
//var counter = 45;
var interval = setInterval(function() {
    if (counter_pause) {
        // do nothing
    } else {
        counter--;
    }
    if (counter <= 0) {
        clearInterval(interval);
        /* commented this out for testing */
        //window.location.replace("loser.html");
    }
}, 1000);

// Initialize canvas element
canvas = document.getElementById("canvas");
m = document.getElementById("mod");
context = canvas.getContext("2d");
canvas.width = WID - 20;
canvas.height = HIG - 20;

// load car and map images
loadImages();

// prevents arrow keys from scrolling page, so they can be used
// for controlling kanye
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// Board is redrawn every 30 miliseconds
var moveInterval = setInterval(function () {
    draw();
}, 30);


// Main draw loop
function draw() {
    // Checks and responds appropriately if Kanye is at a
    // destination, speeding, or has left Paris
    checkDestinations();
    speeding();
    leftParis();

    context = canvas.getContext("2d");
    context.clearRect(0, 0, WID, HIG);
    context.drawImage(map, 0, 0, WID, HIG);
    // Checks if Ye is off the road - has to be executed after map has been drawn
    // on canvas, but before car has been drawn
    offRoading();

    var displayspeed = mod;

    // draws spedometer and fills it with speed - this is admittedly a pretty
    // hacky solution, and is especially risky on particularly small screens
    if (mod < 0) {
        displayspeed *= -1;
    }
    //context.drawImage(spedometer, (8.5 * (WID/10)), (HIG/20));
    context.font = "60px Impact";
    if (displayspeed <= (limit * 0.7)) {
        context.fillStyle = "black";
    } else if ((displayspeed > (limit * 0.7)) && (displayspeed < limit)) {
        context.fillStyle = "yellow";
    } else {
        context.fillStyle = "red";
    }
    context.fillText(displayspeed, (7.8 * (WID/10)), (9.2 * (HIG/10)));
    context.font = "40px Impact";
    context.fillStyle = "black";
    context.fillText(counter, (8.8 * (WID/10)), (9.65 * (HIG/10)));

    x += (speed * mod) * Math.cos(Math.PI / 180 * angle);
    y += (speed * mod) * Math.sin(Math.PI / 180 * angle);

    context.save();
    context.translate(x, y);

    context.rotate(Math.PI / 180 * angle);
    context.drawImage(car, -(car.width / 2), -(car.height / 1.3));

    context.restore();
}

///////////////////////////////////////////////////////////////////////////////
/////                       Land of the helpers                           /////
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
///// Functions for checking if at destinations       /////
///////////////////////////////////////////////////////////

// Checks if Kanye is at the correct location, following
// a set order: Eiffel -> Moulin -> Louvre -> Hotel
///////////////////////////////////////////////////////////
function checkDestinations() {
    if (getEiffel() == "false"){
        checkEiffel();
    }
    if (getEiffel() == "true" && getMoulin() == "false") {
        checkMoulin();
    }
    if (getEiffel() == "true" && getMoulin() == "true" &&
        getLouvre() == "false") {
        checkLouvre();
    }
    if (getEiffel() == "true" && getMoulin() == "true" &&
        getLouvre() == "true") {
    checkHotel();
    }

}
function checkEiffel() {
    if (at_stop(EIFFEL, x, y)) {
        setX(x);
        setY(y);
        setCounter(counter);
        window.location.replace("eiffel.html");
        counter_pause = true;
    }
}

function checkMoulin() {
    if (at_stop (MOULIN, x, y)) {
        setX(x);
        setY(y);
        setCounter(counter);
        window.location.replace("moulinrouge.html");
        counter_pause = true;
    }
}

function checkLouvre() {
    if (at_stop (LOUVRE, x, y)) {
        setX(x);
        setY(y);
        setCounter(counter);
        window.location.replace("louvre.html");
        counter_pause = true;
    }
}

function checkHotel() {
    if (at_stop (HOTEL, x, y)) {
        window.location.replace("winner.html");
        counter_pause = true;
    }
}

// Returns true if x1 and y1 are within the block
// represented by location
///////////////////////////////////////////////////////////
function at_stop (location, x1, y1) {
    if ((x1/WID >= location[0]) && (x1/WID <= location[1]) &&
        (y1/HIG >= location[2]) && (y1/HIG <= location[3])) {
        return true;
    } else {
        return false;
    }
}

///////////////////////////////////////////////////////////
///// HELPER FUNCTIONS for displaying directions      /////
///////////////////////////////////////////////////////////
function showDirections() {

    var whichModal = getDirect();
    switch (whichModal) {
        case "0": break;
        case "1":
            whichModal = 'eiffel_success';
            break;
        case "2":
            whichModal = 'rouge_success';
            break;
        case "3":
            whichModal = "lourve_success";
            break;
        default: // do nothing
    }

    if (whichModal != "0") {
        var modal = document.getElementById(whichModal);
            modal.style.display = "block";
            counter_pause = true;
            window.onclick = function(event) {
                modal.style.display = "none";
                // player can only move once directions are gone
                window.addEventListener("keydown", keypress_handler, false);
                counter_pause = false;
            }
        } else {
            var modal = document.getElementById("destination");
                    document.getElementById("direction").innerHTML
                            = DIRECTIONS[getDirect()];
                modal.style.display = "block";
                counter_pause = true;
                window.onclick = function(event) {
                    modal.style.display = "none";
                    // player can only move once directions are gone
                    window.addEventListener("keydown", keypress_handler, false);
                    counter_pause = false;
                }
        }
}

///////////////////////////////////////////////////////////
///// HELPER FUNCTIONS for draw() loop                /////
///////////////////////////////////////////////////////////


// Checking that Kanye is on road, displays modal,
// changes time, resets x y coords
///////////////////////////////////////////////////////////
function offRoading() {
    var color = context.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    var offroadvals = ["#51c45c", "#0f33ce",
                       "#51c45c", "#0f33ce",
                       "#00d558", "#3e00d3"];
    console.log(hex);
    if (offroadvals.indexOf(hex) != -1) {
        var modal = document.getElementById('off_road');
        modal.style.display = "block";
        counter_pause = true;
        x = getX();
        y = getY();
        counter -= 5;
        mod = 0;
        angle = 45;
        window.onclick = function(event) {
            modal.style.display = "none";
            counter_pause = false;
        }
    }
}

// Checking if Kanye is speeding, displays modal and stuff
///////////////////////////////////////////////////////////
function speeding() {
   if ((mod > limit) || (mod < (limit * -1))) {
       var modal = document.getElementById('too_fast');
       modal.style.display = "block";
       counter_pause = true;
       counter -= 5;
       mod = 0;
       window.onclick = function(event) {
           modal.style.display = "none";
           counter_pause = false;
       }
   }
}

// Checking if Kanye a quitté Paris, displays modal and stuff
///////////////////////////////////////////////////////////
function leftParis() {
    if ((x > LBOUND) || (y > HBOUND) || (x < -20) || (y < -50)){
        var modal = document.getElementById('left_paris');
        modal.style.display = "block";
        counter_pause = true;
        x = getX();
        y = getY();
        angle = 45;
        mod = 0;
        window.onclick = function(event) {
            modal.style.display = "none";
            counter_pause = false;
        }
    }
}

// Helper for determining when Kanye is offroading
///////////////////////////////////////////////////////////
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

// Using arrow-key input to move Kanye
///////////////////////////////////////////////////////////
function keypress_handler(event) {
    if (event.keyCode == 38) { // up arrow
        mod += 1; // speeds up every time you press up
    }
    if (event.keyCode == 40) { // down arrow
        mod -= 1; // slows down every time you press down
    }
    if (event.keyCode == 37) { // left arrow
        angle -= 10;
    }
    if (event.keyCode == 39) { // right arrow
        angle += 10;
    }
}

// Loading car and map images
///////////////////////////////////////////////////////////
function loadImages() {
    // Create and get images for canvas elements
    car = new Image();
    car.crossOrigin = "Anonymous";
    car.src = "https://dl.dropboxusercontent.com/s/n66p9bussx82uo7/kanyecar.png?dl=0";

    map = new Image();
    map.crossOrigin = "Anonymous";
    map.src = "https://dl.dropboxusercontent.com/s/8ovyemcx0z8mzvx/boardmap.jpg?dl=0";
}


///////////////////////////////////////////////////////////
///// HELPER FUNCTIONS for session data               /////
///////////////////////////////////////////////////////////
function initializeSessionData () {
    if (sessionStorage.getItem('gameStarted') == null) {
        sessionStorage.setItem('gameStarted', true);
        sessionStorage.setItem('x', START_X);
        sessionStorage.setItem('y', START_Y);
        sessionStorage.setItem('eiffel', false);
        sessionStorage.setItem('louvre', false);
        sessionStorage.setItem('moulin', false);
        sessionStorage.setItem('hotel',  false);
        sessionStorage.setItem('direct', destEnum.EIFFEL);
        sessionStorage.setItem('counter', 45);
    }
}

// getters and setters
///////////////////////////////////////////////////////////
function getX () {return parseFloat(sessionStorage.getItem('x'));}

function getY () {return parseFloat(sessionStorage.getItem('y'));}

function getEiffel () {return sessionStorage.getItem('eiffel');}

function getLouvre () {return sessionStorage.getItem('louvre');}

function getMoulin () {return sessionStorage.getItem('moulin');}

function getHotel () {return sessionStorage.getItem('hotel');}

function getDirect () {return sessionStorage.getItem('direct');}

function getCounter () {return sessionStorage.getItem('counter');}

function setX (newX) {sessionStorage.setItem('x', newX);}

function setY (newY) {sessionStorage.setItem('y', newY);}

function setEiffel (newEiffel) {sessionStorage.setItem('eiffel', newEiffel);}

function setLouvre (newLouvre) {sessionStorage.setItem('louvre', newLouvre);}

function setMoulin (newMoulin) {sessionStorage.setItem('moulin', newMoulin);}

function setHotel (newHotel) {sessionStorage.setItem('hotel', newHotel);}

function setDirect (newDirect) {sessionStorage.setItem('direct', newDirect);}

function setCounter (newCounter)
                            {sessionStorage.setItem('counter', newCounter);}


// Hey Adam, I moved this stuff down here
// This is all old stuff from releasing modals when Kanye reaches eiffel tower -
// it's not necessary anymore, but I kept it in for now just because some
// functions might be reusable
/*        var modal = document.getElementById('eiffelModal');
modal.style.display = "block";
mod = 0;
// I'm worried that this replacement of Kanye doesn't work on small screens
setX(354);
setY(598);
angle = 15;
function MousePos(event) {
tempx = event.clientX;
tempy = event.clientY;
if (in_box (JAYZ, tempx, tempy)) {
window.location.replace("loser.html");
} else if (in_box (SWIFT, tempx, tempy)) {
window.location.replace("loser.html");
} else if (in_box (BEY, tempx, tempy)) {
modal.style.display = "none";
counter_pause = false;
}
}
modal.addEventListener("click", MousePos); */
