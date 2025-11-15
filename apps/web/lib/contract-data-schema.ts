// Contract IQ Data Extraction Schema
// Standardized data structure for vendor contract intelligence

export interface ContractData {
  // Core Contract Identification
  id: string;
  uploadedAt: Date;
  lastUpdated: Date;
  
  // Document Metadata
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    documentHash: string;
    extractionConfidence: number; // 0-100
    extractionMethod: 'manual' | 'ocr' | 'ai_structured' | 'hybrid';
    language: string;
    pageCount?: number;
  };

  // Basic Contract Information
  basicInfo: {
    contractType: ContractType;
    title?: string;
    agreementDate?: Date;
    effectiveDate?: Date;
    expirationDate?: Date;
    status: ContractStatus;
    jurisdiction?: string;
    governingLaw?: string;
  };

  // Vendor Information
  vendor: {
    name: string;
    legalName?: string;
    entityType?: 'Corporation' | 'LLC' | 'Partnership' | 'Sole Proprietorship' | 'Other';
    address?: Address;
    contacts?: ContactInfo[];
    taxId?: string;
    website?: string;
    industry?: string;
    vendorSize?: 'Small' | 'Medium' | 'Large' | 'Enterprise';
  };

  // Customer Information (Our Organization)
  customer: {
    name: string;
    legalName?: string;
    signatoryName?: string;
    signatoryTitle?: string;
    department?: string;
    address?: Address;
  };

  // Financial Terms
  financialTerms: {
    // Pricing Structure
    totalContractValue?: number;
    currency: string;
    pricingModel: 'Fixed' | 'Variable' | 'Time_and_Materials' | 'Subscription' | 'Usage_Based' | 'Tiered' | 'Other';
    
    // Payment Terms
    paymentTerms?: {
      schedule: 'Monthly' | 'Quarterly' | 'Annually' | 'Upfront' | 'Upon_Delivery' | 'Net_30' | 'Net_45' | 'Net_60' | 'Other';
      method?: 'Check' | 'ACH' | 'Wire' | 'Credit_Card' | 'Other';
      earlyPaymentDiscount?: number; // percentage
      earlyPaymentTerms?: string; // e.g., "2% if paid within 10 days"
      latePaymentPenalty?: number; // percentage per month
    };

    // Fees and Costs
    fees?: {
      setupFee?: number;
      monthlyFee?: number;
      annualFee?: number;
      transactionFees?: number;
      cancellationFee?: number;
      maintenanceFee?: number;
      supportFee?: number;
      trainingFee?: number;
      customDevelopmentFee?: number;
    };

    // Volume and Discounts
    volumeTerms?: {
      minimumCommitment?: number;
      maximumCommitment?: number;
      volumeDiscounts?: VolumeDiscount[];
      overage?: {
        rate: number;
        unit: string;
      };
    };

    // Price Changes
    priceChangeTerms?: {
      allowedFrequency: 'Never' | 'Annual' | 'Upon_Renewal' | 'With_Notice' | 'At_Will';
      noticeRequired?: number; // days
      capOnIncrease?: number; // percentage
      escalationClause?: string;
    };
  };

  // Service Level Agreements
  serviceTerms: {
    // Availability/Uptime
    availability?: {
      uptimeGuarantee?: number; // percentage (e.g., 99.9)
      measurementMethod?: string;
      maintenanceWindows?: string;
      exclusions?: string[];
    };

    // Support Terms
    support?: {
      hours: 'Business_Hours' | '24x5' | '24x7' | 'Other';
      responseTime?: ResponseTimes;
      escalationProcedure?: string;
      supportChannels?: ('Email' | 'Phone' | 'Chat' | 'Portal' | 'On_Site')[];
      dedicatedSupport?: boolean;
    };

    // Performance Standards
    performance?: {
      responseTime?: number; // milliseconds
      throughput?: number;
      accuracy?: number; // percentage
      deliveryTimeframes?: string;
      qualityStandards?: string;
    };

    // Service Credits
    serviceCredits?: {
      uptimeBreaches?: ServiceCreditTier[];
      responseTimeBreaches?: ServiceCreditTier[];
      performanceBreaches?: ServiceCreditTier[];
      maximumCreditsPerMonth?: number; // percentage of monthly fees
    };
  };

  // Legal and Risk Terms
  legalTerms: {
    // Liability and Risk
    liability?: {
      customerLiabilityCap?: number | 'Unlimited';
      vendorLiabilityCap?: number | 'Unlimited';
      mutualLiabilityCap?: number | 'Unlimited';
      carveOuts?: ('IP_Infringement' | 'Confidentiality' | 'Data_Breach' | 'Willful_Misconduct' | 'Gross_Negligence')[];
      exclusions?: ('Indirect' | 'Consequential' | 'Incidental' | 'Punitive' | 'Lost_Profits')[];
    };

    // Indemnification
    indemnification?: {
      customerIndemnifies?: string[];
      vendorIndemnifies?: string[];
      mutualIndemnification?: string[];
      procedure?: string;
    };

    // Insurance Requirements
    insurance?: {
      generalLiability?: number;
      professionalLiability?: number;
      cyberLiability?: number;
      workersCompensation?: boolean;
      certificateRequired?: boolean;
    };

    // Intellectual Property
    intellectualProperty?: {
      backgroundIPOwnership: 'Customer' | 'Vendor' | 'Respective_Owner';
      foregroundIPOwnership: 'Customer' | 'Vendor' | 'Joint';
      workForHire?: boolean;
      licenseGrants?: string;
      ipWarranties?: boolean;
      ipIndemnification?: boolean;
    };

    // Confidentiality
    confidentiality?: {
      mutualNDA?: boolean;
      dataClassification?: string[];
      retentionPeriod?: number; // years
      returnOrDestruction?: 'Return' | 'Destruction' | 'Either';
      survivesTermination?: boolean;
    };
  };

  // Termination and Renewal
  terminationTerms: {
    // Contract Duration
    initialTerm?: {
      duration: number;
      unit: 'Days' | 'Months' | 'Years';
    };

    // Renewal
    renewal?: {
      autoRenewal?: boolean;
      renewalTerm?: number; // months
      renewalNoticeRequired?: number; // days
      renewalPriceChange?: boolean;
    };

    // Termination Rights
    termination?: {
      terminationForCause?: boolean;
      causeNoticeRequired?: number; // days
      curePeriod?: number; // days
      
      terminationForConvenience?: {
        customer?: boolean;
        vendor?: boolean;
        noticeRequired?: number; // days
        terminationFee?: number;
      };

      materialBreachTermination?: boolean;
      bankruptcyTermination?: boolean;
      changeOfControlTermination?: boolean;
    };

    // Post-Termination
    postTermination?: {
      dataReturn?: {
        required: boolean;
        timeframe?: number; // days
        format?: string[];
        cost?: number;
      };
      
      transitionAssistance?: {
        required: boolean;
        duration?: number; // days
        cost?: number;
      };

      survivalClauses?: string[];
      restrictionsOnCustomer?: string;
    };
  };

  // Data and Privacy (especially for SaaS/Cloud services)
  dataTerms?: {
    // Data Processing
    dataProcessing?: {
      dataTypes?: ('Personal_Data' | 'Business_Data' | 'Technical_Data' | 'Usage_Data' | 'Other')[];
      processingPurposes?: string[];
      dataLocation?: string[];
      dataResidencyRequired?: boolean;
      subProcessors?: string[];
    };

    // Security
    security?: {
      securityStandards?: ('SOC2' | 'ISO27001' | 'FedRAMP' | 'HIPAA' | 'Other')[];
      encryptionRequired?: boolean;
      accessControls?: string;
      auditRights?: boolean;
      incidentNotification?: {
        required: boolean;
        timeframe?: number; // hours
      };
    };

    // Compliance
    compliance?: {
      gdprCompliant?: boolean;
      ccpaCompliant?: boolean;
      hipaaBaa?: boolean;
      otherRegulations?: string[];
      dpaRequired?: boolean;
    };
  };

  // Integration and Technical Terms
  technicalTerms?: {
    // System Requirements
    systemRequirements?: {
      browserSupport?: string[];
      operatingSystem?: string[];
      minimumBandwidth?: string;
      mobileSupport?: boolean;
    };

    // APIs and Integration
    integration?: {
      apiAccess?: boolean;
      webhooksSupported?: boolean;
      ssoSupported?: boolean;
      customIntegrations?: boolean;
      dataExportCapability?: boolean;
      bulkDataOperations?: boolean;
    };

    // Training and Onboarding
    training?: {
      trainingIncluded?: boolean;
      trainingMethods?: ('Online' | 'In_Person' | 'Documentation' | 'Video')[];
      trainingHours?: number;
      onboardingSupport?: boolean;
      userCertification?: boolean;
    };
  };

  // Contract Analysis and Intelligence
  analysis: {
    // Risk Assessment
    riskScore?: number; // 0-100
    riskFactors?: RiskFactor[];
    
    // Negotiation Opportunities
    negotiationOpportunities?: NegotiationOpportunity[];
    
    // Benchmarking
    benchmarkData?: {
      pricingPercentile?: number; // vs market
      termFavorability?: 'Very_Favorable' | 'Favorable' | 'Neutral' | 'Unfavorable' | 'Very_Unfavorable';
      liabilityRisk?: 'Low' | 'Medium' | 'High';
      renewalRisk?: 'Low' | 'Medium' | 'High';
    };

    // AI-Generated Insights
    aiInsights?: {
      summary: string;
      keyRisks: string[];
      negotiationRecommendations: string[];
      complianceFlags: string[];
      missingClauses: string[];
    };

    // Classification Tags
    tags?: string[];
    category?: 'Critical' | 'Important' | 'Standard' | 'Low_Risk';
    businessUnit?: string;
    contractOwner?: string;
  };
}

