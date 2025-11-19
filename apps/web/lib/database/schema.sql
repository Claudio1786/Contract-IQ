-- Contract IQ Database Schema for Railway PostgreSQL
-- Complete contract intelligence data layer with audit trails and vector search

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For pgvector semantic search
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For GIN indexes

-- =============================================
-- CORE ENTITIES
-- =============================================

-- Users and Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50) CHECK (size IN ('startup', 'mid-market', 'enterprise', 'fortune-500')),
    headquarters VARCHAR(100),
    annual_revenue BIGINT,
    employee_count INTEGER,
    risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTRACT MANAGEMENT
-- =============================================

-- Main contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Basic contract information
    title VARCHAR(500),
    vendor_name VARCHAR(255),
    contract_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
    
    -- Content and extraction
    original_filename VARCHAR(500),
    content_text TEXT, -- Full contract text
    content_vector vector(1536), -- OpenAI ada-002 embedding for semantic search
    page_count INTEGER,
    word_count INTEGER,
    
    -- Extraction metadata
    extraction_method VARCHAR(50) CHECK (extraction_method IN ('direct_text', 'ocr', 'api_extract')),
    extraction_confidence DECIMAL(3,2) CHECK (extraction_confidence BETWEEN 0 AND 1),
    language VARCHAR(10) DEFAULT 'en',
    
    -- Contract terms and timeline
    effective_date DATE,
    expiration_date DATE,
    renewal_date DATE,
    contract_value DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Business context
    department VARCHAR(100),
    owner_email VARCHAR(255),
    tags TEXT[],
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Processing status
    processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    last_processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Source information
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('file_upload', 'email_attachment', 'clm_api', 'url_fetch', 'bulk_import')),
    source_system VARCHAR(100),
    source_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract clauses (normalized extraction results)
CREATE TABLE contract_clauses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    
    -- Clause identification
    clause_type VARCHAR(100) NOT NULL CHECK (clause_type IN (
        'liability_cap', 'indemnity', 'data_processing', 'sla', 'termination',
        'payment_terms', 'ip_rights', 'governing_law', 'audit_rights', 'volume_discounts'
    )),
    clause_text TEXT NOT NULL,
    clause_vector vector(1536), -- For semantic similarity search
    
    -- Text position information
    start_position INTEGER,
    end_position INTEGER,
    page_number INTEGER,
    
    -- Normalized terms (structured data extraction)
    normalized_terms JSONB DEFAULT '{}',
    
    -- AI processing results
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    extraction_agent_id VARCHAR(100),
    extraction_model VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RISK ASSESSMENT
-- =============================================

-- Contract risk assessments
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    
    -- Overall risk scores
    overall_score DECIMAL(3,1) CHECK (overall_score BETWEEN 0 AND 10),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Impact categories
    financial_risk DECIMAL(3,1) CHECK (financial_risk BETWEEN 0 AND 10),
    operational_risk DECIMAL(3,1) CHECK (operational_risk BETWEEN 0 AND 10),
    legal_risk DECIMAL(3,1) CHECK (legal_risk BETWEEN 0 AND 10),
    compliance_risk DECIMAL(3,1) CHECK (compliance_risk BETWEEN 0 AND 10),
    
    -- Risk factors and mitigations
    risk_factors JSONB DEFAULT '[]',
    mitigation_suggestions JSONB DEFAULT '[]',
    
    -- AI processing metadata
    assessment_agent_id VARCHAR(100) NOT NULL,
    assessment_model VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    processing_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clause-level risk assessments
