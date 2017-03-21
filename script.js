x = 0;
y = 0;
speed = 5;
angle = 0;
mod = 0;
/* TODO: get LEN and HIG to automatically fill the user's screen width and
         height, instead of being hard-coded in */
LEN = 700;
HIG = 700;
HBOUND = HIG + 50;
LBOUND = LEN + 50;

canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
car = new Image();
car.src = "ye1.png";

window.addEventListener("keydown", keypress_handler, false);

var moveInterval = setInterval(function () {
    draw();
}, 30);

function draw() {
    context = canvas.getContext("2d");
    context.clearRect(0, 0, LEN, HIG);

    context.fillStyle = "rgb(200, 100, 220)";
    context.fillRect(50, 50, 100, 100);

    x += (speed * mod) * Math.cos(Math.PI / 180 * angle);
    y += (speed * mod) * Math.sin(Math.PI / 180 * angle);

    context.save();
    context.translate(x, y);

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