// Supporting Types and Interfaces

export type ContractType = 
  | 'SaaS_Agreement'
  | 'Service_Contract'
  | 'Professional_Services'
  | 'Master_Service_Agreement'
  | 'Statement_of_Work'
  | 'Data_Processing_Agreement'
  | 'Equipment_Lease'
  | 'Licensing_Agreement'
  | 'Purchase_Agreement'
  | 'Consulting_Agreement'
  | 'Other';

export type ContractStatus = 
  | 'Draft'
  | 'Under_Review' 
  | 'Under_Negotiation'
  | 'Pending_Signature'
  | 'Active'
  | 'Expired'
  | 'Terminated'
  | 'Cancelled'
  | 'Renewed';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ContactInfo {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  role?: 'Primary' | 'Technical' | 'Legal' | 'Billing' | 'Other';
}

export interface VolumeDiscount {
  threshold: number;
  discountPercentage: number;
  unit?: string;
}

export interface ResponseTimes {
  p1_critical?: number; // hours
  p2_high?: number; // hours  
  p3_medium?: number; // hours
  p4_low?: number; // hours
}

export interface ServiceCreditTier {
  threshold: number; // percentage or time
  creditPercentage: number; // percentage of monthly fees
}

export interface RiskFactor {
  category: 'Financial' | 'Legal' | 'Operational' | 'Compliance' | 'Security';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  impact?: string;
  mitigation?: string;
}