CREATE TABLE clause_risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clause_id UUID NOT NULL REFERENCES contract_clauses(id) ON DELETE CASCADE,
    risk_assessment_id UUID NOT NULL REFERENCES risk_assessments(id) ON DELETE CASCADE,
    
    risk_score DECIMAL(3,1) CHECK (risk_score BETWEEN 0 AND 10),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors JSONB DEFAULT '[]',
    impact_category VARCHAR(50) CHECK (impact_category IN ('financial', 'operational', 'legal', 'compliance')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BENCHMARKING
-- =============================================

-- Contract benchmarking results
CREATE TABLE benchmark_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    
    -- Industry context
    industry VARCHAR(100),
    contract_size_category VARCHAR(50),
    overall_percentile INTEGER CHECK (overall_percentile BETWEEN 0 AND 100),
    
    -- Benchmark metadata
    benchmark_agent_id VARCHAR(100) NOT NULL,
    benchmark_model VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    data_sources JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual metric comparisons
CREATE TABLE benchmark_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    benchmark_analysis_id UUID NOT NULL REFERENCES benchmark_analyses(id) ON DELETE CASCADE,
    clause_id UUID REFERENCES contract_clauses(id), -- Optional: link to specific clause
    
    -- Comparison details
    metric_name VARCHAR(255) NOT NULL,
    contract_value JSONB, -- Your contract's value
    market_median JSONB, -- Market median value
    market_range JSONB, -- [min, max] range
    percentile INTEGER CHECK (percentile BETWEEN 0 AND 100),
    
    -- Recommendation
    recommendation VARCHAR(50) CHECK (recommendation IN ('acceptable', 'negotiate', 'red_flag')),
    recommendation_text TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NEGOTIATION INTELLIGENCE
-- =============================================

-- Negotiation strategies and recommendations
CREATE TABLE negotiation_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    risk_assessment_id UUID REFERENCES risk_assessments(id),
    benchmark_analysis_id UUID REFERENCES benchmark_analyses(id),
    
    -- Strategic recommendations
    prioritized_issues JSONB DEFAULT '[]',
    negotiation_tactics JSONB DEFAULT '[]',
    suggested_concessions JSONB DEFAULT '[]',
    walkaway_points JSONB DEFAULT '[]',
    timeline JSONB DEFAULT '[]',
    
    -- Redlines and proposed changes
    proposed_redlines JSONB DEFAULT '[]',
    
    -- AI processing metadata
    strategy_agent_id VARCHAR(100) NOT NULL,
    strategy_model VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    processing_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenario simulations
CREATE TABLE scenario_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    negotiation_strategy_id UUID REFERENCES negotiation_strategies(id),
    
    -- Simulation results
    scenarios JSONB DEFAULT '[]',
    monte_carlo_results JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    
    -- AI processing metadata
    simulation_agent_id VARCHAR(100) NOT NULL,
    simulation_model VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PROCESSING AND AUDIT
-- =============================================

-- Agent processing jobs
CREATE TABLE agent_processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    
    -- Job configuration
    job_type VARCHAR(50) NOT NULL,
    required_agents JSONB DEFAULT '[]',
    processing_context JSONB DEFAULT '{}',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Status and timing
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    
    -- Results
    results JSONB DEFAULT '{}',
    errors JSONB DEFAULT '[]',
    overall_confidence DECIMAL(3,2) CHECK (overall_confidence BETWEEN 0 AND 1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual agent executions (audit trail)
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES agent_processing_jobs(id) ON DELETE CASCADE,
    
    -- Agent identification
    agent_type VARCHAR(50) NOT NULL,
    agent_id VARCHAR(100) NOT NULL,
    agent_version VARCHAR(50),
    model_name VARCHAR(100),
    model_version VARCHAR(50),
    
    -- Input/Output
    input_data JSONB,
    output_data JSONB,
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    
    -- Processing details
    processing_node VARCHAR(100), -- Railway service instance
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    
    -- Status and errors
    status VARCHAR(50) CHECK (status IN ('running', 'completed', 'failed')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- KNOWLEDGE BASE AND BENCHMARKS
-- =============================================

-- Market benchmark data
CREATE TABLE market_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Context
    industry VARCHAR(100) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) CHECK (company_size IN ('startup', 'mid-market', 'enterprise', 'fortune-500')),
    region VARCHAR(100),
    
    -- Benchmark data
    metric_name VARCHAR(255) NOT NULL,
    metric_type VARCHAR(100), -- 'currency', 'percentage', 'duration', 'text'
    
    -- Statistical data
    median_value JSONB,
    percentile_25 JSONB,
    percentile_75 JSONB,
    min_value JSONB,
    max_value JSONB,
    sample_size INTEGER,
    
    -- Data quality
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    data_sources JSONB DEFAULT '[]',
    last_updated DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract templates and playbooks
CREATE TABLE contract_playbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id), -- NULL for global playbooks
    
    -- Playbook details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contract_type VARCHAR(100) NOT NULL,
    scenario_id VARCHAR(100), -- Links to negotiation-intelligence.ts scenarios
    
    -- Content
    content JSONB NOT NULL,
    template_clauses JSONB DEFAULT '[]',
    negotiation_tactics JSONB DEFAULT '[]',
    
    -- Usage and performance
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2),
    avg_savings_percentage DECIMAL(5,2),
    
    -- Versioning
    version VARCHAR(50) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Primary search and filtering indexes
