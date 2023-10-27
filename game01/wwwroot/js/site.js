// REGION: ConnectionHub
"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/messageHub").build();
let connected = false;

connection.on("ReceiveMessage", function (user, message) {
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
    await refreshGroups();
});

connection.on("RemovedGroup", function (userInfo) {
    document.getElementById("group").value = userInfo.group;
});

connection.on("SendGroupList", function (groupList) {
    $("#groups").empty();
    var groups = document.getElementById("groups");
    for (let i = 0; i < groupList.length; i++) {
        var newOption = document.createElement("option");
        newOption.value = groupList[i];
        groups.appendChild(newOption);
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

// REGION: InputGroup
async function createGroup() {
    var input = document.getElementById("group");
    var newGroup = input.value;

    await connection.invoke("LeaveGroup", connectionId).catch(function (err) {
        return console.error(err.toString());
    });
    https://localhost:7005/
    await connection.invoke("JoinGroup", connectionId, newGroup).catch(function (err) {
        return console.error(err.toString());
    });
}

// ENDREGION: InputGroup

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
        var distance = Math.pow(unitsRed[i].x - x, 2) + Math.pow(unitsRed[i].y - y, 2);
        
        if (distance <= radius) {
            pushUnit = false;
        }
    }
    
    if ((user=="red")&&(y <= 400 - 20)&&(pushUnit)&&(unitsRed.length < units)) {
        connection.invoke("SendMessage", "red", {x: xPos, y: yPos}).catch(function (err) {
            return console.error(err.toString());
        });
        evt.preventDefault();

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

async function refreshGroups() {
    await connection.invoke("GetGroups", connectionId).catch(function (err) {
        return console.error(err.toString());
    });
}

async function changeGroups() {
    let newGroup = document.getElementById("groupList").value;

    await connection.invoke("LeaveGroup", connectionId).catch(function (err) {
        return console.error(err.toString());
    });

    await connection.invoke("JoinGroup", connectionId, newGroup).catch(function (err) {
        return console.error(err.toString());
    });
}

// ENDREGION: Main