export interface NegotiationOpportunity {
  category: 'Pricing' | 'Terms' | 'SLA' | 'Risk' | 'Compliance';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  potentialSavings?: number;
  effort: 'Low' | 'Medium' | 'High';
  likelihood: 'Low' | 'Medium' | 'High';
}

// Data Extraction Confidence Levels
export interface ExtractionConfidence {
  field: keyof ContractData;
  confidence: number; // 0-100
  method: 'ocr' | 'ai_extraction' | 'manual_review' | 'pattern_matching';
  needsReview?: boolean;
}

// Contract Portfolio Analytics Types
export interface ContractPortfolio {
  totalContracts: number;
  totalValue: number;
  averageContractValue: number;
  contractsByType: Record<ContractType, number>;
  contractsByStatus: Record<ContractStatus, number>;
  upcomingRenewals: ContractRenewalAlert[];
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  complianceStatus: {
    compliant: number;
    nonCompliant: number;
    needsReview: number;
  };
}

export interface ContractRenewalAlert {
  contractId: string;
  vendorName: string;
  contractType: ContractType;
  renewalDate: Date;
  daysUntilRenewal: number;
  contractValue: number;
  autoRenewal: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  actionRequired: string[];
}

// Database Schema Validation
export const CONTRACT_SCHEMA_VERSION = '1.0.0';

