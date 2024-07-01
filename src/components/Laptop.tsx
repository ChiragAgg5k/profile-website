"use client";

import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

function MeshComponent() {
  const fileUrl = "cyberpunk_laptop/scene.gltf";
  const mesh = useRef<Mesh>(null!);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const gltf = useLoader(GLTFLoader, fileUrl);

  useFrame(() => {
    mesh.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={mesh} position={[0, -0.8, 0]}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */}
      <primitive object={gltf.scene} />
    </mesh>
  );
}

export default function Laptop() {
  return (
    <div className="flex h-full items-center justify-center">
      <Canvas
        className="h-full w-full"
        camera={{
          position: [2.5, 2, 5],
          fov: 45,
          zoom: 1.5,
        }}
      >
        <OrbitControls />
        <ambientLight intensity={4} />
        <pointLight position={[0, 5, 0]} intensity={1.5} />
        <MeshComponent />
      </Canvas>
    </div>
  );
}
