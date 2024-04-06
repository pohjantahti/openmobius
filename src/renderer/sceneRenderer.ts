import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { getJobPrefab } from "./formatters/jobPrefab";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class SceneRenderer {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    animate: boolean;

    constructor(renderElement: string, height: number, width: number) {
        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(1, 1.5, 2);

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xaaaaaa);
        this.scene.fog = new THREE.Fog(this.scene.background, 10, 50);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(width / height);
        this.renderer.setSize(width, height);
        const container = document.getElementById(renderElement)!;
        container.appendChild(this.renderer.domElement);

        // Lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 3);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xaaaaaa, 3);
        dirLight.position.set(3, 10, 10);
        this.scene.add(dirLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        this.scene.add(groundMesh);

        // Controls
        this.controls = new OrbitControls(this.camera, container);
        this.controls.target.set(0, 0.9, 0);
        this.controls.update();

        this.animate = true;

        const animateFrame = (sr: SceneRenderer) => {
            if (sr.animate) {
                requestAnimationFrame(() => animateFrame(sr));
                sr.controls.update();
                sr.renderer.render(sr.scene, sr.camera);
            }
        };

        animateFrame(this);
    }

    async loadJob(jobId: string) {
        this.unloadJob();

        const jobPrefab = await getJobPrefab(jobId);

        const colorTexture = new THREE.TextureLoader().load(jobPrefab.textures.color);
        colorTexture.wrapS = THREE.RepeatWrapping;
        colorTexture.wrapT = THREE.RepeatWrapping;
        colorTexture.colorSpace = THREE.SRGBColorSpace;
        const normalTexture = new THREE.TextureLoader().load(jobPrefab.textures.normal);
        normalTexture.wrapS = THREE.RepeatWrapping;
        normalTexture.wrapT = THREE.RepeatWrapping;
        normalTexture.colorSpace = THREE.NoColorSpace;
        const materialTexture = new THREE.TextureLoader().load(jobPrefab.textures.material);
        materialTexture.wrapS = THREE.RepeatWrapping;
        materialTexture.wrapT = THREE.RepeatWrapping;
        materialTexture.colorSpace = THREE.NoColorSpace;

        const loader = new OBJLoader();
        const job = new THREE.Group();
        job.name = "displayedJob";
        for (const part of jobPrefab.meshes) {
            loader.load(part.mesh, (obj) => {
                const mesh = obj.children[0] as THREE.Mesh;
                const material = new THREE.MeshPhysicalMaterial({
                    map: colorTexture,
                    normalMap: normalTexture,
                    // aoMap: materialTexture,
                    // roughnessMap: materialTexture,
                    // metalnessMap: materialTexture,
                    alphaTest: 0.5,
                });
                job.add(new THREE.Mesh(mesh.geometry, material));
            });
        }
        this.scene.add(job);
    }

    unloadJob() {
        const job = this.scene.getObjectByName("displayedJob") as THREE.Group | undefined;
        if (job) {
            for (const child of job.children as Array<THREE.Mesh>) {
                child.geometry.dispose();
                const material = child.material as THREE.MeshPhysicalMaterial;
                material.map?.dispose();
                material.normalMap?.dispose();
                material.aoMap?.dispose();
                material.dispose();
            }
            this.scene.remove(job);
        }
    }

    unloadEverything() {
        this.unloadJob();
        this.animate = false;
        this.controls.dispose();

        for (const child of this.scene.children) {
            switch (child.type) {
                case "HemisphereLight":
                case "DirectionalLight": {
                    const object = child as THREE.HemisphereLight | THREE.DirectionalLight;
                    object.dispose();
                    break;
                }
                case "Mesh": {
                    const object = child as THREE.Mesh;
                    object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                        object.material.dispose();
                    }
                    break;
                }
                default:
                    console.log(`Type not accounted for: ${child.type}`);
                    break;
            }
        }
        this.renderer.clear();
        this.renderer.forceContextLoss();
        this.renderer.dispose();
    }
}

export { SceneRenderer };
