// Demo contracts library for seeding a realistic portfolio
// Source: Product spec provided by PM (6 scenarios totalling ~$2.3M ACV)

export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface DemoSeedContract {
  customer_id: string
  customer_name: string
  industry: string
  size: string
  location: string
  website: string
  csm: string
  account_executive: string

  // Contract details
  contract_id: string
  contract_type: string
  effective_date: string // ISO
  contract_end_date: string // ISO
  contract_term_months: number
  renewal_type: 'Auto-Renewal' | 'Manual Renewal' | 'Non-Renewing' | 'Auto-Renewal (Multi-Year)'
  renewal_notice_days: number
  termination_rights: 'Either Party' | 'Customer Only' | 'Company Only' | 'Mutual Agreement'

  // Pricing
  pricing_model: 'Per User/Seat' | 'Flat Fee' | 'Usage-Based' | 'Enterprise Bundle'
  user_seats: number | null
  seats_in_use?: number
  monthly_fee: number | null
  annual_fee: number
  contract_value_total: number
  payment_frequency: 'Monthly' | 'Quarterly' | 'Annual'
  payment_terms: string

  // Health & risk
  status: 'Active'
  risk_level: RiskLevel
  next_renewal_date: string // ISO
  days_until_renewal: number

  // Key terms/meta
  key_terms: Record<string, any>
  pricing_notes: string
  churn_risk_score: number
  expansion_opportunity_score: number

  // Additional optional demo metrics
  pricing_gap_percent?: number
  revenue_at_risk?: number
  seats_over_limit?: number
  expansion_revenue_potential?: number
  health_score?: number
}

