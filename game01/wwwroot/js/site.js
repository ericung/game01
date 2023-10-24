var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var x = 0;
var y = 0;
var unitsRed = [];
var unitsBlue = [];
var side = "red";

draw();

canvas.addEventListener('mousedown', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    x = mousePos.x;
    y = mousePos.y;
}, false);

canvas.addEventListener('mouseup', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    var xPos = x;
    var yPos = y;
    var radius = Math.pow(20 + 20, 2);
    var pushUnit = true;
    var units = document.getElementById("units").value;

    for (let i = 0; i < unitsRed.length; i++) {
        var distance = Math.pow(unitsRed[i].x - x, 2) + Math.pow(unitsRed[i].y - y, 2);

        console.log(x + ", " + y + ", " + distance + ", " + radius);
        
        if (distance <= radius) {
            console.log("false");
            pushUnit = false;
        }
    }
    
    if ((pushUnit)&&(unitsRed.length < units)) {
        unitsRed.push({ x: xPos, y: yPos, id: unitsRed.length });
    }

    x = mousePos.x;
    y = mousePos.y;

    draw();
}, false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.setLineDash([1, 5]);
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffe6e6";
    for (var i = 0; i < unitsRed.length; i++) {
        ctx.beginPath();
        ctx.arc(unitsRed[i].x, unitsRed[i].y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    ctx.fillStyle = "#e6e6ff";
    for (var i = 0; i < unitsBlue.length; i++) {
        ctx.beginPath();
        ctx.arc(unitsBlue[i].x, unitsBlue[i].y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