CREATE INDEX idx_contracts_org_status ON contracts(organization_id, status);
CREATE INDEX idx_contracts_vendor ON contracts(vendor_name);
CREATE INDEX idx_contracts_type ON contracts(contract_type);
CREATE INDEX idx_contracts_renewal_date ON contracts(renewal_date) WHERE renewal_date IS NOT NULL;
CREATE INDEX idx_contracts_processing_status ON contracts(processing_status);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);

-- Full-text search indexes
CREATE INDEX idx_contracts_content_search ON contracts USING GIN(to_tsvector('english', content_text));
CREATE INDEX idx_contracts_vendor_search ON contracts USING GIN(vendor_name gin_trgm_ops);

-- Vector search indexes (for semantic similarity)
CREATE INDEX idx_contracts_vector ON contracts USING ivfflat (content_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_clauses_vector ON contract_clauses USING ivfflat (clause_vector vector_cosine_ops) WITH (lists = 100);

-- Clause-specific indexes
CREATE INDEX idx_clauses_contract_type ON contract_clauses(contract_id, clause_type);
CREATE INDEX idx_clauses_confidence ON contract_clauses(confidence) WHERE confidence > 0.8;

-- Risk assessment indexes
CREATE INDEX idx_risk_overall_score ON risk_assessments(overall_score);
CREATE INDEX idx_risk_level ON risk_assessments(risk_level);
CREATE INDEX idx_clause_risk_level ON clause_risk_scores(risk_level);

-- Benchmarking indexes
CREATE INDEX idx_benchmarks_industry ON benchmark_analyses(industry);
CREATE INDEX idx_benchmarks_percentile ON benchmark_analyses(overall_percentile);
CREATE INDEX idx_market_benchmarks_lookup ON market_benchmarks(industry, contract_type, company_size, metric_name);

-- Processing and audit indexes
CREATE INDEX idx_jobs_status ON agent_processing_jobs(status, created_at);
CREATE INDEX idx_jobs_contract ON agent_processing_jobs(contract_id);
CREATE INDEX idx_executions_job ON agent_executions(job_id);
CREATE INDEX idx_executions_agent_type ON agent_executions(agent_type, status);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Contract overview with latest risk assessment
CREATE VIEW contract_overview AS
SELECT 
    c.*,
    ra.overall_score as risk_score,
    ra.risk_level,
    ba.overall_percentile as benchmark_percentile,
    ba.industry as benchmark_industry,
    ns.id as has_negotiation_strategy,
    ajp.status as latest_processing_status,
    ajp.completed_at as last_processed_at
FROM contracts c
LEFT JOIN risk_assessments ra ON c.id = ra.contract_id 
    AND ra.created_at = (
        SELECT MAX(created_at) 
        FROM risk_assessments ra2 
        WHERE ra2.contract_id = c.id
    )
LEFT JOIN benchmark_analyses ba ON c.id = ba.contract_id 
    AND ba.created_at = (
        SELECT MAX(created_at) 
        FROM benchmark_analyses ba2 
        WHERE ba2.contract_id = c.id
    )
LEFT JOIN negotiation_strategies ns ON c.id = ns.contract_id
LEFT JOIN agent_processing_jobs ajp ON c.id = ajp.contract_id
    AND ajp.created_at = (
        SELECT MAX(created_at)
        FROM agent_processing_jobs ajp2
        WHERE ajp2.contract_id = c.id
    );

-- High-risk contracts requiring attention
CREATE VIEW high_risk_contracts AS
SELECT 
    co.*,
    COALESCE(
        CASE 
            WHEN co.renewal_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'urgent'
            WHEN co.risk_level = 'critical' THEN 'high'
            WHEN co.risk_level = 'high' THEN 'medium'
            ELSE 'low'
        END, 'low'
    ) as attention_priority
FROM contract_overview co
WHERE 
    co.risk_level IN ('high', 'critical') 
    OR co.renewal_date <= CURRENT_DATE + INTERVAL '90 days'
    OR co.benchmark_percentile > 85
ORDER BY 
    CASE attention_priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    co.renewal_date NULLS LAST;

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables that need updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contract_playbooks_updated_at BEFORE UPDATE ON contract_playbooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate contract processing metrics
CREATE OR REPLACE FUNCTION get_processing_metrics(org_id UUID, date_range INTERVAL DEFAULT '30 days')
RETURNS TABLE(
    total_contracts INTEGER,
    completed_contracts INTEGER,
    avg_processing_time INTERVAL,
    avg_risk_score DECIMAL(3,1),
    high_risk_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_contracts,
        COUNT(CASE WHEN ajp.status = 'completed' THEN 1 END)::INTEGER as completed_contracts,
        AVG(ajp.processing_time_ms * INTERVAL '1 millisecond') as avg_processing_time,
        AVG(ra.overall_score) as avg_risk_score,
        COUNT(CASE WHEN ra.risk_level IN ('high', 'critical') THEN 1 END)::INTEGER as high_risk_count
    FROM contracts c
    LEFT JOIN agent_processing_jobs ajp ON c.id = ajp.contract_id
    LEFT JOIN risk_assessments ra ON c.id = ra.contract_id
    WHERE c.organization_id = org_id
    AND c.created_at >= NOW() - date_range;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================

-- Default organization for development
INSERT INTO organizations (id, name, industry, size) 
VALUES (
    uuid_generate_v4(),
    'Contract IQ Demo',
    'Technology',
    'startup'
) ON CONFLICT DO NOTHING;

-- Market benchmark seed data for common metrics
INSERT INTO market_benchmarks (industry, contract_type, company_size, metric_name, metric_type, median_value, percentile_25, percentile_75, sample_size, confidence) VALUES
('Technology', 'SaaS', 'startup', 'Liability Cap', 'currency', '500000', '250000', '1000000', 150, 0.85),
('Technology', 'SaaS', 'startup', 'Payment Terms', 'duration', '30', '15', '45', 200, 0.90),
('Technology', 'SaaS', 'mid-market', 'Liability Cap', 'currency', '1000000', '500000', '2000000', 300, 0.88),
('Technology', 'SaaS', 'mid-market', 'Payment Terms', 'duration', '30', '30', '60', 250, 0.92),
('Technology', 'SaaS', 'enterprise', 'Liability Cap', 'currency', '5000000', '2000000', '10000000', 100, 0.80),
('Technology', 'SaaS', 'enterprise', 'Payment Terms', 'duration', '45', '30', '60', 120, 0.85);

COMMENT ON DATABASE postgres IS 'Contract IQ - AI-powered contract intelligence platform';
COMMENT ON TABLE contracts IS 'Core contracts storage with full-text and vector search capabilities';
COMMENT ON TABLE contract_clauses IS 'Extracted and normalized contract clauses for analysis';
COMMENT ON TABLE risk_assessments IS 'AI-generated risk assessments with confidence scoring';
COMMENT ON TABLE benchmark_analyses IS 'Market benchmark comparisons and industry positioning';
COMMENT ON TABLE agent_executions IS 'Complete audit trail of all AI agent processing';