'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui';

// Types for negotiation tracking
export interface NegotiationOutcome {
  id: string;
  contractId: string;
  vendorName: string;
  contractType: string;
  scenario: string;
  objectives: string[];
  
  // Predictions (from our intelligence system)
  predictions: {
    successProbability: number; // 0-100
    expectedSavings: number;
    timeToClose: number; // days
    recommendedTactics: string[];
  };
  
  // Actual Results
  results?: {
    wasSuccessful: boolean;
    actualSavings: number;
    actualTimeToClose: number; // days
    tacticsUsed: string[];
    finalTerms: string;
    lessonsLearned: string[];
  };
  
  // Timeline
  createdAt: Date;
  completedAt?: Date;
  status: 'In_Progress' | 'Completed' | 'Abandoned';
  
  // Quality Scores
  qualityScores?: {
    predictionAccuracy: number; // 0-100
    tacticsEffectiveness: number; // 0-100  
    overallSatisfaction: number; // 1-5
    wouldRecommendPlaybook: boolean;
  };
}

export interface MetricsData {
  // Overall Performance
  totalNegotiations: number;
  completedNegotiations: number;
  successRate: number; // percentage
  averageSavings: number;
  totalSavings: number;
  
  // Prediction Accuracy
  predictionAccuracy: {
    successPredictionAccuracy: number; // percentage
    savingsAccuracy: number; // percentage 
    timelineAccuracy: number; // percentage
  };
  
  // Scenario Performance
  scenarioPerformance: Array<{
    scenario: string;
    count: number;
    successRate: number;
    averageSavings: number;
    averageTimeToClose: number;
  }>;
  
  // Tactic Effectiveness
  tacticEffectiveness: Array<{
    tactic: string;
    timesUsed: number;
    successRate: number;
    averageImpact: number;
    confidence: number;
  }>;
  
  // Recent Trends
  monthlyTrends: Array<{
    month: string;
    negotiations: number;
    successRate: number;
    savings: number;
  }>;
}

