'use client';

import React from 'react';

/**
 * Landing Page - Marketing entry point
 * No authentication required
 * Leads to /app route for dashboard
 */
export default function LandingPage() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: #0A0E1A;
          color: #E8EAF0;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(10, 14, 26, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 20px 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 
            0 0 20px rgba(99, 102, 241, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .logo-text {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #E8EAF0 0%, #B8BCCC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-cta {
          padding: 12px 28px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 
            0 0 30px rgba(59, 130, 246, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 0 40px rgba(59, 130, 246, 0.6),
            0 6px 16px rgba(0, 0, 0, 0.4);
        }

        /* Hero Section */
        .hero {
          padding: 180px 32px 120px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1400px;
          height: 1400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(139, 92, 246, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 50px;
          font-size: 14px;
          color: #C4B5FD;
          margin-bottom: 32px;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }

        .hero-badge::before {
          content: '✨';
          font-size: 16px;
        }

        .hero-title {
          font-size: 72px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 28px;
          background: linear-gradient(135deg, #E8EAF0 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 22px;
          color: #9CA3B8;
          margin-bottom: 48px;
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 18px 40px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 
            0 0 40px rgba(59, 130, 246, 0.5),
            0 8px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 0 50px rgba(59, 130, 246, 0.7),
            0 12px 28px rgba(0, 0, 0, 0.4);
        }

        .btn-secondary {
          padding: 18px 40px;
          background: rgba(45, 51, 71, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #E8EAF0;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-secondary:hover {
          background: rgba(45, 51, 71, 1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Features Section */
        .features {
          padding: 100px 32px;
          background: linear-gradient(180deg, #0A0E1A 0%, #0F1420 100%);
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-label {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 50px;
          color: #A5B4FC;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 700;
          color: #E8EAF0;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 20px;
          color: #9CA3B8;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: rgba(26, 31, 46, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 40px;
          transition: all 0.4s ease;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(99, 102, 241, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 24px;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .feature-card:nth-child(1) .feature-icon {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
          box-shadow: 
            0 4px 20px rgba(59, 130, 246, 0.2),
            0 0 30px rgba(59, 130, 246, 0.1);
        }

        .feature-card:nth-child(2) .feature-icon {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
          box-shadow: 
            0 4px 20px rgba(139, 92, 246, 0.2),
            0 0 30px rgba(139, 92, 246, 0.1);
        }

        .feature-card:nth-child(3) .feature-icon {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%);
          box-shadow: 
            0 4px 20px rgba(34, 197, 94, 0.2),
            0 0 30px rgba(34, 197, 94, 0.1);
        }

        .feature-card:nth-child(4) .feature-icon {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%);
          box-shadow: 
            0 4px 20px rgba(249, 115, 22, 0.2),
            0 0 30px rgba(249, 115, 22, 0.1);
        }

        .feature-card:nth-child(5) .feature-icon {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.1) 100%);
          box-shadow: 
            0 4px 20px rgba(236, 72, 153, 0.2),
            0 0 30px rgba(236, 72, 153, 0.1);
        }

        .feature-card:nth-child(6) .feature-icon {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%);
          box-shadow: 
            0 4px 20px rgba(14, 165, 233, 0.2),
            0 0 30px rgba(14, 165, 233, 0.1);
        }

        .feature-title {
          font-size: 24px;
          font-weight: 700;
          color: #E8EAF0;
          margin-bottom: 12px;
        }

        .feature-description {
          font-size: 16px;
          color: #9CA3B8;
          line-height: 1.7;
        }

        /* Stats Section */
        .stats {
          padding: 100px 32px;
          background: rgba(26, 31, 46, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 60px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 56px;
          font-weight: 800;
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-label {
          font-size: 18px;
          color: #9CA3B8;
          font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1000px;
          height: 1000px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-size: 56px;
          font-weight: 800;
          color: #E8EAF0;
          margin-bottom: 24px;
          line-height: 1.2;
        }

        .cta-subtitle {
          font-size: 20px;
          color: #9CA3B8;
          margin-bottom: 48px;
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          padding: 60px 32px 40px;
          background: #0A0E1A;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .footer-text {
          color: #6B7280;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 48px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .section-title {
            font-size: 36px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .hero-cta-group {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }

          .cta-title {
            font-size: 40px;
          }

          .stat-value {
            font-size: 44px;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo-section">
            <div className="logo-icon">📄</div>
            <div className="logo-text">Contract IQ</div>
          </div>
          <button className="nav-cta" onClick={() => window.location.href = '/app'}>
            Access Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Contract Intelligence</div>
          <h1 className="hero-title">Master Your Contracts with Intelligence</h1>
          <p className="hero-subtitle">
            Extract insights, negotiate better terms, and manage agreements with AI that understands the nuances of contract language. No legal degree required.
          </p>
          <div className="hero-cta-group">
            <a href="/app" className="btn-primary">🚀 Try Demo Now</a>
            <a href="#features" className="btn-secondary">See How It Works</a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">10x</div>
            <div className="stat-label">Faster Contract Review</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">95%</div>
            <div className="stat-label">Risk Detection Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">$2.4M</div>
            <div className="stat-label">Average Savings per Year</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24/7</div>
            <div className="stat-label">AI Contract Advisor</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="features-container">
          <div className="section-header">
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything You Need to Win</h2>
            <p className="section-subtitle">
              From AI-powered analysis to negotiation playbooks, Contract IQ gives you the edge in every deal.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">AI Contract Chat</h3>
              <p className="feature-description">
                Ask questions about any contract in plain English. Get instant answers with exact clause citations and confidence scores.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Risk Analysis</h3>
              <p className="feature-description">
                Automatically detect unfavorable terms, liability risks, and missing protections. Get prioritized action items with severity ratings.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Smart Dashboards</h3>
              <p className="feature-description">
                Track all your agreements in one place. See renewal dates, spending patterns, and vendor performance at a glance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Negotiation Playbooks</h3>
              <p className="feature-description">
                Get AI-generated negotiation strategies with specific clauses to add, remove, or modify. Backed by market benchmarks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Insights</h3>
              <p className="feature-description">
                Upload any contract and get a comprehensive analysis in seconds. Key terms, obligations, and risks extracted automatically.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Smart Alerts</h3>
              <p className="feature-description">
                Never miss a renewal, deadline, or payment. Get proactive notifications about critical contract events and risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="demo">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Contract Management?</h2>
          <p className="cta-subtitle">
            Experience the power of AI-driven contract intelligence. No credit card required. No sign-up friction. Just instant access to the full platform.
          </p>
          <a href="/app" className="btn-primary" style={{ fontSize: '19px', padding: '20px 48px' }}>
            🎯 Access Full Demo Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '18px' }}>📄</div>
            <div className="logo-text" style={{ fontSize: '18px' }}>Contract IQ</div>
          </div>
          <p className="footer-text">
            © 2024 Contract IQ. Built with intelligence, designed for results.
          </p>
        </div>
      </footer>
    </>
  );
}
