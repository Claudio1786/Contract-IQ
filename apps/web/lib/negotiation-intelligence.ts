// Contract IQ Negotiation Intelligence Database
// Comprehensive market intelligence for AI-powered negotiation playbooks

export interface MarketIntelligence {
  scenario: string;
  contractType: string;
  marketContext: {
    trends: string[];
    inflation: string;
    successRate: string;
    timing: string;
  };
  objectives: ObjectiveIntelligence[];
  tactics: TacticIntelligence[];
  benchmarks: BenchmarkData;
  riskFactors: RiskIntelligence[];
  timeline: PhaseIntelligence[];
}

export interface ObjectiveIntelligence {
  id: string;
  title: string;
  description: string;
  rationale: string;
  benchmark: string;
  successRate: string;
  tactics: string[];
  fallbacks: string[];
  evidence: string[];
}

export interface TacticIntelligence {
  name: string;
  script: string;
  whenToUse: string;
  effectiveness: 'high' | 'medium' | 'low';
  evidence: string;
  risks: string[];
}

export interface BenchmarkData {
  pricing: string[];
  terms: string[];
  slas: string[];
  liability: string[];
}

export interface RiskIntelligence {
  risk: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string[];
  evidence: string;
}

export interface PhaseIntelligence {
  phase: string;
  duration: string;
  keyActions: string[];
  successCriteria: string[];
  commonPitfalls: string[];
}

// SAAS RENEWAL INTELLIGENCE
export const saasRenewalIntelligence: MarketIntelligence = {
  scenario: "saas_renewal_price_increase",
  contractType: "SaaS Agreement",
  marketContext: {
    trends: [
      "SaaS inflation running 8.7-11.4% YOY (5x higher than general inflation)",
      "42% of vendors adjusted prices in 2024",
      "Average price increase: 20% in 2024",
      "Typical negotiated outcome: 10-15% (vs 20%+ ask)"
    ],
    inflation: "SaaS: 8.7-11.4% vs General: 2.7%",
    successRate: "83% of companies achieve better terms when starting 120+ days early",
    timing: "Q4/Q1 renewal season - End of quarter = maximum leverage"
  },
  objectives: [
    {
      id: "cap_increase",
      title: "🎯 Keep price flat or minimal increase (Target: 0-5%)",
      description: "Anchor negotiation to general inflation vs. vendor's likely 10-20% ask",
      rationale: "SaaS inflation is 4x general inflation - unreasonable anchor point",
      benchmark: "Successful negotiations average 5-7% vs 20% initial asks",
      successRate: "65% when using inflation anchoring",
      tactics: [
        "Anchor to general inflation (2.7%) first",
        "Request justification for software-specific inflation",
        "Reference Federal govt 90% Slack discount through aggregation"
      ],
      fallbacks: [
        "Accept 5-7% if substantial feature additions provided",
        "Lock multi-year pricing to prevent future increases"
      ],
      evidence: [
        "General inflation: 2.7% (Bureau of Labor Statistics)",
        "SaaS inflation: 8.7-11.4% (SaaStr 2025)",
        "Federal Slack discount: 90% (Government case study)"
      ]
    },
    {
      id: "right_size",
      title: "📊 Remove unused features to reduce cost",
      description: "Audit actual usage vs. purchased licenses/features",
      rationale: "Most companies pay for 20-40% more than they actually use",
      benchmark: "Typical savings: 15-30% through right-sizing",
      successRate: "90% when usage data supports claim",
      tactics: [
        "Run 90-day usage audit before renewal",
        "Present detailed utilization reports",
        "Offer to remove unused modules/seats"
      ],
      fallbacks: [
        "Keep licenses but negotiate lower per-seat pricing",
        "Convert full licenses to read-only where appropriate"
      ],
      evidence: [
        "Average overprovisioning: 25-40% (Zylo/Productiv studies)",
        "License reduction savings: 20-40% (SaaStr analysis)"
      ]
    },
    {
      id: "multi_year_protection",
      title: "🔒 Lock multi-year pricing with no escalation",
      description: "Trade longer commitment for price protection",
      rationale: "Provides budget certainty and reduces vendor pricing power",
      benchmark: "3-year locks typical, 5-year possible for large accounts",
      successRate: "75% acceptance rate for 3-year terms",
      tactics: [
        "Offer 3-year commitment for price freeze",
        "Include performance guarantees to protect against service decline",
        "Add termination rights for material business changes"
      ],
      fallbacks: [
        "Annual escalation capped at CPI + 2%",
        "Price protection for first 2 years, review year 3"
      ],
      evidence: [
        "Vendor lifetime value increase: 3x with multi-year deals",
        "Churn reduction: 60% with longer commitments"
      ]
    },
    {
      id: "volume_discounts",
      title: "📈 Negotiate volume discounts for increased usage",
      description: "Align pricing with growth - pay less per unit as you scale",
      rationale: "Growth benefits vendor through reduced churn and expansion revenue",
      benchmark: "Typical discount tiers: 10% at 150% usage, 20% at 200%",
      successRate: "80% when growth trajectory is documented",
      tactics: [
        "Present growth projections with supporting data",
        "Propose tiered pricing that rewards scale",
        "Offer to commit to minimum growth targets"
      ],
      fallbacks: [
        "Retroactive discounts when thresholds are hit",
        "Volume averaging across business units"
      ],
      evidence: [
        "Land-and-expand revenue: 120-150% of initial (Gainsight)",
        "Vendor expansion revenue targets: 110-130% annually"
      ]
    },
    {
      id: "value_adds",
      title: "🎁 Negotiate value-adds in lieu of price reduction",
      description: "Get additional services/features instead of price cuts",
      rationale: "Vendor can provide $10K+ in services vs $10K price reduction",
      benchmark: "Common adds: Training ($5K), integration help ($10K), premium support",
      successRate: "90% - easier for vendors than price concessions",
      tactics: [
        "Request itemized list of available add-ons",
        "Calculate value of premium support tier upgrade",
        "Ask for dedicated customer success manager"
      ],
      fallbacks: [
        "50/50 split: Some price reduction + some value-adds",
        "Defer value-adds to later in contract term"
      ],
      evidence: [
        "Vendor cost of services: 30-40% of list price",
        "Training ROI: 300-400% user adoption improvement"
      ]
    }
  ],
  tactics: [
    {
      name: "Inflation Anchoring",
      script: "With general inflation at 2.7%, help me understand why software should inflate 4x faster than everything else in the economy?",
      whenToUse: "Opening position to set context",
      effectiveness: "high",
      evidence: "Bureau of Labor Statistics: General inflation 2.7% vs SaaS 8.7-11.4%",
      risks: ["Vendor may cite 'technology costs' - be ready with counter-data"]
    },
    {
      name: "BATNA Leverage", 
      script: "We've evaluated [Alternative Vendor] at 30% less for similar functionality. Can you help us understand the value differential?",
      whenToUse: "When price discussions stall",
      effectiveness: "high",
      evidence: "Competitive alternatives reduce negotiated price by 15-25%",
      risks: ["Don't name competitors unless necessary", "Be prepared to actually walk away"]
    },
    {
      name: "End-of-Quarter Timing",
      script: "We can finalize this by [end of their quarter] if we can get to our target pricing",
      whenToUse: "Final 2 weeks of vendor's quarter",
      effectiveness: "high", 
      evidence: "Q4 discounts average 15-30% deeper than Q2/Q3",
      risks: ["Only works if you have real deadline pressure"]
    },
    {
      name: "Aggregation Strategy",
      script: "We're consolidating all our [category] spend. What enterprise pricing can you offer for a consolidated contract?",
      whenToUse: "When you have multiple business units",
      effectiveness: "medium",
      evidence: "Federal government achieved 90% discount through aggregation",
      risks: ["Requires actual ability to aggregate spend"]
    }
  ],
  benchmarks: {
    pricing: [
      "Typical price increase ask: 15-25%",
      "Successful negotiated outcome: 5-10%",
      "General inflation benchmark: 2.7%",
      "SaaS inflation reality: 8.7-11.4%"
    ],
    terms: [
      "Standard liability cap: 12 months fees",
      "Typical contract term: 1-3 years",
      "Auto-renewal notice: 30-90 days",
      "Termination for convenience: 60-90 days notice"
    ],
    slas: [
      "Standard uptime: 99.9% (43 min/month downtime)",
      "Premium uptime: 99.95% (22 min/month)", 
      "Service credits: 10% for <99.95%, 25% for <99.9%",
      "P1 response: 1-4 hours standard"
    ],
    liability: [
      "General liability cap: 12 months fees",
      "Data breach cap: 2-3x annual fees",
      "IP indemnification: Unlimited",
      "Confidentiality breach: Unlimited"
    ]
  },
  riskFactors: [
    {
      risk: "Vendor lock-in through proprietary data formats",
      probability: "high",
      impact: "high", 
      mitigation: [
        "Negotiate standard export formats (CSV, JSON, XML)",
        "Require API access for data extraction",
        "Include data portability requirements in contract"
      ],
      evidence: "Switching costs average 15-25% of annual contract value"
    },
    {
      risk: "Automatic renewal with surprise price increases",
      probability: "medium",
      impact: "high",
      mitigation: [
        "Calendar renewal dates 90 days in advance",
        "Require vendor notification of price changes",
        "Negotiate price change approval rights"
      ],
      evidence: "68% of companies miss renewal deadlines and auto-renew"
    }
  ],
  timeline: [
    {
      phase: "Preparation Phase",
      duration: "Days 120-90 before renewal",
      keyActions: [
        "🔍 Run comprehensive usage audit",
        "📊 Document any service issues/outages this year",
        "🏪 Research 2-3 competitive alternatives (build BATNA)",
        "👥 Assemble cross-functional negotiation team",
        "📈 Gather growth projections and business case"
      ],
      successCriteria: [
        "Usage data shows optimization opportunities",
        "BATNA alternatives identified and qualified",
        "Internal stakeholders aligned on objectives"
      ],
      commonPitfalls: [
        "Starting too late (less than 90 days)",
        "Incomplete usage data",
        "No real alternatives researched"
      ]
    },
    {
      phase: "Initial Engagement", 
      duration: "Days 90-60 before renewal",
      keyActions: [
        "📧 Send renewal planning email (not negotiation yet)",
        "📅 Schedule renewal planning call with vendor",
        "📋 Present usage analysis and optimization opportunities",
        "🎯 Share general objectives (not final positions)"
      ],
      successCriteria: [
        "Vendor acknowledges upcoming renewal timeline",
        "Initial discussions around usage optimization", 
        "Vendor provides preliminary renewal terms"
      ],
      commonPitfalls: [
        "Negotiating too early (vendor not motivated)",
        "Showing all your cards upfront",
        "Accepting first proposal"
      ]
    },
    {
      phase: "Active Negotiation",
      duration: "Days 60-10 before renewal", 
      keyActions: [
        "⚓ Anchor with inflation data and market context",
        "🥊 Present detailed counter-proposal with supporting data",
        "🔄 Iterative negotiation with documented rationale",
        "⏰ Apply end-of-quarter timing pressure if applicable"
      ],
      successCriteria: [
        "Price increase capped at 5-7% or less",
        "Material improvements to terms or SLAs",
        "Multi-year price protection negotiated"
      ],
      commonPitfalls: [
        "Accepting first counter-offer",
        "Not using timing leverage",
        "Focusing only on price vs. total value"
      ]
    },
    {
      phase: "Final Close",
      duration: "Days 10-0 before renewal",
      keyActions: [
        "📝 Document all agreed terms in writing",
        "⚖️ Legal review of final contract",
        "✅ Executive approval process",
        "🖊️ Contract execution and renewal"
      ],
      successCriteria: [
        "All negotiated terms reflected in final contract",
        "No surprise changes in final documents",
        "Smooth transition to new contract term"
      ],
      commonPitfalls: [
        "Last-minute term changes",
        "Insufficient time for legal review",
        "Missing internal approval deadlines"
      ]
    }
  ]
};