export interface MetricsDashboardProps {
  className?: string;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  className = ''
}) => {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y' | 'all'>('90d');

  useEffect(() => {
    loadMetricsData();
  }, [selectedPeriod]);

  const loadMetricsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call an API
      // For now, we'll use mock data
      const mockData: MetricsData = {
        totalNegotiations: 47,
        completedNegotiations: 34,
        successRate: 82.4,
        averageSavings: 24750,
        totalSavings: 841500,
        
        predictionAccuracy: {
          successPredictionAccuracy: 89.2,
          savingsAccuracy: 76.5,
          timelineAccuracy: 71.8
        },
        
        scenarioPerformance: [
          {
            scenario: 'SaaS Renewal - Price Increase Mitigation',
            count: 15,
            successRate: 86.7,
            averageSavings: 31200,
            averageTimeToClose: 18
          },
          {
            scenario: 'Service Level Agreement Enhancement',
            count: 8,
            successRate: 75.0,
            averageSavings: 12500,
            averageTimeToClose: 25
          },
          {
            scenario: 'Liability Cap Negotiation',
            count: 6,
            successRate: 83.3,
            averageSavings: 18900,
            averageTimeToClose: 32
          },
          {
            scenario: 'Payment Terms Optimization',
            count: 5,
            successRate: 80.0,
            averageSavings: 8400,
            averageTimeToClose: 14
          }
        ],
        
        tacticEffectiveness: [
          {
            tactic: 'Inflation Anchoring',
            timesUsed: 23,
            successRate: 91.3,
            averageImpact: 15.2,
            confidence: 94.5
          },
          {
            tactic: 'Market Benchmarking',
            timesUsed: 18,
            successRate: 83.3,
            averageImpact: 12.8,
            confidence: 87.2
          },
          {
            tactic: 'End-of-Quarter Timing',
            timesUsed: 12,
            successRate: 75.0,
            averageImpact: 22.1,
            confidence: 78.9
          },
          {
            tactic: 'Volume-Terms Bundling',
            timesUsed: 15,
            successRate: 86.7,
            averageImpact: 18.7,
            confidence: 82.4
          }
        ],
        
        monthlyTrends: [
          { month: 'Oct 2024', negotiations: 8, successRate: 87.5, savings: 245000 },
          { month: 'Sep 2024', negotiations: 12, successRate: 83.3, savings: 312000 },
          { month: 'Aug 2024', negotiations: 9, successRate: 77.8, savings: 189500 },
          { month: 'Jul 2024', negotiations: 5, successRate: 80.0, savings: 95000 }
        ]
      };
      
      setMetricsData(mockData);
    } catch (error) {
      console.error('Failed to load metrics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metricsData) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18"/>
            <rect x="7" y="12" width="3" height="6"/>
            <rect x="12" y="8" width="3" height="10"/>
            <rect x="17" y="5" width="3" height="13"/>
          </svg>
          Negotiation Intelligence Metrics
        </h2>
        <div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricsData.successRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">
                {metricsData.completedNegotiations}/{metricsData.totalNegotiations} completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12h8"/>
                  <path d="M12 8v8"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${(metricsData.totalSavings / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-blue-600">
                ${(metricsData.averageSavings / 1000).toFixed(0)}K avg per deal
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Prediction Accuracy</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricsData.predictionAccuracy.successPredictionAccuracy.toFixed(1)}%
              </p>
              <p className="text-xs text-purple-600">
                Success predictions
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Negotiations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricsData.totalNegotiations - metricsData.completedNegotiations}
              </p>
              <p className="text-xs text-orange-600">
                In progress
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Scenario Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Performance</h3>
        <div className="space-y-4">
          {metricsData.scenarioPerformance.map((scenario, index) => (
            <div key={index} className="border-l-4 border-blue-400 pl-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{scenario.scenario}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {scenario.count} negotiations • {scenario.successRate.toFixed(1)}% success rate
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    ${(scenario.averageSavings / 1000).toFixed(0)}K avg savings
                  </div>
                  <div className="text-sm text-gray-600">
                    {scenario.averageTimeToClose} days avg
                  </div>
                </div>
              </div>
              {/* Progress bar for success rate */}
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${scenario.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tactic Effectiveness */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tactic Effectiveness</h3>
          <div className="space-y-4">
            {metricsData.tacticEffectiveness.map((tactic, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{tactic.tactic}</div>
                  <div className="text-sm text-gray-600">
                    Used {tactic.timesUsed} times • {tactic.successRate.toFixed(1)}% success
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${tactic.confidence}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="font-medium text-blue-600">
                    {tactic.averageImpact.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">impact</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Prediction Accuracy Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Prediction Accuracy</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Success Prediction</span>
                <span className="font-medium">
                  {metricsData.predictionAccuracy.successPredictionAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${metricsData.predictionAccuracy.successPredictionAccuracy}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Savings Accuracy</span>
                <span className="font-medium">
                  {metricsData.predictionAccuracy.savingsAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${metricsData.predictionAccuracy.savingsAccuracy}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Timeline Accuracy</span>
                <span className="font-medium">
                  {metricsData.predictionAccuracy.timelineAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${metricsData.predictionAccuracy.timelineAccuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                Our AI predictions improve over time. The more negotiations tracked, the more accurate our recommendations become.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 17 9 11 13 15 21 7"/>
            <polyline points="3 7 3 17 21 17"/>
          </svg>
          Monthly Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metricsData.monthlyTrends.map((month, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{month.month}</div>
              <div className="mt-2 space-y-1">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{month.negotiations}</span> negotiations
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{month.successRate.toFixed(1)}%</span> success
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">${(month.savings / 1000).toFixed(0)}K</span> saved
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Items */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          Improvement Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Prediction Accuracy</h4>
            <ul className="space-y-1 text-blue-700">
              <li>Timeline predictions need improvement (71.8% accurate)</li>
              <li>More data needed for volume discount scenarios</li>
              <li>Consider tactic sequencing analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Process Optimization</h4>
            <ul className="space-y-1 text-blue-700">
              <li>End-of-quarter timing shows high impact but lower confidence</li>
              <li>SLA negotiations take longer than other scenarios</li>
              <li>Consider industry-specific playbook variations</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};