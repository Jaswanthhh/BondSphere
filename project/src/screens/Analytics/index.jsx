import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Globe, Activity } from 'lucide-react';
import api from '../../services/api';

export const Analytics = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics');
        setStats(res.data.stats || []);
        setRecentActivity(res.data.recentActivity || []);
      } catch (err) {
        setError('Failed to load analytics');
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon === 'Users' ? Users : stat.icon === 'Activity' ? Activity : stat.icon === 'Globe' ? Globe : BarChart3;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6 text-blue-500" />
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 h-64">
          <h2 className="text-lg font-semibold mb-4">Connection Growth</h2>
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 h-64">
          <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 