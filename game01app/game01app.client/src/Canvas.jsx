import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as signalR from '@microsoft/signalr';
import $ from 'jquery';

const Canvas = () => {
    const mountRef = useRef(null);

	useEffect (() => {
        const connection = new signalR.HubConnectionBuilder().withUrl("/messageHub").build();
        let connected = false;
        let user;
        let connectionId;

        const width = 1400;
        const height = 800; // Height of the div
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(100, width / height, 1, 10000 );
        const renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 1);
        //renderer.setClearColor(0x000000, 1);
        mountRef.current.appendChild(renderer.domElement);

        const LINEDASHSIZE = 0.05;
        const LINEGAPSIZE = 0.05;
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        camera.position.set(0, 0, 500);

        const materialRedLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsRedLine = [];
        pointsRedLine.push(new THREE.Vector3(-1400, 500, 0));
        pointsRedLine.push(new THREE.Vector3(1400, 500, 0));
        const geometryRedLine = new THREE.BufferGeometry().setFromPoints(pointsRedLine);
        const line = new THREE.Line(geometryRedLine, materialRedLine);
        line.computeLineDistances();
        scene.add(line);

        const materialBlueLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsBlueLine = [];
        pointsBlueLine.push(new THREE.Vector3(-1400, -500, 0));
        pointsBlueLine.push(new THREE.Vector3(1400, -500, 0));
        const geometryBlueLine = new THREE.BufferGeometry().setFromPoints(pointsBlueLine);
        const lineBlueLine = new THREE.Line(geometryBlueLine, materialBlueLine);
        lineBlueLine.computeLineDistances();
        scene.add(lineBlueLine);

        const materialCenterLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsCenterLine = [];
        pointsCenterLine.push(new THREE.Vector3(-1400, 0, 0));
        pointsCenterLine.push(new THREE.Vector3(1400, 0, 0));
        const geometryCenterLine = new THREE.BufferGeometry().setFromPoints(pointsCenterLine);
        const lineCenterLine = new THREE.Line(geometryCenterLine, materialCenterLine);
        lineCenterLine.computeLineDistances();
        scene.add(lineCenterLine);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if ((intersects.length > 0)&&(intersects.length > 0)) {
                const intersectedObject = intersects[0];
                console.log('Mouse intersects:', intersectedObject.point.x + ": " + intersectedObject.point.y + ": " + event.x + ": " + event.y);
            }
        };

    window.addEventListener('mousemove', onMouseMove);

		const animate = function() {
			requestAnimationFrame(animate);
            cube.rotation.x = 0.001;
            cube.rotation.y = 0.001;
			renderer.render(scene, camera);
		}

        var x = 0;
        var y = 0;
        var unitsRed = [];
        var unitsBlue = [];
        var selected = -1;
        var scoreRed = 0;
        var scoreBlue = 0;
        var ball = { x: 0, y: 0, destX: 0, destY: 0, user: "none", player: -1, speed: 5 };

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
        };
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

        // REGION: Event Listener

        document.getElementById("network").addEventListener("change", function (evt) {
            connectionId = evt.value;
        });

        window.addEventListener('mousedown', function (evt) {
            var mousePos = getMousePos(window, evt);
            x = mousePos.x;
            y = mousePos.y;
        }, false);

        window.addEventListener('mouseup', function (evt) {
            var mousePos = getMousePos(window, evt);
            var xPos = x;
            var yPos = y;
            var pushUnit = true;
            var units = document.getElementById("units").value;

            for (let i = 0; i < unitsRed.length; i++) {
                if ((distance(unitsRed[i].Message.Unit.x, x, unitsRed[i].Message.Unit.y, y) < 20) && (pushUnit)) {
                    pushUnit = false;

                    if (user == "red") {
                        if (selected == i) {
                            selected = -1;
                        } else {
                            selected = i;
                        }
                    }
                }
            }

            for (let i = 0; i < unitsRed.length; i++) {
                if (pushUnit) {
                    if (user == "red") {
                        if ((selected == i) && (evt.button == 0)) {
                            unitsRed[i].Message.Unit.destX = x;
                            unitsRed[i].Message.Unit.destY = y;
                        }
                    }
                }
            }

            for (let i = 0; i < unitsBlue.length; i++) {
                if ((distance(unitsBlue[i].Message.Unit.x, x, unitsBlue[i].Message.Unit.y, y) < 20) && (pushUnit)) {
                    pushUnit = false;

                    if (user == "blue") {
                        if (selected == i) {
                            selected = -1;
                        } else {
                            selected = i;
                        }
                    }
                }
            }

            for (let i = 0; i < unitsBlue.length; i++) {
                if (pushUnit) {
                    if (user == "blue") {
                        if ((selected == i)&&(evt.button == 0)) {
                            unitsBlue[i].Message.Unit.destX = x;
                            unitsBlue[i].Message.Unit.destY = y;
                        }
                    }
                }
            }
            
            if ((user == "red") && (y <= 380) && (pushUnit) && (unitsRed.length < units))
            {
                unitsRed.push({ Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos, id: unitsRed.length } } });

                evt.preventDefault();
            }

            if ((user == "blue") && (y >= 420) && (pushUnit) && (unitsBlue.length < units))
            {
                unitsBlue.push({ Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos, id: unitsBlue.length } } });

                evt.preventDefault();
            }

            if (evt.button == 2) {
                if ((user === "red")&&(ball.user === user)) {
                    for (let i = 0; i < unitsRed.length; i++) {
                        if ((ball.player === i) && (distance(unitsRed[i].Message.Unit.x, xPos, unitsRed[i].Message.Unit.y, yPos) > ball.speed)) {
                            ball.player = -1;
                            ball.destX = xPos;
                            ball.destY = yPos;
                            moveObjectToPoint(ball, ball.destX, ball.destY, ball.speed + 40);
                        }
                    }
                }

                if ((user == "blue")&&(ball.user === user)) {
                    for (let i = 0; i < unitsBlue.length; i++) {
                        if ((ball.player === i)&&(distance(unitsBlue[i].Message.Unit.x,xPos,unitsBlue[i].Message.Unit.y,yPos) > ball.speed)) {
                            ball.player = -1;
                            ball.destX = xPos;
                            ball.destY = yPos;
                            moveObjectToPoint(ball, ball.destX, ball.destY, ball.speed+40);
                        }
                    }
                }
            }

            connection.invoke("SendMessage", "red", { Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos }, Red: unitsRed, Blue: unitsBlue, Ball: ball } }).catch(function (err) {
                return console.error(err.toString());
            });

            connection.invoke("SendMessage", "blue", { Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos }, Red: unitsRed, Blue: unitsBlue, Ball: ball } }).catch(function (err) {
                return console.error(err.toString());
            });
            
            x = mousePos.x;
            y = mousePos.y;

            animate();
        }, false);

        // ENDREGION: eventListener

        /*
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.setLineDash([1, 5]);
            ctx.lineWidth = "2";
            ctx.strokeStyle = "green";
            ctx.moveTo(0, canvas.height/2);
            ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.setLineDash([1, 5]);
            ctx.lineWidth = "2";
            ctx.strokeStyle = "black";
            ctx.moveTo(0, 50);
            ctx.lineTo(canvas.width, 50);
            ctx.stroke();
            ctx.beginPath();
            ctx.setLineDash([1, 5]);
            ctx.lineWidth = "2";
            ctx.strokeStyle = "black";
            ctx.moveTo(0, 750);
            ctx.lineTo(canvas.width, 750);
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

            if (ball.player === -1) {
                ctx.fillStyle = "#ffa500";
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }

            ctx.font = "24px serif";
            ctx.strokeText("Red: " + scoreRed, 50, 50);
            ctx.strokeText("Blue: " + scoreBlue, 50, 75);
            ctx.strokeText(Math.round(x) + ": " + Math.round(y), 50, 100);
            ctx.strokeText(Math.round(ball.x) + ": " + Math.round(ball.y), 50, 125);
            ctx.strokeText(Math.round(ball.destX) + ": " + Math.round(ball.destY), 50, 150);
        }
        */

        function updateObjects() {
            if (distance(ball.x, ball.destX, ball.y, ball.destY) > ball.speed) {
                moveObjectToPoint(ball, ball.destX, ball.destY, ball.speed);
            } else {
                // snapping effect
                if (ball.player !== -1) {
                    if (ball.user === "red") {
                        ball.x = unitsRed[ball.player].Message.Unit.x;
                        ball.y = unitsRed[ball.player].Message.Unit.y;
                        ball.destX = unitsRed[ball.player].Message.Unit.x;
                        ball.destY = unitsRed[ball.player].Message.Unit.y;
                    } else if (ball.user === "blue") {
                        ball.x = unitsBlue[ball.player].Message.Unit.destX;
                        ball.y = unitsBlue[ball.player].Message.Unit.destY;
                        ball.destX = unitsBlue[ball.player].Message.Unit.x;
                        ball.destY = unitsBlue[ball.player].Message.Unit.y;
                    }
                }
            }

            var speed = 0;

            for (let i = 0; i < unitsRed.length; i++) {
                speed = 3;

                for (var j = 0; j < unitsRed.length; j++) {
                    if (i !== j) {
                        if (distance(unitsRed[i].Message.Unit.x, unitsRed[j].Message.Unit.x, unitsRed[i].Message.Unit.y, unitsRed[j].Message.Unit.y) < 40) {
                            moveObjectToPoint(unitsRed[i].Message.Unit, unitsRed[i].Message.Unit.destX, unitsRed[i].Message.Unit.destY, -speed*2);
                            unitsRed[i].Message.Unit.destX = unitsRed[i].Message.Unit.x;
                            unitsRed[i].Message.Unit.destY = unitsRed[i].Message.Unit.y;
                            j = unitsRed.length;
                        }
                    }
                }

                for (let j = 0; j < unitsBlue.length; j++) {
                    if ((distance(unitsRed[i].Message.Unit.x, unitsBlue[j].Message.Unit.x, unitsRed[i].Message.Unit.y, unitsBlue[j].Message.Unit.y)) < 40) {
                        moveObjectToPoint(unitsRed[i].Message.Unit, unitsRed[i].Message.Unit.destX, unitsRed[i].Message.Unit.destY, -speed*2);
                        unitsRed[i].Message.Unit.destX = unitsRed[i].Message.Unit.x;
                        unitsRed[i].Message.Unit.destY = unitsRed[i].Message.Unit.y;
                        j = unitsBlue.length;
                    }
                }

                moveObjectToPoint(unitsRed[i].Message.Unit, unitsRed[i].Message.Unit.destX, unitsRed[i].Message.Unit.destY, speed);

                if ((distance(unitsRed[i].Message.Unit.x, ball.x, unitsRed[i].Message.Unit.y, ball.y)) < 40) {
                    ball.user = "red";
                    ball.player = i;
                }

                if ((unitsRed[i].Message.Unit.y > 750) && (user === ball.user) && (ball.player === i)) {
                    scoreRed++;
                    unitsRed[i].Message.Unit.x = Math.random()*1200 + 100;
                    unitsRed[i].Message.Unit.y = Math.random() * 100 + 100;
                    unitsRed[i].Message.Unit.destX = unitsRed[i].Message.Unit.x;
                    unitsRed[i].Message.Unit.destY = unitsRed[i].Message.Unit.y;
                }
            }

            for (let i = 0; i < unitsBlue.length; i++) {
                speed = 3;

                for (var j = 0; j < unitsRed.length; j++) {
                    if ((distance(unitsBlue[i].Message.Unit.x, unitsRed[j].Message.Unit.x, unitsBlue[i].Message.Unit.y, unitsRed[j].Message.Unit.y)) < 40) {
                        moveObjectToPoint(unitsBlue[i].Message.Unit, unitsBlue[i].Message.Unit.destX, unitsBlue[i].Message.Unit.destY, -speed*2);
                        unitsBlue[i].Message.Unit.destX = unitsBlue[i].Message.Unit.x;
                        unitsBlue[i].Message.Unit.destY = unitsBlue[i].Message.Unit.y;
                        j = unitsBlue.length;
                    }
                }

                for (let j = 0; j < unitsBlue.length; j++) {
                    if (i !== j) {
                        if (distance(unitsBlue[i].Message.Unit.x, unitsBlue[j].Message.Unit.x, unitsBlue[i].Message.Unit.y, unitsBlue[j].Message.Unit.y) < 40) {
                            moveObjectToPoint(unitsBlue[i].Message.Unit, unitsBlue[i].Message.Unit.destX, unitsBlue[i].Message.Unit.destY, -speed*2);
                            unitsBlue[i].Message.Unit.destX = unitsBlue[i].Message.Unit.x;
                            unitsBlue[i].Message.Unit.destY = unitsBlue[i].Message.Unit.y;
                            j = unitsBlue.length;
                        }
                    }
                }

                moveObjectToPoint(unitsBlue[i].Message.Unit, unitsBlue[i].Message.Unit.destX, unitsBlue[i].Message.Unit.destY, speed);

                if ((distance(unitsBlue[i].Message.Unit.x, ball.x, unitsBlue[i].Message.Unit.y, ball.y)) < 40) {
                    ball.user = "blue";
                    ball.player = i;
                }

                if ((unitsBlue[i].Message.Unit.y < 50) && (user === ball.user) && (ball.player === i)) {
                    scoreBlue++;
                    unitsBlue[i].Message.Unit.x = Math.random()*1200 + 100;
                    unitsBlue[i].Message.Unit.y = Math.random() * 100 + 600;
                    unitsBlue[i].Message.Unit.destX = unitsBlue[i].Message.Unit.x;
                    unitsBlue[i].Message.Unit.destY = unitsBlue[i].Message.Unit.y;
                }
            }
        }

        // ENDREGION: Main

        WaitForConnection();

        connection.invoke("Connect").catch(function (err) {
            return console.error(err.toString());
        });

        $("#network").attr("value", connectionId);

        setInterval(() => {
            updateObjects();
            animate();
        }, 1000 / 60);
        
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        }
    }, []);

    return (
        <div id="maincontent" ref={mountRef} ></div>
    );
}

export default Canvas;

// REGION: Helper

function moveObjectToPoint(obj, targetX, targetY, speed) {
    const dx = targetX - obj.x;
    const dy = targetY - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    // Snap to target if the distance is too small 
    // to move so that it doesn't oscillate too much
    if (distance < speed) {
        obj.x = targetX;
        obj.y = targetY;
        return;
    }

    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    obj.x += vx;
    obj.y += vy;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// this function is mainly used for collision detection
function distance(x1, x2, y1, y2) {
    return Math.abs(Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1, 2)));
}

// ENDREGION: Helper