export function validateContractData(data: Partial<ContractData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!data.id) errors.push('Contract ID is required');
  if (!data.metadata?.fileName) errors.push('File name is required');
  if (!data.vendor?.name) errors.push('Vendor name is required');
  if (!data.financialTerms?.currency) errors.push('Currency is required');

  // Data type validation
  if (data.financialTerms?.totalContractValue !== undefined && data.financialTerms.totalContractValue < 0) {
    errors.push('Total contract value cannot be negative');
  }

  if (data.serviceTerms?.availability?.uptimeGuarantee !== undefined) {
    const uptime = data.serviceTerms.availability.uptimeGuarantee;
    if (uptime < 0 || uptime > 100) {
      errors.push('Uptime guarantee must be between 0 and 100 percent');
    }
  }

  // Date validation
  if (data.basicInfo?.effectiveDate && data.basicInfo?.expirationDate) {
    if (data.basicInfo.effectiveDate > data.basicInfo.expirationDate) {
      errors.push('Effective date cannot be after expiration date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper function to extract key metrics for dashboard
export function extractContractMetrics(contract: ContractData) {
  return {
    // Financial metrics
    annualValue: calculateAnnualValue(contract),
    monthlyValue: calculateMonthlyValue(contract),
    remainingValue: calculateRemainingValue(contract),
    
    // Timeline metrics
    daysUntilRenewal: calculateDaysUntilRenewal(contract),
    contractAge: calculateContractAge(contract),
    
    // Risk metrics
    riskScore: contract.analysis.riskScore || 0,
    riskLevel: calculateRiskLevel(contract),
    
    // Compliance metrics
    complianceScore: calculateComplianceScore(contract),
    missingClauses: contract.analysis.aiInsights?.missingClauses || [],
    
    // Performance metrics
    slaCompliance: calculateSLACompliance(contract),
    uptimeTarget: contract.serviceTerms.availability?.uptimeGuarantee
  };
}

// Helper functions for metrics calculations
function calculateAnnualValue(contract: ContractData): number {
  const total = contract.financialTerms.totalContractValue || 0;
  const duration = contract.terminationTerms.initialTerm;
  
  if (!duration) return total;
  
  const years = duration.unit === 'Years' ? duration.duration :
                duration.unit === 'Months' ? duration.duration / 12 :
                duration.duration / 365;
                
  return years > 0 ? total / years : total;
}

function calculateMonthlyValue(contract: ContractData): number {
  return calculateAnnualValue(contract) / 12;
}

function calculateRemainingValue(contract: ContractData): number {
  const annualValue = calculateAnnualValue(contract);
  const daysRemaining = calculateDaysUntilRenewal(contract);
  return (daysRemaining / 365) * annualValue;
}

function calculateDaysUntilRenewal(contract: ContractData): number {
  const expirationDate = contract.basicInfo.expirationDate;
  if (!expirationDate) return 0;
  
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateContractAge(contract: ContractData): number {
  const effectiveDate = contract.basicInfo.effectiveDate;
  if (!effectiveDate) return 0;
  
  const now = new Date();
  const diffTime = now.getTime() - effectiveDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function calculateRiskLevel(contract: ContractData): 'Low' | 'Medium' | 'High' | 'Critical' {
  const riskScore = contract.analysis.riskScore || 0;
  
  if (riskScore >= 80) return 'Critical';
  if (riskScore >= 60) return 'High';
  if (riskScore >= 40) return 'Medium';
  return 'Low';
}

function calculateComplianceScore(contract: ContractData): number {
  let score = 100;
  const deductions = 0;
  
  // Deduct points for missing required compliance elements
  if (contract.dataTerms?.compliance?.gdprCompliant === false) score -= 20;
  if (!contract.legalTerms.liability?.vendorLiabilityCap) score -= 10;
  if (!contract.terminationTerms.postTermination?.dataReturn?.required) score -= 15;
  
  return Math.max(0, score - deductions);
}

function calculateSLACompliance(contract: ContractData): number {
  // This would typically be calculated from actual performance data
  // For now, return a placeholder based on SLA strength
  const uptime = contract.serviceTerms.availability?.uptimeGuarantee;
  const hasServiceCredits = !!contract.serviceTerms.serviceCredits;
  
  if (uptime && uptime >= 99.9 && hasServiceCredits) return 95;
  if (uptime && uptime >= 99.5) return 85;
  if (uptime && uptime >= 99.0) return 75;
  return 60;
}