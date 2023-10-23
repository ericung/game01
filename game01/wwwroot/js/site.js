// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var canvas = document.getElementById("myCanvas");
var generatedHtml = document.getElementById("generatedHtml");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var x = 0;
var y = 0;
var tool = "rectangle";
var rects = [];
var submits = [];
var radios = [];

canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    draw();
}, false);

canvas.addEventListener('mousedown', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    x = mousePos.x;
    y = mousePos.y;
}, false);

canvas.addEventListener('mouseup', function (evt) {
    switch (tool) {
        case "rectangle":
            {
                var mousePos = getMousePos(canvas, evt);
                var xPos = x;
                var yPos = y;
                var wVal = mousePos.x - x;
                var hVal = mousePos.y - y;
                var idRects = rects.length;
                if (wVal < 0) {
                    wVal = Math.abs(wVal);
                    xPos = x - wVal;
                }
                if (hVal < 0) {
                    hVal = Math.abs(hVal);
                    yPos = y - hVal;
                }
                rects.push({ x: xPos, y: yPos, w: wVal, h: hVal, id: idRects });
                x = mousePos.x;
                y = mousePos.y;
                draw();
                break;
            }
        case "submit":
            {
                var mousePos = getMousePos(canvas, evt);
                var xPos = x;
                var yPos = y;
                var wVal = mousePos.x - x;
                var hVal = mousePos.y - y;
                var idRects = submits.length;
                if (wVal < 0) {
                    wVal = Math.abs(wVal);
                    xPos = x - wVal;
                }
                if (hVal < 0) {
                    hVal = Math.abs(hVal);
                    yPos = y - hVal;
                }
                submits.push({ x: xPos, y: yPos, w: wVal, h: hVal, id: idRects });
                x = mousePos.x;
                y = mousePos.y;
                draw();
                break;
            }
        case "radio":
            {
                var mousePos = getMousePos(canvas, evt);
                var xPos = x;
                var yPos = y;
                var wVal = mousePos.x - x;
                var hVal = mousePos.y - y;
                var idRadio = radios.length;
                if (wVal < 0) {
                    wVal = Math.abs(wVal);
                    xPos = x - wVal;
                }
                if (hVal < 0) {
                    hVal = Math.abs(hVal);
                    yPos = y - hVal;
                }
                radios.push({ x: xPos, y: yPos, w: wVal, h: hVal, id: idRadio });
                x = mousePos.x;
                y = mousePos.y;
                draw();
                break;
            }
        default:
            break;
    }
}, false);

function onRectangle() {
    tool = "rectangle";
}

function onSubmit() {
    tool = "submit";
}

function onRadio() {
    tool = "radio";
}

var area = document.getElementById("generatedHtml");
if (area.addEventListener) {
    area.addEventListener('input', function () {
        const iframe = document.getElementById("renderedhtml");
        iframe.width = "480";
        iframe.height = "320";
        iframe.srcdoc = `<!DOCTYPE html><header></header><body>` + document.getElementById("generatedHtml").value + `</body>`;
    }, false);
} else if (area.attachEvent) {
    area.attachEvent('onpropertychange', function () {
        const iframe = document.getElementById("renderedhtml");
        iframe.width = "480";
        iframe.height = "320";
        iframe.srcdoc = `<!DOCTYPE html><header></header><body>` + document.getElementById("generatedHtml").value + `</body>`;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    for (var i = 0; i < rects.length; i++) {
        ctx.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
    }

    ctx.fillStyle = "grey";
    for (var i = 0; i < submits.length; i++) {
        ctx.fillRect(submits[i].x, submits[i].y, submits[i].w, submits[i].h);
    }

    ctx.fillStyle = "red";
    for (var i = 0; i < radios.length; i++) {
        ctx.beginPath();
        ctx.arc(radios[i].x, radios[i].y, radios[i].w / 2, radios[i].h / 2, 0, 2 * Math.PI);
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
            rectangles: JSON.stringify(rects),
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

function reverse() {
    const iframe = document.getElementById("renderedhtml");
    jsonFromSrc = html2json(iframe.srcdoc);
    rects = [];
    submits = [];
    radios = [];

    for (let i = 0; i < jsonFromSrc.length; i++) {
        var x = jsonFromSrc[i].marginLeft;
        var y = jsonFromSrc[i].marginTop;
        var w = jsonFromSrc[i].width;
        var h = jsonFromSrc[i].height;

        if (jsonFromSrc[i].attribute == "div") {
            rects.push({ x: x, y: y, w: w, h: h, id: i });

        }

        if (jsonFromSrc[i].attribute == "input") {
            if (jsonFromSrc[i].type == "submit") {
                submits.push({ x: x, y: y, w: w, h: h, id: i });
            }

            if (jsonFromSrc[i].type == "radio") {
                radios.push({ x: x, y: y, w: w, h: h, id: i });
            }
        }
    }


    draw();
}
