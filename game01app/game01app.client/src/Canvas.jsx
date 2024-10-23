import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const Canvas = () => {
    const mountRef = useRef(null);

	useEffect (() => {
        const stats = new Stats();
        // document.body.appendChild(stats.dom);
        const width = 1400;
        const height = 1000; // Height of the div
        const scene = new THREE.Scene();
        //const camera = new THREE.PerspectiveCamera(100, width / height, 1, 10000 );
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.01, 100000);
        camera.setViewOffset(width, height, 0, 0, width, height);
        camera.position.set(0, 0, 10000);
        const renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 1);
        mountRef.current.appendChild(renderer.domElement);

        /*
        let cameraControls = new OrbitControls( camera, renderer.domElement );
        cameraControls.target.set( 0, 40, 0 );
        cameraControls.maxDistance = 400;
        cameraControls.minDistance = 10;
        cameraControls.update();
        */

        const LINEDASHSIZE = 0.09;
        const LINEGAPSIZE = 0.09;
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        camera.position.set(0, 0, 500);

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

		const animate = function() {
            stats.begin();
			requestAnimationFrame(animate);
            cube.rotation.x = 0.001;
            cube.rotation.y = 0.001;
			renderer.render(scene, camera);
            stats.end();
		}

        setInterval(() => {
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

