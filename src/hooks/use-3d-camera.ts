/**
 * useThreeDCamera Hook
 * 
 * Custom hook for camera controls in Three.js scenes
 * Handles mouse/touch interactions, orbit controls, and animation
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControlsState {
  isRotating: boolean;
  isDragging: boolean;
  rotationX: number;
  rotationY: number;
}

export function useThreeDCamera(
  cameraRef: React.RefObject<THREE.Camera>,
  targetPosition: [number, number, number] = [0, 0, 0],
  autoRotate: boolean = true,
  autoRotateSpeed: number = 1
) {
  const controlsRef = useRef<CameraControlsState>({
    isRotating: false,
    isDragging: false,
    rotationX: 0,
    rotationY: 0,
  });

  const [touchStartDistance, setTouchStartDistance] = useState(0);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Mouse down - start rotation
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'touch') {
      const touchEvent = e as unknown as TouchEvent;
      if (touchEvent.touches && touchEvent.touches.length > 1) {
        setTouchStartDistance(getTouchDistance(touchEvent.touches));
      }
    }
    controlsRef.current.isDragging = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  }, [getTouchDistance]);

  // Mouse move - rotate camera
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!controlsRef.current.isDragging) return;

    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;

    // Update rotation speeds based on movement
    controlsRef.current.rotationY += deltaX * 0.01;
    controlsRef.current.rotationX += deltaY * 0.01;

    // Clamp vertical rotation
    controlsRef.current.rotationX = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, controlsRef.current.rotationX)
    );

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Mouse up - stop rotation
  const handlePointerUp = useCallback(() => {
    controlsRef.current.isDragging = false;
  }, []);

  // Touch zoom
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistance > 0 && cameraRef.current) {
        const currentDistance = getTouchDistance(e.touches);
        const zoomDelta = (currentDistance - touchStartDistance) * 0.01;

        // Apply zoom to camera
        if (cameraRef.current instanceof THREE.PerspectiveCamera) {
          cameraRef.current.fov = Math.max(20, Math.min(120, cameraRef.current.fov - zoomDelta));
          cameraRef.current.updateProjectionMatrix();
        }

        setTouchStartDistance(currentDistance);
      }
    },
    [touchStartDistance, getTouchDistance, cameraRef]
  );

  // Attach event listeners
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handleTouchMove]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 0.05;
      switch (e.key) {
        case 'ArrowUp':
          controlsRef.current.rotationX -= speed;
          break;
        case 'ArrowDown':
          controlsRef.current.rotationX += speed;
          break;
        case 'ArrowLeft':
          controlsRef.current.rotationY -= speed;
          break;
        case 'ArrowRight':
          controlsRef.current.rotationY += speed;
          break;
        case 'r':
        case 'R':
          // Reset rotation
          controlsRef.current.rotationX = 0;
          controlsRef.current.rotationY = 0;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update camera position and apply rotation
  useFrame(() => {
    if (!cameraRef.current) return;

    const [targetX, targetY, targetZ] = targetPosition;
    const distance = 5; // Distance from target

    // Calculate new position based on rotation
    const x = Math.sin(controlsRef.current.rotationY) * Math.cos(controlsRef.current.rotationX) * distance;
    const y = Math.sin(controlsRef.current.rotationX) * distance;
    const z = Math.cos(controlsRef.current.rotationY) * Math.cos(controlsRef.current.rotationX) * distance;

    cameraRef.current.position.x = targetX + x;
    cameraRef.current.position.y = targetY + y + 1; // Offset upward slightly
    cameraRef.current.position.z = targetZ + z;
    cameraRef.current.lookAt(targetX, targetY, targetZ);

    // Auto-rotate when not dragging
    if (autoRotate && !controlsRef.current.isDragging) {
      controlsRef.current.rotationY += (autoRotateSpeed * 0.005);
    }
  });

  return {
    reset: () => {
      controlsRef.current.rotationX = 0;
      controlsRef.current.rotationY = 0;
    },
    state: controlsRef.current,
  };
}
