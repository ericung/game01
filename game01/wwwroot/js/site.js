// REGION: ConnectionHub
"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/messageHub").build();
let connected = false;
var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var x = 0;
var y = 0;
var unitsRed = [];
var unitsBlue = [];
let user;
let connectionId;
var selected = -1;

connection.on("ReceiveMessage", function (user, message) {
    if (message.Message.Blue !== undefined) {
        unitsBlue = message.Message.Blue;
    }

    if (message.Message.Red !== undefined) {
        unitsRed = message.Message.Red;
    }

    draw();
});

connection.on("Connected", function (userInfo) {
    connectionId = userInfo.connectionId;
    var datalist = document.getElementById("networks");
    var newOption = document.createElement("option");

    newOption.value = connectionId;
    datalist.appendChild(newOption);
    user = userInfo.userName;
    document.getElementById("user").value = user;
});

connection.on("JoinedGroup", async function (userInfo) {
    document.getElementById("user").value = userInfo.userName; 
    document.getElementById("group").value = userInfo.group;
    user = userInfo.userName;
    await refreshGroups();
});

connection.on("RemovedGroup", function (userInfo) {
    document.getElementById("group").value = userInfo.group;
    user = userInfo.userName;
});

connection.on("SendGroupList", function (groupList) {
    $("#groupList").empty();
    var groups = document.getElementById("groupList");
    var options = groups.options;
    options[0] = new Option("", "");
    for (let i = 0; i < groupList.length; i++) {
        options[options.length] = new Option(groupList[i], groupList[i]);
    }
});

connection.start().then(function () {
    connected = true;
}).catch(function (err) {
    return "";
});

async function WaitForConnection() {
    while (true) {
        if (connected) {
            return;
        }
        else {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
}

// ENDREGION: ConnectionHub

// REGION: GroupActions

// Group Actions - Create, Refresh, and Change

async function createGroup() {
    var input = document.getElementById("group");
    var newGroup = input.value;

    await connection.invoke("LeaveGroup", connectionId).catch(function (err) {
        return console.error(err.toString());
    });

    await connection.invoke("JoinGroup", connectionId, newGroup).catch(function (err) {
        return console.error(err.toString());
    });
}

async function refreshGroups() {
    await connection.invoke("GetGroups", connectionId).catch(function (err) {
        return console.error(err.toString());
    });
}

async function changeGroups() {
    document.getElementById("group").value = document.getElementById("groupList").value;
    let newGroup = document.getElementById("groupList").value;

    await connection.invoke("LeaveGroup", connectionId).catch(function (err) {
        return console.error(err.toString());
    });

    await connection.invoke("JoinGroup", connectionId, newGroup).catch(function (err) {
        return console.error(err.toString());
    });
}

// ENDREGION: GroupActions

// REGION: Main

$(document).ready(async function () {
    await WaitForConnection();

    await connection.invoke("Connect").catch(function (err) {
        return console.error(err.toString());
    });

    $("#network").attr("value", connectionId);

    setInterval(() => {
        updateObjects();
        draw();
    }, 1000 / 60);
});

document.getElementById("network").addEventListener("change", function (evt) {
    connectionId = evt.value;
});

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
        var distanceRed = distance(unitsRed[i].Message.Unit.x, x, unitsRed[i].Message.Unit.y, y);
        
        if (distanceRed < 20) {
            pushUnit = false;

            if (user == "red") {
                if (selected == i) {
                    selected = -1;
                } else {
                    selected = i;
                }
            }
        }
        else {
            if (user == "red") {
                if (selected == i) {
                    unitsRed[i].Message.Unit.destX = x;
                    unitsRed[i].Message.Unit.destY = y;
                }
            }
        }
    }

    for (let i = 0; i < unitsBlue.length; i++) {
        var distanceBlue = distance(unitsBlue[i].Message.Unit.x, x, unitsBlue[i].Message.Unit.y, y);
        
        if (distanceBlue < 20) {
            pushUnit = false;

            if (user == "blue") {
                if (selected == i) {
                    selected = -1;
                } else {
                    selected = i;
                }
            }
        }
        else {
            if (user == "blue") {
                if (selected == i) {
                    unitsBlue[i].Message.Unit.destX = x;
                    unitsBlue[i].Message.Unit.destY = y;
                }
            }
        }
    }
    
    if ((user == "red") && (y <= 400 - 20) && (pushUnit) && (unitsRed.length < units))
    {
        unitsRed.push({ Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos, id: unitsRed.length } } });

        evt.preventDefault();
    }

    if ((user == "blue") && (y >= 400 + 20) && (pushUnit) && (unitsBlue.length < units))
    {
        unitsBlue.push({ Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos, id: unitsBlue.length } } });

        evt.preventDefault();
    }

    connection.invoke("SendMessage", "red", { Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos }, Red: unitsRed, Blue: unitsBlue } }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.invoke("SendMessage", "blue", { Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos }, Red: unitsRed, Blue: unitsBlue } }).catch(function (err) {
        return console.error(err.toString());
    });
    
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
    for (var i = 0; i < unitsRed.length; i++) {
        if ((user == "red")&&(selected == i)) {
            ctx.fillStyle = "#000000";
        }
        else {
            ctx.fillStyle = "#ffe6e6";
        }

        ctx.beginPath();
        ctx.arc(unitsRed[i].Message.Unit.x, unitsRed[i].Message.Unit.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    for (var i = 0; i < unitsBlue.length; i++) {
        if ((user == "blue")&&(selected == i)) {
            ctx.fillStyle = "#000000";
        }
        else {
            ctx.fillStyle = "#e6e6ff";
        }

        ctx.beginPath();
        ctx.arc(unitsBlue[i].Message.Unit.x, unitsBlue[i].Message.Unit.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    // debug purposes only
    ctx.font = "24px serif";
    ctx.strokeText(x + ": " + y, 50, 50);
}

function updateObjects() {
    for (var i = 0; i < unitsRed.length; i++) {
        var angle = Math.atan2(unitsRed[i].Message.Unit.y - unitsRed[i].Message.Unit.destY, unitsRed[i].Message.Unit.x- unitsRed[i].Message.Unit.destX);

        if (Math.abs(unitsRed[i].Message.Unit.destX - unitsRed[i].Message.Unit.x) > 0.5) {
            unitsRed[i].Message.Unit.x += Math.cos(angle * 180 / Math.PI);
        }

        if (Math.abs(unitsRed[i].Message.Unit.destY - unitsRed[i].Message.Unit.y) > 0.5) {
            unitsRed[i].Message.Unit.y += Math.sin(angle * 180 / Math.PI);
        }
    }

    for (var i = 0; i < unitsBlue.length; i++) {
        var angle = Math.atan2(unitsBlue[i].Message.Unit.y - unitsBlue[i].Message.Unit.destY, unitsBlue[i].Message.Unit.x- unitsBlue[i].Message.Unit.destX);

        if (Math.abs(unitsBlue[i].Message.Unit.destX - unitsBlue[i].Message.Unit.x) > 0.5) {
            unitsBlue[i].Message.Unit.x += Math.cos(angle * 180 / Math.PI);
        }

        if (Math.abs(unitsBlue[i].Message.Unit.destY - unitsBlue[i].Message.Unit.y) > 0.5) {
            unitsBlue[i].Message.Unit.y += Math.sin(angle * 180 / Math.PI);
        }
    }

}

// ENDREGION: Main

// REGION: Helper

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function distance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1, 2));
}

// ENDREGION: Helper

