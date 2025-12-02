'use client';

import React from 'react';

/**
 * Landing Page - Pain-point-led marketing
 * Copy framework: Pain → Stakes → Solution → Proof
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
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          margin-right: auto;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          box-shadow: 
            0 0 20px rgba(99, 102, 241, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .logo-text {
          font-size: 26px;
          font-weight: 700;
          background: linear-gradient(135deg, #E8EAF0 0%, #B8BCCC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
        }

        .nav-cta {
          padding: 14px 32px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 
            0 0 30px rgba(59, 130, 246, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 0 40px rgba(59, 130, 246, 0.6),
            0 8px 20px rgba(0, 0, 0, 0.4);
        }

        /* Hero Section */
        .hero {
          padding: 200px 32px 120px;
          text-align: center;
          position: relative;
          background: radial-gradient(ellipse at top center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 50px;
          color: #A5B4FC;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-title {
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 1.1;
          background: linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #94A3B8;
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

        /* Stats Section */
        .stats {
          background: linear-gradient(180deg, #0A0E1A 0%, #0F1420 50%, #0A0E1A 100%);
          padding: 100px 32px;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 48px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 56px;
          font-weight: 700;
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 18px;
          color: #E8EAF0;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-subtext {
          font-size: 14px;
          color: #64748B;
          font-style: italic;
        }

        /* Problem Section */
        .problem-section {
          padding: 100px 32px;
          background: linear-gradient(180deg, #0A0E1A 0%, #0F1420 100%);
        }

        .problem-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .problem-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .problem-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 32px;
          background: linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .problem-body {
          font-size: 18px;
          color: #CBD5E1;
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .problem-list {
          list-style: none;
          padding: 0;
          margin: 32px 0;
          background: rgba(99, 102, 241, 0.05);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 16px;
          padding: 32px;
        }

        .problem-list li {
          font-size: 18px;
          color: #E8EAF0;
          margin-bottom: 16px;
          padding-left: 32px;
          position: relative;
        }

        .problem-list li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6366F1;
          font-size: 24px;
        }

        .problem-transition {
          text-align: center;
          font-size: 20px;
          color: #10B981;
          font-weight: 600;
          margin-top: 48px;
        }

        /* Features Section */
        .features {
          padding: 100px 32px;
          background: linear-gradient(180deg, #0F1420 0%, #0A0E1A 100%);
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
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-size: 18px;
          color: #94A3B8;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: rgba(15, 19, 32, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 20px;
          padding: 40px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #6366F1 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-card:hover:before {
          opacity: 1;
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 24px;
        }

        .feature-title {
          font-size: 24px;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 16px;
        }

        .feature-description {
          font-size: 16px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .feature-proof {
          font-size: 14px;
          color: #10B981;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Who It's For Section */
        .personas {
          padding: 100px 32px;
          background: linear-gradient(180deg, #0A0E1A 0%, #0F1420 100%);
        }

        .personas-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .personas-intro {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 64px;
        }

        .personas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .persona-card {
          background: rgba(15, 19, 32, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
        }

        .persona-title {
          font-size: 18px;
          font-weight: 700;
          color: #6366F1;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .persona-description {
          font-size: 16px;
          color: #CBD5E1;
          line-height: 1.6;
        }

        /* Final CTA Section */
        .final-cta {
          padding: 120px 32px;
          text-align: center;
          background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
        }

        .final-cta-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .final-cta-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 32px;
          background: linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .final-cta-body {
          font-size: 18px;
          color: #CBD5E1;
          line-height: 1.8;
          margin-bottom: 48px;
        }

        .final-cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .trust-line {
          font-size: 14px;
          color: #64748B;
        }

        /* Footer */
        .footer {
          background: #0A0E1A;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 48px 32px 32px;
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
          margin-bottom: 16px;
        }

        .footer-tagline {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 32px;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .footer-links a {
          color: #94A3B8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #CBD5E1;
        }

        .footer-legal {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .footer-legal a {
          color: #64748B;
          text-decoration: none;
          font-size: 12px;
        }

        .footer-copyright {
          font-size: 12px;
          color: #475569;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px;
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
          <button className="nav-cta" onClick={() => window.location.href = '/upload'}>
            Upload Contract
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Contract Negotiation Platform</div>
          <h1 className="hero-title">
            Your Customer Sent Back Redlines.<br />
            Do You Know What Changed?
          </h1>
          <p className="hero-subtitle">
            Most businesses don't. They accept unfavorable terms to close fast—or wait weeks for a lawyer to review. 
            Contract IQ shows you every change, scores the risk, and tells you exactly where to negotiate.
          </p>
          <div className="hero-cta-group">
            <a href="/upload" className="btn-primary">Upload a Redlined Contract</a>
            <a href="#how-it-works" className="btn-secondary">See How It Works</a>
          </div>
        </div>
      </section>

      {/* Stats Section - Pain-Framed */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">2,000+</div>
            <div className="stat-label">Customer Contracts Analyzed</div>
            <div className="stat-subtext">"How many redlines have you missed?"</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">$120M+</div>
            <div className="stat-label">Contract Value Protected</div>
            <div className="stat-subtext">"What's hiding in your fine print?"</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">73%</div>
            <div className="stat-label">Faster Contract Turnaround</div>
            <div className="stat-subtext">"Deals used to stall for weeks."</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Zero</div>
            <div className="stat-label">Deals Lost to Missed Redlines</div>
            <div className="stat-subtext">"Can you say the same?"</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="problem-container">
          <div className="problem-header">
            <h2 className="problem-title">The Contract Problem Nobody Talks About</h2>
          </div>
          <p className="problem-body">
            Your customer is ready to sign. They send back the contract with "a few changes." 
            Now you're staring at a 30-page PDF wondering:
          </p>
          <ul className="problem-list">
            <li>What did they actually change?</li>
            <li>Is this indemnity clause going to bite me later?</li>
            <li>Should I push back or just sign to close the deal?</li>
            <li>Who do I even ask about this?</li>
          </ul>
          <p className="problem-body">
            You're not a lawyer. You didn't go to law school. But somehow, you're the one 
            deciding whether to accept terms that could cost your company thousands—or lose 
            the deal entirely.
          </p>
          <p className="problem-transition">
            There's a better way. And it takes less than 60 seconds.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="how-it-works">
        <div className="features-container">
          <div className="section-header">
            <div className="section-label">Platform Capabilities</div>
            <h2 className="section-title">See Every Change. Know Every Risk. Close Every Deal.</h2>
            <p className="section-subtitle">
              Contract IQ gives you the confidence to negotiate customer contracts—even when legal review isn't an option.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1: Redline Analysis (Lead Feature) */}
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">"These Are the Changes. This Is Where You Want to Negotiate."</h3>
              <p className="feature-description">
                Upload the customer's marked-up contract. In seconds, Contract IQ identifies every addition, 
                deletion, and modification—even the subtle ones buried on page 27.
              </p>
              <p className="feature-description">
                Each change gets a risk score: High, Medium, or Low. Plain-English explanations tell you what 
                it actually means for your business. No more guessing. No more Googling legal terms at midnight.
              </p>
              <div className="feature-proof">
                → Average analysis time: 47 seconds
              </div>
            </div>

            {/* Feature 2: Counter-Language Generation */}
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Know Exactly What to Say Back</h3>
              <p className="feature-description">
                For every risky clause, get specific counter-language ready to copy and paste. Talking points 
                for customer calls. Alternative phrasing that protects your interests.
              </p>
              <p className="feature-description">
                Don't know how to push back on an aggressive liability cap? Now you do. Contract IQ tells you 
                when to stand firm, when to compromise, and exactly how to phrase your response.
              </p>
              <div className="feature-proof">
                → Average time from redline to response: 4 minutes
              </div>
            </div>

            {/* Feature 3: Contract Creation */}
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Start Every Deal from a Position of Strength</h3>
              <p className="feature-description">
                Stop copying and pasting from old Word docs. Start with professional templates—MSAs, SOWs, 
                NDAs, service agreements—customized for your business. Input customer details once. 
                Generate contracts ready for signature.
              </p>
              <p className="feature-description">
                Your best negotiated terms become your standard starting point. Every new deal benefits 
                from every past win.
              </p>
              <div className="feature-proof">
                → 50+ industry-specific templates included
              </div>
            </div>

            {/* Feature 4: AI Negotiation Assistant */}
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3 className="feature-title">Ask Anything. Get Answers You Can Act On.</h3>
              <p className="feature-description">
                "What does this indemnity clause actually mean?"<br />
                "Is this payment term standard?"<br />
                "Should I push back on this termination clause?"
              </p>
              <p className="feature-description">
                Ask questions in plain English. Get answers that make sense—not legal jargon that sends you 
                back to Google. Context-aware guidance based on your specific contract, not generic templates.
              </p>
              <div className="feature-proof">
                → Trained on 100,000+ B2B contract negotiations
              </div>
            </div>

            {/* Feature 5: Template Library */}
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Build Your Negotiation Playbook Over Time</h3>
              <p className="feature-description">
                Every contract you negotiate makes the next one easier. Save your best language. Reuse 
                successful terms. Build a library of what works for YOUR business, YOUR customers, YOUR industry.
              </p>
              <p className="feature-description">
                New team members get up to speed instantly. Institutional knowledge doesn't walk out the door 
                when someone leaves.
              </p>
              <div className="feature-proof">
                → Teams report 40% faster onboarding for new sales hires
              </div>
            </div>

            {/* Feature 6: Email Response Drafting */}
            <div className="feature-card">
              <div className="feature-icon">✉️</div>
              <h3 className="feature-title">Respond Professionally. Maintain Momentum.</h3>
              <p className="feature-description">
                For every redline you reject or counter, get a professionally drafted email response. 
                Explain your position clearly. Propose alternatives that keep the deal moving.
              </p>
              <p className="feature-description">
                No more awkward "let me get back to you" delays. No more deal momentum killed by response time.
              </p>
              <div className="feature-proof">
                → One-click email generation for any clause decision
              </div>
            </div>

            {/* Feature 7: Revenue Intelligence (Secondary, Last) */}
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Signed Contracts Shouldn't Disappear Into a Folder</h3>
              <p className="feature-description">
                Once the deal closes, the contract still matters. Renewal dates. Payment terms. 
                Price escalations. Obligations you committed to.
              </p>
              <p className="feature-description">
                Contract IQ automatically extracts and tracks everything. Get alerts before renewals. 
                Never miss a deadline. Turn your contract archive into actionable revenue data.
              </p>
              <div className="feature-proof">
                → Zero manual data entry. 90/60/30 day renewal alerts.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="personas">
        <div className="personas-container">
          <div className="section-header">
            <h2 className="section-title">Built for the People Who Actually Close Deals</h2>
            <div className="personas-intro">
              <p className="section-subtitle">
                You don't have an army of lawyers reviewing every contract. You don't have weeks to wait 
                for outside counsel. But you still need to protect your business and close deals fast.
              </p>
              <p className="section-subtitle" style={{ fontSize: '20px', color: '#10B981', marginTop: '24px' }}>
                Contract IQ is built for you.
              </p>
            </div>
          </div>

          <div className="personas-grid">
            <div className="persona-card">
              <h3 className="persona-title">Founders & CEOs</h3>
              <p className="persona-description">
                You're closing deals yourself. You can't afford to get the terms wrong—or wait weeks.
              </p>
            </div>
            <div className="persona-card">
              <h3 className="persona-title">Sales Teams</h3>
              <p className="persona-description">
                Every redline that sits is a deal at risk. Stop being the bottleneck on contract review.
              </p>
            </div>
            <div className="persona-card">
              <h3 className="persona-title">Service Businesses</h3>
              <p className="persona-description">
                Plumbers, contractors, consultants. Commercial bids and service agreements, handled with confidence.
              </p>
            </div>
            <div className="persona-card">
              <h3 className="persona-title">Agencies & Consultancies</h3>
              <p className="persona-description">
                Client MSAs, SOWs, retainers. Negotiate terms that protect your work and your revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="final-cta-container">
          <h2 className="final-cta-title">Stop Losing Deals to Contract Uncertainty</h2>
          <p className="final-cta-body">
            Every redline you accept without understanding is a risk.<br />
            Every deal that stalls waiting for review is revenue at stake.<br />
            Every clause you miss is a problem waiting to happen.
          </p>
          <p className="final-cta-body" style={{ fontSize: '20px', color: '#10B981' }}>
            Upload your first contract and see exactly what you've been missing.
          </p>
          <div className="final-cta-buttons">
            <a href="/upload" className="btn-primary">Upload a Contract Free</a>
            <a href="/demo" className="btn-secondary">Schedule a Demo</a>
          </div>
          <p className="trust-line">
            Free analysis. No credit card required. SOC 2 Type II certified.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span style={{ fontSize: '24px' }}>📄</span>
            <span style={{ fontSize: '20px', fontWeight: 600, color: '#CBD5E1' }}>Contract IQ</span>
          </div>
          <p className="footer-tagline">
            AI-powered contract negotiation for B2B businesses.
          </p>
          <div className="footer-links">
            <a href="/product">Product</a>
            <a href="/pricing">Pricing</a>
            <a href="/security">Security</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <p className="footer-copyright">
            © 2024 Contract IQ. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}