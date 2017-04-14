x = 0;
y = 0;
speed = 1;
angle = 0;
mod = 0;
limit = 10;
/* TODO:
    - get WID and HIG to automatically fill the user's screen width and
        height, instead of being hard-coded in
    - clickable buttons on canvas?
    - store past scores of each user (and overall high score)
    - data reporting at the end of the game */
WID = $(window).width();
HIG = $(window).height();
HBOUND = HIG + 50;
LBOUND = WID + 50;

// timer
var counter = 30;
var interval = setInterval(function() {
    counter--;
    timer = document.getElementById("timer");
    timer.innerHTML = counter;
    if (counter == 0) {
        clearInterval(interval);
        alert("You lost, bummer");
    }
}, 1000);

canvas = document.getElementById("canvas");
m = document.getElementById("mod");
context = canvas.getContext("2d");
car = new Image();
car.src = "https://dl.dropboxusercontent.com/s/n66p9bussx82uo7/kanyecar.png?dl=0";
car.crossOrigin = "Anonymous";
map = new Image();
map.src = "https://dl.dropboxusercontent.com/s/rk8gjbqe5y4yd0u/boardmap.jpg?dl=0";
map.crossOrigin = "Anonymous";

canvas.width = WID - 20;
canvas.height = HIG - 20;
window.addEventListener("keydown", keypress_handler, false);

// prevents arrow keys from scrolling page, so they can be used for controlling kanye
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var moveInterval = setInterval(function () {
    draw();
    m.innerHTML = "<p> Speed: " + mod + " x: " + x + " y: " + y + "<p>";
}, 30);


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function draw() {
    context = canvas.getContext("2d");
    context.clearRect(0, 0, WID, HIG);

    context.drawImage(map, 0, 0, WID, HIG);

    context.fillStyle = "rgb(200, 100, 220)";
    context.fillRect(50, 50, 100, 100);

    x += (speed * mod) * Math.cos(Math.PI / 180 * angle);
    y += (speed * mod) * Math.sin(Math.PI / 180 * angle);


    var color = context.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    //console.log(hex);
    if ((hex != "#010001") && (hex != "#000000")) {
        alert ("offroad " + hex);
    }

    context.save();
    context.translate(x, y);

    // alerts if Ye is in the purple box
    if ((50 < x) && (50 < y) && (150 > x) && (150> y)) {
        alert ("in box!");
        x = 0;
        y = 0;
    }

   // alerts if Ye is speeding
   if ((mod > limit) || (mod < (limit * -1))) {
       alert ("Too fast, Ye!");
       mod = 0;
   }

/* this allows Ye to wrap around when he goes out of bounds, but has some
   worrying corner cases (try driving him off a corner) */

    if (x > LBOUND) {
        x = 0;
        draw();
    }
    if (y > HBOUND) {
        y = 0;
        draw();
    }
    if (x < -50) {
        x = LBOUND;
        draw();
    }
    if (y < -50) {
        y = HBOUND;
        draw();
    }
    context.rotate(Math.PI / 180 * angle);
    context.drawImage(car, -(car.width / 2), -(car.height / 2));
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
        angle -= 5;
    }
    if (event.keyCode == 39) { // right arrow
        angle += 5;
    }
}
