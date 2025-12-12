/**
 * Telemetry Dashboard Page
 * 
 * Real-time monitoring of system metrics and performance
 */

import React from 'react';
import { Metadata } from 'next';
import { PageHeader, PageSection } from '@/components/layouts';
import { SectionHeader } from '@/components/SectionHeader';
import { MotionFade } from '@/components/MotionFade';
import { TelemetryDashboard } from '@/components/TelemetryDashboard';
import systemMetricsData from '@/data/system-metrics.json';

export const metadata: Metadata = {
  title: 'Telemetry Dashboard',
  description: 'Real-time monitoring of hardware systems and AI infrastructure',
  openGraph: {
    title: 'Telemetry Dashboard',
    description: 'Real-time monitoring of hardware systems and AI infrastructure',
  },
};

export default function TelemetryPage() {
  // Type the metrics data properly - filter out undefined values from optional fields
  const systems = systemMetricsData.systems.map(sys => {
    const current = Object.fromEntries(
      Object.entries(sys.metrics.current).filter(([_, v]) => v !== undefined)
    ) as Record<string, number>;

    return {
      id: sys.id,
      name: sys.name,
      category: sys.category,
      status: sys.status as 'healthy' | 'warning' | 'critical',
      uptime: sys.uptime,
      current,
      history: sys.metrics.history,
    };
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Header */}
      <PageHeader
        title="Telemetry Dashboard"
        subtitle="Real-time System Monitoring"
        description="Live monitoring of GPU, CPU, memory, and network metrics across infrastructure"
      />

      <PageSection>
        {/* Introduction */}
        <MotionFade delay={0.1}>
          <div className="mb-12">
            <SectionHeader title="System Metrics" />
            <p className="text-slate-400 leading-relaxed max-w-2xl mt-3">
              Real-time performance monitoring of hardware systems. This interactive dashboard
              provides live telemetry data from multiple systems including GPU training rigs,
              inference servers, and data pipelines.
            </p>
          </div>
        </MotionFade>

        {/* Dashboard */}
        <MotionFade delay={0.2}>
          <TelemetryDashboard systems={systems} />
        </MotionFade>

        {/* Legend and Info */}
        <MotionFade delay={0.3} className="mt-12 pt-8 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Healthy
              </h3>
              <p className="text-sm text-slate-400">
                System operating within normal parameters. All metrics within expected ranges.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Warning
              </h3>
              <p className="text-sm text-slate-400">
                System approaching threshold. One or more metrics are elevated. Monitor closely.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Critical
              </h3>
              <p className="text-sm text-slate-400">
                System exceeded threshold. Immediate attention required. Action may be needed.
              </p>
            </div>
          </div>
        </MotionFade>

        {/* Metrics Explanation */}
        <MotionFade delay={0.4} className="mt-12 pt-8 border-t border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-6">Understanding Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">🎮 GPU Utilization</h4>
                <p className="text-sm text-slate-400">
                  Percentage of GPU processing power in use. Higher values indicate more intensive workloads.
                  Healthy threshold: 0-80%
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">⚙️ CPU Utilization</h4>
                <p className="text-sm text-slate-400">
                  Percentage of CPU processing power in use. Varies by workload type.
                  Healthy threshold: 0-75%
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">💾 Memory Usage</h4>
                <p className="text-sm text-slate-400">
                  Amount of system memory in use. Critical for model training and inference.
                  Healthy threshold: 0-80%
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">🌡️ System Temperature</h4>
                <p className="text-sm text-slate-400">
                  Internal system temperature in Celsius. Higher values indicate more work.
                  Healthy threshold: 20-75°C
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">⚡ Power Draw</h4>
                <p className="text-sm text-slate-400">
                  Electrical power consumption in watts. Correlates with computational intensity.
                  Typical range: 0-1500W
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">📊 Request Latency</h4>
                <p className="text-sm text-slate-400">
                  Response time for inference requests in milliseconds. Lower is better.
                  Target: &lt;100ms
                </p>
              </div>
            </div>
          </div>
        </MotionFade>
      </PageSection>
    </main>
  );
}
