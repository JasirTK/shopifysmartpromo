"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox, Sparkles, Stars, PresentationControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Group } from 'three';

function AnimatedBag({ position, color, rotation, scale = 1, isWireframe = false, ...props }: any) {
    const meshRef = useRef<Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002; // Gentle constant rotation
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05; // Subtle tilt
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={1}
        >
            <group ref={meshRef} position={position} rotation={rotation} scale={scale} {...props}>
                {/* Bag Body */}
                <RoundedBox args={[1.4, 1.6, 0.5]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color={color}
                        roughness={0.2}
                        metalness={0.6}
                        wireframe={isWireframe}
                        emissive={isWireframe ? color : "#000"}
                        emissiveIntensity={isWireframe ? 2 : 0}
                    />
                </RoundedBox>

                {/* Bag Handle */}
                <mesh position={[0, 0.7, 0]}>
                    <torusGeometry args={[0.35, 0.04, 16, 48, 3.2]} />
                    <meshStandardMaterial color={isWireframe ? color : "#333"} emissive={isWireframe ? color : "#000"} />
                </mesh>

                {/* Glowing "Promo Tag" */}
                {!isWireframe && (
                    <group position={[0.4, -0.4, 0.26]} rotation={[0, 0, -0.2]}>
                        <RoundedBox args={[0.4, 0.2, 0.02]} radius={0.05} smoothness={2}>
                            <meshStandardMaterial color="#000" />
                        </RoundedBox>
                        <mesh position={[0, 0, 0.02]}>
                            <planeGeometry args={[0.3, 0.1]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                    </group>
                )}

                {/* Highlight Light */}
                <pointLight position={[1, 1, 1]} intensity={0.8} color={color} distance={4} />
            </group>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 hidden md:block">
            <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 9]} />

                    {/* Interactive Controls (Mouse Parallax) */}
                    <PresentationControls
                        global={false} // Only control this scene
                        cursor={true}
                        snap={true} // Snap back to center
                        speed={1.5}
                        zoom={0.8}
                        rotation={[0, 0, 0]}
                        polar={[-0.2, 0.2]} // Limit vertical rotation
                        azimuth={[-0.2, 0.2]} // Limit horizontal rotation
                        config={{ mass: 1, tension: 170, friction: 26 }}
                    >
                        {/* Atmosphere: Tech Particles */}
                        <Sparkles
                            count={80}
                            scale={12}
                            size={4}
                            speed={0.4}
                            opacity={0.6}
                            color="#7C3AED"
                        />
                        <Sparkles
                            count={50}
                            scale={10}
                            size={6}
                            speed={0.2}
                            opacity={0.4}
                            color="#2DD4BF"
                        />
                        {/* Distant Stars for depth */}
                        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

                        {/* Lighting */}
                        <ambientLight intensity={0.3} />
                        <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={2} color="#2DD4BF" />
                        <pointLight position={[-5, -5, 5]} intensity={2} color="#7C3AED" />

                        {/* Feature Bag (Hero) */}
                        <AnimatedBag
                            position={[3.5, 0.5, 0]}
                            rotation={[0, -0.4, 0.1]}
                            color="#0A0A0A" // Dark Premium
                        />

                        {/* Secondary Bags (Wireframe Tech Look) */}
                        <AnimatedBag
                            position={[-4, -2, -1]}
                            rotation={[0.2, 0.4, -0.2]}
                            color="#7C3AED" // Brand Purple
                            scale={0.85}
                            isWireframe={true}
                        />

                        <AnimatedBag
                            position={[-2.5, 3.5, -3]}
                            rotation={[-0.2, 0.1, 0.3]}
                            color="#3B82F6" // Brand Blue
                            scale={0.6}
                            isWireframe={true}
                        />

                    </PresentationControls>
                </Suspense>
            </Canvas>
        </div>
    );
}
