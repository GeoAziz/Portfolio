/**
 * 3D Models Demo/Showcase Page
 * 
 * Interactive page demonstrating the 3D model viewer component
 * with multiple models and controls
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { PageHeader, PageSection, SectionHeader, ContentGrid } from '@/components/layouts';
import { MotionFade } from '@/components/MotionFade';
import { models3D } from '@/lib/3d-models';
import { SkeletonGrid } from '@/components/SkeletonCard';

// Dynamically import 3D components to avoid SSR issues
const ModelViewer3D = dynamic(() => import('@/components/ModelViewer3D').then(m => ({ default: m.ModelViewer3D })), {
  loading: () => <SkeletonGrid count={1} columns={1} />,
  ssr: false,
});

const ModelViewerGrid = dynamic(() => import('@/components/ModelViewer3D').then(m => ({ default: m.ModelViewerGrid })), {
  loading: () => <SkeletonGrid count={3} columns={3} />,
  ssr: false,
});

export default function Models3DPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Header */}
      <PageHeader
        title="3D Model Viewer"
        subtitle="Interactive visualization of hardware systems and AI accelerators"
        description="Explore detailed 3D models of custom-built systems with real-time camera controls"
      />

      <PageSection>
        {/* Introduction */}
        <MotionFade delay={0.1}>
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-white/80 leading-relaxed">
              This page showcases interactive 3D models of various hardware systems and AI accelerators.
              Use your mouse to rotate, scroll to zoom, and touch controls on mobile devices.
            </p>
          </div>
        </MotionFade>

        {/* Main Gallery */}
        <SectionHeader title="Model Gallery" subtitle="Select a model to view details" />
        <MotionFade delay={0.2}>
          <ModelViewerGrid models={models3D} />
        </MotionFade>

        {/* Individual Models Section */}
        <div className="mt-16">
          <SectionHeader
            title="Featured Models"
            subtitle="Detailed views of each system"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {models3D.map((model, index) => (
              <MotionFade key={model.id} delay={0.1 + index * 0.05}>
                <div className="space-y-4">
                  <ModelViewer3D
                    model={model}
                    height="350px"
                    showInfo
                    showControls={false}
                  />

                  {/* Model Details */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h3 className="font-bold text-lg text-white mb-2">{model.name}</h3>
                    <p className="text-sm text-white/70 mb-4">{model.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                          Category
                        </div>
                        <div className="text-sm text-white/90 capitalize">{model.category}</div>
                      </div>

                      <div>
                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                          Tags
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {model.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <div className="text-xs text-white/50 uppercase tracking-wider mb-2">
                          Technical Specs
                        </div>
                        <ul className="space-y-1 text-xs text-white/70">
                          <li>Scale: {model.scale}x</li>
                          <li>Auto Rotate: {model.autoRotate ? 'Yes' : 'No'}</li>
                          <li>Rotation Speed: {model.autoRotateSpeed}</li>
                          <li>
                            Camera Position: ({model.cameraPosition[0]}, {model.cameraPosition[1]},
                            {model.cameraPosition[2]})
                          </li>
                          <li>Light Intensity: {model.ambientLightIntensity}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionFade>
            ))}
          </div>
        </div>

        {/* Controls Guide */}
        <div className="mt-16">
          <SectionHeader title="Controls Guide" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <MotionFade delay={0.2}>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">Mouse Controls</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">🖱️</span>
                    <span>
                      <strong>Click & Drag</strong>: Rotate the model
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">🔍</span>
                    <span>
                      <strong>Scroll Wheel</strong>: Zoom in/out
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">⌨️</span>
                    <span>
                      <strong>Arrow Keys</strong>: Fine-tune rotation
                    </span>
                  </li>
                </ul>
              </div>
            </MotionFade>

            <MotionFade delay={0.25}>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">Touch Controls</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-bold">📱</span>
                    <span>
                      <strong>Single Finger</strong>: Rotate model
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-bold">👆👆</span>
                    <span>
                      <strong>Two Fingers</strong>: Pinch to zoom
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-bold">🔄</span>
                    <span>
                      <strong>Auto Rotate</strong>: Models rotate automatically when idle
                    </span>
                  </li>
                </ul>
              </div>
            </MotionFade>
          </div>
        </div>

        {/* Implementation Details */}
        <div className="mt-16">
          <SectionHeader title="Technical Implementation" />
          <MotionFade delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-lg">📚</span>
                    Libraries Used
                  </h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>Three.js</li>
                    <li>React Three Fiber</li>
                    <li>Drei (R3F Utilities)</li>
                    <li>Framer Motion</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-lg">⚙️</span>
                    Features
                  </h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>Real-time rendering</li>
                    <li>Orbit controls</li>
                    <li>Touch support</li>
                    <li>Error boundaries</li>
                    <li>Loading states</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    Performance
                  </h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>60 FPS target</li>
                    <li>Lazy loading</li>
                    <li>GPU acceleration</li>
                    <li>Optimized geometry</li>
                    <li>Responsive design</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-white/70">
                  The 3D model viewer is built with a modular architecture:
                  <code className="block bg-black/30 rounded p-4 mt-4 text-xs font-mono text-blue-300">
                    ModelViewer3D.tsx (main component)
                    <br />
                    ├─ Canvas (Three.js renderer)
                    <br />
                    ├─ SceneContent (lighting, camera)
                    <br />
                    ├─ LoadedModel (glTF loader)
                    <br />
                    ├─ ProceduralModel (fallback geometry)
                    <br />
                    └─ Overlays (info, controls, status)
                    <br />
                    <br />
                    use-3d-camera.ts (camera controls)
                    <br />
                    3d-models.ts (model registry)
                  </code>
                </p>
              </div>
            </div>
          </MotionFade>
        </div>

        {/* Related Systems */}
        <div className="mt-16 mb-12">
          <SectionHeader
            title="Hardware Systems"
            subtitle="Complete 3D models available for all major systems"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {models3D.map((model, index) => (
              <MotionFade key={`summary-${model.id}`} delay={0.2 + index * 0.05}>
                <div className="group cursor-pointer">
                  <div className="relative h-32 bg-gradient-to-br from-white/5 to-white/0 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {model.category === 'hardware' ? '⚙️' : '🧠'}
                      </div>
                      <div className="text-xs text-white/60">{model.name}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all" />
                  </div>
                  <p className="text-xs text-white/50 mt-3 line-clamp-2">
                    {model.description}
                  </p>
                </div>
              </MotionFade>
            ))}
          </div>
        </div>
      </PageSection>
    </main>
  );
}
