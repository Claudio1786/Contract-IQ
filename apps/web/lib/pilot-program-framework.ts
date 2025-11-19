// Contract IQ Pilot Program Framework
// Structured approach for enterprise customer onboarding and value demonstration

export interface PilotProspect {
  // Company Information
  id: string;
  companyName: string;
  industry: string;
  size: 'Mid-Market' | 'Large Enterprise' | 'Fortune_500' | 'Fortune_1000';
  annualRevenue?: number;
  employeeCount?: number;
  headquarters?: string;
  
  // Contact Information
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    department: 'Procurement' | 'Legal' | 'Finance' | 'Operations' | 'IT' | 'Other';
    decisionMakingAuthority: 'Decision_Maker' | 'Influencer' | 'End_User';
  };
  
  // Opportunity Assessment
  opportunity: {
    // Current Pain Points
    painPoints: PainPoint[];
    
    // Contract Portfolio Size
    portfolioSize: {
      totalContracts?: number;
      totalValue?: number;
      vendorCount?: number;
      renewalsPerYear?: number;
    };
    
    // Renewal Pressure (Key Qualification Criteria)
    upcomingRenewals: {
      next90Days: number;
      next180Days: number;
      totalValue90Days: number;
      criticalRenewals: CriticalRenewal[];
    };
    
    // Current Tools and Process
    currentProcess: {
      tools: string[];
      manualProcesses: string[];
      teamSize?: number;
      timeSpentOnNegotiations?: number; // hours per month
    };
    
    // Budget and Authority
    budgetRange?: '$10K-25K' | '$25K-50K' | '$50K-100K' | '$100K+' | 'Not_Disclosed';
    timelineToDecision?: '30_days' | '60_days' | '90_days' | '6_months' | 'Unknown';
    budgetCycle?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Rolling';
  };
  
  // Pilot Configuration
  pilot: {
    status: 'Qualifying' | 'Scheduled' | 'In_Progress' | 'Completed' | 'Lost' | 'Won';
    startDate?: Date;
    endDate?: Date;
    duration: 30 | 60 | 90; // days
    
    // Pilot Scope
    scope: {
      contractCount: number;
      focusAreas: PilotFocusArea[];
      scenarios: string[]; // scenario IDs from our intelligence system
      successCriteria: string[];
    };
    
    // Resource Commitment
    resources: {
      ourTeamHours: number;
      theirTeamHours: number;
      dataRequirements: string[];
      systemAccess: string[];
    };
  };
  
  // Tracking and Results
  results?: {
    contractsProcessed: number;
    playbooksGenerated: number;
    negotiationsStarted: number;
    negotiationsCompleted: number;
    
    // Measured Outcomes
    outcomes: {
      totalSavings: number;
      averageSavingsPerContract: number;
      timeReduction: number; // percentage
      successRate: number; // percentage
      satisfactionScore: number; // 1-10
    };
    
    // Feedback and Lessons
    feedback: {
      strengths: string[];
      improvements: string[];
      testimonials: string[];
      referenceable: boolean;
    };
  };
  
  // Sales Process Tracking
  salesProcess: {
    source: 'Inbound' | 'Outbound' | 'Referral' | 'Partner' | 'Conference' | 'Other';
    leadScore: number; // 0-100
    stage: SalesStage;
    nextSteps: string[];
    lastActivity: Date;
    keyStakeholders: string[];
    competitorsEvaluated: string[];
    timeline: PilotTimeline[];
  };
}

export interface PainPoint {
  category: 'Cost_Savings' | 'Time_Efficiency' | 'Risk_Management' | 'Process_Improvement' | 'Compliance';
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  impactAreas: string[];
  currentCost?: number; // annual
  desiredImprovement: string;
}

export interface CriticalRenewal {
  vendorName: string;
  contractValue: number;
  renewalDate: Date;
  riskLevel: 'High' | 'Medium' | 'Low';
  currentIssues: string[];
  negotiationComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Very_Complex';
}

