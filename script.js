x = 51;
y = 44;
speed = 1;
angle = 45;
mod = 0;
limit = 10;
/* TODO:
    - clickable buttons on canvas?
    - popups for when rules are broken?
    - popups for clues?
    - store past scores of each user (and overall high score)
    - data reporting at the end of the game */
WID = $(window).width() - 10;
HIG = $(window).height() - 10;
HBOUND = HIG + 50;
LBOUND = WID + 50;

// timer
var counter = 60;
var interval = setInterval(function() {
    counter--;
    if (counter <= 0) {
        clearInterval(interval);
        window.location.replace("loser.html");
    }
}, 1000);

canvas = document.getElementById("canvas");
m = document.getElementById("mod");
context = canvas.getContext("2d");
car = new Image();
car.src = "https://dl.dropboxusercontent.com/s/n66p9bussx82uo7/kanyecar.png?dl=0";
car.crossOrigin = "Anonymous";
map = new Image();
map.src = "https://dl.dropboxusercontent.com/s/8ovyemcx0z8mzvx/boardmap.jpg?dl=0";
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
}, 30);


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function draw() {
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
    context.fillText(counter, (8.8 * (WID/10)), (9.65 * (HIG/10)));

    x += (speed * mod) * Math.cos(Math.PI / 180 * angle);
    y += (speed * mod) * Math.sin(Math.PI / 180 * angle);


    // tells whether Ye is off the road, but the coordinates seem to be a bit off -
    // the x and y that get passed in seem to be somewhere around his forehead, and
    // it should be near the center of the car
    // AND, should he go back onto start or onto the road? how would we do that?
    var color = context.getImageData(x, y - 5, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    if ((hex != "#010001") && (hex != "#000000") && (hex != "#010000")) {
        alert ("offroad! go back to start, and minus 10 seconds!");
        x = 51;
        y = 44;
        counter -= 10;
        mod = 0;
        angle = 45;
    }

    context.save();
    context.translate(x, y);

   // alerts if Ye is speeding
   if ((mod > limit) || (mod < (limit * -1))) {
       alert ("Too fast, Ye! Minus 10 seconds!");
       mod = 0;
       counter -= 10;
   }

    if ((x > LBOUND) || (y > HBOUND) || (x < -20) || (y < -50)){
        alert("Vous avez quitté Paris! Go back to start, and minus 10 seconds!");
        x = 51;
        y = 44;
        counter -= 10;
        mod = 0;
        angle = 45;
    }

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
