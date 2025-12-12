/**
 * Metrics Utilities
 * 
 * Helper functions for telemetry data processing and real-time updates
 */

export interface MetricPoint {
  timestamp: number;
  [key: string]: number;
}

export interface SystemMetrics {
  id: string;
  name: string;
  category: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  current: Record<string, number>;
  history: MetricPoint[];
}

/**
 * Simulate real-time metric updates with slight variations
 */
export function generateMetricVariation(baseValue: number, variance: number = 5): number {
  const change = (Math.random() - 0.5) * variance;
  const newValue = baseValue + change;
  return Math.max(0, Math.min(100, newValue));
}

/**
 * Format metric value with appropriate units
 */
export function formatMetricValue(value: number, metricName: string): string {
  const metricLower = metricName.toLowerCase();

  if (metricLower.includes('memory') || metricLower.includes('mbps')) {
    return `${value.toFixed(1)} GB`;
  }
  if (metricLower.includes('temp')) {
    return `${value.toFixed(0)}°C`;
  }
  if (metricLower.includes('power') || metricLower.includes('draw')) {
    return `${value.toFixed(0)} W`;
  }
  if (metricLower.includes('bandwidth')) {
    return `${value.toFixed(1)} Gbps`;
  }
  if (metricLower.includes('throughput')) {
    return `${value.toFixed(0)} MB/s`;
  }
  if (metricLower.includes('latency')) {
    return `${value.toFixed(1)} ms`;
  }
  if (metricLower.includes('requests') || metricLower.includes('jobs')) {
    return `${value.toFixed(0)}`;
  }
  if (metricLower.includes('error') || metricLower.includes('utilization')) {
    return `${value.toFixed(1)}%`;
  }

  return `${value.toFixed(2)}`;
}

/**
 * Determine metric status color based on value and metric type
 */
export function getMetricStatus(
  value: number,
  metricName: string
): 'healthy' | 'warning' | 'critical' {
  const metricLower = metricName.toLowerCase();

  // Temperature thresholds
  if (metricLower.includes('temp')) {
    if (value > 85) return 'critical';
    if (value > 75) return 'warning';
    return 'healthy';
  }

  // Utilization thresholds
  if (
    metricLower.includes('utilization') ||
    metricLower.includes('memory') ||
    metricLower.includes('disk')
  ) {
    if (value > 90) return 'critical';
    if (value > 75) return 'warning';
    return 'healthy';
  }

  // Error rate thresholds
  if (metricLower.includes('error')) {
    if (value > 5) return 'critical';
    if (value > 2) return 'warning';
    return 'healthy';
  }

  return 'healthy';
}

/**
 * Calculate moving average for smoothed data
 */
export function calculateMovingAverage(data: number[], windowSize: number = 3): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
    result.push(avg);
  }

  return result;
}

/**
 * Calculate statistics for a metric
 */
export function calculateMetricStats(values: number[]) {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, current: 0 };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    current: values[values.length - 1],
  };
}

/**
 * Get color for status indicator
 */
export function getStatusColor(status: 'healthy' | 'warning' | 'critical'): string {
  switch (status) {
    case 'healthy':
      return 'from-emerald-500 to-teal-500';
    case 'warning':
      return 'from-amber-500 to-orange-500';
    case 'critical':
      return 'from-red-500 to-rose-500';
    default:
      return 'from-slate-500 to-slate-600';
  }
}

/**
 * Format uptime string
 */
export function formatUptime(uptimeStr: string): string {
  return uptimeStr;
}

/**
 * Create timestamp label for charts
 */
export function getTimestampLabel(index: number): string {
  const now = new Date();
  const minutes = now.getMinutes() - (5 - index);
  const date = new Date(now.getTime() - (5 - index) * 60000);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
