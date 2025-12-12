/**
 * ModelViewer3D Component
 * 
 * Interactive 3D model viewer with camera controls
 * Uses Three.js via React Three Fiber for rendering
 * Supports mouse/touch controls and auto-rotation
 */

'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls as DriOrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { MotionFade } from './MotionFade';
import { LoadingState } from './LoadingState';
import { ErrorBoundary } from './ErrorBoundary';
import { colors } from '@/lib/design-system';
import { useThreeDCamera } from '@/hooks/use-3d-camera';
import {
  createProceduralCube,
  createProceduralSphere,
  createProceduralTorus,
  Model3DConfig,
} from '@/lib/3d-models';

interface ModelViewerProps {
  model: Model3DConfig;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  showControls?: boolean;
  showInfo?: boolean;
  height?: string;
  className?: string;
}

/**
 * Procedural Model Renderer
 * Renders procedurally generated 3D geometry
 */
function ProceduralModel({ model }: { model: Model3DConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera>(null);

  useThreeDCamera(cameraRef, model.position, model.autoRotate, model.autoRotateSpeed);

  // Determine which procedural model to render based on ID
  const getMesh = (): THREE.Mesh | THREE.Object3D => {
    switch (model.id) {
      case 'quantum-core':
        return createProceduralCube(1, model.color || '#00E5FF');
      case 'neural-processor':
        return createProceduralSphere(1, model.color || '#BB86FC');
      case 'iot-hub':
        return createProceduralTorus(1, 0.3, model.color || '#FF6B35');
      default:
        return createProceduralCube(1, model.color || '#00E5FF');
    }
  };

  useFrame(() => {
    if (groupRef.current) {
      if (model.autoRotate) {
        groupRef.current.rotation.x += 0.001 * model.autoRotateSpeed;
        groupRef.current.rotation.y += 0.002 * model.autoRotateSpeed;
      }
    }
  });

  return (
    <group ref={groupRef} position={model.position} scale={model.scale}>
      <primitive object={getMesh()} />
    </group>
  );
}

/**
 * Loaded 3D Model Component
 */
function LoadedModel({ model, onLoad }: { model: Model3DConfig; onLoad?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera>(null);

  useThreeDCamera(cameraRef, model.position, model.autoRotate, model.autoRotateSpeed);

  try {
    // Try to load external glTF model
    const gltf = useGLTF(model.modelPath);

    React.useEffect(() => {
      onLoad?.();
    }, [onLoad]);

    return (
      <group ref={groupRef} position={model.position} scale={model.scale} rotation={model.rotation}>
        <primitive object={gltf.scene} />
      </group>
    );
  } catch {
    // Fallback to procedural model if file doesn't exist
    return <ProceduralModel model={model} />;
  }
}

/**
 * Scene Setup Component
 */
function SceneContent({ model, onLoad }: { model: Model3DConfig; onLoad?: () => void }) {
  const cameraRef = useRef<THREE.Camera>(null);

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={model.cameraPosition} fov={75} />
      <DriOrbitControls
        autoRotate={model.autoRotate}
        autoRotateSpeed={model.autoRotateSpeed}
        maxDistance={10}
        minDistance={2}
        enableZoom={true}
      />

      {/* Lighting */}
      <ambientLight intensity={model.ambientLightIntensity} color={0xffffff} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={model.directionalLightIntensity}
        color={0xffffff}
        castShadow
      />

      {/* Model */}
      <Suspense fallback={null}>
        <LoadedModel model={model} onLoad={onLoad} />
      </Suspense>

      {/* Background gradient */}
      <color attach="background" args={[colors.neutral['900']]} />
    </>
  );
}

/**
 * Control Info Overlay
 */
function ControlsInfo() {
  return (
    <div className="absolute bottom-4 left-4 text-xs text-white/60 bg-black/30 rounded p-2 backdrop-blur-sm">
      <div className="space-y-1 font-mono">
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>📱 Touch to control</div>
        <div className="text-xs text-white/40 mt-1">Arrow keys: rotate</div>
        <div className="text-xs text-white/40">R: reset</div>
      </div>
    </div>
  );
}

/**
 * Model Info Overlay
 */
function ModelInfo({ model }: { model: Model3DConfig }) {
  return (
    <MotionFade delay={0.2}>
      <div className="absolute top-4 left-4 text-sm text-white">
        <h3 className="font-bold text-base mb-1">{model.name}</h3>
        <p className="text-white/70 text-xs max-w-xs">{model.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {model.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 bg-white/10 rounded text-xs text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}

/**
 * Main ModelViewer3D Component
 */
export function ModelViewer3D({
  model,
  onLoad,
  onError,
  showControls = true,
  showInfo = true,
  height = '400px',
  className = '',
}: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (err: Error) => {
    setError(err);
    onError?.(err);
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div
          className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-red-900/20 to-red-950/20 border border-red-500/20 ${className}`}
          style={{ height }}
        >
          <div className="text-center">
            <div className="text-red-400 mb-2">Failed to load model</div>
            <div className="text-xs text-red-300/60">{error.message}</div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`relative rounded-lg overflow-hidden bg-black/30 border border-white/10 ${className}`} style={{ height }}>
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <LoadingState type="card" isLoading={true}>
              <div className="text-white text-sm">Loading 3D model...</div>
            </LoadingState>
          </div>
        )}

        {/* Canvas */}
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: model.cameraPosition,
            fov: 75,
          }}
          onCreated={() => handleLoad()}
        >
          <SceneContent model={model} onLoad={handleLoad} />
        </Canvas>

        {/* Overlays */}
        {!isLoading && showInfo && <ModelInfo model={model} />}
        {!isLoading && showControls && <ControlsInfo />}

        {/* Status Badge */}
        {!isLoading && (
          <MotionFade delay={0.1}>
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full text-xs text-green-400 border border-green-500/20 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Interactive
            </div>
          </MotionFade>
        )}
      </div>
    </ErrorBoundary>
  );
}

/**
 * Display Grid for Multiple Models
 */
export function ModelViewerGrid({ models }: { models: Model3DConfig[] }) {
  const [selectedId, setSelectedId] = useState(models[0]?.id);
  const selectedModel = models.find(m => m.id === selectedId);

  if (!selectedModel) {
    return (
      <div className="text-center text-white/60">
        No models available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Viewer */}
      <ModelViewer3D
        model={selectedModel}
        height="500px"
        showControls
        showInfo
        className="w-full"
      />

      {/* Model Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {models.map(model => (
          <button
            key={model.id}
            onClick={() => setSelectedId(model.id)}
            className={`p-4 rounded-lg border transition-all text-left ${
              selectedId === model.id
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-black/20 border-white/10 text-white/70 hover:border-white/20'
            }`}
          >
            <div className="font-semibold text-sm">{model.name}</div>
            <div className="text-xs text-white/50 mt-1">{model.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Standalone 3D Viewer Hook
 */
export function useModelViewer(modelId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  return {
    isLoading,
    error,
    setIsLoading,
    setError,
  };
}
