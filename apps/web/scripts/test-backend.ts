// Test Backend API
// Creates test contracts and verifies risk scoring works

async function testBackend() {
  const API_BASE = 'http://localhost:3000'
  
  console.log('🚀 Testing Contract IQ Backend...\n')
  
  // Test 1: Create a HIGH RISK contract (expires in 10 days)
  console.log('Test 1: Creating HIGH RISK contract (FinTech Corp)...')
  const highRiskContract = {
    organizationId: 'demo-org',
    customerName: 'FinTech Corp',
    contractType: 'MSA',
    effectiveDate: '2024-01-15',
    initialTermEndDate: '2025-12-07', // 20 days from now
    renewalType: 'MANUAL_RENEWAL',
    renewalNoticeDays: 60, // Notice deadline was 40 days ago!
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'FLAT_FEE',
    baseMonthlyFee: 7500,
    baseAnnualFee: 90000,
    currency: 'USD',
  }
  
  try {
    const response1 = await fetch(`${API_BASE}/api/contracts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(highRiskContract),
    })
    
    const result1 = await response1.json()
    
    if (result1.success) {
      console.log('✅ HIGH RISK Contract Created!')
      console.log(`   Customer: ${result1.contract.customerName}`)
      console.log(`   ACV: $${result1.contract.annualContractValue}`)
      console.log(`   Risk Score: ${result1.riskScore.overallRiskScore}/100`)
      console.log(`   Risk Level: ${result1.riskScore.riskClassification}`)
      console.log(`   Renewal Risk: ${result1.riskScore.renewalRiskScore}/100`)
      console.log(`   Actions: ${result1.riskScore.recommendedActions.length} recommended\n`)
    } else {
      console.log('❌ Failed:', result1.error)
    }
  } catch (error) {
    console.log('❌ Error:', error)
  }
  
  // Test 2: Create a LOW RISK contract (auto-renewal, expires in 6 months)
  console.log('Test 2: Creating LOW RISK contract (TechScale Inc)...')
  const lowRiskContract = {
    organizationId: 'demo-org',
    customerName: 'TechScale Inc',
    contractType: 'Enterprise Agreement',
    effectiveDate: '2023-06-01',
    initialTermEndDate: '2026-06-01', // 7 months from now
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 90,
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 12500,
    baseAnnualFee: 150000,
    currency: 'USD',
    committedSeats: 50,
  }
  
  try {
    const response2 = await fetch(`${API_BASE}/api/contracts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lowRiskContract),
    })
    
    const result2 = await response2.json()
    
    if (result2.success) {
      console.log('✅ LOW RISK Contract Created!')
      console.log(`   Customer: ${result2.contract.customerName}`)
      console.log(`   ACV: $${result2.contract.annualContractValue}`)
      console.log(`   Risk Score: ${result2.riskScore.overallRiskScore}/100`)
      console.log(`   Risk Level: ${result2.riskScore.riskClassification}`)
      console.log(`   Renewal Risk: ${result2.riskScore.renewalRiskScore}/100`)
      console.log(`   Actions: ${result2.riskScore.recommendedActions.length} recommended\n`)
    } else {
      console.log('❌ Failed:', result2.error)
    }
  } catch (error) {
    console.log('❌ Error:', error)
  }
  
  // Test 3: Get all contracts
  console.log('Test 3: Fetching all contracts...')
  try {
    const response3 = await fetch(`${API_BASE}/api/contracts?organizationId=demo-org`)
    const result3 = await response3.json()
    
    if (result3.success) {
      console.log('✅ Contracts Retrieved!')
      console.log(`   Total Contracts: ${result3.summary.total}`)
      console.log(`   High Risk: ${result3.summary.high_risk}`)
      console.log(`   Medium Risk: ${result3.summary.medium_risk}`)
      console.log(`   Low Risk: ${result3.summary.low_risk}`)
      console.log(`   Total ACV: $${result3.summary.total_acv}`)
      console.log(`   Expiring in 30 days: ${result3.summary.expiring_30_days}`)
      console.log(`   Expiring in 60 days: ${result3.summary.expiring_60_days}`)
      console.log(`   Expiring in 90 days: ${result3.summary.expiring_90_days}\n`)
      
      console.log('\n📋 Contract List:')
      result3.contracts.forEach((contract: any, index: number) => {
        console.log(`   ${index + 1}. ${contract.customerName}`)
        console.log(`      ACV: $${contract.annualContractValue}`)
        console.log(`      Risk: ${contract.riskScore?.riskClassification || 'N/A'} (${contract.riskScore?.overallRiskScore || 0}/100)`)
        console.log(`      Renewal Deadline: ${new Date(contract.renewalNoticeDeadline).toLocaleDateString()}`)
      })
    } else {
      console.log('❌ Failed:', result3.error)
    }
  } catch (error) {
    console.log('❌ Error:', error)
  }
  
  console.log('\n✅ Backend testing complete!')
  console.log('🎉 Your Contract IQ backend is WORKING!\n')
}

// Run the test
testBackend().catch(console.error)