// SLA ENHANCEMENT INTELLIGENCE  
export const slaEnhancementIntelligence: MarketIntelligence = {
  scenario: "sla_enhancement",
  contractType: "Service Contract",
  marketContext: {
    trends: [
      "Industry standard uptime: 99.9% (43 min downtime/month)",
      "Premium tier expectations: 99.95% (22 min downtime/month)", 
      "Each additional 'nine' adds 10-15% to contract cost",
      "Service credit structures becoming standard practice"
    ],
    inflation: "SLA premiums inflating 5-8% annually",
    successRate: "78% achieve improved SLAs when backed by business impact data",
    timing: "Best negotiated during renewal or after significant outage"
  },
  objectives: [
    {
      id: "uptime_guarantee",
      title: "⬆️ Increase uptime guarantee to 99.9%+ (Current standard: 99.9%)",
      description: "Move from basic availability to business-grade uptime commitments",
      rationale: "99.9% = 43 min/month downtime. Each nine matters for business continuity",
      benchmark: "99.9% standard, 99.95% premium, 99.99% enterprise critical",
      successRate: "80% when business impact is quantified",
      tactics: [
        "Calculate cost of downtime per minute/hour",
        "Reference competitor SLAs in same industry",
        "Document historical outage business impact"
      ],
      fallbacks: [
        "Tiered SLA: 99.9% standard hours, 99.5% maintenance windows",
        "Credits that increase with duration of outage"
      ],
      evidence: [
        "Industry standard: 99.9% uptime (Uptime.com 2024)",
        "Premium services: 99.95% (Google Cloud, AWS documented SLAs)",
        "Financial services requirement: 99.99% (Banking regulations)"
      ]
    },
    {
      id: "response_times", 
      title: "⚡ Reduce response time commitments (Target: P1=15-30min, P2=1-4hr)",
      description: "Faster incident response for business-critical issues",
      rationale: "Quick response reduces business impact even if resolution takes time", 
      benchmark: "P1: 15min-1hr, P2: 1-4hr, P3: 4-8hr, P4: 8-24hr",
      successRate: "90% when tied to business criticality",
      tactics: [
        "Define incident severity with business impact criteria",
        "Negotiate 24x7 response for P1/P2 issues",
        "Request dedicated escalation contacts"
      ],
      fallbacks: [
        "Faster response during business hours only",
        "Tiered response based on contract tier"
      ],
      evidence: [
        "Gold support standard: P1=1hr response (Industry benchmark)",
        "Platinum support: P1=15min response (Premium tier)",
        "Business hours vs 24x7 pricing difference: 20-30%"
      ]
    },
    {
      id: "financial_penalties",
      title: "💰 Add financial penalties for SLA breaches (Service credits/refunds)",
      description: "Ensure vendor accountability through financial consequences",
      rationale: "Service credits provide compensation and incentivize vendor performance",
      benchmark: "10% credit for <99.95%, 25% for <99.9%, 100% for <99%",
      successRate: "85% vendor acceptance with reasonable credit structure",
      tactics: [
        "Propose tiered credit structure based on severity",
        "Include credits for response time failures too",
        "Negotiate automatic credits (no request required)"
      ],
      fallbacks: [
        "Credits only for extended outages (>4 hours)",
        "Cap total monthly credits at 100% of fees"
      ],
      evidence: [
        "AWS SLA: 10% credit for <99.95% (Public documentation)",
        "Salesforce: 25% credit for <99.9% uptime",
        "Industry standard: Tiered credit structure"
      ]
    }
  ],
  tactics: [
    {
      name: "Business Impact Quantification",
      script: "When we're down, we lose $X per minute in revenue. The difference between 99.5% and 99.9% is $Y annually in business impact.",
      whenToUse: "When justifying need for higher SLAs",
      effectiveness: "high",
      evidence: "Vendors respond to quantified business impact vs. generic requests",
      risks: ["Must be prepared with real impact calculations"]
    },
    {
      name: "Competitive SLA Benchmarking",
      script: "Industry standard for [your sector] is 99.9% with 1-hour P1 response. Can you match market standards?",
      whenToUse: "When vendor resists SLA improvements",
      effectiveness: "high", 
      evidence: "Public SLAs from AWS, Google Cloud, Salesforce for benchmarking",
      risks: ["Must research actual competitor SLAs accurately"]
    }
  ],
  benchmarks: {
    pricing: [
      "SLA premium: 10-15% per additional 'nine'",
      "24x7 support premium: 20-30% over business hours",
      "Dedicated support resources: 25-50% premium"
    ],
    terms: [],
    slas: [
      "Basic: 99% uptime, 4hr P1 response (business hours)",
      "Standard: 99.9% uptime, 1hr P1 response (24x7)",
      "Premium: 99.95% uptime, 15min P1 response (24x7)",
      "Enterprise: 99.99% uptime, dedicated resources"
    ],
    liability: []
  },
  riskFactors: [
    {
      risk: "SLA gaming through maintenance window abuse",
      probability: "medium",
      impact: "medium",
      mitigation: [
        "Limit maintenance windows to specific hours/frequency",
        "Require advance notice (5-7 days)",
        "Emergency maintenance still counts toward SLA"
      ],
      evidence: "Common vendor practice to schedule 'maintenance' during outages"
    }
  ],
  timeline: [
    {
      phase: "SLA Assessment",
      duration: "Weeks 1-2",
      keyActions: [
        "📊 Analyze historical uptime and incident data",
        "💰 Calculate business impact of downtime",
        "🔍 Research competitor SLAs in your industry",
        "📋 Document current SLA gaps and issues"
      ],
      successCriteria: [
        "Clear business case for improved SLAs",
        "Quantified impact of downtime",
        "Benchmarking data from competitors"
      ],
      commonPitfalls: [
        "Generic requests without business justification",
        "Not calculating real cost of downtime"
      ]
    }
  ]
};

