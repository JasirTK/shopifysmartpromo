"use client";

import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

function ShoppingBag({ position, color, ...props }: any) {
    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={1}
        >
            <group position={position} {...props}>
                {/* Bag Body */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.2, 1.4, 0.4]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
                </mesh>

                {/* Bag Handle */}
                <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.3, 0.05, 16, 32, 3.2]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.5} />
                </mesh>

                {/* Shopify-like Logo Badge (Simple Circle) */}
                <mesh position={[0, 0, 0.21]}>
                    <circleGeometry args={[0.3, 32]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            </group>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
            <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />

                    {/* Standard Lighting - Very Cheap Performance */}
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />
                    <pointLight position={[-5, 5, 5]} intensity={0.5} color="#7C3AED" />

                    {/* Floating Shopping Bags */}
                    <ShoppingBag position={[3.5, 1, 0]} rotation={[0, -0.3, 0.1]} color="#95BF47" /> {/* Shopify Green */}
                    <ShoppingBag position={[-3.5, -1, -1]} rotation={[0, 0.3, -0.1]} color="#7C3AED" /> {/* Brand Purple */}

                    {/* Distant muted bags for depth */}
                    <ShoppingBag position={[5, -3, -4]} rotation={[0.2, 0, 0]} color="#3B82F6" scale={0.7} />
                    <ShoppingBag position={[-5, 3, -5]} rotation={[-0.2, 0, 0]} color="#2DD4BF" scale={0.7} />

                </Suspense>
            </Canvas>
        </div>
    );
}
