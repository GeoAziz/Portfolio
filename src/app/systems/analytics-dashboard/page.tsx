'use client';

import { useMemo, useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { motion } from 'framer-motion';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  generateMockAnalyticsData,
  calculateUserJourneys,
  calculateCohorts,
  PerformanceMetrics,
} from '@/lib/advanced-analytics';
import { TrendingUp, Users, Activity, Target, Zap, Eye } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<7 | 14 | 30>(7);
  const [activeTab, setActiveTab] = useState<'overview' | 'journeys' | 'performance' | 'cohorts'>('overview');

  // Generate mock data
  const { sessions, events, pageMetrics } = useMemo(() => generateMockAnalyticsData(dateRange), [dateRange]);
  const journeys = useMemo(() => calculateUserJourneys(events, sessions), [events, sessions]);
  const cohorts = useMemo(() => calculateCohorts(sessions), [sessions]);

  // Calculate KPIs
  const totalSessions = sessions.length;
  const totalPageViews = events.filter((e) => e.type === 'pageview').length;
  const totalConversions = events.filter((e) => e.type === 'conversion').length;
  const avgSessionDuration = Math.round(
    sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length / 1000
  );
  const conversionRate = ((totalConversions / totalSessions) * 100).toFixed(2);
  const bounceRate = (
    (journeys.filter((j) => j.pages.length <= 1).length / journeys.length) *
    100
  ).toFixed(2);

  // Daily session trend data
  const dailySessions = Array.from({ length: dateRange }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sessions: Math.floor(Math.random() * 50) + 10,
    pageViews: Math.floor(Math.random() * 150) + 30,
    conversions: Math.floor(Math.random() * 10) + 1,
  })).reverse();

  // Device breakdown
  const deviceBreakdown = [
    { name: 'Desktop', value: Math.round(sessions.filter((s) => s.device.type === 'desktop').length * (100 / sessions.length)) },
    { name: 'Mobile', value: Math.round(sessions.filter((s) => s.device.type === 'mobile').length * (100 / sessions.length)) },
    { name: 'Tablet', value: Math.round(sessions.filter((s) => s.device.type === 'tablet').length * (100 / sessions.length)) },
  ];

  // Top pages
  const topPages = pageMetrics.sort((a, b) => b.views - a.views).slice(0, 5);

  // Browser breakdown
  const browsers = sessions.reduce(
    (acc, s) => {
      const browser = s.device.browser;
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const browserData = Object.entries(browsers).map(([name, value]) => ({
    name,
    value,
  }));

  // Performance metrics (mock)
  const performanceData = [
    { metric: 'LCP', value: 2.5, target: 2.5, good: '#06b6d4' },
    { metric: 'FID', value: 45, target: 100, good: '#06b6d4' },
    { metric: 'CLS', value: 0.08, target: 0.1, good: '#06b6d4' },
    { metric: 'TTFB', value: 600, target: 800, good: '#06b6d4' },
  ];

  // Top user journeys
  const topJourneys = journeys.slice(0, 5).map((j) => ({
    ...j,
    path: j.pages.join(' → '),
    duration: Math.round(j.totalDuration / 1000),
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen">
      <SectionHeader title="Advanced Analytics Dashboard" />

      <motion.div variants={item} className="max-w-7xl mx-auto mt-16 space-y-8">
        {/* Date Range Selector */}
        <motion.div variants={item} className="flex gap-4">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setDateRange(days as 7 | 14 | 30)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === days
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              Last {days} Days
            </button>
          ))}
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={item} className="grid md:grid-cols-5 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-cyan-500" />
              <p className="text-slate-400 text-sm">Page Views</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalPageViews}</p>
            <p className="text-xs text-slate-500 mt-1">+12% vs last period</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <p className="text-slate-400 text-sm">Sessions</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalSessions}</p>
            <p className="text-xs text-slate-500 mt-1">{avgSessionDuration}s avg</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <p className="text-slate-400 text-sm">Conversions</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalConversions}</p>
            <p className="text-xs text-cyan-400 mt-1">{conversionRate}% rate</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <p className="text-slate-400 text-sm">Bounce Rate</p>
            </div>
            <p className="text-2xl font-bold text-white">{bounceRate}%</p>
            <p className="text-xs text-slate-500 mt-1">Single-page sessions</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-slate-400 text-sm">Avg Duration</p>
            </div>
            <p className="text-2xl font-bold text-white">{avgSessionDuration}s</p>
            <p className="text-xs text-slate-500 mt-1">Time on site</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex gap-4 border-b border-slate-700 pb-4">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'journeys', label: 'User Journeys' },
              { id: 'performance', label: 'Performance' },
              { id: 'cohorts', label: 'Cohorts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-2 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div variants={item} className="space-y-6">
              {/* Daily Trend */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sessions & Conversions Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailySessions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Area type="monotone" dataKey="sessions" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="pageViews" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="conversions" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Device Breakdown */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Browser Distribution */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Browser Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={browserData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="value" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {topPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-mono text-sm">{page.page}</p>
                        <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                          <div
                            className="bg-cyan-500 h-1 rounded-full"
                            style={{ width: `${(page.views / topPages[0].views) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-cyan-400 font-semibold">{page.views}</p>
                        <p className="text-slate-500 text-xs">{page.uniqueVisitors} unique</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* User Journeys Tab */}
          {activeTab === 'journeys' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top User Journeys</h3>
                <div className="space-y-4">
                  {topJourneys.map((journey, i) => (
                    <div key={i} className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-slate-300 text-sm">{journey.path}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          journey.converted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {journey.converted ? '✓ Converted' : 'No conversion'}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-400">
                        <span>{journey.duration}s session</span>
                        <span>{journey.eventCount} events</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
                  <div className="space-y-2">
                    {[
                      { step: 'Landing', users: totalPageViews },
                      { step: 'Engagement', users: Math.round(totalPageViews * 0.72) },
                      { step: 'Signup', users: Math.round(totalPageViews * 0.45) },
                      { step: 'Conversion', users: totalConversions },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-full bg-slate-700 rounded-full h-6 flex items-center px-3">
                          <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center">
                            <span className="text-white text-xs font-semibold ml-2">{item.users}</span>
                          </div>
                        </div>
                        <span className="text-slate-400 text-sm w-24">{item.step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Journey Insights</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>✓ {((journeys.filter((j) => j.converted).length / journeys.length) * 100).toFixed(1)}% of journeys convert</li>
                    <li>✓ Avg {(journeys.reduce((s, j) => s + j.pages.length, 0) / journeys.length).toFixed(1)} pages per session</li>
                    <li>✓ {journeys.filter((j) => j.totalDuration > 5 * 60 * 1000).length} high-engagement sessions</li>
                    <li>✓ Most common entry: {journeys[0]?.startPage}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Core Web Vitals</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {performanceData.map((metric) => (
                    <div key={metric.metric} className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-2">{metric.metric}</p>
                      <p className="text-2xl font-bold text-cyan-400 mb-1">
                        {metric.value}
                        {metric.metric === 'CLS' ? '' : metric.metric === 'FID' || metric.metric === 'TTFB' ? 'ms' : 's'}
                      </p>
                      <p className="text-xs text-slate-500">Target: {metric.target}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySessions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" yAxisId="left" />
                    <YAxis stroke="#94a3b8" yAxisId="right" orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#06b6d4" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="pageViews" stroke="#3b82f6" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Cohorts Tab */}
          {activeTab === 'cohorts' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Cohort Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-4 text-slate-400 font-semibold">Cohort Date</th>
                        <th className="text-center py-2 px-4 text-slate-400 font-semibold">Size</th>
                        <th className="text-center py-2 px-4 text-slate-400 font-semibold">Week 1</th>
                        <th className="text-center py-2 px-4 text-slate-400 font-semibold">Week 2</th>
                        <th className="text-center py-2 px-4 text-slate-400 font-semibold">Week 3</th>
                        <th className="text-center py-2 px-4 text-slate-400 font-semibold">Activation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohorts.slice(0, 5).map((cohort) => (
                        <tr key={cohort.cohortDate} className="border-b border-slate-700 hover:bg-slate-800/50">
                          <td className="py-3 px-4 text-white">{cohort.cohortDate}</td>
                          <td className="py-3 px-4 text-center text-cyan-400">{cohort.cohortSize}</td>
                          <td className="py-3 px-4 text-center text-slate-300">
                            <span className="bg-slate-700 px-2 py-1 rounded text-xs">{cohort.retentionByWeek[0]}%</span>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-300">
                            <span className="bg-slate-700 px-2 py-1 rounded text-xs">{cohort.retentionByWeek[1]}%</span>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-300">
                            <span className="bg-slate-700 px-2 py-1 rounded text-xs">{cohort.retentionByWeek[2]}%</span>
                          </td>
                          <td className="py-3 px-4 text-center text-green-400 font-semibold">
                            {cohort.activationRate.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Features Summary */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Advanced Analytics Features</h3>

          <div className="grid md:grid-cols-3 gap-6 text-slate-300 text-sm">
            <div className="flex gap-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-semibold text-white">User Journey Tracking</p>
                <p>Multi-touch attribution and conversion path analysis</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🔥</span>
              <div>
                <p className="font-semibold text-white">Heatmap Data</p>
                <p>Click positions and scroll depth tracking</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📈</span>
              <div>
                <p className="font-semibold text-white">Cohort Analysis</p>
                <p>Retention and engagement by user cohorts</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-semibold text-white">Performance Metrics</p>
                <p>Core Web Vitals and custom performance tracking</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🔗</span>
              <div>
                <p className="font-semibold text-white">Conversion Funnels</p>
                <p>Multi-step funnel visualization and drop-off analysis</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-semibold text-white">Real-time Dashboard</p>
                <p>Live KPIs and immediate event tracking</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