export interface PilotFocusArea {
  area: 'SaaS_Renewals' | 'SLA_Enhancement' | 'Liability_Management' | 'Compliance_GDPR' | 'Cost_Optimization' | 'Risk_Mitigation';
  priority: 'Primary' | 'Secondary' | 'Nice_to_Have';
  expectedImpact: 'High' | 'Medium' | 'Low';
  measurableOutcomes: string[];
}

export type SalesStage = 
  | 'Lead' 
  | 'Qualified' 
  | 'Demo_Scheduled' 
  | 'Demo_Completed' 
  | 'Pilot_Proposal' 
  | 'Pilot_Approved' 
  | 'Pilot_In_Progress' 
  | 'Pilot_Review' 
  | 'Proposal' 
  | 'Negotiation' 
  | 'Closed_Won' 
  | 'Closed_Lost';

export interface PilotTimeline {
  date: Date;
  milestone: string;
  status: 'Scheduled' | 'Completed' | 'Delayed' | 'At_Risk';
  notes?: string;
  owner: string;
}

// Pilot Program Templates and Configurations

export const PILOT_TEMPLATES = {
  // Standard 30-day pilot for mid-market prospects
  standard_30_day: {
    duration: 30,
    contractCount: 3,
    focusAreas: [
      { area: 'SaaS_Renewals', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Cost reduction %', 'Time to negotiate', 'Success rate'] },
      { area: 'Risk_Mitigation', priority: 'Secondary', expectedImpact: 'Medium', measurableOutcomes: ['Liability exposure reduction', 'Compliance score'] }
    ],
    successCriteria: [
      'Generate 3 actionable negotiation playbooks',
      'Demonstrate 10%+ cost savings on at least 1 contract',
      'Reduce negotiation prep time by 50%+',
      'Achieve 80%+ satisfaction score'
    ],
    resources: {
      ourTeamHours: 20,
      theirTeamHours: 15,
      dataRequirements: ['Contract documents', 'Current terms', 'Vendor contact info'],
      systemAccess: ['Contract repository read-only', 'Calendar integration']
    }
  },
  
  // Comprehensive 60-day pilot for large enterprises
  enterprise_60_day: {
    duration: 60,
    contractCount: 8,
    focusAreas: [
      { area: 'SaaS_Renewals', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Cost reduction %', 'Process efficiency'] },
      { area: 'SLA_Enhancement', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Uptime improvements', 'Service credit negotiations'] },
      { area: 'Compliance_GDPR', priority: 'Secondary', expectedImpact: 'Medium', measurableOutcomes: ['Compliance score', 'Risk reduction'] },
      { area: 'Cost_Optimization', priority: 'Secondary', expectedImpact: 'High', measurableOutcomes: ['Volume discount capture', 'Payment term optimization'] }
    ],
    successCriteria: [
      'Process 8 contracts with full intelligence',
      'Achieve $100K+ in documented savings opportunities',
      'Improve team efficiency by 60%+',
      'Generate referenceable case studies',
      'Achieve 85%+ satisfaction score'
    ],
    resources: {
      ourTeamHours: 40,
      theirTeamHours: 35,
      dataRequirements: ['Contract portfolio', 'Vendor performance data', 'Historical negotiation outcomes'],
      systemAccess: ['Full contract management system', 'Vendor management platform', 'Finance system (read-only)']
    }
  },
  
  // Focused 90-day pilot for Fortune 500 with complex requirements
  fortune_500_90_day: {
    duration: 90,
    contractCount: 15,
    focusAreas: [
      { area: 'SaaS_Renewals', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Enterprise discount optimization', 'Multi-year protection'] },
      { area: 'Liability_Management', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Risk exposure reduction', 'Insurance optimization'] },
      { area: 'SLA_Enhancement', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Performance guarantee improvements'] },
      { area: 'Compliance_GDPR', priority: 'Secondary', expectedImpact: 'Medium', measurableOutcomes: ['Regulatory compliance', 'Data governance'] },
      { area: 'Cost_Optimization', priority: 'Primary', expectedImpact: 'High', measurableOutcomes: ['Portfolio optimization', 'Vendor consolidation'] }
    ],
    successCriteria: [
      'Full portfolio intelligence across 15 critical contracts',
      'Achieve $500K+ in documented savings opportunities',
      'Reduce contract review time by 70%+',
      'Establish enterprise negotiation playbook library',
      'Demonstrate ROI of 5:1 or better',
      'Generate Fortune 500 reference case'
    ],
    resources: {
      ourTeamHours: 80,
      theirTeamHours: 60,
      dataRequirements: ['Complete contract database', 'Vendor scorecards', 'Procurement policies', 'Legal precedents'],
      systemAccess: ['Enterprise contract platform', 'Vendor management', 'Financial systems', 'Legal document management']
    }
  }
};

// Qualification Framework
export function qualifyPilotProspect(prospect: Partial<PilotProspect>): QualificationResult {
  let score = 0;
  let strengths: string[] = [];
  let concerns: string[] = [];
  let recommendations: string[] = [];
  
  // Company Size and Revenue Potential (25 points)
  if (prospect.size === 'Fortune_500') {
    score += 25;
    strengths.push('Fortune 500 company - high revenue potential');
  } else if (prospect.size === 'Large Enterprise') {
    score += 20;
    strengths.push('Large enterprise - good fit for platform');
  } else if (prospect.size === 'Mid-Market') {
    score += 15;
    concerns.push('Mid-market size - validate budget availability');
  }
  
  // Renewal Pressure and Urgency (30 points)
  const renewals90 = prospect.opportunity?.upcomingRenewals?.next90Days || 0;
  const renewalsValue = prospect.opportunity?.upcomingRenewals?.totalValue90Days || 0;
  
  if (renewals90 >= 5 && renewalsValue >= 500000) {
    score += 30;
    strengths.push('High renewal pressure - immediate value opportunity');
  } else if (renewals90 >= 3 && renewalsValue >= 200000) {
    score += 20;
    strengths.push('Moderate renewal pressure - good pilot opportunity');
  } else if (renewals90 >= 1) {
    score += 10;
    concerns.push('Limited immediate renewal pressure - may need longer pilot');
  } else {
    concerns.push('No immediate renewal pressure - reconsider timing');
  }
  
  // Decision Making Authority (20 points)
  if (prospect.primaryContact?.decisionMakingAuthority === 'Decision_Maker') {
    score += 20;
    strengths.push('Speaking with decision maker - faster sales cycle');
  } else if (prospect.primaryContact?.decisionMakingAuthority === 'Influencer') {
    score += 10;
    recommendations.push('Identify and engage primary decision maker');
  } else {
    score += 5;
    concerns.push('Limited decision making authority - complex sales process');
  }
  
  // Pain Point Severity (15 points)
  const highSeverityPains = prospect.opportunity?.painPoints?.filter(p => p.severity === 'High').length || 0;
  if (highSeverityPains >= 3) {
    score += 15;
    strengths.push('Multiple high-severity pain points - strong value fit');
  } else if (highSeverityPains >= 1) {
    score += 10;
    strengths.push('Clear pain points identified');
  } else {
    score += 5;
    concerns.push('Pain points not clearly established');
  }
  
  // Budget and Timeline (10 points)
  if (prospect.opportunity?.budgetRange && !prospect.opportunity.budgetRange.includes('Not_Disclosed')) {
    score += 10;
    strengths.push('Budget disclosed - serious evaluation');
  } else {
    score += 5;
    recommendations.push('Qualify budget in discovery call');
  }
  
  // Determine recommendation
  let recommendation: 'Pursue_Aggressively' | 'Standard_Pilot' | 'Nurture' | 'Disqualify';
  let template: keyof typeof PILOT_TEMPLATES;
  
  if (score >= 80) {
    recommendation = 'Pursue_Aggressively';
    template = prospect.size === 'Fortune_500' ? 'fortune_500_90_day' : 'enterprise_60_day';
  } else if (score >= 60) {
    recommendation = 'Standard_Pilot';
    template = prospect.size === 'Mid-Market' ? 'standard_30_day' : 'enterprise_60_day';
  } else if (score >= 40) {
    recommendation = 'Nurture';
    template = 'standard_30_day';
    recommendations.push('Address qualification concerns before pilot');
  } else {
    recommendation = 'Disqualify';
    template = 'standard_30_day';
    recommendations.push('Does not meet minimum qualification criteria');
  }
  
  return {
    score,
    recommendation,
    suggestedTemplate: template,
    strengths,
    concerns,
    recommendations,
    nextSteps: generateNextSteps(recommendation, concerns)
  };
}

export interface QualificationResult {
  score: number; // 0-100
  recommendation: 'Pursue_Aggressively' | 'Standard_Pilot' | 'Nurture' | 'Disqualify';
  suggestedTemplate: keyof typeof PILOT_TEMPLATES;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  nextSteps: string[];
}

function generateNextSteps(recommendation: QualificationResult['recommendation'], concerns: string[]): string[] {
  const baseSteps = [
    'Schedule discovery call to validate opportunity',
    'Prepare company research and use case examples',
    'Identify key stakeholders and decision process'
  ];
  
  switch (recommendation) {
    case 'Pursue_Aggressively':
      return [
        'Fast-track to pilot proposal',
        'Engage executive sponsor',
        'Prepare comprehensive ROI analysis',
        'Schedule pilot scoping session',
        ...baseSteps
      ];
      
    case 'Standard_Pilot':
      return [
        'Develop pilot proposal',
        'Validate budget and timeline',
        'Confirm renewal timeline pressures',
        ...baseSteps
      ];
      
    case 'Nurture':
      return [
        'Address qualification concerns first',
        'Educational content sharing',
        'Build relationship with key stakeholders',
        'Monitor for trigger events (renewals, budget cycles)',
        ...baseSteps
      ];
      
    case 'Disqualify':
      return [
        'Politely decline with future consideration',
        'Refer to partner if applicable',
        'Add to nurture campaign for future opportunities'
      ];
      
    default:
      return baseSteps;
  }
}

// Success Metrics and ROI Calculation
export function calculatePilotROI(prospect: PilotProspect): PilotROIAnalysis {
  if (!prospect.results) {
    // Projected ROI for pilot proposal
    const projectedSavings = estimateProjectedSavings(prospect);
    const investmentCost = estimateInvestmentCost(prospect);
    
    return {
      type: 'Projected',
      totalSavings: projectedSavings,
      investmentCost,
      roi: (projectedSavings / investmentCost - 1) * 100,
      paybackPeriod: investmentCost / (projectedSavings / 12), // months
      confidence: calculateConfidence(prospect)
    };
  } else {
    // Actual ROI from completed pilot
    const annualizedSavings = prospect.results.outcomes.totalSavings * (365 / prospect.pilot.duration);
    const investmentCost = estimateActualInvestment(prospect);
    
    return {
      type: 'Actual',
      totalSavings: annualizedSavings,
      investmentCost,
      roi: (annualizedSavings / investmentCost - 1) * 100,
      paybackPeriod: investmentCost / (annualizedSavings / 12),
      confidence: 100, // Actual results
      metrics: {
        contractsProcessed: prospect.results.contractsProcessed,
        averageSavingsPerContract: prospect.results.outcomes.averageSavingsPerContract,
        timeReduction: prospect.results.outcomes.timeReduction,
        successRate: prospect.results.outcomes.successRate,
        satisfactionScore: prospect.results.outcomes.satisfactionScore
      }
    };
  }
}

export interface PilotROIAnalysis {
  type: 'Projected' | 'Actual';
  totalSavings: number;
  investmentCost: number;
  roi: number; // percentage
  paybackPeriod: number; // months
  confidence: number; // percentage
  metrics?: {
    contractsProcessed: number;
    averageSavingsPerContract: number;
    timeReduction: number;
    successRate: number;
    satisfactionScore: number;
  };
}

function estimateProjectedSavings(prospect: PilotProspect): number {
  const portfolioValue = prospect.opportunity.portfolioSize.totalValue || 0;
  const renewalValue = prospect.opportunity.upcomingRenewals.totalValue90Days || 0;
  
  // Conservative estimate: 3-5% savings on renewal value, 1-2% on portfolio
  const renewalSavings = renewalValue * 0.04; // 4% average
  const portfolioSavings = portfolioValue * 0.015; // 1.5% average
  
  return renewalSavings + portfolioSavings;
}

function estimateInvestmentCost(prospect: PilotProspect): number {
  // Estimate based on pilot template
  const template = PILOT_TEMPLATES[
    prospect.size === 'Fortune_500' ? 'fortune_500_90_day' :
    prospect.size === 'Large Enterprise' ? 'enterprise_60_day' :
    'standard_30_day'
  ];
  
  // Cost = Our team time + Their team time (opportunity cost) + Platform cost
  const ourCost = template.resources.ourTeamHours * 150; // $150/hour blended rate
  const theirCost = template.resources.theirTeamHours * 75; // $75/hour opportunity cost
  const platformCost = template.duration * 100; // $100/day platform cost during pilot
  
  return ourCost + theirCost + platformCost;
}

function estimateActualInvestment(prospect: PilotProspect): number {
  // Calculate actual investment based on pilot results
  return estimateInvestmentCost(prospect);
}

function calculateConfidence(prospect: PilotProspect): number {
  let confidence = 70; // Base confidence
  
  // Adjust based on data quality
  if (prospect.opportunity.upcomingRenewals.criticalRenewals.length > 0) confidence += 10;
  if (prospect.opportunity.portfolioSize.totalValue && prospect.opportunity.portfolioSize.totalValue > 0) confidence += 10;
  if (prospect.primaryContact.decisionMakingAuthority === 'Decision_Maker') confidence += 10;
  
  return Math.min(confidence, 95); // Cap at 95% for projections
}

// Pilot Communication Templates
export const PILOT_EMAIL_TEMPLATES = {
  initial_outreach: {
    subject: "Contract Negotiation Intelligence - Immediate Renewal Opportunities",
    body: `Hi {firstName},

I noticed {companyName} has several contract renewals coming up in the next 90 days. Companies similar to {companyName} in {industry} typically achieve 15-25% cost reductions using our AI-powered negotiation intelligence.

We have research-backed playbooks specifically for:
• SaaS renewal price increase mitigation
• Service level agreement enhancements  
• Liability risk optimization

Would you be interested in a brief 15-minute call to explore how we could help optimize your upcoming renewals?

Best regards,
{senderName}`
  },
  
  pilot_proposal: {
    subject: "Contract IQ Pilot Program Proposal - {companyName}",
    body: `Hi {firstName},

Thank you for the great conversation about {companyName}'s contract negotiation challenges.

Based on our discussion, I've prepared a customized {duration}-day pilot program proposal:

**PILOT SCOPE**
• {contractCount} high-value contracts
• Focus on: {focusAreas}
• Success criteria: {successCriteria}

**PROJECTED VALUE**
• Estimated savings: ${projectedSavings}
• ROI projection: {roi}%
• Payback period: {paybackPeriod} months

I've attached the detailed proposal. When would be a good time to review the specifics?

Best regards,
{senderName}`
  }
};

// Export utility functions
export {
  qualifyPilotProspect,
  calculatePilotROI,
  PILOT_TEMPLATES,
  PILOT_EMAIL_TEMPLATES
};