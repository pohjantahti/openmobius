import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

interface Props {
    url: string;
}

function Mesh(props: Props) {
    const threeSetUp = useRef(false);
    const height = 700;
    const width = 900;
    useEffect(() => {
        const disposable: Array<
            THREE.BufferGeometry | THREE.Light | THREE.Material | THREE.WebGLRenderer
        > = [];
        if (!threeSetUp.current) {
            threeSetUp.current = true;

            const container = document.getElementById("three")!;

            // Camera
            const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
            camera.position.set(1, 2, 3);
            camera.lookAt(0, 1, 0);

            // Scene
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xaaaaaa);
            scene.fog = new THREE.Fog(scene.background, 10, 50);

            // Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(width / height);
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            renderer.shadowMap.enabled = true;

            // Lights
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 3);
            hemiLight.position.set(0, 20, 0);
            scene.add(hemiLight);

            const dirLight = new THREE.DirectionalLight(0xaaaaaa, 3);
            dirLight.position.set(3, 10, 10);
            scene.add(dirLight);

            // Ground
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
            const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
            groundMesh.rotation.x = -Math.PI / 2;
            scene.add(groundMesh);

            // Loader
            const loader = new OBJLoader();
            loader.load(props.url, (obj) => {
                const mesh = obj.children[0] as THREE.Mesh;
                const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
                const full = new THREE.Mesh(mesh.geometry, material);
                scene.add(full);
                renderer.render(scene, camera);
                // Mark all the disposable items
                disposable.push(
                    hemiLight,
                    dirLight,
                    groundGeometry,
                    groundMaterial,
                    material,
                    renderer
                );
            });
        }
        return () => {
            for (let i = 0; i < disposable.length; i++) {
                disposable[i].dispose();
            }
        };
    }, [props.url]);

    return <div id="three" />;
}

export default Mesh;
