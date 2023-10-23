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
    var wVal = mousePos.x - x;
    var hVal = mousePos.y - y;
    var idRects = unitsRed.length;
    if (wVal < 0) {
        wVal = Math.abs(wVal);
        xPos = x - wVal;
    }
    if (hVal < 0) {
        hVal = Math.abs(hVal);
        yPos = y - hVal;
    }
    unitsRed.push({ x: xPos, y: yPos, id: idRects });
    x = mousePos.x;
    y = mousePos.y;
    draw();
}, false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /*
    if (ctx.setLineDash !== undefined) {
        ctx.setLineDash([0, canvas.width]);
    }
    if (ctx.mozDash !== undefined) {
        ctx.mozDash = [0, canvas.width];
    }
    */
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();

    ctx.strokeStyle = "black";
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

function generate() {
    $.ajax({
        method: "POST",
        url: "Home/Generate",
        data: {
            rectangles: JSON.stringify(unitsRed),
            submits: JSON.stringify(submits),
            radios: JSON.stringify(radios)
        }
    })
        .done(function (msg) {
            $('#generatedHtml').text(msg);
            $('#generatedHtml').val(msg);
            const iframe = document.getElementById("renderedhtml");
            iframe.width = "490px";
            iframe.height = "330px";
            iframe.border = "1px solid #000000";
            iframe.srcdoc = msg;
        });
}
