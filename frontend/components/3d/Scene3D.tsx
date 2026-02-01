"use client";

import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense } from 'react';

function FloatingShape({ position, color, ...props }: any) {
    return (
        <Float
            speed={2} // Animation speed
            rotationIntensity={1.5} // XYZ rotation intensity
            floatIntensity={2} // Up/down float intensity
        >
            <mesh position={position} {...props}>
                <dodecahedronGeometry args={[1, 0]} /> {/* Clean geometric shape */}
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.5}
                    color={color}
                    resolution={512}
                />
            </mesh>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <Environment preset="city" />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />

                    {/* Floating Shapes */}
                    <FloatingShape position={[-6, 2, -2]} scale={1.5} color="#7C3AED" /> {/* Brand Primary */}
                    <FloatingShape position={[6, -2, -4]} scale={2} color="#3B82F6" /> {/* Brand Secondary */}
                    <FloatingShape position={[0, 4, -8]} scale={1} color="#2DD4BF" /> {/* Brand Accent */}
                    <FloatingShape position={[-8, -4, -6]} scale={1.2} color="#EC4899" /> {/* Pink/Rose */}

                </Suspense>
            </Canvas>
            {/* Gradient Overlay to blend with site - Dark Mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050A]" />
        </div>
    );
}
