'use client';

import React from 'react';
import { Card } from '../ui';

export interface AnalyticsData {
  totalContracts: number;
  avgRiskScore: number;
  upcomingRenewals: number;
  potentialSavings: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  contractTypes: Array<{
    type: string;
    count: number;
    avgValue: number;
  }>;
  monthlySpend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface AnalyticsCardsProps {
  data: AnalyticsData;
  className?: string;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  data,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Key Metrics Row - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Total Contracts"
          value={data.totalContracts.toString()}
          icon="📋"
          trend={+5}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Avg Risk Score"
          value={data.avgRiskScore.toFixed(1)}
          icon="⚠️"
          trend={-0.3}
          trendLabel="lower risk"
          color={data.avgRiskScore > 7 ? 'red' : data.avgRiskScore > 4 ? 'yellow' : 'green'}
        />
        <MetricCard
          title="Renewals Due"
          value={data.upcomingRenewals.toString()}
          icon="📅"
          trend={+2}
          trendLabel="next 90 days"
          color={data.upcomingRenewals > 10 ? 'red' : 'default'}
        />
        <MetricCard
          title="Potential Savings"
          value={`$${(data.potentialSavings / 1000).toFixed(0)}K`}
          icon="💰"
          trend={+15}
          trendLabel="identified"
          color="green"
        />
      </div>

      {/* Risk Distribution */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Risk Distribution</h3>
        <RiskDistributionChart distribution={data.riskDistribution} />
      </Card>

      {/* Contract Types */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Contract Portfolio</h3>
        <div className="space-y-3">
          {data.contractTypes.map((type, index) => (
            <ContractTypeRow key={index} type={type} />
          ))}
        </div>
      </Card>

      {/* Spending Trend */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Monthly Spend Trend</h3>
        <SpendingChart data={data.monthlySpend} />
      </Card>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: number;
  trendLabel?: string;
  color?: 'default' | 'green' | 'yellow' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'default'
}) => {
  const colorClasses = {
    default: 'bg-white',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  };

  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend && trend > 0 ? '↗️' : '↘️';

  return (
    <Card className={`p-3 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-600 truncate">{title}</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">{value}</div>
          {trend !== undefined && trendLabel && (
            <div className="flex items-center mt-1">
              <span className={`text-xs ${trendColor}`}>
                {trendIcon} {Math.abs(trend)}{typeof trend === 'number' && trend % 1 !== 0 ? '' : '%'}
              </span>
              <span className="text-xs text-gray-500 ml-1">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className="text-lg ml-2">{icon}</div>
      </div>
    </Card>
  );
};

interface RiskDistributionChartProps {
  distribution: {
    high: number;
    medium: number;
    low: number;
  };
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ distribution }) => {
  const total = distribution.high + distribution.medium + distribution.low;
  const highPct = total > 0 ? (distribution.high / total) * 100 : 0;
  const mediumPct = total > 0 ? (distribution.medium / total) * 100 : 0;
  const lowPct = total > 0 ? (distribution.low / total) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress Bars */}
      <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="bg-red-500" style={{ width: `${highPct}%` }} />
        <div className="bg-yellow-500" style={{ width: `${mediumPct}%` }} />
        <div className="bg-green-500" style={{ width: `${lowPct}%` }} />
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded"></div>
          <span className="text-gray-600">High ({distribution.high})</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Medium ({distribution.medium})</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded"></div>
          <span className="text-gray-600">Low ({distribution.low})</span>
        </div>
      </div>
    </div>
  );
};

interface ContractTypeRowProps {
  type: {
    type: string;
    count: number;
    avgValue: number;
  };
}

const ContractTypeRow: React.FC<ContractTypeRowProps> = ({ type }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900">{type.type}</div>
      <div className="text-xs text-gray-500">{type.count} contracts</div>
    </div>
    <div className="text-right">
      <div className="text-sm font-medium text-gray-900">
        ${(type.avgValue / 1000).toFixed(0)}K
      </div>
      <div className="text-xs text-gray-500">avg value</div>
    </div>
  </div>
);

interface SpendingChartProps {
  data: Array<{
    month: string;
    amount: number;
  }>;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const maxAmount = Math.max(...data.map(d => d.amount));
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
        
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 text-xs text-gray-600 text-right">
              {item.month}
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs font-medium text-gray-900 w-12">
                ${(item.amount / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Mock data generator for demo purposes
export const generateMockAnalyticsData = (): AnalyticsData => ({
  totalContracts: 47,
  avgRiskScore: 5.2,
  upcomingRenewals: 8,
  potentialSavings: 125000,
  riskDistribution: {
    high: 6,
    medium: 18,
    low: 23
  },
  contractTypes: [
    { type: 'SaaS Agreements', count: 15, avgValue: 85000 },
    { type: 'Service Contracts', count: 12, avgValue: 120000 },
    { type: 'Equipment Leases', count: 8, avgValue: 45000 },
    { type: 'Professional Services', count: 7, avgValue: 95000 },
    { type: 'Data Processing', count: 5, avgValue: 35000 }
  ],
  monthlySpend: [
    { month: 'Jan', amount: 145000 },
    { month: 'Feb', amount: 162000 },
    { month: 'Mar', amount: 138000 },
    { month: 'Apr', amount: 175000 },
    { month: 'May', amount: 156000 },
    { month: 'Jun', amount: 168000 }
  ]
});