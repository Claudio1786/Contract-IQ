'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../../../../components/layout/AppLayout';

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
        <form onSubmit={handleSubmit} style={{
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
      </div>
    </AppLayout>
  );
}
