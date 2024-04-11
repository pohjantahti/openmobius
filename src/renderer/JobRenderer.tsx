import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { getJobPrefabGltf } from "./formatters/jobPrefab";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface JobProps {
    gltfFile: string;
}

function Job(props: JobProps) {
    const gltf = useLoader(GLTFLoader, props.gltfFile);

    return <primitive object={gltf.scene} />;
}

interface Props {
    jobId: string;
}

function JobRenderer(props: Props) {
    const { jobId } = props;
    const [gltfFile, setGltfFile] = useState("");

    useEffect(() => {
        const handleJobId = async () => {
            const file = await getJobPrefabGltf(jobId);
            setGltfFile(file);
        };

        if (jobId.length > 0) {
            handleJobId();
        }
    }, [jobId]);

    return (
        <>
            <Canvas
                camera={{
                    position: [1, 1.5, 2],
                    fov: 45,
                    aspect: 1,
                }}
                scene={{
                    background: new THREE.Color(0xaaaaaa),
                    fog: new THREE.Fog(new THREE.Color(0xaaaaaa), 10, 50),
                }}
                gl={{ toneMapping: THREE.NoToneMapping }}
                flat
            >
                <OrbitControls target={[0, 0.9, 0]} />
                <hemisphereLight
                    color={0xffffff}
                    groundColor={0x888888}
                    intensity={3}
                    position={[0, 20, 0]}
                />
                <directionalLight color={0xaaaaaa} intensity={3} position={[3, 10, 10]} />
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color={0x555555} />
                </mesh>

                {gltfFile.length > 0 && <Job gltfFile={gltfFile} />}
            </Canvas>
        </>
    );
}

export default JobRenderer;