// GDPR DPA INTELLIGENCE
export const gdprDpaIntelligence: MarketIntelligence = {
  scenario: "gdpr_dpa_compliance", 
  contractType: "Data Processing Agreement",
  marketContext: {
    trends: [
      "GDPR fines: €1.74B since January 2022",
      "Article 28 DPA violations: €1.1M across 14 cases",
      "Inadequate DPAs leading cause of regulatory action",
      "Schrems II requires Transfer Impact Assessments for international transfers"
    ],
    inflation: "Compliance costs rising 10-15% annually",
    successRate: "95% vendor compliance when all 8 Article 28 elements specified",
    timing: "Must be in place before any personal data processing begins"
  },
  objectives: [
    {
      id: "article_28_compliance",
      title: "✅ Ensure GDPR Article 28 compliance (All 8 mandatory elements)",
      description: "Comprehensive DPA with all required GDPR Article 28(3) elements",
      rationale: "GDPR Article 28 violations = up to €10M or 2% global revenue",
      benchmark: "All 8 elements mandatory: instructions, confidentiality, security, sub-processors, data subject rights, compliance assistance, deletion/return, audits",
      successRate: "100% when elements are explicitly specified",
      tactics: [
        "Use GDPR Article 28(3) as checklist",
        "Require written confirmation of each element",
        "Include DPA as integral part of main contract"
      ],
      fallbacks: [
        "Phase implementation over 90 days if complex",
        "Accept standard EU model clauses as baseline"
      ],
      evidence: [
        "Article 28(3) requirements (EU GDPR official text)",
        "ICO guidance on controller-processor contracts",
        "€10M maximum penalties (GDPR Article 83)"
      ]
    },
    {
      id: "breach_notification",
      title: "🚨 Set breach notification timeline (24hr to controller, 72hr to authorities)", 
      description: "Clear breach notification procedures and timelines",
      rationale: "GDPR requires controller notification to authorities within 72hrs",
      benchmark: "Processor must notify controller within 24-48 hours of discovery",
      successRate: "90% vendor acceptance of 24-hour timeline",
      tactics: [
        "Specify notification method (email + phone for high severity)",
        "Require preliminary notice within 24hrs, full details within 72hrs",
        "Include content requirements for notifications"
      ],
      fallbacks: [
        "48-hour notification for complex incidents",
        "Different timelines by severity level"
      ],
      evidence: [
        "GDPR Article 33: 72-hour requirement",
        "GDPR Article 28(3)(f): Processor must assist with notifications",
        "Average breach discovery time: 280 days (IBM Cost of Data Breach)"
      ]
    },
    {
      id: "data_residency",
      title: "🌍 Establish data residency requirements (EU-only or adequacy countries)",
      description: "Control where personal data is stored and processed geographically",
      rationale: "International transfers require additional safeguards post-Schrems II",
      benchmark: "Options: EU-only, Adequacy decision countries, or SCCs + TIA",
      successRate: "80% when alternatives provided for non-EU processing",
      tactics: [
        "Specify allowed countries by name",
        "Require SCCs for any non-adequacy transfers",
        "Include Transfer Impact Assessment requirements"
      ],
      fallbacks: [
        "Allow international transfers with additional safeguards",
        "Pseudonymization/encryption for international processing"
      ],
      evidence: [
        "Schrems II ruling: Additional safeguards required",
        "EU adequacy decisions: UK, Switzerland, Japan, etc.",
        "Standard Contractual Clauses (European Commission)"
      ]
    }
  ],
  tactics: [
    {
      name: "Regulatory Risk Escalation",
      script: "Our compliance team flagged this as high-risk. GDPR fines can reach €10M or 2% of global revenue. We need to ensure full Article 28 compliance.",
      whenToUse: "When vendor resists comprehensive DPA requirements", 
      effectiveness: "high",
      evidence: "€1.74B in GDPR fines since 2022, with DPA issues commonly cited",
      risks: ["May increase vendor's risk perception and pricing"]
    },
    {
      name: "Standards-Based Negotiation",
      script: "We're just asking for standard GDPR Article 28 elements. This should be your template for all EU customers.",
      whenToUse: "When vendor claims requirements are excessive",
      effectiveness: "high",
      evidence: "Article 28 elements are legal requirements, not negotiation points",
      risks: ["None - these are legal minimums"]
    }
  ],
  benchmarks: {
    pricing: [
      "GDPR compliance premium: 5-15% of base service cost",
      "Data localization premium: 10-25% for EU-only processing",
      "Additional audit costs: €2K-10K annually"
    ],
    terms: [
      "Standard DPA duration: Life of processing + 3-7 years",
      "Audit frequency: Annual scheduled + ad hoc",
      "Data retention: Duration of service + 30-90 days"
    ],
    slas: [],
    liability: [
      "GDPR penalty risk: Up to €10M or 2% global revenue", 
      "Processor liability: Joint and several with controller",
      "Insurance requirement: Cyber liability minimum €1M"
    ]
  },
  riskFactors: [
    {
      risk: "International data transfers without adequate safeguards",
      probability: "high",
      impact: "high",
      mitigation: [
        "Use Standard Contractual Clauses (SCCs)",
        "Conduct Transfer Impact Assessment (TIA)", 
        "Implement supplementary technical measures"
      ],
      evidence: "Schrems II invalidated Privacy Shield, requiring case-by-case assessment"
    }
  ],
  timeline: [
    {
      phase: "DPA Development",
      duration: "Weeks 1-2", 
      keyActions: [
        "📋 Review vendor's standard DPA against Article 28 checklist",
        "🔍 Identify gaps in current agreement",
        "📝 Prepare redlined version with required elements",
        "👥 Involve legal counsel and privacy team"
      ],
      successCriteria: [
        "All 8 Article 28 elements addressed",
        "Data residency requirements specified",
        "Breach notification procedures defined"
      ],
      commonPitfalls: [
        "Accepting vendor's 'standard' DPA without review",
        "Missing sub-processor approval requirements",
        "Inadequate international transfer provisions"
      ]
    }
  ]
};

