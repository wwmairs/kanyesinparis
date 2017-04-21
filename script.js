var startX = 51;
var startY = 44;
x = startX;
y = startY;
speed = 1;
angle = 45;
mod = 0;
limit = 5;
/* TODO:
    - Modals for: success, broken rules, start and finish
    - store past scores of each user (and overall high score)
    - data reporting at the end of the game */
WID = $(window).width() - 10;
HIG = $(window).height() - 10;
HBOUND = HIG + 50;
LBOUND = WID + 50;

places_visited = {"eiffel":false, "louvre":false, "moulin":false};

/* boundaries for in_box and at_stop functions
   format: [left x bound, right x bound, top y bound, bottom y bound] */

EIFFEL = [190, 305, 539, 585]

JAYZ  = [504/1600, 584/1600, 621/804, 656/804];
SWIFT = [717/1600, 883/1600, 621/804, 656/804];
BEY   = [1023/1600, 1144/1600, 621/804, 656/804];

// Countdown Timer
var counter = 45;
var interval = setInterval(function() {
    counter--;
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
car.src = "https://dl.dropboxusercontent.com/s/n66p9bussx82uo7/kanyecar.png?dl=0";
car.crossOrigin = "Anonymous";
map = new Image();
map.src = "https://dl.dropboxusercontent.com/s/8ovyemcx0z8mzvx/boardmap.jpg?dl=0";
map.crossOrigin = "Anonymous";



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

    if ((at_stop (EIFFEL, x, y)) && (places_visited.eiffel == false)) {
        var modal = document.getElementById('eiffelModal');
        modal.style.display = "block";
        mod = 0;
        x = 354;
        y = 598;
        angle = 15;
        places_visited.eiffel = true;

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
    context.fillText(counter, (8.8 * (WID/10)), (9.65 * (HIG/10)));

    x += (speed * mod) * Math.cos(Math.PI / 180 * angle);
    y += (speed * mod) * Math.sin(Math.PI / 180 * angle);


    // tells whether Ye is off the road, but the coordinates seem to be a bit
    // off -
    // the x and y that get passed in seem to be somewhere around his
    // forehead, and
    // it should be near the center of the car
    var color = context.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    if ((hex == "#00d558") || (hex == "#3e00d3")) {
        alert ("offroad! go back to start, and minus 10 seconds!");
        x = startX;
        y = startY;
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
        x = startX;
        y = startY;
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
