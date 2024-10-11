import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Canvas = () => {
    const mountRef = useRef(null);

	useEffect (() => {
        const width = 1400;
        const height = 800; // Height of the div

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

		const animate = function() {
			requestAnimationFrame(animate);
            cube.rotation.x = 0.001;
            cube.rotation.y = 0.001;
			renderer.render(scene, camera);
		}

        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        }
    }, []);

    return (
        <div id="maincontent">
            <div className="canvas" ref={mountRef} style={{ width: '1400px', height: '800px' }}></div>
        </div>
    );
}

export default Canvas;
