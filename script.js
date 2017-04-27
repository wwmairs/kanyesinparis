
// globals
var startX = 51;
var startY = 44;

/* boundaries for in_box and at_stop functions
   format: [left x bound, right x bound, top y bound, bottom y bound] */
EIFFEL = [190, 305, 539, 585];
MOULIN = [740, 800, 0, 150];
LOUVRE = [1370, 1510, 370, 250];
HOTEL  = [400, 450, 730, 775];

JAYZ  = [504/1600, 584/1600, 621/804, 656/804];
SWIFT = [717/1600, 883/1600, 621/804, 656/804];
BEY   = [1023/1600, 1144/1600, 621/804, 656/804];

// var adjust = 23;

// Starting values
x = startX;
y = startY;
// setting start X, Y coords, eiffle, louvre, moulin
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

function in_box (box, x1, y1) {
    var relx = x1 / (document.body.clientWidth);
    var rely = y1 / (document.body.clientHeight);
    if ((relx >= box[0]) && (relx <= box[1]) && (rely >= box[2]) && rely <= box[3]) {
        return true;
    } else {
        return false;
    }
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

    if ((at_stop (EIFFEL, x, y)) && (getEiffel == false)) {
        var modal = document.getElementById('eiffelModal');
        modal.style.display = "block";
        mod = 0;
        // I'm worried that this replacement of Kanye doesn't work on small screens
        setX(354);
        setY(598);
        angle = 15;
        setEiffle(true);
        counter_pause = true;

        function MousePos(event) {
            tempx = event.clientX;
            tempy = event.clientY;
            if (in_box (JAYZ, tempx, tempy)) {
                window.location.replace("loser.html");
            } else if (in_box (SWIFT, tempx, tempy)) {
                window.location.replace("loser.html");
            } else if (in_box (BEY, tempx, tempy)) {
                /* TODO success modal here */
                modal.style.display = "none";
                counter_pause = false;
            }
        }
        modal.addEventListener("click", MousePos);
    }

    context = canvas.getContext("2d");
    //context.clearRect(0, 0, WID, HIG);

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
    var color = context.getImageData(x, y, 1, 1).data;
    console.log('just got the color');
    console.log(color);
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    if ((hex == "#00d558") || (hex == "#3e00d3")) {
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

    context.save();
    context.translate(x, y);

   // alerts if Ye is speeding
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

    context.rotate(Math.PI / 180 * angle);
    context.drawImage(car, -(car.width / 2), -(car.height / 1.3));

    context.restore();
}


    // y += (speed * mod) * Math.sin(Math.PI / 180 * angle);
// function correctX(x) {
//     x + Math.cos(angle) * adjust;
// }

// function correctY(y) {
//     y + Math.sin(angle) * adjust;
// }

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

function initializeSessionData () {
    sessionStorage.setItem('x', startX);
    sessionStorage.setItem('y', startY);
    sessionStorage.setItem('eiffle', false);
    sessionStorage.setItem('louvre', false);
    sessionStorage.setItem('moulin', false);
}

function getX () {
    sessionStorage.getItem('x');
}

function getY () {
    sessionStorage.getItem('y');
}

function getEiffle () {
    sessionStorage.getItem('eiffle');
}

function getLouvre () {
    sessionStorage.getItem('louvre');
}

function getMoulin () {
    sessionStorage.getItem('moulin');
}

function setX (newX) {
    sessionStorage.setItem('x', newX);
}

function setY (newY) {
    sessionStorage.setItem('y', newY);
}

function setEiffle (newEiffle) {
    sessionStorage.setItem('eiffle', newEiffle);
}

function setLouvre (newLouvre) {
    sessionStorage.setItem('louvre', newLouvre);
}

function setMoulin (newMoulin) {
    sessionStorage.setItem('moulin', newMoulin);
}
