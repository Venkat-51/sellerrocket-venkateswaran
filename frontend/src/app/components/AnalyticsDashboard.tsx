import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { adminAPI } from '../../services/adminApi';

interface Analytics {
  totalLeads: number;
  recentLeads: number;
  convertedLeads: number;
  conversionRate: string;
  leadsByStatus: Array<{ status: string; count: number }>;
  leadsByPlatform: Array<{ platform: string; count: number }>;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  if (!analytics) return null;

  const StatCard = ({ title, value, subtitle, bgColor }: any) => (
    <Card className={`p-6 ${bgColor}`}>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={analytics.totalLeads}
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatCard
          title="Recent Leads"
          value={analytics.recentLeads}
          subtitle="Last 7 days"
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <StatCard
          title="Converted"
          value={analytics.convertedLeads}
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatCard
          title="Conversion Rate"
          value={analytics.conversionRate}
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
          <div className="space-y-3">
            {analytics.leadsByStatus.map((item) => {
              const percentage = analytics.totalLeads > 0 
                ? Math.round((item.count / analytics.totalLeads) * 100) 
                : 0;
              
              const colors: Record<string, string> = {
                'New': 'bg-blue-500',
                'Contacted': 'bg-yellow-500',
                'Converted': 'bg-green-500',
                'Rejected': 'bg-red-500',
              };

              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[item.status]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Platform</h3>
          <div className="space-y-3">
            {analytics.leadsByPlatform.map((item) => {
              const percentage = analytics.totalLeads > 0 
                ? Math.round((item.count / analytics.totalLeads) * 100) 
                : 0;

              return (
                <div key={item.platform}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.platform}</span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