export const demoContracts: DemoSeedContract[] = [
  {
    customer_id: 'CUST-001',
    customer_name: 'TechCorp Enterprises',
    industry: 'Financial Technology',
    size: 'Enterprise (2000+ employees)',
    location: 'New York, NY',
    website: 'www.techcorp-ent.com',
    csm: 'Sarah Chen',
    account_executive: 'Michael Rodriguez',

    contract_id: 'CTR-2024-001',
    contract_type: 'MSA (Master Service Agreement)',
    effective_date: '2024-01-15',
    contract_end_date: '2027-01-14',
    contract_term_months: 36,
    renewal_type: 'Auto-Renewal',
    renewal_notice_days: 90,
    termination_rights: 'Either Party',

    pricing_model: 'Per User/Seat',
    user_seats: 500,
    monthly_fee: null,
    annual_fee: 420000,
    contract_value_total: 1260000,
    payment_frequency: 'Annual',
    payment_terms: 'Net 30',

    status: 'Active',
    risk_level: 'Low',
    next_renewal_date: '2025-01-14',
    days_until_renewal: 57,

    key_terms: {
      auto_renew: true,
      termination_convenience: true,
      data_residency: 'US-only',
      dedicated_support: true,
      custom_sla: true,
      price_protection: '3 years',
    },
    pricing_notes: 'At market rate. Good candidate for expansion.',
    churn_risk_score: 15,
    expansion_opportunity_score: 85,
  },
  {
    customer_id: 'CUST-002',
    customer_name: 'DataFlow Systems',
    industry: 'Data Analytics',
    size: 'Mid-Market (500 employees)',
    location: 'Austin, TX',
    website: 'www.dataflow-sys.com',
    csm: 'James Park',
    account_executive: 'Lisa Thompson',

    contract_id: 'CTR-2021-047',
    contract_type: 'MSA (Master Service Agreement)',
    effective_date: '2021-03-01',
    contract_end_date: '2025-02-28',
    contract_term_months: 12,
    renewal_type: 'Auto-Renewal',
    renewal_notice_days: 60,
    termination_rights: 'Either Party',

    pricing_model: 'Per User/Seat',
    user_seats: 150,
    monthly_fee: null,
    annual_fee: 135000,
    contract_value_total: 135000,
    payment_frequency: 'Quarterly',
    payment_terms: 'Net 60',

    status: 'Active',
    risk_level: 'Medium',
    next_renewal_date: '2025-02-28',
    days_until_renewal: 101,

    key_terms: {
      auto_renew: true,
      termination_convenience: true,
      legacy_pricing: true,
      no_price_increases: true,
      standard_support: true,
      quarterly_billing: true,
    },
    pricing_notes:
      'LEGACY PRICING: $900/seat vs current $1,200/seat. 25% below market. Priority for price optimization at renewal.',
    churn_risk_score: 40,
    expansion_opportunity_score: 65,
    pricing_gap_percent: -25,
    revenue_at_risk: 45000,
  },
  {
    customer_id: 'CUST-003',
    customer_name: 'GrowthCo SaaS',
    industry: 'Marketing Technology',
    size: 'SMB (120 employees)',
    location: 'San Francisco, CA',
    website: 'www.growthco-saas.com',
    csm: 'Emily Watson',
    account_executive: 'David Kim',

    contract_id: 'CTR-2023-092',
    contract_type: 'Subscription Agreement',
    effective_date: '2023-06-01',
    contract_end_date: '2025-05-31',
    contract_term_months: 24,
    renewal_type: 'Auto-Renewal',
    renewal_notice_days: 60,
    termination_rights: 'Either Party',

    pricing_model: 'Per User/Seat',
    user_seats: 50,
    seats_in_use: 73,
    monthly_fee: 5000,
    annual_fee: 60000,
    contract_value_total: 120000,
    payment_frequency: 'Monthly',
    payment_terms: 'Net 30',

    status: 'Active',
    risk_level: 'Low',
    next_renewal_date: '2025-05-31',
    days_until_renewal: 193,

    key_terms: {
      auto_renew: true,
      termination_convenience: true,
      overage_allowed: true,
      monthly_billing: true,
    },
    pricing_notes:
      'EXPANSION OPPORTUNITY: Using 73 seats but only licensed for 50. Overage since Feb 2024. Upsell conversation needed.',
    churn_risk_score: 20,
    expansion_opportunity_score: 95,
    seats_over_limit: 23,
    expansion_revenue_potential: 27600,
  },
  {
    customer_id: 'CUST-004',
    customer_name: 'RetailChain Plus',
    industry: 'Retail',
    size: 'Mid-Market (800 employees)',
    location: 'Chicago, IL',
    website: 'www.retailchain-plus.com',
    csm: 'Marcus Johnson',
    account_executive: 'Rachel Green',

    contract_id: 'CTR-2024-031',
    contract_type: 'MSA (Master Service Agreement)',
    effective_date: '2024-02-01',
    contract_end_date: '2025-01-31',
    contract_term_months: 12,
    renewal_type: 'Manual Renewal',
    renewal_notice_days: 30,
    termination_rights: 'Either Party',

    pricing_model: 'Flat Fee',
    user_seats: null,
    monthly_fee: 8500,
    annual_fee: 102000,
    contract_value_total: 102000,
    payment_frequency: 'Monthly',
    payment_terms: 'Net 45',

    status: 'Active',
    risk_level: 'High',
    next_renewal_date: '2025-01-31',
    days_until_renewal: 73,

    key_terms: {
      auto_renew: false,
      termination_convenience: true,
      short_term: true,
      manual_renewal_required: true,
      payment_issues: true,
    },
    pricing_notes:
      'HIGH RISK: Manual renewal required. 2 late payments in last 6 months. Low engagement; exec sponsor left Oct 2024.',
    churn_risk_score: 85,
    expansion_opportunity_score: 10,
    health_score: 35,
  },
  {
    customer_id: 'CUST-005',
    customer_name: 'CloudServe Global',
    industry: 'Cloud Infrastructure',
    size: 'Enterprise (5000+ employees)',
    location: 'Seattle, WA',
    website: 'www.cloudserve-global.com',
    csm: 'Alexandra Martinez',
    account_executive: 'Chris Anderson',

    contract_id: 'CTR-2023-005',
    contract_type: 'Enterprise License Agreement (ELA)',
    effective_date: '2023-01-01',
    contract_end_date: '2027-12-31',
    contract_term_months: 60,
    renewal_type: 'Auto-Renewal (Multi-Year)',
    renewal_notice_days: 180,
    termination_rights: 'Company Only',

    pricing_model: 'Enterprise Bundle',
    user_seats: 1200,
    monthly_fee: null,
    annual_fee: 850000,
    contract_value_total: 4250000,
    payment_frequency: 'Annual',
    payment_terms: 'Net 15',

    status: 'Active',
    risk_level: 'Low',
    next_renewal_date: '2026-01-01',
    days_until_renewal: 408,

    key_terms: {
      auto_renew: true,
      termination_convenience: false,
      multi_year: true,
      volume_discount: true,
      dedicated_csm: true,
      quarterly_reviews: true,
      custom_integrations: true,
      priority_support: true,
      annual_escalation: '5%',
    },
    pricing_notes: 'Flagship customer. Multi-product bundle. Strong relationship. Year 3 escalation (5%) on track.',
    churn_risk_score: 5,
    expansion_opportunity_score: 70,
  },
  {
    customer_id: 'CUST-006',
    customer_name: 'StartupFast Inc',
    industry: 'Software Development',
    size: 'SMB (35 employees)',
    location: 'Denver, CO',
    website: 'www.startupfast.com',
    csm: 'Jessica Lee',
    account_executive: 'Tom Wilson',

    contract_id: 'CTR-2024-118',
    contract_type: 'Subscription Agreement',
    effective_date: '2024-09-01',
    contract_end_date: '2025-08-31',
    contract_term_months: 12,
    renewal_type: 'Auto-Renewal',
    renewal_notice_days: 30,
    termination_rights: 'Either Party',

    pricing_model: 'Per User/Seat',
    user_seats: 25,
    monthly_fee: 2500,
    annual_fee: 30000,
    contract_value_total: 30000,
    payment_frequency: 'Monthly',
    payment_terms: 'Net 30',

    status: 'Active',
    risk_level: 'Low',
    next_renewal_date: '2025-08-31',
    days_until_renewal: 284,

    key_terms: {
      auto_renew: true,
      termination_convenience: true,
      startup_discount: true,
      monthly_billing: true,
      standard_support: true,
    },
    pricing_notes: 'New customer (3 months). Strong engagement. Good candidate for growth as they scale.',
    churn_risk_score: 25,
    expansion_opportunity_score: 75,
    health_score: 85,
  },
]

