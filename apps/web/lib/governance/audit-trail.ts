// Contract IQ Audit Trail System
// Comprehensive logging and governance for enterprise compliance

import { db } from '../database/db-client';
import { createHash } from 'crypto';

// =============================================
// AUDIT EVENT TYPES AND INTERFACES
// =============================================

export type AuditEventType = 
  // User Actions
  | 'user_login' | 'user_logout' | 'user_created' | 'user_updated' | 'user_deleted'
  // Contract Operations  
  | 'contract_uploaded' | 'contract_viewed' | 'contract_updated' | 'contract_deleted' | 'contract_shared'
  // AI Processing
  | 'ai_analysis_started' | 'ai_analysis_completed' | 'ai_analysis_failed' | 'agent_processing'
  // Risk & Compliance
  | 'risk_assessment_generated' | 'risk_level_changed' | 'compliance_check'
  // Negotiation & Strategy
  | 'playbook_generated' | 'negotiation_strategy_created' | 'benchmark_analysis'
  // Data Operations
  | 'data_export' | 'bulk_import' | 'data_deletion' | 'database_backup'
  // System Events
  | 'system_config_changed' | 'integration_connected' | 'api_key_generated'
  // Security Events
  | 'unauthorized_access' | 'permission_changed' | 'security_alert';

export type AuditLevel = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEvent {
  id?: string;
  event_type: AuditEventType;
  level: AuditLevel;
  user_id?: string;
  organization_id: string;
  resource_type?: string; // 'contract', 'user', 'organization', etc.
  resource_id?: string;
  action: string; // Human-readable action description
  details: Record<string, any>; // Structured event data
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  metadata: AuditMetadata;
  created_at?: Date;
  hash?: string; // Event integrity hash
}

export interface AuditMetadata {
  source: string; // Which component/service generated the event
  version: string; // Application version
  correlation_id?: string; // For tracking related events
  parent_event_id?: string; // For event hierarchies
  tags?: string[]; // Searchable tags
  retention_period_days: number; // How long to keep this event
  compliance_flags?: string[]; // SOX, GDPR, SOC2, etc.
}

export interface AuditQuery {
  organization_id: string;
  event_types?: AuditEventType[];
  user_ids?: string[];
  resource_ids?: string[];
  level?: AuditLevel;
  date_range?: {
    start: Date;
    end: Date;
  };
  search_text?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface AuditReport {
  total_events: number;
  events_by_type: Record<AuditEventType, number>;
  events_by_user: Record<string, number>;
  events_by_level: Record<AuditLevel, number>;
  timeline: AuditTimelineEntry[];
  security_alerts: AuditEvent[];
  compliance_summary: ComplianceSummary;
}

export interface AuditTimelineEntry {
  date: string;
  event_count: number;
  critical_count: number;
  error_count: number;
}

export interface ComplianceSummary {
  sox_events: number;
  gdpr_events: number;
  soc2_events: number;
  retention_compliance: boolean;
  data_integrity_score: number;
}

// =============================================
// AUDIT TRAIL MANAGER
// =============================================

export class AuditTrailManager {
  private static instance: AuditTrailManager;
  private retentionPolicies: Map<AuditEventType, number> = new Map();

  constructor() {
    this.initializeRetentionPolicies();
  }

  static getInstance(): AuditTrailManager {
    if (!AuditTrailManager.instance) {
      AuditTrailManager.instance = new AuditTrailManager();
    }
    return AuditTrailManager.instance;
  }

  private initializeRetentionPolicies(): void {
    // SOX compliance: 7 years for financial records
    this.retentionPolicies.set('contract_uploaded', 2555); // 7 years
    this.retentionPolicies.set('contract_updated', 2555);
    this.retentionPolicies.set('contract_deleted', 2555);
    this.retentionPolicies.set('risk_assessment_generated', 2555);

    // Security events: 3 years
    this.retentionPolicies.set('user_login', 1095); // 3 years
    this.retentionPolicies.set('user_logout', 1095);
    this.retentionPolicies.set('unauthorized_access', 1095);
    this.retentionPolicies.set('security_alert', 1095);

    // Operational events: 1 year
    this.retentionPolicies.set('ai_analysis_started', 365); // 1 year
    this.retentionPolicies.set('playbook_generated', 365);
    this.retentionPolicies.set('data_export', 365);

    // System events: 90 days
    this.retentionPolicies.set('system_config_changed', 90);
  }

