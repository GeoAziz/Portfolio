/**
 * 3D Models Registry & Configuration
 * 
 * Central registry for all 3D models used across the portfolio.
 * Each model includes metadata, transformations, and animation configs.
 */

export interface Model3DConfig {
  id: string;
  name: string;
  category: 'hardware' | 'systems' | 'ai' | 'research';
  description: string;
  modelPath: string; // URL to .glb, .gltf, or .obj file
  scale: number;
  rotation: [number, number, number];
  position: [number, number, number];
  autoRotate: boolean;
  autoRotateSpeed: number;
  cameraPosition: [number, number, number];
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  tags: string[];
  color?: string; // Accent color for the model
}

/**
 * Available 3D Models
 * 
 * Models can be:
 * - Generated procedurally (using Three.js geometry)
 * - Loaded from external files (glTF/glb format)
 * - Imported from model libraries
 */
export const models3D: Model3DConfig[] = [
  {
    id: 'quantum-core',
    name: 'Quantum Core',
    category: 'systems',
    description: 'FPGA-based quantum acceleration system for real-time inference',
    modelPath: '/models/quantum-core.glb',
    scale: 1.2,
    rotation: [0.2, 0.5, 0],
    position: [0, 0, 0],
    autoRotate: true,
    autoRotateSpeed: 2,
    cameraPosition: [4, 3, 4],
    ambientLightIntensity: 0.6,
    directionalLightIntensity: 1.2,
    tags: ['hardware', 'fpga', 'acceleration', 'systems'],
    color: '#00E5FF', // Cyan
  },
  {
    id: 'neural-processor',
    name: 'Neural Processor',
    category: 'ai',
    description: 'Specialized neural network accelerator for ML inference',
    modelPath: '/models/neural-processor.glb',
    scale: 1.0,
    rotation: [0.3, 0.8, 0.1],
    position: [0, 0, 0],
    autoRotate: true,
    autoRotateSpeed: 1.5,
    cameraPosition: [5, 3, 5],
    ambientLightIntensity: 0.7,
    directionalLightIntensity: 1.0,
    tags: ['ai', 'neural', 'processor', 'acceleration'],
    color: '#BB86FC', // Purple
  },
  {
    id: 'iot-hub',
    name: 'IoT Hub',
    category: 'hardware',
    description: 'Central hub for IoT device communication and data processing',
    modelPath: '/models/iot-hub.glb',
    scale: 1.5,
    rotation: [0.1, 0.3, 0],
    position: [0, 0, 0],
    autoRotate: true,
    autoRotateSpeed: 1,
    cameraPosition: [4, 4, 4],
    ambientLightIntensity: 0.5,
    directionalLightIntensity: 1.3,
    tags: ['hardware', 'iot', 'sensors', 'connectivity'],
    color: '#FF6B35', // Orange
  },
];

/**
 * Get model configuration by ID
 */
export function getModel(id: string): Model3DConfig | undefined {
  return models3D.find(model => model.id === id);
}

/**
 * Get models by category
 */
export function getModelsByCategory(category: string): Model3DConfig[] {
  return models3D.filter(model => model.category === category);
}

/**
 * Get models by tag
 */
export function getModelsByTag(tag: string): Model3DConfig[] {
  return models3D.filter(model => model.tags.includes(tag));
}

/**
 * Procedural Model Factory
 * 
 * Functions to generate simple 3D models procedurally
 * without needing external model files
 */

import * as THREE from 'three';

/**
 * Create a procedural cube with emissive material
 */
export function createProceduralCube(
  size: number = 1,
  color: string = '#00E5FF'
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3,
    specular: new THREE.Color(0x111111),
    shininess: 10,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a procedural rotating sphere
 */
export function createProceduralSphere(
  radius: number = 1,
  color: string = '#BB86FC'
): THREE.Mesh {
  const geometry = new THREE.IcosahedronGeometry(radius, 4);
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.2,
    wireframe: false,
    flatShading: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a procedural pyramid
 */
export function createProceduralPyramid(
  size: number = 1,
  color: string = '#FF6B35'
): THREE.Mesh {
  const geometry = new THREE.TetrahedronGeometry(size);
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.25,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a glowing torus (tech ring)
 */
export function createProceduralTorus(
  majorRadius: number = 1,
  minorRadius: number = 0.3,
  color: string = '#00E5FF'
): THREE.Mesh {
  const geometry = new THREE.TorusGeometry(majorRadius, minorRadius, 16, 100);
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a particle field (for abstract visualization)
 */
export function createParticleField(
  count: number = 100,
  range: number = 5,
  color: string = '#00E5FF'
): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * range;
    positions[i + 1] = (Math.random() - 0.5) * range;
    positions[i + 2] = (Math.random() - 0.5) * range;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size: 0.1,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}