// Map demo contract to prisma Contract.create data shape
export function toPrismaContractData(d: DemoSeedContract) {
  // Map renewal type & termination codes to schema values
  const renewalType = d.renewal_type.includes('Auto')
    ? 'AUTO_RENEWAL'
    : d.renewal_type === 'Manual Renewal'
    ? 'MANUAL_RENEWAL'
    : 'ONE_TIME'

  const whoCanTerminate = d.termination_rights === 'Customer Only'
    ? 'CUSTOMER_ONLY'
    : d.termination_rights === 'Company Only'
    ? 'PROVIDER_ONLY'
    : 'EITHER_PARTY'

  const pricingModel =
    d.pricing_model === 'Per User/Seat' ? 'PER_USER' :
    d.pricing_model === 'Flat Fee' ? 'FLAT_FEE' :
    d.pricing_model === 'Usage-Based' ? 'USAGE_BASED' :
    'HYBRID'

  const baseMonthly = d.monthly_fee || 0
  const baseAnnual = d.annual_fee || baseMonthly * 12

  const renewalNoticeDeadline = d.renewal_notice_days
    ? new Date(new Date(d.contract_end_date).getTime() - d.renewal_notice_days * 24 * 60 * 60 * 1000)
    : null

  return {
    organizationId: 'demo-org',
    fileName: `${d.customer_name} - Seed Contract`,

    customerName: d.customer_name,
    customerType: d.size,
    industry: d.industry,
    contractType: d.contract_type?.startsWith('MSA') ? 'MSA' : (d.contract_type || 'MSA'),
    effectiveDate: d.effective_date ? new Date(d.effective_date) : null,

    initialTermEndDate: new Date(d.contract_end_date),
    renewalType,
    renewalNoticeDays: d.renewal_notice_days,
    renewalNoticeDeadline,
    whoCanTerminate: whoCanTerminate,

    pricingModel,
    baseMonthlyFee: baseMonthly,
    baseAnnualFee: baseAnnual,
    currency: 'USD',
    committedSeats: d.user_seats ?? null,

    totalContractValue: baseAnnual * Math.max(1, Math.round(d.contract_term_months / 12)),
    annualContractValue: baseAnnual,

    manualEntryComplete: true,
    status: 'active',
  }
}
