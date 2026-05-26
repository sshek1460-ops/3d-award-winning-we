"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

function GlassPanel({ position, size, rotation: rot }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }) {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#88bbdd", transparent: true, opacity: 0.2, roughness: 0, metalness: 0,
    transmission: 0.95, thickness: 0.05, side: THREE.DoubleSide, envMapIntensity: 0.5,
  }), []);
  return <mesh position={position} rotation={rot}><planeGeometry args={size} /><primitive object={mat} /></mesh>;
}

function PalmTree({ position, scale: s = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5a4a3a", roughness: 0.9 }), []);
  const frondMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a6a3a", roughness: 0.8, side: THREE.DoubleSide }), []);
  return (
    <group position={position} scale={[s, s, s]}>
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.05, 0.08, 1.6, 6]} /><primitive object={trunkMat} /></mesh>
      {Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, 1.6, 0]} rotation={[0.5, angle, 0.3]}>
            <planeGeometry args={[0.6, 0.08]} /><primitive object={frondMat} />
          </mesh>
        );
      })}
    </group>
  );
}

function VillaScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const waterRef = useRef<THREE.Mesh>(null);
  const poolRef = useRef<THREE.Mesh>(null);

  const concrete = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e8e0d0", roughness: 0.85, metalness: 0 }), []);
  const darkConcrete = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c8b8a0", roughness: 0.9, metalness: 0 }), []);
  const bronze = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b8864e", metalness: 0.9, roughness: 0.2 }), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c8a96a", metalness: 0.95, roughness: 0.1, emissive: "#c8a96a", emissiveIntensity: 0.15 }), []);
  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8B7355", roughness: 0.95 }), []);
  const water = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#1a5a6a", transparent: true, opacity: 0.6,
    roughness: 0, metalness: 0.9, side: THREE.DoubleSide,
  }), []);
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#aaccee", transparent: true, opacity: 0.15, roughness: 0, metalness: 0,
    transmission: 0.9, thickness: 0.1, envMapIntensity: 1, side: THREE.DoubleSide,
  }), []);
  const roofMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d0c8b8", roughness: 0.9 }), []);
  const hedgeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a5a3a", roughness: 0.9 }), []);

  useEffect(() => {
    if (!groupRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(groupRef.current!.rotation, {
        y: Math.PI * 2, ease: "none",
        scrollTrigger: { trigger: "#craft", start: "top top", end: "+=400%", scrub: 1.2 }
      });
      gsap.to(groupRef.current!.position, {
        y: -0.3, ease: "power1.inOut",
        scrollTrigger: { trigger: "#craft", start: "top top", end: "+=400%", scrub: 1 }
      });
    });
    return () => ctx.revert();
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.12;
    if (waterRef.current) {
      const m = waterRef.current.material as THREE.MeshPhysicalMaterial;
      m.opacity = 0.55 + Math.sin(t * 0.4) * 0.1;
    }
    if (poolRef.current) {
      const m = poolRef.current.material as THREE.MeshPhysicalMaterial;
      m.roughness = 0.4 + Math.sin(t * 0.6) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}><planeGeometry args={[16, 14]} /><meshStandardMaterial color="#d4c9b0" roughness={1} /></mesh>

      {/* ===== MAIN VILLA STRUCTURE ===== */}
      {/* Base podium */}
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[5.6, 0.4, 4.6]} /><primitive object={darkConcrete} /></mesh>

      {/* Ground floor main block */}
      <mesh position={[0, 1.4, 0]}><boxGeometry args={[5, 2, 4]} /><primitive object={concrete} /></mesh>

      {/* Glass facade - south face */}
      <GlassPanel position={[0, 1.4, 2.01]} size={[4.4, 1.8]} />
      <GlassPanel position={[-1.8, 1.4, 2.01]} size={[1, 1.8]} />
      <GlassPanel position={[1.8, 1.4, 2.01]} size={[1, 1.8]} />

      {/* Glass walls - east/west */}
      <GlassPanel position={[2.51, 1.4, 0]} size={[1.8, 2]} rotation={[0, Math.PI / 2, 0]} />
      <GlassPanel position={[-2.51, 1.4, 0]} size={[1.8, 2]} rotation={[0, Math.PI / 2, 0]} />

      {/* North glass wall */}
      <GlassPanel position={[0, 1.4, -2.01]} size={[2.5, 1.6]} rotation={[0, Math.PI, 0]} />

      {/* Entry pathway */}
      <mesh position={[0, 0.02, 3.1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.5, 1]} /><meshStandardMaterial color="#c8b898" roughness={0.95} /></mesh>
      <mesh position={[0, -0.05, 3.6]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.5, 0.4]} /><primitive object={wood} /></mesh>

      {/* ===== SECOND FLOOR ===== */}
      {/* Cantilevered upper volume */}
      <mesh position={[0.6, 3, -0.3]}><boxGeometry args={[4, 1.2, 3]} /><primitive object={concrete} /></mesh>
      <GlassPanel position={[0.6, 3, 1.2]} size={[3.5, 0.8]} />
      <GlassPanel position={[2.5, 3, -0.3]} size={[0.8, 1]} rotation={[0, Math.PI / 2, 0]} />
      <GlassPanel position={[-1.3, 3, -0.3]} size={[0.8, 1]} rotation={[0, Math.PI / 2, 0]} />

      {/* Roof overhang */}
      <mesh position={[0.6, 3.7, -0.3]}><boxGeometry args={[4.6, 0.1, 3.6]} /><primitive object={roofMat} /></mesh>

      {/* ===== WING ===== */}
      <mesh position={[-3, 1, 0.8]}><boxGeometry args={[1.5, 1.8, 2]} /><primitive object={concrete} /></mesh>
      <GlassPanel position={[-3.76, 1, 0.8]} size={[1.6, 1.5]} rotation={[0, Math.PI / 2, 0]} />
      <mesh position={[-3, 2, 0.8]}><boxGeometry args={[1.7, 0.1, 2.2]} /><primitive object={roofMat} /></mesh>

      {/* ===== POOL ===== */}
      <mesh ref={poolRef} position={[0, 0.01, -2.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[4, 2]} /><primitive object={water} /></mesh>
      {/* Pool edge */}
      <mesh position={[-2.01, 0.1, -2.2]}><boxGeometry args={[0.08, 0.2, 2]} /><primitive object={darkConcrete} /></mesh>
      <mesh position={[2.01, 0.1, -2.2]}><boxGeometry args={[0.08, 0.2, 2]} /><primitive object={darkConcrete} /></mesh>
      <mesh position={[0, 0.1, -3.21]}><boxGeometry args={[4, 0.2, 0.08]} /><primitive object={darkConcrete} /></mesh>
      <mesh position={[0, 0.1, -1.19]}><boxGeometry args={[4, 0.2, 0.08]} /><primitive object={darkConcrete} /></mesh>

      {/* Pool water animation */}
      <mesh ref={waterRef} position={[0, 0.05, -2.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.6, 1.6]} /><meshPhysicalMaterial color="#2a8a9a" transparent opacity={0.4} roughness={0.1} metalness={0.3} /></mesh>

      {/* ===== DECK ===== */}
      <mesh position={[2.2, 0.05, 1.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.5, 1.5]} /><primitive object={wood} /></mesh>

      {/* Deck lounge chairs */}
      {[[2.2, 0.15, 1.7] as const, [2.2, 0.15, 0.7] as const].map((p, i) => (
        <group key={`chair-${i}`} position={[p[0], p[1], p[2]]}>
          <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.5, 0.04, 0.6]} /><meshStandardMaterial color="#e8dcc8" roughness={0.8} /></mesh>
          <mesh position={[0, 0.15, -0.3]}><boxGeometry args={[0.5, 0.08, 0.04]} /><primitive object={bronze} /></mesh>
          <mesh position={[0, 0.15, 0.3]}><boxGeometry args={[0.5, 0.08, 0.04]} /><primitive object={bronze} /></mesh>
        </group>
      ))}

      {/* ===== COLUMNS (bronze) ===== */}
      {[[-2.3, 0, 1.5], [-2.3, 0, -0.5], [2.3, 0, 1.5], [2.3, 0, -0.5]].map((p, i) => (
        <mesh key={`col-${i}`} position={[p[0], 1, p[2]]}><cylinderGeometry args={[0.06, 0.08, 2, 12]} /><primitive object={bronze} /></mesh>
      ))}
      {[[-0.5, 0, 0.8], [0.4, 0, 0.3], [1.2, 0, 0.8]].map((p, i) => (
        <mesh key={`col-sm-${i}`} position={[p[0], 0.5, p[2]]}><cylinderGeometry args={[0.04, 0.05, 1, 8]} /><primitive object={bronze} /></mesh>
      ))}

      {/* ===== GOLD RING (art piece) ===== */}
      <mesh position={[-0.5, 2.5, 1.2]} rotation={[Math.PI / 3, 0.2, 0]}><torusGeometry args={[0.35, 0.02, 8, 32]} /><primitive object={gold} /></mesh>

      {/* ===== TREES ===== */}
      <PalmTree position={[-4.5, 0, 3.5]} scale={1.2} />
      <PalmTree position={[4.8, 0, 4]} scale={1.1} />
      <PalmTree position={[-4.2, 0, -2.5]} scale={0.9} />
      <PalmTree position={[4.5, 0, -3]} scale={1} />

      {/* Hedges */}
      {[[-3, 0, 4.5], [0, 0, 4.8], [3.5, 0, 4.2]].map((p, i) => (
        <mesh key={`hedge-${i}`} position={[p[0], 0.3, p[2]]}><boxGeometry args={[0.8, 0.6, 0.5]} /><primitive object={hedgeMat} /></mesh>
      ))}

      {/* ===== LIGHTING ===== */}
      <pointLight position={[0, 1.5, 0.5]} intensity={0.8} color="#FFDDAA" distance={6} decay={1} />
      <pointLight position={[-2, 1, 1]} intensity={0.4} color="#FFBB88" distance={4} decay={1} />
      <pointLight position={[2, 0.8, -1]} intensity={0.3} color="#FFDDBB" distance={4} decay={1} />

      {/* Pool lights */}
      <pointLight position={[-1, 0, -2.2]} intensity={0.2} color="#66CCFF" distance={3} decay={1} />
      <pointLight position={[1, 0, -2.2]} intensity={0.2} color="#66CCFF" distance={3} decay={1} />

      {/* Ambient glowing motes */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`mote-${i}`} position={[
          (Math.random() - 0.5) * 8,
          Math.random() * 4,
          (Math.random() - 0.5) * 6,
        ]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#FFD8A0" transparent opacity={0.3 + Math.random() * 0.3} />
        </mesh>
      ))}
    </group>
  );
}

function RenderController() {
  const { gl, invalidate } = useThree();
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; if (entry.isIntersecting) invalidate(); },
      { threshold: 0.01 }
    );
    const section = document.getElementById("craft");
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, [gl, invalidate]);

  useEffect(() => {
    const onScroll = () => { if (isVisibleRef.current) invalidate(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate]);

  return null;
}

export default function ThreeArchitecturalFragment() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }} dpr={[1, 1.2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }} frameloop="demand">
        <color attach="background" args={["#F5F1E8"]} />
        <fog attach="fog" args={["#F5F1E8", 8, 20]} />
        <ambientLight intensity={0.25} color="#F5EFE4" />
        <directionalLight position={[5, 8, 4]} intensity={1.2} color="#FFEEDD" />
        <directionalLight position={[-3, 4, 6]} intensity={0.5} color="#FFDDBB" />
        <hemisphereLight args={["#FFEEDD", "#8a7a6a", 0.4]} />
        <VillaScene />
        <RenderController />
      </Canvas>
    </div>
  );
}
