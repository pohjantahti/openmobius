import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import { JobPrefab, getJobPrefab } from "./formatters/jobPrefab";
import { OBJLoader } from "three/examples/jsm/Addons.js";

interface JobProps {
    meshData: {
        name: string;
        mesh: string;
        skin: Array<{
            weight: number[];
            boneIndex: number[];
        }>;
    };
    textures: {
        color: string;
        normal: string;
        material: string;
    };
}

function Job(props: JobProps) {
    const object = useLoader(OBJLoader, props.meshData.mesh).children[0] as THREE.Mesh;
    const [colorTexture, normalTexture, materialTexture] = useTexture([
        props.textures.color,
        props.textures.normal,
        props.textures.material,
    ]);
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.colorSpace = THREE.SRGBColorSpace;

    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.colorSpace = THREE.NoColorSpace;

    materialTexture.wrapS = THREE.RepeatWrapping;
    materialTexture.wrapT = THREE.RepeatWrapping;
    materialTexture.colorSpace = THREE.NoColorSpace;

    return (
        <mesh>
            <primitive object={object.geometry} />
            <meshStandardMaterial
                map={colorTexture}
                normalMap={normalTexture}
                // aoMap={materialTexture}
                // roughnessMap={materialTexture}
                // metalnessMap={materialTexture}
                alphaTest={0.5}
            />
        </mesh>
    );
}

interface Props {
    jobId: string;
}

function JobRenderer(props: Props) {
    const { jobId } = props;

    const [jobPrefab, setJobPrefab] = useState<JobPrefab>();

    useEffect(() => {
        const handleJobId = async () => {
            const prefab = await getJobPrefab(jobId);
            setJobPrefab(prefab);
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

                {jobPrefab && (
                    <group>
                        {jobPrefab.meshes.map((mesh, index) => (
                            <Job key={index} meshData={mesh} textures={jobPrefab.textures} />
                        ))}
                    </group>
                )}
            </Canvas>
        </>
    );
}

export default JobRenderer;
