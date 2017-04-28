
// globals
var startX = 51;
var startY = 44;

// TODO: someone who knows jokes about kanye 
// west should write better directions
var directions = ["Allez à la Tour Eiffel!!", "Allez au Moulin Rouge!",
                  "Cherchez au Louvre!", "Rentrez à l'hotel!"];
var destination = {
    EIFFEL : 0,
    MOULIN : 1,
    LOUVRE : 2,
    HOTEL  : 3
};

/* boundaries for in_box and at_stop functions
   format: [left x bound, right x bound, top y bound, bottom y bound] */
EIFFEL = [190, 305, 539, 585];
MOULIN = [740, 800, 0, 150];
LOUVRE = [1370, 1510, 370, 250];
HOTEL  = [400, 450, 730, 775];

// Starting values
x = startX;
y = startY;
// setting start X, Y coords, eiffle, louvre, moulin, directions
initializeSessionData();

speed = 1;
angle = 45;
mod = 0;
limit = 5;
counter_pause = false;
/* TODO:
    - Modals for: success, broken rules, start and finish
    - store past scores of each user (and overall high score)
    - data reporting at the end of the game */
WID = $(window).width() - 10;
HIG = $(window).height() - 10;
HBOUND = HIG + 50;
LBOUND = WID + 50;


// Countdown Timer
var counter = 45;
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

// Create and get images for canvas elements
car = new Image();
car.crossOrigin = "Anonymous";
car.src = "https://dl.dropboxusercontent.com/s/n66p9bussx82uo7/kanyecar.png?dl=0";

map = new Image();
map.crossOrigin = "Anonymous";
map.src = "https://dl.dropboxusercontent.com/s/8ovyemcx0z8mzvx/boardmap.jpg?dl=0";




window.addEventListener("keydown", keypress_handler, false);

// prevents arrow keys from scrolling page, so they can be used for controlling kanye
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

// Helper for determining when Kanye is offroading
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function at_stop (location, x1, y1) {
    if ((x1 >= location[0]) && (x1 <= location[1]) && (y1 >= location[2]) && (y1 <= location[3])) {
        return true;
    } else {
        return false;
    }
}

// Main draw loop
function draw() {

    console.log("Coordinates:" + x + ", " + y);
    console.log("")
    if ((at_stop (EIFFEL, x, y)) && (getEiffel() == "false")) {
        window.location.replace("eiffel.html");

        setEiffel(true);
        counter_pause = true;
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
    }

    context = canvas.getContext("2d");
    context.clearRect(0, 0, WID, HIG);

    context.drawImage(map, 0, 0, WID, HIG);
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


    // tells whether Ye is off the road
    offRoading();

    context.save();
    context.translate(x, y);

    // alerts if Ye is speeding
    speeding();

    // alerts is Ye left Paris
    leftParis();

    context.rotate(Math.PI / 180 * angle);
    context.drawImage(car, -(car.width / 2), -(car.height / 1.3));

    context.restore();
}


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

///////////////////////////////////////////////////////////
///// HELPER FUNCTIONS for draw() loop                /////
///////////////////////////////////////////////////////////


// Checking that Kanye is on road, displays modal, 
// changes time, resets x y coords
///////////////////////////////////////////////////////////
function offRoading() {
    var color = context.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    console.log('hex values:');
    console.log(hex);
    var offroadvals = ["#51c45c", "#0f33ce", "#51c45c", "#0f33ce", "#00d558", "#3e00d3"];
    if (offroadvals.indexOf(hex) != -1) {
        console.log('Kanyes is offroading!');
        var modal = document.getElementById('off_road');
        modal.style.display = "block";
        counter_pause = true;
        x = startX;
        y = startY;
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
        x = startX;
        y = startY;
        angle = 45;
        mod = 0;
        window.onclick = function(event) {
            modal.style.display = "none";
            counter_pause = false;
        }
    }
}


///////////////////////////////////////////////////////////
///// HELPER FUNCTIONS for session data               /////
///////////////////////////////////////////////////////////
function initializeSessionData () {
    sessionStorage.setItem('x', startX);
    sessionStorage.setItem('y', startY);
    sessionStorage.setItem('eiffel', false);
    sessionStorage.setItem('louvre', false);
    sessionStorage.setItem('moulin', false);
    sessionStorage.setItem('direct', directions[destination.EIFFEL]);
}

// getters and setters
///////////////////////////////////////////////////////////
function getX () {return sessionStorage.getItem('x');}

function getY () {return sessionStorage.getItem('y');}

function getEiffel () {return sessionStorage.getItem('eiffel');}

function getLouvre () {return sessionStorage.getItem('louvre');}

function getMoulin () {return sessionStorage.getItem('moulin');}

function setX (newX) {return sessionStorage.setItem('x', newX);}

function setY (newY) {return sessionStorage.setItem('y', newY);}

function setEiffel (newEiffel) {
    return sessionStorage.setItem('eiffel', newEiffel);}

function setLouvre (newLouvre) {
    return sessionStorage.setItem('louvre', newLouvre);}

function setMoulin (newMoulin) {
    return sessionStorage.setItem('moulin', newMoulin);}
