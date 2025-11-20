'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../../../../components/layout/AppLayout';
import '../../../../../styles/contracts.css';

/**
 * Manual Contract Entry Form
 * Admin-only page for manually entering contract data
 * Connects to POST /api/contracts/create
 */
export default function NewContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    customerName: '',
    contractType: 'MSA',
    effectiveDate: '',
    
    // Term & Renewal
    initialTermEndDate: '',
    renewalType: 'MANUAL_RENEWAL',
    renewalNoticeDays: 60,
    whoCanTerminate: 'EITHER_PARTY',
    
    // Pricing
    pricingModel: 'FLAT_FEE',
    baseMonthlyFee: '',
    baseAnnualFee: '',
    currency: 'USD',
    committedSeats: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Convert string numbers to actual numbers
      const payload = {
        ...formData,
        organizationId: 'demo-org',
        fileName: `${formData.customerName} - Contract`,
        // Convert numeric strings to numbers
        renewalNoticeDays: formData.renewalNoticeDays ? parseInt(formData.renewalNoticeDays as any) : null,
        baseMonthlyFee: formData.baseMonthlyFee ? parseFloat(formData.baseMonthlyFee as any) : null,
        baseAnnualFee: formData.baseAnnualFee ? parseFloat(formData.baseAnnualFee as any) : null,
        committedSeats: formData.committedSeats ? parseInt(formData.committedSeats as any) : null,
      };

      const response = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      // Log the full response for debugging
      console.log('Response status:', response.status);
      console.log('Response data:', result);

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          customerName: '',
          contractType: 'MSA',
          effectiveDate: '',
          initialTermEndDate: '',
          renewalType: 'MANUAL_RENEWAL',
          renewalNoticeDays: 60,
          whoCanTerminate: 'EITHER_PARTY',
          pricingModel: 'FLAT_FEE',
          baseMonthlyFee: '',
          baseAnnualFee: '',
          currency: 'USD',
          committedSeats: '',
        });
        
        // Show success for 2 seconds, then redirect
        setTimeout(() => {
          router.push('/app');
        }, 2000);
      } else {
        // Show detailed error
        const errorMessage = result.details 
          ? `${result.error}: ${result.details}` 
          : result.error || 'Failed to create contract';
        setError(errorMessage);
        console.error('API Error:', result);
      }
    } catch (err) {
      setError('Network error: Could not create contract');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Template data for quick apply
  const templates: Record<string, any> = {
    'enterprise-msa': {
      name: 'Enterprise SaaS MSA',
      badge: 'Most Common',
      icon: '🏢',
      description: 'Multi-year enterprise agreement with annual escalation',
      displayDetails: {
        value: '$250,000/year', term: '3 years', payment: 'Annual prepay'
      },
      data: {
        customerName: 'Acme Corporation',
        contractType: 'MSA',
        effectiveDate: '2024-01-01',
        initialTermEndDate: '2026-12-31',
        renewalType: 'AUTO_RENEWAL',
        renewalNoticeDays: 90,
        whoCanTerminate: 'EITHER_PARTY',
        pricingModel: 'PER_USER',
        baseMonthlyFee: '',
        baseAnnualFee: 250000,
        currency: 'USD',
        committedSeats: 500,
      }
    },
    'mid-market-annual': {
      name: 'Mid-Market Annual Subscription',
      badge: 'Standard',
      icon: '📊',
      description: 'Standard 1-year SaaS agreement with monthly billing',
      displayDetails: {
        value: '$5,000/month', term: '1 year', payment: 'Monthly'
      },
      data: {
        customerName: 'TechStart Inc',
        contractType: 'Order Form',
        effectiveDate: '2024-06-01',
        initialTermEndDate: '2025-05-31',
        renewalType: 'AUTO_RENEWAL',
        renewalNoticeDays: 60,
        whoCanTerminate: 'EITHER_PARTY',
        pricingModel: 'PER_USER',
        baseMonthlyFee: 5000,
        baseAnnualFee: 60000,
        currency: 'USD',
        committedSeats: 75,
      }
    },
    'usage-based': {
      name: 'Usage-Based Pricing Agreement',
      badge: 'Flexible',
      icon: '📈',
      description: 'Consumption-based model with minimum commitment',
      displayDetails: {
        value: '$10,000/month minimum', term: '1 year', payment: 'Per usage tier'
      },
      data: {
        customerName: 'DataFlow Systems',
        contractType: 'Order Form',
        effectiveDate: '2024-03-01',
        initialTermEndDate: '2025-02-28',
        renewalType: 'MANUAL_RENEWAL',
        renewalNoticeDays: 30,
        whoCanTerminate: 'EITHER_PARTY',
        pricingModel: 'USAGE_BASED',
        baseMonthlyFee: 10000,
        baseAnnualFee: 120000,
        currency: 'USD',
        committedSeats: '',
      }
    },
    'smb-quick': {
      name: 'SMB Quick-Start',
      badge: 'Popular',
      icon: '🚀',
      description: 'Small business monthly subscription with quarterly commits',
      displayDetails: {
        value: '$1,500/month', term: '3 months', payment: 'Monthly'
      },
      data: {
        customerName: 'SmallBiz Solutions',
        contractType: 'Order Form',
        effectiveDate: '2024-09-01',
        initialTermEndDate: '2024-11-30',
        renewalType: 'AUTO_RENEWAL',
        renewalNoticeDays: 30,
        whoCanTerminate: 'EITHER_PARTY',
        pricingModel: 'FLAT_FEE',
        baseMonthlyFee: 1500,
        baseAnnualFee: '',
        currency: 'USD',
        committedSeats: 25,
      }
    },
    'professional-services': {
      name: 'Professional Services Agreement',
      badge: 'Services',
      icon: '🛠️',
      description: 'Fixed-fee implementation and consulting engagement',
      displayDetails: {
        value: '$180,000 project', term: '6 months', payment: 'Milestone-based'
      },
      data: {
        customerName: 'Enterprise Solutions Co',
        contractType: 'SOW',
        effectiveDate: '2024-07-01',
        initialTermEndDate: '2024-12-31',
        renewalType: 'ONE_TIME',
        renewalNoticeDays: '',
        whoCanTerminate: 'EITHER_PARTY',
        pricingModel: 'FLAT_FEE',
        baseMonthlyFee: '',
        baseAnnualFee: 180000,
        currency: 'USD',
        committedSeats: '',
      }
    },
    'multi-product': {
      name: 'Multi-Product Bundle',
      badge: 'Premium',
      icon: '📦',
      description: 'Enterprise bundle with multiple products and tiers',
      displayDetails: {
        value: '$500,000/year', term: '4 years', payment: 'Annual prepay'
      },
      data: {
        customerName: 'Global Enterprises Ltd',
        contractType: 'MSA',
        effectiveDate: '2024-01-01',
        initialTermEndDate: '2027-12-31',
        renewalType: 'AUTO_RENEWAL',
        renewalNoticeDays: 120,
        whoCanTerminate: 'PROVIDER_ONLY',
        pricingModel: 'PER_USER',
        baseMonthlyFee: '',
        baseAnnualFee: 500000,
        currency: 'USD',
        committedSeats: 1000,
      }
    }
  };

  const applyTemplate = (templateId: string) => {
    const t = templates[templateId];
    if (!t) return;
    setFormData(prev => ({ ...prev, ...t.data }));

    // Scroll to top of form
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const formEl = document.querySelector('.contract-entry-form');
      if (formEl) {
        formEl.classList.add('highlight-updated');
        setTimeout(() => formEl.classList.remove('highlight-updated'), 2000);
      }
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Manual Contract Entry
          </h1>
          <p style={{ color: '#64748B' }}>
            Enter contract details manually. Risk score will be calculated automatically.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: '#D1FAE5',
            border: '1px solid #10B981',
            borderRadius: '8px',
            color: '#065F46'
          }}>
            ✅ Contract created successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            color: '#991B1B'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="contract-entry-form" style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #E2E8F0'
        }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Basic Information
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="e.g., Acme Corp"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Contract Type
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="MSA">MSA (Master Service Agreement)</option>
                  <option value="SOW">SOW (Statement of Work)</option>
                  <option value="Order Form">Order Form</option>
                  <option value="Amendment">Amendment</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Effective Date
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Term & Renewal */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Term & Renewal
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Contract End Date *
              </label>
              <input
                type="date"
                name="initialTermEndDate"
                value={formData.initialTermEndDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Renewal Type *
                </label>
                <select
                  name="renewalType"
                  value={formData.renewalType}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="AUTO_RENEWAL">Auto-Renewal</option>
                  <option value="MANUAL_RENEWAL">Manual Renewal</option>
                  <option value="ONE_TIME">One-Time (No Renewal)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Renewal Notice Period (days)
                </label>
                <input
                  type="number"
                  name="renewalNoticeDays"
                  value={formData.renewalNoticeDays}
                  onChange={handleChange}
                  placeholder="e.g., 60"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Who Can Terminate?
              </label>
              <select
                name="whoCanTerminate"
                value={formData.whoCanTerminate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="EITHER_PARTY">Either Party</option>
                <option value="CUSTOMER_ONLY">Customer Only</option>
                <option value="PROVIDER_ONLY">Provider Only</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Pricing
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Pricing Model
              </label>
              <select
                name="pricingModel"
                value={formData.pricingModel}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="FLAT_FEE">Flat Fee</option>
                <option value="PER_USER">Per User</option>
                <option value="USAGE_BASED">Usage-Based</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Monthly Fee
                </label>
                <input
                  type="number"
                  name="baseMonthlyFee"
                  value={formData.baseMonthlyFee}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Annual Fee *
                </label>
                <input
                  type="number"
                  name="baseAnnualFee"
                  value={formData.baseAnnualFee}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 60000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Seats/Users
                </label>
                <input
                  type="number"
                  name="committedSeats"
                  value={formData.committedSeats}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#94A3B8' : '#3B82F6',
                color: 'white'
              }}
            >
              {loading ? 'Creating...' : '✅ Create Contract'}
            </button>
          </div>
        </form>

        {/* Contract Templates & Examples */}
        <div className="template-examples-section">
          <div className="section-header">
            <div className="header-icon">📋</div>
            <div className="header-content">
              <h3 className="section-title">Contract Templates & Examples</h3>
              <p className="section-subtitle">Click any template below to auto-fill the form with example data</p>
            </div>
          </div>

          <div className="templates-grid">
            {/* Enterprise SaaS MSA */}
            <div className="template-card" onClick={() => applyTemplate('enterprise-msa')}>
              <div className="template-card-header">
                <div className="template-badge">Most Common</div>
                <div className="template-icon">🏢</div>
              </div>
              <h4 className="template-title">Enterprise SaaS MSA</h4>
              <p className="template-description">Multi-year enterprise agreement with annual escalation</p>
              <div className="template-details">
                <div className="detail-row"><span className="detail-label">Contract Value:</span><span className="detail-value">$250,000/year</span></div>
                <div className="detail-row"><span className="detail-label">Term:</span><span className="detail-value">3 years</span></div>
                <div className="detail-row"><span className="detail-label">Payment:</span><span className="detail-value">Annual prepay</span></div>
              </div>
              <div className="template-card-footer"><span className="click-hint">Click to use template</span></div>
            </div>

            {/* Mid-Market Annual Subscription */}
            <div className="template-card" onClick={() => applyTemplate('mid-market-annual')}>
              <div className="template-card-header">
                <div className="template-badge">Standard</div>
                <div className="template-icon">📊</div>
              </div>
              <h4 className="template-title">Mid-Market Annual Subscription</h4>
              <p className="template-description">Standard 1-year SaaS agreement with monthly billing</p>
              <div className="template-details">
                <div className="detail-row"><span className="detail-label">Contract Value:</span><span className="detail-value">$5,000/month</span></div>
                <div className="detail-row"><span className="detail-label">Term:</span><span className="detail-value">1 year</span></div>
                <div className="detail-row"><span className="detail-label">Payment:</span><span className="detail-value">Monthly</span></div>
              </div>
              <div className="template-card-footer"><span className="click-hint">Click to use template</span></div>
            </div>

            {/* Usage-Based Pricing Agreement */}
            <div className="template-card" onClick={() => applyTemplate('usage-based')}>
              <div className="template-card-header">
                <div className="template-badge">Flexible</div>
                <div className="template-icon">📈</div>
              </div>
              <h4 className="template-title">Usage-Based Pricing</h4>
              <p className="template-description">Consumption-based model with minimum commitment</p>
              <div className="template-details">
                <div className="detail-row"><span className="detail-label">Minimum Commitment:</span><span className="detail-value">$10,000/month</span></div>
                <div className="detail-row"><span className="detail-label">Term:</span><span className="detail-value">1 year</span></div>
                <div className="detail-row"><span className="detail-label">Overage:</span><span className="detail-value">Per usage tier</span></div>
              </div>
              <div className="template-card-footer"><span className="click-hint">Click to use template</span></div>
            </div>

            {/* SMB Quick-Start */}
            <div className="template-card" onClick={() => applyTemplate('smb-quick')}>
              <div className="template-card-header">
                <div className="template-badge">Popular</div>
                <div className="template-icon">🚀</div>
              </div>
              <h4 className="template-title">SMB Quick-Start</h4>
              <p className="template-description">Small business monthly subscription with quarterly commits</p>
              <div className="template-details">
                <div className="detail-row"><span className="detail-label">Contract Value:</span><span className="detail-value">$1,500/month</span></div>
                <div className="detail-row"><span className="detail-label">Term:</span><span className="detail-value">3 months</span></div>
                <div className="detail-row"><span className="detail-label">Payment:</span><span className="detail-value">Monthly</span></div>
              </div>
              <div className="template-card-footer"><span className="click-hint">Click to use template</span></div>
            </div>

            {/* Professional Services */}
            <div className="template-card" onClick={() => applyTemplate('professional-services')}>
              <div className="template-card-header">
                <div className="template-badge">Services</div>
                <div className="template-icon">🛠️</div>
              </div>
              <h4 className="template-title">Professional Services</h4>
              <p className="template-description">Fixed-fee implementation and consulting engagement</p>
              <div className="template-details">
                <div className="detail-row"><span className="detail-label">Project Value:</span><span className="detail-value">$180,000</span></div>
                <div className="detail-row"><span className="detail-label">Duration:</span><span className="detail-value">6 months</span></div>
                <div className="detail-row"><span className="detail-label">Payment:</span><span className="detail-value">Milestone-based</span></div>
              </div>
              <div className="template-card-footer"><span className="click-hint">Click to use template</span></div>
            </div>

            {/* Multi-Product Bundle */}
            <div className="template-card" onClick={() => applyTemplate('multi-product')}>
              <div className="template-card-header">
                <div className="template-badge">Premium</div>
                <div className="template-icon">📦</div>
              </div>
              <h4 className="template-title">Multi-Product Bundle</h4>
              <p className="template-description">Enterprise bundle with multiple products and tiers</p>
              <div className="template-details">
                <div className="detail-row"><span className="detail-label">Contract Value:</span><span className="detail-value">$500,000/year</span></div>
                <div className="detail-row"><span className="detail-label">Term:</span><span className="detail-value">4 years</span></div>
                <div className="detail-row"><span className="detail-label">Payment:</span><span className="detail-value">Annual prepay</span></div>
              </div>
              <div className="template-card-footer"><span className="click-hint">Click to use template</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
