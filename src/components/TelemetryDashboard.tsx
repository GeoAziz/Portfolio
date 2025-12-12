/**
 * Telemetry Dashboard Component
 * 
 * Real-time visualization of system metrics using Recharts
 * Displays GPU, CPU, temperature, power consumption with live updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  SystemMetrics,
  getMetricStatus,
  formatMetricValue,
  getStatusColor,
  calculateMetricStats,
  getTimestampLabel,
} from '@/lib/metrics';

interface TelemetryDashboardProps {
  systems: SystemMetrics[];
  onMetricClick?: (systemId: string, metricName: string) => void;
}

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ReactNode;
}

/**
 * Metric Card Component - Individual metric display
 */
function MetricCard({ label, value, unit, status, icon }: MetricCardProps) {
  const statusGradient = getStatusColor(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-lg bg-slate-900/50 border border-slate-700/50 p-4 hover:border-slate-600 transition-colors"
    >
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusGradient}`} />

      <div className="flex items-start justify-between mb-3">
        <div className="text-slate-400 text-sm font-medium">{label}</div>
        <div className="text-lg">{icon}</div>
      </div>

      <div className="flex items-baseline gap-1">
        <div className="text-2xl font-bold text-white">{value.toFixed(1)}</div>
        <div className="text-sm text-slate-400">{unit}</div>
      </div>

      {/* Status badge */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'healthy'
              ? 'bg-emerald-500'
              : status === 'warning'
                ? 'bg-amber-500'
                : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-slate-400 uppercase">{status}</span>
      </div>
    </motion.div>
  );
}

/**
 * System Overview Card - Summary of a single system
 */
interface SystemCardProps {
  system: SystemMetrics;
  onExpand?: () => void;
}

function SystemCard({ system, onExpand }: SystemCardProps) {
  const statusGradient = getStatusColor(system.status);
  const keyMetrics = Object.entries(system.current).slice(0, 4);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 p-6 hover:border-slate-600 transition-colors cursor-pointer"
      onClick={onExpand}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{system.name}</h3>
        <p className="text-sm text-slate-400 mb-3">{system.category}</p>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              system.status === 'healthy'
                ? 'bg-emerald-500'
                : system.status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            }`}
          />
          <span className="text-xs font-medium text-slate-300">
            {system.status.toUpperCase()} • Uptime: {system.uptime}
          </span>
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {keyMetrics.map(([key, value]) => (
          <div key={key} className="bg-slate-800/30 rounded p-3">
            <div className="text-xs text-slate-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            <div className="text-lg font-semibold text-white">
              {formatMetricValue(value, key)}
            </div>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="mt-4 text-xs text-slate-400">Click to view details →</div>
    </motion.div>
  );
}

/**
 * Metrics Chart Component - Line/Area chart for time series data
 */
interface MetricsChartProps {
  data: any[];
  title: string;
  metrics: string[];
  type?: 'line' | 'area' | 'composed';
}

function MetricsChart({
  data,
  title,
  metrics,
  type = 'line',
}: MetricsChartProps) {
  const colors = [
    '#06B6D4', // cyan
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F59E0B', // amber
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg bg-slate-900/50 border border-slate-700/50 p-6"
    >
      <h3 className="text-base font-semibold text-white mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="timestamp"
              stroke="#64748B"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend />
            {metrics.map((metric, idx) => (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.1}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="timestamp"
              stroke="#64748B"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend />
            {metrics.map((metric, idx) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[idx % colors.length]}
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}

/**
 * Main Telemetry Dashboard Component
 */
export function TelemetryDashboard({ systems, onMetricClick }: TelemetryDashboardProps) {
  const [selectedSystem, setSelectedSystem] = useState<SystemMetrics | null>(systems[0] || null);
  const [liveMetrics, setLiveMetrics] = useState<Record<string, number>>({});

  // Simulate real-time metric updates
  useEffect(() => {
    if (!selectedSystem) return;

    const interval = setInterval(() => {
      setLiveMetrics((prev) => {
        const newMetrics = { ...prev };
        const keysToUpdate = Object.keys(selectedSystem.current).slice(0, 3);

        keysToUpdate.forEach((key) => {
          const current = selectedSystem.current[key];
          const variance = Math.random() * 10 - 5;
          newMetrics[key] = Math.max(0, Math.min(100, current + variance));
        });

        return newMetrics;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [selectedSystem]);

  if (!selectedSystem) {
    return (
      <div className="text-center text-slate-400 py-12">
        No system data available
      </div>
    );
  }

  // Get chart data from history with timestamps
  const chartData = selectedSystem.history.map((point, idx) => ({
    ...point,
    timestamp: getTimestampLabel(idx),
  }));

  // Get available metrics for the selected system
  const metricKeys = Object.keys(selectedSystem.current).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* System Selector - Grid of systems */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              onExpand={() => setSelectedSystem(system)}
            />
          ))}
        </div>
      </div>

      {/* Selected System Detailed View */}
      <motion.div
        key={selectedSystem.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          {selectedSystem.name} - Detailed Metrics
        </h2>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {metricKeys.map((key) => {
            const value = liveMetrics[key] !== undefined ? liveMetrics[key] : selectedSystem.current[key];
            const status = getMetricStatus(value, key);

            return (
              <MetricCard
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').trim()}
                value={value}
                unit={formatMetricValue(value, key).split(' ')[1] || ''}
                status={status}
                icon={getMetricIcon(key)}
              />
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsChart
            data={chartData}
            title="Metric Trends"
            metrics={metricKeys}
            type="line"
          />
          <MetricsChart
            data={chartData}
            title="Usage Distribution"
            metrics={metricKeys.slice(0, 2)}
            type="area"
          />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Helper function to get icon for metric
 */
function getMetricIcon(metricName: string): React.ReactNode {
  const lower = metricName.toLowerCase();

  if (lower.includes('gpu')) return '🎮';
  if (lower.includes('cpu')) return '⚙️';
  if (lower.includes('memory')) return '💾';
  if (lower.includes('temp')) return '🌡️';
  if (lower.includes('power')) return '⚡';
  if (lower.includes('bandwidth')) return '📡';
  if (lower.includes('disk')) return '💿';
  if (lower.includes('request')) return '📊';
  if (lower.includes('latency')) return '⏱️';
  if (lower.includes('error')) return '⚠️';
  if (lower.includes('job')) return '🔄';

  return '📈';
}

export { MetricCard, SystemCard, MetricsChart };