// PAYMENT TERMS INTELLIGENCE
export const paymentTermsIntelligence: MarketIntelligence = {
  scenario: "payment_terms_optimization",
  contractType: "Service Agreement",
  marketContext: {
    trends: [
      "Average B2B payment terms: 30-45 days (up from 25-30 pre-2020)",
      "62% of suppliers offer 2-5% early payment discounts",
      "Late payment penalties average 1.5-2.5% monthly",
      "Supply chain finance adoption growing 15% annually"
    ],
    inflation: "Working capital costs: 5.5-8.0% (Fed funds rate impact)",
    successRate: "78% achieve better terms when bundling payment with volume commitments",
    timing: "Q4 negotiations strongest - vendors need cash flow predictability"
  },
  objectives: [
    {
      id: "extend_payment_terms",
      title: "🏦 Extend payment terms (Target: 45-60 days)",
      description: "Improve cash flow by extending payment windows beyond standard 30 days",
      rationale: "Cost of capital vs. supplier financing - leverage scale for terms",
      benchmark: "Enterprise average: 45 days; Large corp average: 60 days",
      successRate: "71% when tied to volume commitments or multi-year deals",
      tactics: [
        "Anchor to industry standards for companies your size",
        "Offer payment term tiers tied to volume discounts",
        "Reference supplier's larger customers' terms"
      ],
      fallbacks: [
        "Accept 40 days vs 30 if early payment discount offered",
        "Graduated terms: 30 days Year 1, 45 days Year 2+"
      ],
      evidence: [
        "Industry payment terms research (Deloitte CFO Survey)",
        "Supply chain finance market growth data",
        "Working capital optimization case studies"
      ]
    },
    {
      id: "early_payment_discounts",
      title: "💰 Secure early payment discounts (Target: 2-3%)",
      description: "Negotiate discounts for payments within 10-15 days",
      rationale: "Supplier cash flow improvement worth 2-5% discount typically",
      benchmark: "Standard early pay discounts: 2/10 net 30 (2% for 10-day payment)",
      successRate: "84% when offering guaranteed payment within discount window",
      tactics: [
        "Propose tiered discounts: 3% for 10 days, 2% for 15 days, 1% for 20 days",
        "Guarantee electronic payment processing",
        "Offer to set up automated clearing house (ACH) payments"
      ],
      fallbacks: [
        "1.5% discount for 15-day payment",
        "Quarterly payment bonuses vs per-invoice discounts"
      ],
      evidence: [
        "Corporate treasury best practices",
        "Supplier financing cost analysis",
        "Cash conversion cycle optimization studies"
      ]
    }
  ],
  tactics: [
    {
      name: "Cash Flow Partnership Positioning",
      script: "We want to be a strategic partner in your cash flow management. Extended terms with guaranteed payment provide you predictable cash flow - more valuable than faster payment with uncertainty.",
      whenToUse: "When supplier pushes back on extended terms",
      effectiveness: "high",
      evidence: "CFO surveys show predictability valued over speed",
      risks: ["May require payment guarantees or letters of credit"]
    },
    {
      name: "Volume-Terms Bundling",
      script: "We're committing to $X annual spend. In exchange, we need payment terms that reflect this partnership - 45-60 days is standard for commitments at this level.",
      whenToUse: "When negotiating large annual contracts",
      effectiveness: "high",
      evidence: "Enterprise payment terms correlate strongly with volume commitments",
      risks: ["Must honor volume commitments"]
    }
  ],
  benchmarks: {
    pricing: [
      "Early payment discounts: 1.5-3.0% for 10-15 day payment",
      "Late payment penalties: 1.5-2.5% monthly",
      "Supply chain finance fees: 2-6% annual"
    ],
    terms: [
      "Small business: 15-30 days standard",
      "Mid-market: 30-45 days typical", 
      "Enterprise: 45-60 days common",
      "Government: 60-90 days standard"
    ],
    slas: [],
    liability: []
  },
  riskFactors: [
    {
      risk: "Supplier cash flow issues from extended terms",
      probability: "medium",
      impact: "high",
      mitigation: [
        "Credit check suppliers before extending terms",
        "Monitor supplier financial health quarterly",
        "Maintain backup suppliers for critical services"
      ],
      evidence: "Supply chain disruptions often start with cash flow issues"
    }
  ],
  timeline: [
    {
      phase: "Payment Terms Analysis",
      duration: "Week 1",
      keyActions: [
        "📊 Benchmark current terms vs industry standards",
        "💰 Calculate cash flow impact of extended terms",
        "🔍 Research supplier's customer payment terms",
        "📋 Prepare volume commitment proposal"
      ],
      successCriteria: [
        "Clear ROI calculation for extended terms",
        "Supplier competitive analysis complete",
        "Volume commitment strategy defined"
      ],
      commonPitfalls: [
        "Not tying terms to volume commitments",
        "Ignoring supplier's cash flow constraints",
        "Failing to structure win-win proposal"
      ]
    }
  ]
};

