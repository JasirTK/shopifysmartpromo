"use client";

import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import { Suspense } from 'react';

function PremiumShoppingBag({ position, color, rotation, scale = 1, ...props }: any) {
    return (
        <Float
            speed={2.5}
            rotationIntensity={0.8}
            floatIntensity={1.2}
        >
            <group position={position} rotation={rotation} scale={scale} {...props}>
                {/* Bag Body - Soft Rounded Edges */}
                <RoundedBox args={[1.4, 1.6, 0.5]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color={color}
                        roughness={0.4}
                        metalness={0.3}
                        envMapIntensity={0.5}
                    />
                </RoundedBox>

                {/* Bag Handle - Darker/Metallic */}
                <mesh position={[0, 0.7, 0]}>
                    <torusGeometry args={[0.35, 0.04, 16, 48, 3.2]} />
                    <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
                </mesh>

                {/* Glowing "Promo Tag" - Cyberpunk Accent */}
                <group position={[0.4, -0.4, 0.26]} rotation={[0, 0, -0.2]}>
                    <RoundedBox args={[0.4, 0.2, 0.02]} radius={0.05} smoothness={2}>
                        <meshStandardMaterial color="#000" />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.02]}>
                        <planeGeometry args={[0.3, 0.1]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>

                {/* Subtle Rim Light Highlight */}
                <pointLight position={[1, 1, 1]} intensity={0.5} color={color} distance={3} />
            </group>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
            {/* Transparent Canvas with optimized settings */}
            <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />

                    {/* Cinematic Lighting Setup - "Deep Space" Mood */}
                    <ambientLight intensity={0.4} /> {/* Dim Ambient */}

                    {/* Key Light (Cyan) */}
                    <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#2DD4BF" castShadow={false} />

                    {/* Fill Light (Purple) */}
                    <pointLight position={[-5, 0, 5]} intensity={1.5} color="#7C3AED" />

                    {/* Rim/Back Light (Deep Blue) */}
                    <directionalLight position={[0, 5, -5]} intensity={2} color="#3B82F6" />

                    {/* Feature Bag (Hero) */}
                    <PremiumShoppingBag
                        position={[3, 0.5, 0]}
                        rotation={[0, -0.4, 0.1]}
                        color="#111" // Sleek Black/Dark Bag base
                    />

                    {/* Secondary Floating Elements */}
                    <PremiumShoppingBag
                        position={[-4, -1.5, -2]}
                        rotation={[0.2, 0.4, -0.2]}
                        color="#7C3AED" // Brand Purple
                        scale={0.8}
                    />

                    <PremiumShoppingBag
                        position={[-2, 3, -4]}
                        rotation={[-0.2, 0.1, 0.3]}
                        color="#3B82F6" // Brand Blue
                        scale={0.6}
                    />

                </Suspense>
            </Canvas>
        </div>
    );
}