  // =============================================
  // EVENT LOGGING
  // =============================================

  async logEvent(event: Omit<AuditEvent, 'id' | 'created_at' | 'hash'>): Promise<string> {
    try {
      // Set defaults
      const now = new Date();
      const eventId = this.generateEventId();
      
      const completeEvent: AuditEvent = {
        ...event,
        id: eventId,
        created_at: now,
        hash: this.generateEventHash(event, eventId, now),
      };

      // Insert into database
      const client = await db.getClient();
      try {
        const result = await client.query(
          `INSERT INTO audit_events (
            id, event_type, level, user_id, organization_id, resource_type, resource_id,
            action, details, ip_address, user_agent, session_id, metadata, created_at, hash
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id`,
          [
            completeEvent.id,
            completeEvent.event_type,
            completeEvent.level,
            completeEvent.user_id,
            completeEvent.organization_id,
            completeEvent.resource_type,
            completeEvent.resource_id,
            completeEvent.action,
            JSON.stringify(completeEvent.details),
            completeEvent.ip_address,
            completeEvent.user_agent,
            completeEvent.session_id,
            JSON.stringify(completeEvent.metadata),
            completeEvent.created_at,
            completeEvent.hash
          ]
        );

        // Check if this is a critical security event
        if (completeEvent.level === 'critical' || completeEvent.event_type === 'security_alert') {
          await this.handleSecurityAlert(completeEvent);
        }

        return result.rows[0].id;
        
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Failed to log audit event:', error);
      
      // Fallback: Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('AUDIT EVENT FAILED TO LOG:', JSON.stringify(event, null, 2));
      }
      
      throw new Error(`Audit logging failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =============================================
  // SPECIALIZED LOGGING METHODS
  // =============================================

  async logUserAction(
    userId: string,
    organizationId: string,
    action: string,
    details: Record<string, any> = {},
    request?: {
      ip?: string;
      userAgent?: string;
      sessionId?: string;
    }
  ): Promise<string> {
    return this.logEvent({
      event_type: this.inferEventType(action),
      level: 'info',
      user_id: userId,
      organization_id: organizationId,
      action,
      details,
      ip_address: request?.ip,
      user_agent: request?.userAgent,
      session_id: request?.sessionId,
      metadata: {
        source: 'user_interface',
        version: process.env.APP_VERSION || '1.0.0',
        retention_period_days: this.retentionPolicies.get(this.inferEventType(action)) || 365,
      },
    });
  }

  async logContractOperation(
    userId: string,
    organizationId: string,
    contractId: string,
    operation: string,
    details: Record<string, any> = {}
  ): Promise<string> {
    return this.logEvent({
      event_type: operation.includes('upload') ? 'contract_uploaded' :
                  operation.includes('view') ? 'contract_viewed' :
                  operation.includes('update') ? 'contract_updated' :
                  operation.includes('delete') ? 'contract_deleted' : 'contract_viewed',
      level: operation.includes('delete') ? 'warning' : 'info',
      user_id: userId,
      organization_id: organizationId,
      resource_type: 'contract',
      resource_id: contractId,
      action: operation,
      details,
      metadata: {
        source: 'contract_service',
        version: process.env.APP_VERSION || '1.0.0',
        retention_period_days: 2555, // 7 years for SOX compliance
        compliance_flags: ['SOX', 'SOC2'],
      },
    });
  }

  async logAIProcessing(
    userId: string,
    organizationId: string,
    contractId: string,
    agentType: string,
    status: 'started' | 'completed' | 'failed',
    details: Record<string, any> = {}
  ): Promise<string> {
    return this.logEvent({
      event_type: status === 'started' ? 'ai_analysis_started' :
                  status === 'completed' ? 'ai_analysis_completed' :
                  'ai_analysis_failed',
      level: status === 'failed' ? 'error' : 'info',
      user_id: userId,
      organization_id: organizationId,
      resource_type: 'contract',
      resource_id: contractId,
      action: `AI ${agentType} ${status}`,
      details: {
        agent_type: agentType,
        status,
        ...details,
      },
      metadata: {
        source: 'ai_service',
        version: process.env.APP_VERSION || '1.0.0',
        retention_period_days: 365,
        tags: ['ai', 'automation', agentType],
      },
    });
  }

  async logSecurityEvent(
    organizationId: string,
    eventType: AuditEventType,
    action: string,
    details: Record<string, any> = {},
    level: AuditLevel = 'warning'
  ): Promise<string> {
    return this.logEvent({
      event_type: eventType,
      level,
      organization_id: organizationId,
      action,
      details,
      metadata: {
        source: 'security_service',
        version: process.env.APP_VERSION || '1.0.0',
        retention_period_days: 1095, // 3 years
        compliance_flags: ['SOC2', 'ISO27001'],
        tags: ['security', 'compliance'],
      },
    });
  }

  async logDataOperation(
    userId: string,
    organizationId: string,
    operation: string,
    resourceType: string,
    resourceId?: string,
    details: Record<string, any> = {}
  ): Promise<string> {
    return this.logEvent({
      event_type: operation.includes('export') ? 'data_export' :
                  operation.includes('import') ? 'bulk_import' :
                  operation.includes('delete') ? 'data_deletion' : 'data_export',
      level: operation.includes('delete') ? 'warning' : 'info',
      user_id: userId,
      organization_id: organizationId,
      resource_type: resourceType,
      resource_id: resourceId,
      action: operation,
      details,
      metadata: {
        source: 'data_service',
        version: process.env.APP_VERSION || '1.0.0',
        retention_period_days: 2555,
        compliance_flags: ['SOX', 'GDPR', 'SOC2'],
        tags: ['data', 'export', 'compliance'],
      },
    });
  }

  // =============================================
  // AUDIT QUERYING AND REPORTING
  // =============================================

  async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      let sql = `
        SELECT * FROM audit_events
        WHERE organization_id = $1
      `;
      
      const params: any[] = [query.organization_id];
      let paramCount = 1;

      // Apply filters
      if (query.event_types && query.event_types.length > 0) {
        sql += ` AND event_type = ANY($${++paramCount})`;
        params.push(query.event_types);
      }

      if (query.user_ids && query.user_ids.length > 0) {
        sql += ` AND user_id = ANY($${++paramCount})`;
        params.push(query.user_ids);
      }

      if (query.resource_ids && query.resource_ids.length > 0) {
        sql += ` AND resource_id = ANY($${++paramCount})`;
        params.push(query.resource_ids);
      }

      if (query.level) {
        sql += ` AND level = $${++paramCount}`;
        params.push(query.level);
      }

      if (query.date_range) {
        sql += ` AND created_at BETWEEN $${++paramCount} AND $${++paramCount}`;
        params.push(query.date_range.start, query.date_range.end);
      }

      if (query.search_text) {
        sql += ` AND (action ILIKE $${++paramCount} OR details::text ILIKE $${++paramCount})`;
        params.push(`%${query.search_text}%`, `%${query.search_text}%`);
      }

      if (query.tags && query.tags.length > 0) {
        sql += ` AND metadata->'tags' ?| $${++paramCount}`;
        params.push(query.tags);
      }

      // Order and pagination
      sql += ` ORDER BY created_at DESC`;
      
      if (query.limit) {
        sql += ` LIMIT $${++paramCount}`;
        params.push(query.limit);
      }

      if (query.offset) {
        sql += ` OFFSET $${++paramCount}`;
        params.push(query.offset);
      }

      const client = await db.getClient();
      try {
        const result = await client.query(sql, params);
        return result.rows.map(row => ({
          ...row,
          details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
          metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
        }));
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Audit query failed:', error);
      throw new Error(`Audit query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateAuditReport(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AuditReport> {
    try {
      const events = await this.queryEvents({
        organization_id: organizationId,
        date_range: { start: startDate, end: endDate },
        limit: 10000, // Get all events in range
      });

      const report: AuditReport = {
        total_events: events.length,
        events_by_type: this.groupEventsByType(events),
        events_by_user: this.groupEventsByUser(events),
        events_by_level: this.groupEventsByLevel(events),
        timeline: this.createTimeline(events, startDate, endDate),
        security_alerts: events.filter(e => e.level === 'critical' || e.event_type === 'security_alert'),
        compliance_summary: await this.generateComplianceSummary(organizationId, startDate, endDate),
      };

      // Log the report generation
      await this.logEvent({
        event_type: 'data_export',
        level: 'info',
        organization_id: organizationId,
        action: 'Audit report generated',
        details: {
          report_period: { start: startDate, end: endDate },
          total_events: report.total_events,
          security_alerts: report.security_alerts.length,
        },
        metadata: {
          source: 'audit_service',
          version: process.env.APP_VERSION || '1.0.0',
          retention_period_days: 2555,
          compliance_flags: ['SOX', 'SOC2'],
        },
      });

      return report;
      
    } catch (error) {
      console.error('Audit report generation failed:', error);
      throw error;
    }
  }

  // =============================================
  // COMPLIANCE AND GOVERNANCE
  // =============================================

  async verifyEventIntegrity(eventId: string): Promise<boolean> {
    try {
      const client = await db.getClient();
      let event;
      
      try {
        const result = await client.query(
          'SELECT * FROM audit_events WHERE id = $1',
          [eventId]
        );
        event = result.rows[0];
      } finally {
        client.release();
      }

      if (!event) return false;

      // Recalculate hash and compare
      const calculatedHash = this.generateEventHash(
        {
          event_type: event.event_type,
          level: event.level,
          user_id: event.user_id,
          organization_id: event.organization_id,
          resource_type: event.resource_type,
          resource_id: event.resource_id,
          action: event.action,
          details: typeof event.details === 'string' ? JSON.parse(event.details) : event.details,
          ip_address: event.ip_address,
          user_agent: event.user_agent,
          session_id: event.session_id,
          metadata: typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata,
        },
        event.id,
        event.created_at
      );

      return calculatedHash === event.hash;
      
    } catch (error) {
      console.error('Event integrity verification failed:', error);
      return false;
    }
  }

  async runRetentionCleanup(organizationId: string): Promise<{
    deleted_events: number;
    errors: string[];
  }> {
    try {
      const results = { deleted_events: 0, errors: [] };
      
      for (const [eventType, retentionDays] of this.retentionPolicies.entries()) {
        try {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

          const client = await db.getClient();
          let deleteResult;
          
          try {
            deleteResult = await client.query(
              `DELETE FROM audit_events 
               WHERE organization_id = $1 
               AND event_type = $2 
               AND created_at < $3`,
              [organizationId, eventType, cutoffDate]
            );
          } finally {
            client.release();
          }

          results.deleted_events += deleteResult.rowCount || 0;
          
        } catch (error) {
          results.errors.push(`Failed to clean ${eventType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Log the cleanup operation
      await this.logEvent({
        event_type: 'data_deletion',
        level: 'info',
        organization_id: organizationId,
        action: 'Audit retention cleanup completed',
        details: {
          deleted_events: results.deleted_events,
          errors: results.errors,
        },
        metadata: {
          source: 'audit_service',
          version: process.env.APP_VERSION || '1.0.0',
          retention_period_days: 2555,
          compliance_flags: ['SOX', 'GDPR'],
        },
      });

      return results;
      
    } catch (error) {
      console.error('Retention cleanup failed:', error);
      throw error;
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventHash(
    event: Omit<AuditEvent, 'id' | 'created_at' | 'hash'>,
    eventId: string,
    createdAt: Date
  ): string {
    const hashInput = JSON.stringify({
      ...event,
      id: eventId,
      created_at: createdAt.toISOString(),
      salt: process.env.AUDIT_HASH_SALT || 'default_salt',
    });
    return createHash('sha256').update(hashInput).digest('hex');
  }

  private inferEventType(action: string): AuditEventType {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login')) return 'user_login';
    if (actionLower.includes('logout')) return 'user_logout';
    if (actionLower.includes('upload')) return 'contract_uploaded';
    if (actionLower.includes('view')) return 'contract_viewed';
    if (actionLower.includes('update')) return 'contract_updated';
    if (actionLower.includes('delete')) return 'contract_deleted';
    if (actionLower.includes('export')) return 'data_export';
    if (actionLower.includes('analysis')) return 'ai_analysis_started';
    
    return 'system_config_changed'; // Default fallback
  }

  private async handleSecurityAlert(event: AuditEvent): Promise<void> {
    // In production, this would send alerts to security team
    console.error('SECURITY ALERT:', JSON.stringify(event, null, 2));
    
    // Could integrate with:
    // - PagerDuty for incident response
    // - Slack for team notifications
    // - Email alerts for critical events
    // - SIEM systems for correlation
  }

  private groupEventsByType(events: AuditEvent[]): Record<AuditEventType, number> {
    return events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<AuditEventType, number>);
  }

  private groupEventsByUser(events: AuditEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      if (event.user_id) {
        acc[event.user_id] = (acc[event.user_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }

  private groupEventsByLevel(events: AuditEvent[]): Record<AuditLevel, number> {
    return events.reduce((acc, event) => {
      acc[event.level] = (acc[event.level] || 0) + 1;
      return acc;
    }, {} as Record<AuditLevel, number>);
  }

  private createTimeline(events: AuditEvent[], startDate: Date, endDate: Date): AuditTimelineEntry[] {
    const timeline: Map<string, AuditTimelineEntry> = new Map();
    
    events.forEach(event => {
      const date = event.created_at?.toISOString().split('T')[0] || '';
      const existing = timeline.get(date) || {
        date,
        event_count: 0,
        critical_count: 0,
        error_count: 0,
      };
      
      existing.event_count++;
      if (event.level === 'critical') existing.critical_count++;
      if (event.level === 'error') existing.error_count++;
      
      timeline.set(date, existing);
    });
    
    return Array.from(timeline.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  private async generateComplianceSummary(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceSummary> {
    const events = await this.queryEvents({
      organization_id: organizationId,
      date_range: { start: startDate, end: endDate },
    });

    const soxEvents = events.filter(e => e.metadata.compliance_flags?.includes('SOX')).length;
    const gdprEvents = events.filter(e => e.metadata.compliance_flags?.includes('GDPR')).length;
    const soc2Events = events.filter(e => e.metadata.compliance_flags?.includes('SOC2')).length;

    // Check data integrity (simplified)
    const totalEvents = events.length;
    const validHashes = await Promise.all(events.map(e => this.verifyEventIntegrity(e.id!)));
    const integrityScore = validHashes.filter(Boolean).length / totalEvents;

    return {
      sox_events: soxEvents,
      gdpr_events: gdprEvents,
      soc2_events: soc2Events,
      retention_compliance: true, // Simplified - would check actual retention
      data_integrity_score: integrityScore,
    };
  }
}

// Export singleton instance
export const auditTrail = AuditTrailManager.getInstance();

// Middleware helper for Express/Next.js
export function createAuditMiddleware() {
  return (req: any, res: any, next: any) => {
    // Attach audit logging to request
    req.auditLog = {
      logUserAction: (userId: string, organizationId: string, action: string, details?: any) =>
        auditTrail.logUserAction(userId, organizationId, action, details, {
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          sessionId: req.sessionID,
        }),
      
      logContractOperation: (userId: string, organizationId: string, contractId: string, operation: string, details?: any) =>
        auditTrail.logContractOperation(userId, organizationId, contractId, operation, details),
      
      logSecurityEvent: (organizationId: string, eventType: AuditEventType, action: string, details?: any, level?: AuditLevel) =>
        auditTrail.logSecurityEvent(organizationId, eventType, action, details, level),
    };
    
    next();
  };
}