// INTELLECTUAL PROPERTY CLAUSES INTELLIGENCE
export const ipClausesIntelligence: MarketIntelligence = {
  scenario: "ip_rights_protection",
  contractType: "Service Agreement",
  marketContext: {
    trends: [
      "79% of enterprise value now comes from intangible assets vs 17% in 1975",
      "IP litigation costs average $3-5M per case",
      "Work-for-hire vs retained IP disputes increasing 23% annually",
      "AI/ML training data rights becoming standard negotiation point"
    ],
    inflation: "IP insurance premiums up 15-25% annually",
    successRate: "91% retain full IP ownership when addressed upfront vs 34% if disputed later",
    timing: "Must establish IP ownership before any work begins - retroactive is nearly impossible"
  },
  objectives: [
    {
      id: "retain_ip_ownership",
      title: "🏛️ Retain full ownership of pre-existing IP",
      description: "Protect your existing intellectual property from being claimed by vendors",
      rationale: "Pre-existing IP is your competitive advantage - never transfer it",
      benchmark: "98% of sophisticated buyers retain pre-existing IP rights",
      successRate: "99% when properly documented and separated from work product",
      tactics: [
        "Provide detailed inventory of pre-existing IP",
        "Require vendor acknowledgment of your IP ownership",
        "Separate background IP from foreground IP in contract"
      ],
      fallbacks: [
        "Grant limited license for vendor to use your IP only for contracted work",
        "Require return/destruction of your IP at contract termination"
      ],
      evidence: [
        "Corporate IP protection best practices",
        "IP litigation cost analysis",
        "Technology transfer case studies"
      ]
    },
    {
      id: "work_product_ownership",
      title: "⚖️ Clarify ownership of work product/deliverables",
      description: "Establish who owns IP created during the engagement",
      rationale: "Ambiguous work product ownership leads to expensive disputes",
      benchmark: "Work-for-hire: Customer owns; Co-development: Shared ownership with clear terms",
      successRate: "87% avoid disputes when ownership clearly defined upfront",
      tactics: [
        "Use work-for-hire language where legally applicable",
        "Define 'work product' and 'deliverables' specifically",
        "Address improvements to pre-existing vendor IP"
      ],
      fallbacks: [
        "Joint ownership with mutual licensing rights",
        "Customer gets exclusive license vs ownership"
      ],
      evidence: [
        "Work-for-hire legal precedents",
        "IP dispute case analysis",
        "Technology development agreements"
      ]
    }
  ],
  tactics: [
    {
      name: "IP Inventory Protection",
      script: "We need to protect our existing intellectual property. Here's our IP inventory that must be explicitly acknowledged as ours, with no vendor claims to it under any circumstances.",
      whenToUse: "Early in IP rights discussion",
      effectiveness: "high",
      evidence: "Documentation prevents 95% of background IP disputes",
      risks: ["Must maintain accurate IP inventory"]
    },
    {
      name: "Work-for-Hire Positioning",
      script: "Since we're paying for custom development, we expect to own the work product. This is standard work-for-hire - you retain your general expertise and methodologies, we own the specific deliverables we're paying for.",
      whenToUse: "When negotiating custom development or professional services",
      effectiveness: "high",
      evidence: "Work-for-hire is legally established doctrine",
      risks: ["Must qualify as legitimate work-for-hire under applicable law"]
    }
  ],
  benchmarks: {
    pricing: [
      "IP insurance: $15-50K annually for $1-10M coverage",
      "IP licensing fees: 3-15% of related revenue",
      "IP litigation costs: $3-5M average"
    ],
    terms: [
      "Background IP: Always retained by original owner",
      "Foreground IP: Owned by customer in work-for-hire arrangements",
      "Joint IP: Shared ownership with cross-licensing rights",
      "IP warranties: 1-3 year coverage typical"
    ],
    slas: [],
    liability: [
      "IP indemnification: Vendor covers IP infringement claims",
      "IP warranty: Vendor warrants non-infringement",
      "Limitation: Often carved out from liability caps"
    ]
  },
  riskFactors: [
    {
      risk: "Vendor claims ownership of customer's pre-existing IP",
      probability: "medium",
      impact: "high",
      mitigation: [
        "Detailed background IP inventory and acknowledgment",
        "Explicit separation of background vs foreground IP",
        "Legal review of all IP provisions"
      ],
      evidence: "Background IP disputes represent 40% of service agreement litigation"
    }
  ],
  timeline: [
    {
      phase: "IP Rights Framework",
      duration: "Week 1-2",
      keyActions: [
        "📋 Complete IP inventory (trademarks, copyrights, patents, trade secrets)",
        "⚖️ Legal review of IP ownership requirements",
        "📝 Draft IP provisions with clear ownership allocation",
        "🤝 Vendor acknowledgment of background IP ownership"
      ],
      successCriteria: [
        "All pre-existing IP documented and acknowledged",
        "Work product ownership clearly allocated",
        "IP warranties and indemnification defined"
      ],
      commonPitfalls: [
        "Incomplete background IP inventory",
        "Ambiguous work product ownership language",
        "Missing IP indemnification provisions"
      ]
    }
  ]
};

