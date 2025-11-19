// Database Client for Contract IQ - Railway PostgreSQL
// Type-safe database operations with connection pooling

import { Pool, PoolClient } from 'pg';
import { ContractData, RiskAssessmentData, BenchmarkData } from '../contract-data-schema';

// Database configuration
interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  max?: number; // Connection pool size
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Core database entities matching our schema
export interface Organization {
  id: string;
  name: string;
  industry?: string;
  size?: 'startup' | 'mid-market' | 'enterprise' | 'fortune-500';
  headquarters?: string;
  annual_revenue?: number;
  employee_count?: number;
  risk_tolerance?: 'conservative' | 'moderate' | 'aggressive';
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  organization_id?: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Contract {
  id: string;
  organization_id: string;
  user_id: string;
  
  // Basic info
  title?: string;
  vendor_name?: string;
  contract_type: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  
  // Content
  original_filename?: string;
  content_text?: string;
  content_vector?: number[]; // pgvector embedding
  page_count?: number;
  word_count?: number;
  
  // Extraction
  extraction_method?: 'direct_text' | 'ocr' | 'api_extract';
  extraction_confidence?: number;
  language?: string;
  
  // Terms
  effective_date?: Date;
  expiration_date?: Date;
  renewal_date?: Date;
  contract_value?: number;
  currency?: string;
  
  // Business context
  department?: string;
  owner_email?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // Processing
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  last_processed_at?: Date;
  
  // Source
  source_type: 'file_upload' | 'email_attachment' | 'clm_api' | 'url_fetch' | 'bulk_import';
  source_system?: string;
  source_id?: string;
  
  created_at: Date;
  updated_at: Date;
}

export interface ContractClause {
  id: string;
  contract_id: string;
  clause_type: 'liability_cap' | 'indemnity' | 'data_processing' | 'sla' | 'termination' 
    | 'payment_terms' | 'ip_rights' | 'governing_law' | 'audit_rights' | 'volume_discounts';
  clause_text: string;
  clause_vector?: number[];
  start_position?: number;
  end_position?: number;
  page_number?: number;
  normalized_terms: Record<string, any>;
  confidence?: number;
  extraction_agent_id?: string;
  extraction_model?: string;
  created_at: Date;
}

export interface RiskAssessment {
  id: string;
  contract_id: string;
  overall_score?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  financial_risk?: number;
  operational_risk?: number;
  legal_risk?: number;
  compliance_risk?: number;
  risk_factors: Record<string, any>[];
  mitigation_suggestions: string[];
  assessment_agent_id: string;
  assessment_model: string;
  confidence?: number;
  processing_time_ms?: number;
  created_at: Date;
}

export interface BenchmarkAnalysis {
  id: string;
  contract_id: string;
  industry?: string;
  contract_size_category?: string;
  overall_percentile?: number;
  benchmark_agent_id: string;
  benchmark_model: string;
  confidence?: number;
  data_sources: string[];
  created_at: Date;
}

export interface AgentProcessingJob {
  id: string;
  contract_id: string;
  job_type: string;
  required_agents: string[];
  processing_context: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  started_at?: Date;
  completed_at?: Date;
  processing_time_ms?: number;
  results: Record<string, any>;
  errors: any[];
  overall_confidence?: number;
  created_at: Date;
}

// Database client class
export class ContractIQDatabase {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor(config?: DatabaseConfig) {
    // Use Railway's DATABASE_URL or custom config
    const dbConfig = config || this.getRailwayConfig();
    this.pool = new Pool(dbConfig);
    
    // Handle connection errors
    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
      this.isConnected = false;
    });

