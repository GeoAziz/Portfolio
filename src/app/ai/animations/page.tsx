/**
 * Advanced Animations Showcase Page
 */

'use client';

import { SectionHeader } from '@/components/SectionHeader';
import { ScrollReveal } from '@/components/ScrollReveal';
import { PageTransition } from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { ParallaxLayer } from '@/components/ParallaxSection';

export default function AdvancedAnimationsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageTransition>
        {/* Hero Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionHeader title="Advanced Animations" />
          <p className="text-slate-400 text-center max-w-2xl mx-auto mt-4">
            Scroll-triggered reveals, parallax effects, and micro-interactions powered by Framer Motion
          </p>
        </section>

        {/* Scroll Reveal Examples */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <ScrollReveal variant="slideInUp">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 mb-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📱 Scroll Reveal Animation</h3>
              <p className="text-slate-300">
                This section animates in when you scroll to it. Try scrolling down to see different animation variants.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Slide Up */}
            <ScrollReveal variant="slideInUp" delay={0}>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Slide In Up</h4>
                <p className="text-sm text-slate-400">Smooth vertical slide animation</p>
              </div>
            </ScrollReveal>

            {/* Fade In */}
            <ScrollReveal variant="fadeIn" delay={0.1}>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Fade In</h4>
                <p className="text-sm text-slate-400">Simple opacity reveal</p>
              </div>
            </ScrollReveal>

            {/* Slide In Left */}
            <ScrollReveal variant="slideInLeft" delay={0.2}>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Slide In Left</h4>
                <p className="text-sm text-slate-400">Horizontal slide from left</p>
              </div>
            </ScrollReveal>

            {/* Slide In Right */}
            <ScrollReveal variant="slideInRight" delay={0.3}>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Slide In Right</h4>
                <p className="text-sm text-slate-400">Horizontal slide from right</p>
              </div>
            </ScrollReveal>

            {/* Scale In */}
            <ScrollReveal variant="scaleIn" delay={0.4}>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Scale In</h4>
                <p className="text-sm text-slate-400">Zoom animation from small to full size</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Micro-interactions */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <ScrollReveal variant="slideInUp">
            <h2 className="text-2xl font-bold text-white mb-8">Micro-interactions</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button Hover */}
            <ScrollReveal variant="slideInUp">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-4">Button Tap</h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded font-medium"
                >
                  Click Me
                </motion.button>
                <p className="text-xs text-slate-400 mt-4">
                  Hover to scale up, click to scale down
                </p>
              </div>
            </ScrollReveal>

            {/* Icon Hover */}
            <ScrollReveal variant="slideInUp">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-4">Icon Hover</h4>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-4xl cursor-pointer inline-block"
                >
                  ✨
                </motion.div>
                <p className="text-xs text-slate-400 mt-4">
                  Hover to scale and rotate
                </p>
              </div>
            </ScrollReveal>

            {/* Card Hover */}
            <ScrollReveal variant="slideInUp">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-4">Card Hover</h4>
                <motion.div
                  whileHover={{
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0, 255, 255, 0.2)',
                  }}
                  className="bg-slate-800 p-4 rounded cursor-pointer border border-slate-700"
                >
                  <p className="text-sm text-white">Hover for elevation</p>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Link Hover */}
            <ScrollReveal variant="slideInUp">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-4">Link Hover</h4>
                <motion.a
                  href="#"
                  whileHover={{ x: 5, color: '#00ffff' }}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Hover for slide and color change →
                </motion.a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Animation Features */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <ScrollReveal variant="slideInUp">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">🎬 Animation Features</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Scroll-triggered reveals (play when in viewport)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>5 reveal variants (slideUp, fadeIn, slideLeft, slideRight, scaleIn)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Parallax scroll effects (depth-based layering)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Micro-interactions (tap, hover, gesture animations)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Stagger delays for sequential reveals</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Mouse parallax on hover (3D tilt effect)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Scroll progress tracking</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Performance optimized (60fps target)</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Integration Guide */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <ScrollReveal variant="slideInUp">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">📝 Usage Examples</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-white mb-2">Scroll Reveal Component:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
{`import { ScrollReveal } from '@/components/ScrollReveal';

<ScrollReveal variant="slideInUp">
  <div>Content reveals on scroll</div>
</ScrollReveal>`}
                  </pre>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">Parallax Layer:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
{`import { ParallaxLayer } from '@/components/ParallaxSection';

<ParallaxLayer offset={50}>
  <img src="bg.png" />
</ParallaxLayer>`}
                  </pre>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">Scroll Animation Hook:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
{`import { useParallax } from '@/hooks/use-scroll-animations';

const y = useParallax(50);
<motion.div style={{ y }} />`}
                  </pre>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Performance Notes */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-12">
          <ScrollReveal variant="slideInUp">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-amber-400 mb-4">⚡ Performance Optimization</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Uses Framer Motion's optimized rendering pipeline</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>GPU-accelerated transforms (translate, scale, rotate)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Scroll events throttled and debounced</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>InView hook uses Intersection Observer API</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Animations only run when element is visible</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </section>
      </PageTransition>
    </div>
  );
}