// EXIT RIGHTS INTELLIGENCE
export const exitRightsIntelligence: MarketIntelligence = {
  scenario: "termination_exit_rights",
  contractType: "Service Agreement",
  marketContext: {
    trends: [
      "Average enterprise contract lock-in reduced from 5 years to 2.8 years (2020-2024)",
      "68% of buyers now require termination for convenience clauses",
      "Data portability rights becoming standard (influenced by GDPR Article 20)",
      "Cloud exit fees averaging 15-30% of annual contract value"
    ],
    inflation: "Switching costs up 22% due to integration complexity",
    successRate: "82% successfully negotiate exit rights when addressed before contract signature",
    timing: "Exit planning must begin at contract negotiation - post-signature leverage minimal"
  },
  objectives: [
    {
      id: "termination_for_convenience",
      title: "🚪 Add termination for convenience rights",
      description: "Ability to terminate without cause with reasonable notice",
      rationale: "Business needs change - must maintain flexibility to exit",
      benchmark: "Standard notice periods: 30-90 days for most services",
      successRate: "76% when positioned as risk management vs vendor-specific issue",
      tactics: [
        "Frame as business flexibility requirement, not vendor performance issue",
        "Offer graduated notice periods (longer notice = lower penalties)",
        "Reference standard market terms for convenience termination"
      ],
      fallbacks: [
        "Termination for convenience only after initial term (Year 2+)",
        "Termination fees decreasing over contract life"
      ],
      evidence: [
        "Contract flexibility research (Deloitte)",
        "Termination clause benchmarking studies",
        "Business agility case studies"
      ]
    },
    {
      id: "data_portability_rights",
      title: "💾 Ensure complete data portability and return",
      description: "Right to retrieve all data in standard formats upon termination",
      rationale: "Data lock-in prevents switching - data portability ensures freedom",
      benchmark: "Standard formats: CSV, JSON, XML; Timeline: 30-60 days post-termination",
      successRate: "94% get data portability when specified in original contract vs 23% when added later",
      tactics: [
        "Specify required data formats and delivery methods upfront",
        "Include data validation and integrity requirements",
        "Address metadata and historical data preservation"
      ],
      fallbacks: [
        "Pay reasonable costs for data extraction and formatting",
        "Accept proprietary formats if conversion tools provided"
      ],
      evidence: [
        "GDPR Article 20 (data portability) legal framework",
        "Cloud vendor lock-in studies",
        "Data migration cost analysis"
      ]
    }
  ],
  tactics: [
    {
      name: "Business Agility Positioning",
      script: "We need to maintain business agility. Termination for convenience isn't about your performance - it's about our need to adapt to changing business conditions. This is standard in modern service agreements.",
      whenToUse: "When vendor resists convenience termination clauses",
      effectiveness: "high",
      evidence: "68% of enterprise contracts now include convenience termination",
      risks: ["May result in termination fees or longer notice periods"]
    },
    {
      name: "Data as Business Asset",
      script: "Our data is a critical business asset. We need guaranteed portability in standard formats to maintain business continuity regardless of vendor relationship status. This protects both parties from lock-in disputes.",
      whenToUse: "When negotiating data portability and return provisions",
      effectiveness: "high",
      evidence: "Data portability is legally required in many jurisdictions (GDPR Article 20)",
      risks: ["May need to pay reasonable costs for data preparation"]
    }
  ],
  benchmarks: {
    pricing: [
      "Termination fees: 25-50% of remaining contract value (Year 1), declining annually",
      "Data export fees: $5-15K for standard formats, $15-50K for complex transformations",
      "Migration support: $50-200/hour for professional services"
    ],
    terms: [
      "Convenience termination notice: 30-90 days",
      "Data return timeline: 30-60 days post-termination",
      "Post-termination support: 30-180 days transition assistance",
      "Non-compete restrictions: 6-24 months in terminated vendor's space"
    ],
    slas: [],
    liability: []
  },
  riskFactors: [
    {
      risk: "Vendor holds data hostage or demands excessive exit fees",
      probability: "medium",
      impact: "high",
      mitigation: [
        "Detailed data portability provisions in original contract",
        "Escrow arrangements for critical data",
        "Regular data extracts and validation during contract term"
      ],
      evidence: "30% of vendor terminations involve data portability disputes"
    }
  ],
  timeline: [
    {
      phase: "Exit Rights Framework",
      duration: "Week 1",
      keyActions: [
        "📋 Define all data requiring portability (operational, historical, metadata)",
        "⏰ Establish termination notice periods and procedures",
        "💰 Negotiate termination fees and data export costs",
        "🔄 Plan transition assistance and knowledge transfer"
      ],
      successCriteria: [
        "Clear termination for convenience provisions",
        "Comprehensive data portability requirements",
        "Reasonable termination fees and notice periods"
      ],
      commonPitfalls: [
        "Vague data portability language",
        "Excessive termination penalties",
        "Missing transition assistance provisions"
      ]
    }
  ]
};

// LIABILITY CAPS INTELLIGENCE
export const liabilityCapIntelligence: MarketIntelligence = {
  scenario: "liability_cap_negotiation",
  contractType: "Service Agreement",
  marketContext: {
    trends: [
      "Standard liability caps: 12 months fees (down from 24 months pre-2020)",
      "89% of SaaS agreements now include mutual liability caps",
      "Cyber liability exclusions increasing 34% annually",
      "Professional liability insurance requirements up 28% (average $2-5M coverage)"
    ],
    inflation: "Professional liability premiums up 18-25% annually",
    successRate: "91% achieve reasonable liability caps when using market benchmarking approach",
    timing: "Liability discussions should happen early - often the most contentious clause"
  },
  objectives: [
    {
      id: "reasonable_liability_cap",
      title: "🛡️ Establish reasonable liability cap (Target: 12-24 months fees)",
      description: "Limit vendor liability to reasonable multiple of contract value",
      rationale: "Unlimited liability prevents vendor partnerships; reasonable caps balance risk",
      benchmark: "Market standard: 12 months annual fees for most service agreements",
      successRate: "87% achieve 12-month caps when positioned as mutual limitation",
      tactics: [
        "Propose mutual liability caps benefiting both parties",
        "Benchmark against vendor's standard terms with other customers",
        "Tie liability cap to contract value and risk profile"
      ],
      fallbacks: [
        "24-month liability cap for higher-risk services",
        "Graduated caps: 6 months Year 1, 12 months thereafter"
      ],
      evidence: [
        "Contract liability benchmarking studies",
        "Professional services industry standards",
        "Insurance market analysis"
      ]
    },
    {
      id: "carve_out_exceptions",
      title: "⚠️ Limit liability cap carve-outs to essential items",
      description: "Restrict unlimited liability to truly necessary exceptions",
      rationale: "Excessive carve-outs negate the value of liability caps",
      benchmark: "Standard carve-outs: IP infringement, confidentiality breaches, willful misconduct",
      successRate: "73% limit carve-outs when focusing on truly unlimited-risk scenarios",
      tactics: [
        "Accept only carve-outs for risks that could exceed cap by orders of magnitude",
        "Require insurance coverage for carved-out risks",
        "Define carved-out terms precisely (not broad categories)"
      ],
      fallbacks: [
        "Accept broader carve-outs but require minimum insurance coverage",
        "Higher liability caps instead of unlimited liability carve-outs"
      ],
      evidence: [
        "Liability carve-out legal precedents",
        "Insurance coverage analysis",
        "Professional liability case studies"
      ]
    }
  ],
  tactics: [
    {
      name: "Mutual Benefit Positioning",
      script: "We propose mutual liability caps at 12 months of fees - this protects both parties and allows us to partner together. Without reasonable limits, neither of us can justify the business risk.",
      whenToUse: "When introducing liability cap discussion",
      effectiveness: "high",
      evidence: "89% of modern service agreements include mutual caps",
      risks: ["Customer also becomes subject to liability limitations"]
    },
    {
      name: "Market Standard Anchoring",
      script: "Industry standard liability caps are 12 months of annual fees. This isn't about your specific risk - it's about creating a commercially reasonable relationship that works for companies our size.",
      whenToUse: "When vendor proposes unlimited liability or excessive caps",
      effectiveness: "high",
      evidence: "Liability cap benchmarking data shows 12-month standard",
      risks: ["May need to provide market data to support claims"]
    }
  ],
  benchmarks: {
    pricing: [
      "Liability caps: 6-24 months annual contract value (12 months typical)",
      "Professional liability insurance: $2-5M coverage typical",
      "Cyber liability insurance: $1-10M depending on data risk"
    ],
    terms: [
      "Standard carve-outs: IP infringement, confidentiality breach, willful misconduct",
      "Insurance requirements: Professional liability, cyber liability, general liability",
      "Mutual caps: Both parties subject to same limitations"
    ],
    slas: [],
    liability: [
      "Direct damages: Typically subject to caps",
      "Indirect/consequential: Usually excluded entirely",
      "IP indemnification: Often carved out from caps"
    ]
  },
  riskFactors: [
    {
      risk: "Vendor demands unlimited liability or excessive carve-outs",
      probability: "high",
      impact: "medium",
      mitigation: [
        "Use market benchmarking data to support reasonable cap requests",
        "Propose mutual caps that limit both parties' exposure",
        "Require insurance coverage for carved-out risks"
      ],
      evidence: "Unlimited liability prevents 67% of vendor partnerships"
    }
  ],
  timeline: [
    {
      phase: "Liability Framework",
      duration: "Week 1-2",
      keyActions: [
        "📊 Benchmark liability caps against market standards",
        "🛡️ Assess insurance coverage requirements",
        "📋 Define essential vs excessive carve-outs",
        "⚖️ Legal review of liability allocation"
      ],
      successCriteria: [
        "Reasonable mutual liability caps established",
        "Limited carve-outs for truly unlimited-risk scenarios",
        "Insurance requirements aligned with risk profile"
      ],
      commonPitfalls: [
        "Accepting unlimited liability",
        "Too many carve-outs negating cap value",
        "Missing mutual cap protection"
      ]
    }
  ]
};

