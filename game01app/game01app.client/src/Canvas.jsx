import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const Canvas = () => {
    //const mountRef = useRef(null);

	useEffect (() => {
        // document.body.appendChild(stats.dom);
        /*
        const width = 1400;
        const height = 1000; // Height of the div
        const scene = new THREE.Scene();
        //const camera = new THREE.PerspectiveCamera(100, width / height, 1, 10000 );
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.01, 100000);
        camera.setViewOffset(width, height, 0, 0, width, height);
        camera.position.set(0, 0, 10000);
        */

        var container,
            scene, 
            camera,
            renderer,
            mouseMesh;

        // Custom global variables
        var mouse = {x: 0, y: 0};

        init();
        animate();

        function init() {

            // Scene
            scene = new THREE.Scene();

            // Camera
            var screenWidth = window.innerWidth,
                    screenHeight = window.innerHeight,
                    viewAngle = 75,
                    nearDistance = 0.1,
                    farDistance = 1000;
            camera = new THREE.PerspectiveCamera(viewAngle, screenWidth / 	screenHeight, nearDistance, farDistance);
            scene.add(camera);
            camera.position.set(0, 0, 5);
            camera.lookAt(scene.position);

            // Renderer engine together with the background
            renderer = new THREE.WebGLRenderer({
                    antialias: true,
                alpha: true
          });
            renderer.setSize(screenWidth, screenHeight);
            container = document.getElementById('container');
            container.appendChild(renderer.domElement); 

            // Define the lights for the scene
            var light = new THREE.PointLight(0xffffff);
            light.position.set(20, 0, 20);
            scene.add(light);
            var lightAmb = new THREE.AmbientLight(0x777777);
            scene.add(lightAmb);


            // Create a circle around the mouse and move it
            // The sphere has opacity 0
            var mouseGeometry = new THREE.SphereGeometry(1, 0, 0);
            var mouseMaterial = new THREE.MeshBasicMaterial({
                color: 0x0000ff
            });
            mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
            mouseMesh.position.z = -5;
            scene.add(mouseMesh);

            // When the mouse moves, call the given function
            document.addEventListener('mousemove', onMouseMove, false);
        }

        // Follows the mouse event
        function onMouseMove(event) {

            // Update the mouse variable
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

         // Make the sphere follow the mouse
          var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject( camera );
            var dir = vector.sub( camera.position ).normalize();
            var distance = - camera.position.z / dir.z;
            var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
            mouseMesh.position.copy(pos);
          
            // Make the sphere follow the mouse
        //	mouseMesh.position.set(event.clientX, event.clientY, 0);
        };

        // Animate the elements
        function animate() {
            requestAnimationFrame(animate);
                render();	
        }
            
        // Rendering function
        function render() {

            // For rendering
            renderer.autoClear = false;
            renderer.clear();
            renderer.render(scene, camera);
        };

        // When the mouse moves, call the given function
        //document.addEventListener('mousemove', onMouseMove, false);

        //mountRef.current.appendChild(renderer.domElement);

        /*
        const LINEDASHSIZE = 0.09;
        const LINEGAPSIZE = 0.09;
        
        const materialRedLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsRedLine = [];
        pointsRedLine.push(new THREE.Vector3(-1400, 300, 0));
        pointsRedLine.push(new THREE.Vector3(1400, 300, 0));
        const geometryRedLine = new THREE.BufferGeometry().setFromPoints(pointsRedLine);
        const line = new THREE.Line(geometryRedLine, materialRedLine);
        line.computeLineDistances();
        scene.add(line);

        const materialBlueLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: LINEDASHSIZE, gapSize: LINEGAPSIZE });
        const pointsBlueLine = [];
        pointsBlueLine.push(new THREE.Vector3(-1400, -300, 0));
        pointsBlueLine.push(new THREE.Vector3(1400, -300, 0));
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

        const ballGeometry = new THREE.CircleGeometry(25, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ball);
        */

        // const unitRedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        /*
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        raycaster.setFromCamera(mouse, camera);

        function onMouseClick() {
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject( camera );
            var dir = vector.sub( camera.position ).normalize();
            var distance = - camera.position.z / dir.z;
            var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
            const redBall = new THREE.Mesh(ballGeometry, unitRedMaterial);
            redBall.position.set(pos.x, pos.y, 0);
            scene.add(redBall);
        }

        window.addEventListener('mouseup', onMouseClick);
        */

       /*
		const animate = function() {
            stats.begin();
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
            stats.end();
		}

        setInterval(() => {
            animate();
        }, 1000 / 60);
        */

        return () => {
            // mountRef.current.removeChild(renderer.domElement);
        }
    }, []);

    return (
        <div id="maincontent" >
            <div id="container" ></div>
        </div>
    );
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

