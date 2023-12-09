// Add CSS dependency to the page
document.head.insertAdjacentHTML(
    "beforeend",
    `<link hx-preserve="true" rel="stylesheet" href="/modules/animated_background/ani_background.css">`
);

// Create an html canvas element, randommly generate circles in random locations which grow then shrink. When a circle finishes a cycle, they are randomly regenerated in a new location.

// Create a canvas element
var canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";
canvas.style.backgroundColor = "transparent";
document.getElementById("background").appendChild(canvas);

// Resize the canvas when the window is resized
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Get the canvas context
var ctx = canvas.getContext("2d");

// Create an array to hold the circles
var circles = [];

// Create a circle object
var Circle = function (x, y, r, maxRadius, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.growing = true;
    this.maxRadius = maxRadius;
    this.color = color;
    this.lastmove = [0, 0];
};

// Create a function to generate a random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a function to generate a random color that is very similar to rgba(14, 78, 145, 0.7)
function getRandomColor() {
    return `rgba(${14 + getRandomInt(-50, 50)}, ${78 + getRandomInt(-50, 50)}, ${145 + getRandomInt(-50, 50)}, ${
        getRandomInt(5, 9) / 10
    })`;
}

// Create a function to generate a random circle
function generateCircle() {
    var x = getRandomInt(0, canvas.width);
    var y = getRandomInt(0, canvas.height);
    var r = getRandomInt(10, 299);
    var maxRadius = getRandomInt(100, 300);

    var circle = new Circle(x, y, r, maxRadius, getRandomColor());
    circles.push(circle);
}

// Create an animation loop
function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redo the above for loop
    for (circle of circles) {
        ctx.fillStyle = circle.color;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
        ctx.fill();

        if (circle.growing) {
            circle.r += Math.max((circle.maxRadius - circle.r) / 150 + Math.random() * 0.5, 0.1);
        } else {
            circle.r -= Math.max((circle.maxRadius - circle.r) / 150 + Math.random() * 0.5, 0.1);
        }

        if (circle.r > circle.maxRadius) {
            circle.growing = false;
        }
        if (circle.r <= 10) {
            circle.x = getRandomInt(0, canvas.width);
            circle.y = getRandomInt(0, canvas.height);
            circle.growing = true;
            circle.color = getRandomColor();
            circle.maxRadius = getRandomInt(100, 300);
        }
    }
}

// Generate 10 circles and start animating
for (var i = 0; i < 5; i++) {
    generateCircle();
}
setInterval(animate, 1000 / 24);

// --------------------------------------------------------

// Make a white circle element that follows the mouse (Not using the canvas)
var mouseCircle = document.createElement("div");
mouseCircle.id = "mouse_highlight_circle";

// Transform the mouse circle to be in the center of the cursor
mouseCircle.style.transform = "translate(-50%, -50%)";

document.getElementById("background").appendChild(mouseCircle);

// Make the mouse circle follow the mouse, with a 1 second delay.
document.addEventListener("mousemove", function (e) {
    mouseCircle.animate(
        {
            transform: `translate(${e.clientX - mouseCircle.offsetWidth / 2}px, ${
                e.clientY - mouseCircle.offsetHeight / 2
            }px)`,
        },
        {
            duration: 2000,
            fill: "forwards",
        }
    );
});

// Add event listener (If escape button pressed, add style tag to head)
// *:not(#background) {
//     opacity: 0;
// }

document.addEventListener("keydown", function (e) {
    if (e.key == "Escape") {
        document.head.insertAdjacentHTML(
            "beforeend",
            `
            <style id="hide_everything">
            body > *:not(#background) {
                display: none;
            }
            </style>
            `
        );
        document.addEventListener("mousemove", function (e) {
            if (document.getElementById("hide_everything")) {
                document.getElementById("hide_everything").remove();
                // Remove this event listener
                this.removeEventListener("mousemove", arguments.callee);
            }
        });
    }
});

// Remove the script tag
document.currentScript.remove();
