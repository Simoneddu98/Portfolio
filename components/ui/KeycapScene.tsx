"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const KEYS = [
  { label: "Marketing", col: 0, row: 0, accent: false },
  { label: "Persone",   col: 1, row: 0, accent: false },
  { label: "AI",        col: 0, row: 1, accent: true  },
  { label: "Formazione",col: 1, row: 1, accent: false },
];

const ACCENT   = new THREE.Color("#E85D26");
const BASE     = new THREE.Color("#FFECD8");
const GLOW     = new THREE.Color("#FFB37A");

function Keycap({
  label,
  position,
  isAccent,
}: {
  label: string;
  position: [number, number, number];
  isAccent: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      {/* Base cap */}
      <RoundedBox args={[1.1, 1.1, 0.45]} radius={0.1} smoothness={4} ref={meshRef as any}>
        <meshStandardMaterial
          color={isAccent ? ACCENT : BASE}
          roughness={0.35}
          metalness={0.05}
          envMapIntensity={isAccent ? 1.2 : 0.6}
        />
      </RoundedBox>

      {/* Top face slightly raised */}
      <RoundedBox position={[0, 0, 0.28]} args={[0.9, 0.9, 0.06]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color={isAccent ? GLOW : new THREE.Color("#FFF8F0")}
          roughness={0.2}
          metalness={0.02}
        />
      </RoundedBox>

      {/* Label */}
      <Text
        position={[0, 0, 0.35]}
        fontSize={label.length > 6 ? 0.13 : 0.17}
        color={isAccent ? "#FFF" : "#3A2010"}
        font={undefined}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.85}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}

function KeycapGrid({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const [mx, my] = mouse.current;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mx * 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -my * 0.2,
      0.05
    );
  });

  const gap = 1.25;

  return (
    <group ref={groupRef} rotation={[0.1, -0.1, 0]}>
      {KEYS.map((k) => (
        <Keycap
          key={k.label}
          label={k.label}
          position={[(k.col - 0.5) * gap, (0.5 - k.row) * gap, 0]}
          isAccent={k.accent}
        />
      ))}

      {/* Rim light leak from accent key */}
      <pointLight position={[-0.3, -0.3, 1.2]} color={ACCENT} intensity={2.5} distance={3} />
    </group>
  );
}

function Scene() {
  const mouse = useRef<[number, number]>([0, 0]);

  const { gl } = useThree();

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, -2, 2]} color="#FFB37A" intensity={0.4} />
      <KeycapGrid mouse={mouse} />

      {/* Mouse tracking via canvas pointer events */}
      <mesh
        visible={false}
        onPointerMove={(e) => {
          const rect = gl.domElement.getBoundingClientRect();
          mouse.current = [
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1,
          ];
        }}
        onPointerLeave={() => { mouse.current = [0, 0]; }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function KeycapScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
