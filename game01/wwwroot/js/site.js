// REGION: ConnectionHub
"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/messageHub").build();
let connected = false;

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

var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var x = 0;
var y = 0;
var unitsRed = [];
var unitsBlue = [];
let user;
let connectionId;

$(document).ready(async function () {
    await WaitForConnection();

    await connection.invoke("Connect").catch(function (err) {
        return console.error(err.toString());
    });
    $("#network").attr("value", connectionId);

    draw();
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
        var distance = Math.pow(unitsRed[i].Message.Unit.x - x, 2) + Math.pow(unitsRed[i].Message.Unit.y - y, 2);
        
        if (distance <= radius) {
            pushUnit = false;
        }
    }

    for (let i = 0; i < unitsBlue.length; i++) {
        var distance = Math.pow(unitsBlue[i].Message.Unit.x - x, 2) + Math.pow(unitsBlue[i].Message.Unit.y - y, 2);
        
        if (distance <= radius) {
            pushUnit = false;
        }
    }
    
    if ((user == "red") && (y <= 400 - 20) && (pushUnit) && (unitsRed.length < units))
    {
        unitsRed.push({ Message: { Unit: { x: xPos, y: yPos, id: unitsRed.length } } });

        evt.preventDefault();
    }

    if ((user == "blue") && (y >= 400 + 20) && (pushUnit) && (unitsBlue.length < units))
    {
        unitsBlue.push({ Message: { Unit: { x: xPos, y: yPos, id: unitsBlue.length } } });

        evt.preventDefault();
    }
    connection.invoke("SendMessage", "red", { Message: { Unit: { x: xPos, y: yPos }, Red: unitsRed, Blue: unitsBlue } }).catch(function (err) {
        return console.error(err.toString());
    });
    connection.invoke("SendMessage", "blue", { Message: { Unit: { x: xPos, y: yPos }, Red: unitsRed, Blue: unitsBlue } }).catch(function (err) {
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
    ctx.fillStyle = "#ffe6e6";
    for (var i = 0; i < unitsRed.length; i++) {
        ctx.beginPath();
        ctx.arc(unitsRed[i].Message.Unit.x, unitsRed[i].Message.Unit.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    ctx.fillStyle = "#e6e6ff";
    for (var i = 0; i < unitsBlue.length; i++) {
        ctx.beginPath();
        ctx.arc(unitsBlue[i].Message.Unit.x, unitsBlue[i].Message.Unit.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    // debug purposes only
    ctx.font = "24px serif";
    ctx.strokeText(x + ": " + y, 50, 50);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// ENDREGION: Main