    this.pool.on('connect', () => {
      this.isConnected = true;
    });
  }

  private getRailwayConfig(): DatabaseConfig {
    // Railway provides DATABASE_URL environment variable
    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    }

    // Fallback to individual environment variables
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'contract_iq',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.NODE_ENV === 'production',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  // Connection management
  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.pool.connect();
      console.log('Database connected successfully');
    }
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
    this.isConnected = false;
    console.log('Database disconnected');
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  // =============================================
  // CONTRACT OPERATIONS
  // =============================================

  async createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<Contract> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO contracts (
          organization_id, user_id, title, vendor_name, contract_type, status,
          original_filename, content_text, content_vector, extraction_method,
          extraction_confidence, effective_date, expiration_date, renewal_date,
          contract_value, currency, department, owner_email, tags, priority,
          processing_status, source_type, source_system, source_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24
        )
        RETURNING *
      `;

      const values = [
        contract.organization_id,
        contract.user_id,
        contract.title,
        contract.vendor_name,
        contract.contract_type,
        contract.status,
        contract.original_filename,
        contract.content_text,
        contract.content_vector ? JSON.stringify(contract.content_vector) : null,
        contract.extraction_method,
        contract.extraction_confidence,
        contract.effective_date,
        contract.expiration_date,
        contract.renewal_date,
        contract.contract_value,
        contract.currency,
        contract.department,
        contract.owner_email,
        contract.tags,
        contract.priority,
        contract.processing_status,
        contract.source_type,
        contract.source_system,
        contract.source_id,
      ];

      const result = await client.query(query, values);
      return result.rows[0] as Contract;
    } finally {
      client.release();
    }
  }

  async getContract(contractId: string): Promise<Contract | null> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM contracts WHERE id = $1';
      const result = await client.query(query, [contractId]);
      return result.rows[0] as Contract || null;
    } finally {
      client.release();
    }
  }

  async getContractsByOrganization(organizationId: string, limit = 50, offset = 0): Promise<Contract[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT * FROM contracts 
        WHERE organization_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
      `;
      const result = await client.query(query, [organizationId, limit, offset]);
      return result.rows as Contract[];
    } finally {
      client.release();
    }
  }

  async updateContractProcessingStatus(
    contractId: string, 
    status: Contract['processing_status'],
    lastProcessedAt?: Date
  ): Promise<void> {
    const client = await this.getClient();
    try {
      const query = `
        UPDATE contracts 
        SET processing_status = $1, last_processed_at = $2, updated_at = NOW()
        WHERE id = $3
      `;
      await client.query(query, [status, lastProcessedAt || new Date(), contractId]);
    } finally {
      client.release();
    }
  }

  async searchContracts(
    organizationId: string,
    searchTerm: string,
    filters?: {
      vendor_name?: string;
      contract_type?: string;
      status?: Contract['status'];
      priority?: Contract['priority'];
    }
  ): Promise<Contract[]> {
    const client = await this.getClient();
    try {
      let query = `
        SELECT *, ts_rank(to_tsvector('english', content_text), plainto_tsquery($2)) as rank
        FROM contracts 
        WHERE organization_id = $1 
        AND to_tsvector('english', content_text) @@ plainto_tsquery($2)
      `;
      
      const params: any[] = [organizationId, searchTerm];
      let paramCount = 2;

      if (filters) {
        if (filters.vendor_name) {
          query += ` AND vendor_name ILIKE $${++paramCount}`;
          params.push(`%${filters.vendor_name}%`);
        }
        if (filters.contract_type) {
          query += ` AND contract_type = $${++paramCount}`;
          params.push(filters.contract_type);
        }
        if (filters.status) {
          query += ` AND status = $${++paramCount}`;
          params.push(filters.status);
        }
        if (filters.priority) {
          query += ` AND priority = $${++paramCount}`;
          params.push(filters.priority);
        }
      }

      query += ' ORDER BY rank DESC, created_at DESC LIMIT 100';

      const result = await client.query(query, params);
      return result.rows as Contract[];
    } finally {
      client.release();
    }
  }

  // =============================================
  // CLAUSE OPERATIONS
  // =============================================

  async createContractClauses(clauses: Omit<ContractClause, 'id' | 'created_at'>[]): Promise<ContractClause[]> {
    const client = await this.getClient();
    try {
      const insertValues = clauses.map((clause, index) => {
        const baseIndex = index * 10;
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, 
                $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, 
                $${baseIndex + 9}, $${baseIndex + 10})`;
      });

      const query = `
        INSERT INTO contract_clauses (
          contract_id, clause_type, clause_text, clause_vector, start_position,
          end_position, page_number, normalized_terms, confidence, extraction_agent_id
        ) VALUES ${insertValues.join(', ')}
        RETURNING *
      `;

      const values = clauses.flatMap(clause => [
        clause.contract_id,
        clause.clause_type,
        clause.clause_text,
        clause.clause_vector ? JSON.stringify(clause.clause_vector) : null,
        clause.start_position,
        clause.end_position,
        clause.page_number,
        JSON.stringify(clause.normalized_terms),
        clause.confidence,
        clause.extraction_agent_id,
      ]);

      const result = await client.query(query, values);
      return result.rows as ContractClause[];
    } finally {
      client.release();
    }
  }

  async getContractClauses(contractId: string): Promise<ContractClause[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT * FROM contract_clauses 
        WHERE contract_id = $1 
        ORDER BY start_position ASC, clause_type ASC
      `;
      const result = await client.query(query, [contractId]);
      return result.rows as ContractClause[];
    } finally {
      client.release();
    }
  }

  async findSimilarClauses(
    clauseVector: number[], 
    organizationId: string, 
    clauseType?: string,
    limit = 10
  ): Promise<ContractClause[]> {
    const client = await this.getClient();
    try {
      let query = `
        SELECT cc.*, c.vendor_name, c.contract_type,
               (cc.clause_vector <=> $1::vector) as similarity
        FROM contract_clauses cc
        JOIN contracts c ON cc.contract_id = c.id
        WHERE c.organization_id = $2
      `;
      
      const params: any[] = [JSON.stringify(clauseVector), organizationId];
      
      if (clauseType) {
        query += ' AND cc.clause_type = $3';
        params.push(clauseType);
      }
      
      query += ' ORDER BY similarity ASC LIMIT $' + (params.length + 1);
      params.push(limit);

      const result = await client.query(query, params);
      return result.rows as ContractClause[];
    } finally {
      client.release();
    }
  }

  // =============================================
  // RISK ASSESSMENT OPERATIONS
  // =============================================

  async createRiskAssessment(assessment: Omit<RiskAssessment, 'id' | 'created_at'>): Promise<RiskAssessment> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO risk_assessments (
          contract_id, overall_score, risk_level, financial_risk, operational_risk,
          legal_risk, compliance_risk, risk_factors, mitigation_suggestions,
          assessment_agent_id, assessment_model, confidence, processing_time_ms
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
        RETURNING *
      `;

      const values = [
        assessment.contract_id,
        assessment.overall_score,
        assessment.risk_level,
        assessment.financial_risk,
        assessment.operational_risk,
        assessment.legal_risk,
        assessment.compliance_risk,
        JSON.stringify(assessment.risk_factors),
        JSON.stringify(assessment.mitigation_suggestions),
        assessment.assessment_agent_id,
        assessment.assessment_model,
        assessment.confidence,
        assessment.processing_time_ms,
      ];

      const result = await client.query(query, values);
      return result.rows[0] as RiskAssessment;
    } finally {
      client.release();
    }
  }

  async getLatestRiskAssessment(contractId: string): Promise<RiskAssessment | null> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT * FROM risk_assessments 
        WHERE contract_id = $1 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const result = await client.query(query, [contractId]);
      return result.rows[0] as RiskAssessment || null;
    } finally {
      client.release();
    }
  }

  async getHighRiskContracts(organizationId: string, riskLevel: 'high' | 'critical' = 'high'): Promise<Contract[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT c.*, ra.overall_score, ra.risk_level
        FROM contracts c
        JOIN risk_assessments ra ON c.id = ra.contract_id
        WHERE c.organization_id = $1 
        AND ra.risk_level IN ('high', 'critical')
        AND ra.created_at = (
          SELECT MAX(created_at) 
          FROM risk_assessments ra2 
          WHERE ra2.contract_id = c.id
        )
        ORDER BY ra.overall_score DESC, c.renewal_date ASC
      `;
      const result = await client.query(query, [organizationId]);
      return result.rows as Contract[];
    } finally {
      client.release();
    }
  }

  // =============================================
  // BENCHMARK OPERATIONS
  // =============================================

  async createBenchmarkAnalysis(analysis: Omit<BenchmarkAnalysis, 'id' | 'created_at'>): Promise<BenchmarkAnalysis> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO benchmark_analyses (
          contract_id, industry, contract_size_category, overall_percentile,
          benchmark_agent_id, benchmark_model, confidence, data_sources
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        analysis.contract_id,
        analysis.industry,
        analysis.contract_size_category,
        analysis.overall_percentile,
        analysis.benchmark_agent_id,
        analysis.benchmark_model,
        analysis.confidence,
        JSON.stringify(analysis.data_sources),
      ];

      const result = await client.query(query, values);
      return result.rows[0] as BenchmarkAnalysis;
    } finally {
      client.release();
    }
  }

  async getMarketBenchmarks(
    industry: string,
    contractType: string,
    companySize: string,
    metricName?: string
  ): Promise<any[]> {
    const client = await this.getClient();
    try {
      let query = `
        SELECT * FROM market_benchmarks 
        WHERE industry = $1 AND contract_type = $2 AND company_size = $3
      `;
      const params = [industry, contractType, companySize];

      if (metricName) {
        query += ' AND metric_name = $4';
        params.push(metricName);
      }

      query += ' ORDER BY confidence DESC, last_updated DESC';

      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // =============================================
  // PROCESSING JOB OPERATIONS
  // =============================================

  async createProcessingJob(job: Omit<AgentProcessingJob, 'id' | 'created_at'>): Promise<AgentProcessingJob> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO agent_processing_jobs (
          contract_id, job_type, required_agents, processing_context,
          priority, status, results, errors
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        job.contract_id,
        job.job_type,
        JSON.stringify(job.required_agents),
        JSON.stringify(job.processing_context),
        job.priority,
        job.status,
        JSON.stringify(job.results),
        JSON.stringify(job.errors),
      ];

      const result = await client.query(query, values);
      return result.rows[0] as AgentProcessingJob;
    } finally {
      client.release();
    }
  }

  async updateProcessingJob(jobId: string, updates: Partial<AgentProcessingJob>): Promise<void> {
    const client = await this.getClient();
    try {
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramCount}`);
          
          // Handle JSON fields
          if (['required_agents', 'processing_context', 'results', 'errors'].includes(key)) {
            values.push(JSON.stringify(value));
          } else {
            values.push(value);
          }
          paramCount++;
        }
      }

      if (updateFields.length === 0) return;

      const query = `
        UPDATE agent_processing_jobs 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount}
      `;
      values.push(jobId);

      await client.query(query, values);
    } finally {
      client.release();
    }
  }

  async getProcessingJob(jobId: string): Promise<AgentProcessingJob | null> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM agent_processing_jobs WHERE id = $1';
      const result = await client.query(query, [jobId]);
      return result.rows[0] as AgentProcessingJob || null;
    } finally {
      client.release();
    }
  }

  async getQueuedJobs(limit = 10): Promise<AgentProcessingJob[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT * FROM agent_processing_jobs 
        WHERE status = 'queued' 
        ORDER BY 
          CASE priority 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            ELSE 4 
          END ASC,
          created_at ASC
        LIMIT $1
      `;
      const result = await client.query(query, [limit]);
      return result.rows as AgentProcessingJob[];
    } finally {
      client.release();
    }
  }

  // =============================================
  // ANALYTICS AND METRICS
  // =============================================

  async getProcessingMetrics(organizationId: string, dateRange = '30 days'): Promise<{
    total_contracts: number;
    completed_contracts: number;
    avg_processing_time: string; // PostgreSQL interval
    avg_risk_score: number;
    high_risk_count: number;
  }> {
    const client = await this.getClient();
    try {
      const query = 'SELECT * FROM get_processing_metrics($1, $2::interval)';
      const result = await client.query(query, [organizationId, dateRange]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getContractOverview(organizationId: string): Promise<any[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT * FROM contract_overview 
        WHERE organization_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [organizationId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getUpcomingRenewals(organizationId: string, daysAhead = 90): Promise<Contract[]> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT * FROM contracts 
        WHERE organization_id = $1 
        AND renewal_date IS NOT NULL 
        AND renewal_date <= CURRENT_DATE + INTERVAL '$2 days'
        AND status = 'active'
        ORDER BY renewal_date ASC
      `;
      const result = await client.query(query, [organizationId, daysAhead]);
      return result.rows as Contract[];
    } finally {
      client.release();
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async healthCheck(): Promise<boolean> {
    const client = await this.getClient();
    try {
      await client.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    } finally {
      client.release();
    }
  }

  async runMigration(migrationSQL: string): Promise<void> {
    const client = await this.getClient();
    try {
      await client.query(migrationSQL);
      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Export singleton instance
export const db = new ContractIQDatabase();

// Type exports for convenience
export type {
  Organization,
  User,
  Contract,
  ContractClause,
  RiskAssessment,
  BenchmarkAnalysis,
  AgentProcessingJob,
};