import { useEffect, useContext, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Context } from "./Context";
import { SignalRConnection } from "./Signalr";
/*
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
*/

const Canvas = () => {
    const { connectionId, setConnectionId, user /*, setUser*/ } = useContext(Context);
    const mountRef = useRef(false);

    useEffect(() => {
        if (!mountRef.current) {
            mountRef.current = true;
            return () => {
                <>
                </>
            };
        }

        //const stats = new Stats();
        // document.body.appendChild(stats.dom);
        const scene = new THREE.Scene();
        //const camera = new THREE.PerspectiveCamera(100, width / height, 1, 10000 );
        var screenWidth = window.innerWidth,
            screenHeight = window.innerHeight,
            viewAngle = 75,
            nearDistance = 0.1,
            farDistance = 1000;
        //const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.01, 100000);
        const camera = new THREE.PerspectiveCamera(viewAngle, screenWidth / screenHeight, nearDistance, farDistance);
        scene.add(camera);
        camera.position.set(0, 0, 5);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(screenWidth, screenHeight);
        var container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        /*
        let cameraControls = new OrbitControls( camera, renderer.domElement );
        cameraControls.target.set( 0, 40, 0 );
        cameraControls.maxDistance = 400;
        cameraControls.minDistance = 10;
        cameraControls.update();
        */

        const LINEDASHSIZE = 0.05;
        const LINEGAPSIZE = 0.05;

        const planeGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x90ee90 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -1;

        scene.add(plane);

        const materialRedLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsRedLine = [];
        pointsRedLine.push(new THREE.Vector3(-10, 3, 0));
        pointsRedLine.push(new THREE.Vector3(10, 3, 0));
        const geometryRedLine = new THREE.BufferGeometry().setFromPoints(pointsRedLine);
        const line = new THREE.Line(geometryRedLine, materialRedLine);
        line.computeLineDistances();
        scene.add(line);

        const materialBlueLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsBlueLine = [];
        pointsBlueLine.push(new THREE.Vector3(-10, -3, 0));
        pointsBlueLine.push(new THREE.Vector3(10, -3, 0));
        const geometryBlueLine = new THREE.BufferGeometry().setFromPoints(pointsBlueLine);
        const lineBlueLine = new THREE.Line(geometryBlueLine, materialBlueLine);
        lineBlueLine.computeLineDistances();
        scene.add(lineBlueLine);

        const materialCenterLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsCenterLine = [];
        pointsCenterLine.push(new THREE.Vector3(-10, 0, 0));
        pointsCenterLine.push(new THREE.Vector3(10, 0, 0));
        const geometryCenterLine = new THREE.BufferGeometry().setFromPoints(pointsCenterLine);
        const lineCenterLine = new THREE.Line(geometryCenterLine, materialCenterLine);
        lineCenterLine.computeLineDistances();
        scene.add(lineCenterLine);

        const ballGeometry = new THREE.CircleGeometry(0.25);
        //const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });

        /*
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ball);
        */

        const unitRedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const unitBlueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        /*
        //const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        import { InitSignalRConnection } from './Signalr';
        //raycaster.setFromCamera(mouse, camera);
        */

        /*
        function onMouseClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                const redBall = new THREE.Mesh(ballGeometry, unitRedMaterial);
                redBall.position.set(mouse.x, mouse.y, 0);
                scene.add(redBall);
            }
        }
        */

        /*
        const redBall = new THREE.Mesh(ballGeometry, unitRedMaterial);
        redBall.position.z = -5;
        scene.add(redBall);
        */

        // const connection = new signalR.HubConnectionBuilder().withUrl("/messageHub").build();
        // let connected = false;
        // const connection = SignalRConnection();
        //let user = "red";
        // let connectionId;

        const mouse = { x: 0, y: 0 };
        var unitsRed = [];
        var unitsBlue = [];
        var selected = -1;
        // var scoreRed = 0;
        // var scoreBlue = 0;
        var ball = { x: 700, y: 400, destX: 700, destY: 400, user: "none", player: -1, speed: 5 };

        function onMouseClick() {

            var mousePos = getMousePos();
            var xPos = mousePos.x;
            var yPos = mousePos.y;
            //var radius = Math.pow(40, 2);
            var pushUnit = true;
            // var units = document.getElementById("units").value;
            var units = 50;

            for (let i = 0; i < unitsRed.length; i++) {
                if ((distance(unitsRed[i].Message.Unit.x, xPos, unitsRed[i].Message.Unit.y, yPos) < 0.43) && (pushUnit)) {
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

            /*
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
            */

            for (let i = 0; i < unitsBlue.length; i++) {
                if ((distance(unitsBlue[i].Message.Unit.x, xPos, unitsBlue[i].Message.Unit.y, yPos) < 0.43) && (pushUnit)) {
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

            /*
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
            */

            if ((user == "red") && (mousePos.y <= 2.95) && (mousePos.y >= .05) && (pushUnit) && (unitsRed.length < units)) {
                unitsRed.push({ Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos, id: unitsRed.length } } });
                const redBall = new THREE.Mesh(ballGeometry, unitRedMaterial);
                scene.add(redBall);
                redBall.position.copy(mousePos);
            }

            if ((user == "blue") && (mousePos.y >= -2.95) && (mousePos.y <= -0.05) && (pushUnit) && (unitsBlue.length < units)) {
                unitsBlue.push({ Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos, id: unitsBlue.length } } });
                const blueBall = new THREE.Mesh(ballGeometry, unitBlueMaterial);
                scene.add(blueBall);
                blueBall.position.copy(mousePos);
            }

            /*
            if (evt.button == 2) {
                if ((user === "red")&&(ball.user === user)) {
                    for (var i = 0; i < unitsRed.length; i++) {
                        if ((ball.player === i) && (distance(unitsRed[i].Message.Unit.x, xPos, unitsRed[i].Message.Unit.y, yPos) > ball.speed)) {
                            ball.player = -1;
                            ball.destX = xPos;
                            ball.destY = yPos;
                            moveObjectToPoint(ball, ball.destX, ball.destY, ball.speed + 40);
                        }
                    }
                }

                if ((user == "blue")&&(ball.user === user)) {
                    for (var i = 0; i < unitsBlue.length; i++) {
                        if ((ball.player === i)&&(distance(unitsBlue[i].Message.Unit.x,xPos,unitsBlue[i].Message.Unit.y,yPos) > ball.speed)) {
                            ball.player = -1;
                            ball.destX = xPos;
                            ball.destY = yPos;
                            moveObjectToPoint(ball, ball.destX, ball.destY, ball.speed+40);
                        }
                    }
                }
            }
            */

            async function SendMessage() {
                try {
                    /*
                    await connection.invoke("SendMessage", "red", { Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos }, Red: unitsRed, Blue: unitsBlue, Ball: ball } }).catch(function (err) {
                        return console.error(err.toString());
                    });

                    await connection.invoke("SendMessage", "blue", { Message: { Unit: { x: xPos, y: yPos, destX: xPos, destY: yPos }, Red: unitsRed, Blue: unitsBlue, Ball: ball } }).catch(function (err) {
                        return console.error(err.toString());
                    });
                    */
                }
                catch (err) {
                    console.log(err);
                }
            }

            SendMessage();

            /*
            x = mousePos.x;
            y = mousePos.y;
            */

            /*
            const redBall = new THREE.Mesh(ballGeometry, unitRedMaterial);
            scene.add(redBall);
            redBall.position.copy(mousePos);
            */

            animate();
        };

        function getMousePos() {
            // Update the mouse variable
            event.preventDefault();
            mouse.x = (event.clientX / screenWidth) * 2 - 1;
            mouse.y = - (event.clientY / screenHeight) * 2 + 1;

            // Make the sphere follow the mouse
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            var dir = vector.sub(camera.position).normalize();
            var distance = - camera.position.z / dir.z;
            var pos = camera.position.clone().add(dir.multiplyScalar(distance));

            return pos;
        }

        window.addEventListener('mouseup', onMouseClick);

        function animate() {
            requestAnimationFrame(animate);
            render(scene, camera);
        }

        // Rendering function
        function render() {

            // For rendering
            renderer.autoClear = false;
            renderer.clear();
            renderer.render(scene, camera);

        };

        animate();

        setInterval(() => {
            animate();
        }, 1000 / 60);

        return () => {
            /*mountRef.current.removeChild(renderer.domElement);*/
        }
    }, []);

    /*
    if (mountRef.current) {
        return (
            <></>
            <div id="maincontent" >
                <div id="container" ></div>
            </div>
        );
    }
    */
}

Canvas.propTypes = {
    connection: PropTypes.object,
    user: PropTypes.string
}


export default Canvas;

// REGION: Helper

/*
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
*/

/*
function getMousePos(canvas, evt) {
     var rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
*/

// this function is mainly used for collision detection
function distance(x1, x2, y1, y2) {
    return Math.abs(Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1, 2)));
}

// ENDREGION: Helper