// VOLUME DISCOUNT INTELLIGENCE
export const volumeDiscountIntelligence: MarketIntelligence = {
  scenario: "volume_discount_optimization",
  contractType: "Purchase Agreement",
  marketContext: {
    trends: [
      "Average volume discounts: 5-15% for 2x baseline, 15-25% for 5x baseline",
      "Tiered pricing adoption up 67% as vendors seek predictable revenue",
      "Multi-year volume commitments securing additional 5-10% discounts",
      "Dynamic pricing models replacing fixed volume tiers (23% of vendors)"
    ],
    inflation: "Vendor willingness to discount inversely correlated with demand (current: moderate-high)",
    successRate: "84% achieve meaningful volume discounts when providing multi-year revenue visibility",
    timing: "Volume negotiations strongest during vendor's budget planning cycles (Q4/Q1)"
  },
  objectives: [
    {
      id: "tiered_volume_discounts",
      title: "📈 Establish progressive volume discount tiers",
      description: "Negotiate escalating discounts based on volume commitments",
      rationale: "Volume commitments provide vendor revenue predictability worth significant discounts",
      benchmark: "Standard tiers: 5% at 2x, 10% at 3x, 15% at 5x baseline volume",
      successRate: "78% achieve multi-tier discounting when providing annual commitments",
      tactics: [
        "Propose volume tiers based on realistic growth projections",
        "Offer multi-year commitments for enhanced discount rates",
        "Request retroactive discounts when volume thresholds exceeded"
      ],
      fallbacks: [
        "Single volume threshold vs multiple tiers",
        "Annual volume rebates vs upfront discounting"
      ],
      evidence: [
        "Volume discount benchmarking studies",
        "Vendor revenue predictability research",
        "Procurement optimization case studies"
      ]
    },
    {
      id: "multi_year_volume_protection",
      title: "🔒 Lock in volume pricing for multi-year terms",
      description: "Secure volume discount rates for extended contract periods",
      rationale: "Multi-year volume commitments justify vendor investment in relationship",
      benchmark: "3-year volume commitments typically secure additional 5-10% discount vs annual",
      successRate: "82% lock favorable pricing when offering 2+ year volume commitments",
      tactics: [
        "Offer graduated volume commitments (lower Year 1, higher Years 2-3)",
        "Provide detailed demand forecasting and business growth plans",
        "Include minimum annual purchase obligations"
      ],
      fallbacks: [
        "2-year terms vs 3-year if discount gap minimal",
        "Annual price protection clauses vs fixed multi-year pricing"
      ],
      evidence: [
        "Multi-year contracting benefits analysis",
        "Vendor relationship investment studies",
        "Strategic sourcing best practices"
      ]
    }
  ],
  tactics: [
    {
      name: "Revenue Predictability Value",
      script: "We're offering you significant revenue predictability with our volume commitments. This reduces your sales costs, improves your forecast accuracy, and justifies investment in our relationship. The discounts we're requesting reflect the value we're providing.",
      whenToUse: "When vendor questions volume discount rates",
      effectiveness: "high",
      evidence: "Revenue predictability reduces vendor cost of sales by 15-30%",
      risks: ["Must honor volume commitments or face penalties"]
    },
    {
      name: "Strategic Partnership Positioning",
      script: "We want to be a strategic partner, not just a customer. These volume commitments and multi-year terms allow you to invest in our success. In return, we need pricing that reflects this partnership level - not transactional rates.",
      whenToUse: "When negotiating enhanced volume discounts",
      effectiveness: "high",
      evidence: "Strategic partnerships yield 12-25% better vendor terms on average",
      risks: ["May trigger enhanced service level expectations"]
    }
  ],
  benchmarks: {
    pricing: [
      "Standard volume discounts: 5-15% for 2x volume, 15-25% for 5x volume",
      "Multi-year premiums: Additional 5-10% discount for 3+ year commitments",
      "Early payment discounts: 1-3% for payment terms better than 30 days"
    ],
    terms: [
      "Volume measurement: Monthly, quarterly, or annual calculations",
      "Minimum commitments: 80-90% of projected volumes typical",
      "True-up periods: Quarterly or annual volume reconciliation",
      "Overages: Standard rates apply above committed tiers"
    ],
    slas: [],
    liability: []
  },
  riskFactors: [
    {
      risk: "Unable to meet volume commitments due to business changes",
      probability: "medium",
      impact: "medium",
      mitigation: [
        "Build in volume commitment flexibility for business downturns",
        "Include force majeure provisions affecting volume requirements",
        "Negotiate graduated penalties vs all-or-nothing volume failures"
      ],
      evidence: "38% of volume commitments miss targets due to market changes"
    }
  ],
  timeline: [
    {
      phase: "Volume Analysis & Strategy",
      duration: "Week 1-2",
      keyActions: [
        "📊 Analyze historical usage patterns and growth trends",
        "🎯 Model realistic volume commitments and discount scenarios",
        "💰 Calculate ROI of various volume discount structures",
        "📋 Prepare business growth forecasts and supporting documentation"
      ],
      successCriteria: [
        "Data-driven volume projections completed",
        "Multi-tier discount structure proposed",
        "Multi-year commitment strategy defined"
      ],
      commonPitfalls: [
        "Overcommitting on volume projections",
        "Missing retroactive discount provisions",
        "Not accounting for business cyclicality"
      ]
    }
  ]
};

