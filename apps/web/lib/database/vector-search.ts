// Vector Search and Semantic Similarity for Contract Intelligence
// Implements pgvector-based semantic search for contracts and clauses

import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, Contract, ContractClause } from './db-client';

// Vector search configuration
export interface VectorSearchConfig {
  googleApiKey: string;
  embeddingModel: string;
  similarityThreshold: number;
  maxResults: number;
}

// Search result interfaces
export interface ContractSearchResult extends Contract {
  similarity_score: number;
  matching_clauses?: ContractClause[];
}

export interface ClauseSearchResult extends ContractClause {
  similarity_score: number;
  contract_context: {
    vendor_name?: string;
    contract_type: string;
    title?: string;
  };
}

export interface SemanticSearchQuery {
  query: string;
  organizationId: string;
  filters?: {
    contract_type?: string;
    vendor_name?: string;
    clause_type?: string;
    date_range?: {
      start: Date;
      end: Date;
    };
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
  };
  limit?: number;
  threshold?: number;
}

// Vector search class
export class VectorSearchEngine {
  private genAI: GoogleGenerativeAI;
  private config: VectorSearchConfig;
  private embeddingCache: Map<string, number[]> = new Map();

  constructor(config: VectorSearchConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.googleApiKey);
  }

  // =============================================
  // EMBEDDING GENERATION
  // =============================================

  async generateEmbedding(text: string, useCache = true): Promise<number[]> {
    // Check cache first
    if (useCache && this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text)!;
    }

    try {
      // Use Google's text-embedding-004 model for embeddings
      const model = this.genAI.getGenerativeModel({ 
        model: 'text-embedding-004'
      });

      const result = await model.embedContent(text);
      const embedding = result.embedding.values;

      // Cache the embedding
      if (useCache && embedding && embedding.length > 0) {
        this.embeddingCache.set(text, embedding);
      }

      return embedding || [];

    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    // For now, process sequentially. In production, could use batch API if available
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      try {
        const embedding = await this.generateEmbedding(text);
        embeddings.push(embedding);
      } catch (error) {
        console.error(`Failed to embed text: ${text.substring(0, 50)}...`, error);
        // Use zero vector as fallback
        embeddings.push(new Array(768).fill(0)); // Assuming 768-dimensional embeddings
      }
    }
    
    return embeddings;
  }

  // =============================================
  // SEMANTIC CONTRACT SEARCH
  // =============================================

  async searchContracts(query: SemanticSearchQuery): Promise<ContractSearchResult[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query.query);
      
      // Build SQL query with filters
      let sql = `
        SELECT c.*, 
               (c.content_vector <=> $1::vector) as similarity_score
        FROM contracts c
        WHERE c.organization_id = $2
        AND c.content_vector IS NOT NULL
      `;
      
      const params: any[] = [JSON.stringify(queryEmbedding), query.organizationId];
      let paramCount = 2;

      // Apply filters
      if (query.filters) {
        if (query.filters.contract_type) {
          sql += ` AND c.contract_type = $${++paramCount}`;
          params.push(query.filters.contract_type);
        }
        
        if (query.filters.vendor_name) {
          sql += ` AND c.vendor_name ILIKE $${++paramCount}`;
          params.push(`%${query.filters.vendor_name}%`);
        }
        
        if (query.filters.date_range) {
          sql += ` AND c.created_at BETWEEN $${++paramCount} AND $${++paramCount}`;
          params.push(query.filters.date_range.start, query.filters.date_range.end);
        }
        
        if (query.filters.risk_level) {
          sql += ` AND EXISTS (
            SELECT 1 FROM risk_assessments ra 
            WHERE ra.contract_id = c.id 
            AND ra.risk_level = $${++paramCount}
            AND ra.created_at = (
              SELECT MAX(created_at) 
              FROM risk_assessments ra2 
              WHERE ra2.contract_id = c.id
            )
          )`;
          params.push(query.filters.risk_level);
        }
      }

      // Apply similarity threshold and limit
      const threshold = query.threshold || this.config.similarityThreshold;
      sql += ` AND (c.content_vector <=> $1::vector) < $${++paramCount}`;
      params.push(threshold);

      sql += ` ORDER BY similarity_score ASC LIMIT $${++paramCount}`;
      params.push(query.limit || this.config.maxResults);

      // Execute query
      const client = await db.getClient();
      try {
        const result = await client.query(sql, params);
        return result.rows as ContractSearchResult[];
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Contract search error:', error);
      throw new Error(`Contract search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================
  // SEMANTIC CLAUSE SEARCH
  // =============================================

  async searchClauses(query: SemanticSearchQuery): Promise<ClauseSearchResult[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query.query);
      
      // Build SQL query with joins
      let sql = `
        SELECT cc.*,
               c.vendor_name,
               c.contract_type,
               c.title,
               (cc.clause_vector <=> $1::vector) as similarity_score
        FROM contract_clauses cc
        JOIN contracts c ON cc.contract_id = c.id
        WHERE c.organization_id = $2
        AND cc.clause_vector IS NOT NULL
      `;
      
      const params: any[] = [JSON.stringify(queryEmbedding), query.organizationId];
      let paramCount = 2;

      // Apply filters
      if (query.filters) {
        if (query.filters.clause_type) {
          sql += ` AND cc.clause_type = $${++paramCount}`;
          params.push(query.filters.clause_type);
        }
        
        if (query.filters.contract_type) {
          sql += ` AND c.contract_type = $${++paramCount}`;
          params.push(query.filters.contract_type);
        }
        
        if (query.filters.vendor_name) {
          sql += ` AND c.vendor_name ILIKE $${++paramCount}`;
          params.push(`%${query.filters.vendor_name}%`);
        }
      }

      // Apply similarity threshold and limit
      const threshold = query.threshold || this.config.similarityThreshold;
      sql += ` AND (cc.clause_vector <=> $1::vector) < $${++paramCount}`;
      params.push(threshold);

      sql += ` ORDER BY similarity_score ASC LIMIT $${++paramCount}`;
      params.push(query.limit || this.config.maxResults);

      // Execute query
      const client = await db.getClient();
      try {
        const result = await client.query(sql, params);
        
        // Transform results to include contract context
        return result.rows.map(row => ({
          ...row,
          contract_context: {
            vendor_name: row.vendor_name,
            contract_type: row.contract_type,
            title: row.title,
          }
        })) as ClauseSearchResult[];
        
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Clause search error:', error);
      throw new Error(`Clause search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================
  // BENCHMARK AND SIMILARITY ANALYSIS
  // =============================================

  async findSimilarContracts(
    contractId: string, 
    organizationId: string,
    limit = 10
  ): Promise<ContractSearchResult[]> {
    try {
      // Get the source contract's embedding
      const sourceContract = await db.getContract(contractId);
      if (!sourceContract || !sourceContract.content_vector) {
        throw new Error('Source contract not found or no embedding available');
      }

      // Search for similar contracts
      const sql = `
        SELECT c.*,
               (c.content_vector <=> $1::vector) as similarity_score
        FROM contracts c
        WHERE c.organization_id = $2
        AND c.id != $3
        AND c.content_vector IS NOT NULL
        ORDER BY similarity_score ASC
        LIMIT $4
      `;

      const client = await db.getClient();
      try {
        const result = await client.query(sql, [
          JSON.stringify(sourceContract.content_vector),
          organizationId,
          contractId,
          limit
        ]);
        
        return result.rows as ContractSearchResult[];
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Similar contracts search error:', error);
      throw new Error(`Similar contracts search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findSimilarClauses(
    clauseId: string,
    organizationId: string,
    sameType = true,
    limit = 10
  ): Promise<ClauseSearchResult[]> {
    try {
      // Get the source clause's embedding and type
      const client = await db.getClient();
      let sourceClause;
      
      try {
        const result = await client.query(
          'SELECT * FROM contract_clauses WHERE id = $1',
          [clauseId]
        );
        sourceClause = result.rows[0];
      } finally {
        client.release();
      }

      if (!sourceClause || !sourceClause.clause_vector) {
        throw new Error('Source clause not found or no embedding available');
      }

      // Build query
      let sql = `
        SELECT cc.*,
               c.vendor_name,
               c.contract_type,
               c.title,
               (cc.clause_vector <=> $1::vector) as similarity_score
        FROM contract_clauses cc
        JOIN contracts c ON cc.contract_id = c.id
        WHERE c.organization_id = $2
        AND cc.id != $3
        AND cc.clause_vector IS NOT NULL
      `;
      
      const params = [
        JSON.stringify(sourceClause.clause_vector),
        organizationId,
        clauseId
      ];

      if (sameType) {
        sql += ' AND cc.clause_type = $4';
        params.push(sourceClause.clause_type);
      }

      sql += ' ORDER BY similarity_score ASC LIMIT $' + (params.length + 1);
      params.push(limit);

      // Execute query
      const client2 = await db.getClient();
      try {
        const result = await client2.query(sql, params);
        
        return result.rows.map(row => ({
          ...row,
          contract_context: {
            vendor_name: row.vendor_name,
            contract_type: row.contract_type,
            title: row.title,
          }
        })) as ClauseSearchResult[];
        
      } finally {
        client2.release();
      }

    } catch (error) {
      console.error('Similar clauses search error:', error);
      throw new Error(`Similar clauses search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================
  // CLUSTERING AND ANALYTICS
  // =============================================

  async analyzeContractClusters(
    organizationId: string,
    contractType?: string
  ): Promise<{
    clusters: ContractCluster[];
    outliers: Contract[];
    insights: string[];
  }> {
    try {
      // Get all contracts with embeddings
      let sql = `
        SELECT c.*, 
               ra.risk_level,
               ra.overall_score
        FROM contracts c
        LEFT JOIN risk_assessments ra ON c.id = ra.contract_id 
          AND ra.created_at = (
            SELECT MAX(created_at) 
            FROM risk_assessments ra2 
            WHERE ra2.contract_id = c.id
          )
        WHERE c.organization_id = $1
        AND c.content_vector IS NOT NULL
      `;
      
      const params: any[] = [organizationId];
      
      if (contractType) {
        sql += ' AND c.contract_type = $2';
        params.push(contractType);
      }

      const client = await db.getClient();
      let contracts;
      
      try {
        const result = await client.query(sql, params);
        contracts = result.rows;
      } finally {
        client.release();
      }

      if (contracts.length < 3) {
        return {
          clusters: [],
          outliers: contracts,
          insights: ['Insufficient contracts for clustering analysis']
        };
      }

      // Simple clustering based on vector similarity
      // In production, could use more sophisticated clustering algorithms
      const clusters = await this.performSimpleClustering(contracts);
      const outliers = this.identifyOutliers(contracts, clusters);
      const insights = this.generateClusterInsights(clusters, outliers);

      return {
        clusters,
        outliers,
        insights
      };

    } catch (error) {
      console.error('Contract clustering error:', error);
      throw new Error(`Contract clustering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async performSimpleClustering(contracts: any[]): Promise<ContractCluster[]> {
    // Simple K-means style clustering
    // This is a basic implementation - production would use more sophisticated methods
    
    const clusters: ContractCluster[] = [];
    const processed = new Set<string>();
    
    for (const contract of contracts) {
      if (processed.has(contract.id)) continue;
      
      // Find similar contracts to form a cluster
      const similar = contracts.filter(other => {
        if (processed.has(other.id) || contract.id === other.id) return false;
        
        const similarity = this.calculateCosineSimilarity(
          contract.content_vector,
          other.content_vector
        );
        
        return similarity > 0.8; // High similarity threshold for clustering
      });
      
      if (similar.length > 0) {
        const cluster: ContractCluster = {
          id: `cluster_${clusters.length + 1}`,
          contracts: [contract, ...similar],
          centroid_characteristics: this.extractClusterCharacteristics([contract, ...similar]),
          common_patterns: this.identifyCommonPatterns([contract, ...similar]),
          risk_profile: this.analyzeClusterRisk([contract, ...similar]),
        };
        
        clusters.push(cluster);
        
        // Mark contracts as processed
        processed.add(contract.id);
        similar.forEach(c => processed.add(c.id));
      }
    }
    
    return clusters;
  }

  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private identifyOutliers(contracts: any[], clusters: ContractCluster[]): Contract[] {
    const clusteredIds = new Set();
    clusters.forEach(cluster => {
      cluster.contracts.forEach(contract => {
        clusteredIds.add(contract.id);
      });
    });
    
    return contracts.filter(contract => !clusteredIds.has(contract.id));
  }

  private extractClusterCharacteristics(contracts: any[]): Record<string, any> {
    const characteristics = {
      avg_value: 0,
      common_vendors: [] as string[],
      avg_risk_score: 0,
      common_departments: [] as string[],
    };
    
    // Calculate averages and common patterns
    const values = contracts.filter(c => c.contract_value).map(c => c.contract_value);
    if (values.length > 0) {
      characteristics.avg_value = values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    
    const riskScores = contracts.filter(c => c.overall_score).map(c => c.overall_score);
    if (riskScores.length > 0) {
      characteristics.avg_risk_score = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
    }
    
    // Extract common vendors and departments
    const vendorCounts = new Map<string, number>();
    const deptCounts = new Map<string, number>();
    
    contracts.forEach(contract => {
      if (contract.vendor_name) {
        vendorCounts.set(contract.vendor_name, (vendorCounts.get(contract.vendor_name) || 0) + 1);
      }
      if (contract.department) {
        deptCounts.set(contract.department, (deptCounts.get(contract.department) || 0) + 1);
      }
    });
    
    characteristics.common_vendors = Array.from(vendorCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([vendor, _]) => vendor);
      
    characteristics.common_departments = Array.from(deptCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([dept, _]) => dept);
    
    return characteristics;
  }

  private identifyCommonPatterns(contracts: any[]): string[] {
    // Identify common patterns across contracts in the cluster
    const patterns: string[] = [];
    
    if (contracts.every(c => c.contract_type === contracts[0].contract_type)) {
      patterns.push(`All contracts are ${contracts[0].contract_type} type`);
    }
    
    const avgValue = contracts
      .filter(c => c.contract_value)
      .reduce((sum, c, _, arr) => sum + c.contract_value / arr.length, 0);
      
    if (avgValue > 100000) {
      patterns.push('High-value contracts cluster');
    } else if (avgValue < 10000) {
      patterns.push('Low-value contracts cluster');
    }
    
    return patterns;
  }

  private analyzeClusterRisk(contracts: any[]): {
    avg_risk: number;
    risk_distribution: Record<string, number>;
    high_risk_count: number;
  } {
    const riskLevels = contracts
      .filter(c => c.risk_level)
      .map(c => c.risk_level);
      
    const distribution = riskLevels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const avgRisk = contracts
      .filter(c => c.overall_score)
      .reduce((sum, c, _, arr) => sum + c.overall_score / arr.length, 0);
      
    return {
      avg_risk: avgRisk,
      risk_distribution: distribution,
      high_risk_count: (distribution.high || 0) + (distribution.critical || 0)
    };
  }

  private generateClusterInsights(clusters: ContractCluster[], outliers: Contract[]): string[] {
    const insights: string[] = [];
    
    insights.push(`Identified ${clusters.length} contract clusters and ${outliers.length} outliers`);
    
    if (clusters.length > 0) {
      const largestCluster = clusters.reduce((max, cluster) => 
        cluster.contracts.length > max.contracts.length ? cluster : max
      );
      insights.push(`Largest cluster contains ${largestCluster.contracts.length} similar contracts`);
      
      const highRiskClusters = clusters.filter(c => c.risk_profile.avg_risk > 7);
      if (highRiskClusters.length > 0) {
        insights.push(`${highRiskClusters.length} clusters show elevated risk patterns`);
      }
    }
    
    if (outliers.length > 0) {
      const highValueOutliers = outliers.filter(c => c.contract_value && c.contract_value > 100000);
      if (highValueOutliers.length > 0) {
        insights.push(`${highValueOutliers.length} high-value contracts are outliers - may need special attention`);
      }
    }
    
    return insights;
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async updateContractEmbedding(contractId: string, content: string): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(content);
      
      const client = await db.getClient();
      try {
        await client.query(
          'UPDATE contracts SET content_vector = $1 WHERE id = $2',
          [JSON.stringify(embedding), contractId]
        );
      } finally {
        client.release();
      }
      
    } catch (error) {
      console.error(`Failed to update embedding for contract ${contractId}:`, error);
      throw error;
    }
  }

  async updateClauseEmbedding(clauseId: string, content: string): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(content);
      
      const client = await db.getClient();
      try {
        await client.query(
          'UPDATE contract_clauses SET clause_vector = $1 WHERE id = $2',
          [JSON.stringify(embedding), clauseId]
        );
      } finally {
        client.release();
      }
      
    } catch (error) {
      console.error(`Failed to update embedding for clause ${clauseId}:`, error);
      throw error;
    }
  }

  clearEmbeddingCache(): void {
    this.embeddingCache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.embeddingCache.size,
      keys: Array.from(this.embeddingCache.keys()).slice(0, 10) // First 10 keys
    };
  }
}

// Supporting interfaces
export interface ContractCluster {
  id: string;
  contracts: Contract[];
  centroid_characteristics: Record<string, any>;
  common_patterns: string[];
  risk_profile: {
    avg_risk: number;
    risk_distribution: Record<string, number>;
    high_risk_count: number;
  };
}

// Export factory function
export function createVectorSearchEngine(config: VectorSearchConfig): VectorSearchEngine {
  return new VectorSearchEngine(config);
}

// Default configuration for Railway deployment
export const getDefaultVectorSearchConfig = (): VectorSearchConfig => ({
  googleApiKey: process.env.GOOGLE_AI_API_KEY || '',
  embeddingModel: 'text-embedding-004',
  similarityThreshold: 0.7, // Cosine distance threshold
  maxResults: 20,
});