// COMPREHENSIVE INTELLIGENCE DATABASE
export const negotiationIntelligenceDB = {
  "saas_renewal_price_increase": saasRenewalIntelligence,
  "sla_enhancement": slaEnhancementIntelligence, 
  "gdpr_dpa_compliance": gdprDpaIntelligence,
  "payment_terms_optimization": paymentTermsIntelligence,
  "ip_rights_protection": ipClausesIntelligence,
  "termination_exit_rights": exitRightsIntelligence,
  "liability_cap_negotiation": liabilityCapIntelligence,
  "volume_discount_optimization": volumeDiscountIntelligence
};

// ENHANCED SCENARIO DEFINITIONS
export const enhancedScenarios = [
  {
    id: "saas_renewal_price_increase",
    label: "SaaS Renewal - Price Increase Mitigation",
    description: "Vendor proposing 10-25% increase at renewal",
    contractTypes: ["SaaS Agreement"],
    keyObjectives: [
      "cap_increase",
      "right_size", 
      "multi_year_protection",
      "volume_discounts",
      "value_adds"
    ]
  },
  {
    id: "sla_enhancement",
    label: "Service Level Agreement Enhancement", 
    description: "Improving uptime, response times, and accountability",
    contractTypes: ["Service Contract", "SaaS Agreement"],
    keyObjectives: [
      "uptime_guarantee",
      "response_times",
      "financial_penalties"
    ]
  },
  {
    id: "gdpr_dpa_compliance",
    label: "GDPR Data Processing Agreement",
    description: "Ensuring full GDPR Article 28 compliance",
    contractTypes: ["Data Processing Agreement", "SaaS Agreement"],
    keyObjectives: [
      "article_28_compliance",
      "breach_notification", 
      "data_residency"
    ]
  },
  {
    id: "payment_terms_optimization",
    label: "Payment Terms Optimization",
    description: "Extending payment terms and securing early payment discounts",
    contractTypes: ["Service Contract", "Purchase Agreement", "Professional Services"],
    keyObjectives: [
      "extend_payment_terms",
      "early_payment_discounts"
    ]
  },
  {
    id: "ip_rights_protection",
    label: "Intellectual Property Rights Protection",
    description: "Protecting existing IP and clarifying work product ownership",
    contractTypes: ["Service Contract", "Professional Services", "Development Agreement"],
    keyObjectives: [
      "retain_ip_ownership",
      "work_product_ownership"
    ]
  },
  {
    id: "termination_exit_rights",
    label: "Termination & Exit Rights",
    description: "Adding termination flexibility and ensuring data portability",
    contractTypes: ["SaaS Agreement", "Service Contract", "Equipment Lease"],
    keyObjectives: [
      "termination_for_convenience",
      "data_portability_rights"
    ]
  },
  {
    id: "liability_cap_negotiation",
    label: "Liability Cap Negotiation",
    description: "Establishing reasonable liability limits and managing carve-outs",
    contractTypes: ["Service Contract", "Professional Services", "SaaS Agreement"],
    keyObjectives: [
      "reasonable_liability_cap",
      "carve_out_exceptions"
    ]
  },
  {
    id: "volume_discount_optimization",
    label: "Volume Discount Optimization",
    description: "Securing tiered discounts and multi-year volume pricing",
    contractTypes: ["Purchase Agreement", "Service Contract", "SaaS Agreement"],
    keyObjectives: [
      "tiered_volume_discounts",
      "multi_year_volume_protection"
    ]
  }
];

// PROMPT ENHANCEMENT FOR AI GENERATION
export function buildEnhancedPrompt(
  contractType: string,
  scenario: string, 
  objectives: string[],
  currentTerms?: string,
  desiredOutcome?: string
): string {
  const intelligence = negotiationIntelligenceDB[scenario as keyof typeof negotiationIntelligenceDB];
  
  if (!intelligence) {
    return buildBasicPrompt(contractType, scenario, objectives, currentTerms, desiredOutcome);
  }

  return `You are a world-class contract negotiation strategist with deep expertise in ${contractType} negotiations. Generate a comprehensive, actionable negotiation playbook using the following market intelligence and proven tactics.

MARKET CONTEXT & INTELLIGENCE:
${intelligence.marketContext.trends.map(trend => `• ${trend}`).join('\n')}

Current Market Reality:
• ${intelligence.marketContext.inflation}
• ${intelligence.marketContext.successRate}  
• ${intelligence.marketContext.timing}

USER'S SITUATION:
Contract Type: ${contractType}
Scenario: ${scenario}
${currentTerms ? `Current Terms: ${currentTerms}` : ''}
${desiredOutcome ? `Desired Outcome: ${desiredOutcome}` : ''}

SELECTED OBJECTIVES:
${objectives.map(obj => `• ${obj}`).join('\n')}

PROVEN TACTICS TO INCLUDE:
${intelligence.tactics.map(tactic => `
${tactic.name}:
Script: "${tactic.script}"
When to use: ${tactic.whenToUse}
Effectiveness: ${tactic.effectiveness}
Evidence: ${tactic.evidence}
`).join('\n')}

MARKET BENCHMARKS TO REFERENCE:
Pricing: ${intelligence.benchmarks.pricing.join(' | ')}
SLAs: ${intelligence.benchmarks.slas.join(' | ')}
Terms: ${intelligence.benchmarks.terms.join(' | ')}

GENERATE A COMPREHENSIVE PLAYBOOK WITH:

1. **EXECUTIVE SUMMARY** 
   - Your position of strength
   - Market context that supports your case
   - Expected outcome range

2. **BATTLE-TESTED TALKING POINTS**
   For each selected objective, provide:
   - Your opening position
   - Supporting market data/evidence
   - Tactical scripts to use
   - Fallback positions
   - Counter-arguments to expect

3. **RISK MITIGATION**  
   Key risks and specific mitigation strategies:
   ${intelligence.riskFactors.map(risk => `• ${risk.risk}: ${risk.mitigation.join(', ')}`).join('\n')}

4. **NEGOTIATION TACTICS**
   Specific tactics with when/how to deploy them effectively

5. **TIMELINE & PHASES**
   ${intelligence.timeline.map(phase => `${phase.phase} (${phase.duration}): ${phase.keyActions.slice(0,2).join(', ')}`).join(' → ')}

6. **SUCCESS METRICS**
   Measurable outcomes that indicate victory

TONE: Confident, data-driven, actionable. Write as if advising a sophisticated negotiator.
EVIDENCE: Cite specific market data, benchmarks, and proven tactics throughout.
FORMAT: Use clear headers, bullet points, and tactical scripts that can be used verbatim.

Generate a playbook that will give the user genuine confidence and tactical advantage in their negotiation.`;
}

function buildBasicPrompt(
  contractType: string,
  scenario: string,
  objectives: string[],
  currentTerms?: string,
  desiredOutcome?: string  
): string {
  return `Generate a comprehensive negotiation playbook for a ${contractType} with the scenario: ${scenario}.

Objectives:
${objectives.map(obj => `• ${obj}`).join('\n')}

${currentTerms ? `Current Terms: ${currentTerms}` : ''}
${desiredOutcome ? `Desired Outcome: ${desiredOutcome}` : ''}

Include market context, specific talking points, risk mitigation strategies, negotiation tactics, timeline, and success metrics.`;
}