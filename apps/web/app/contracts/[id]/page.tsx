'use client';

/**
 * Contract Details View
 * Epic 6: Contract Management (Task 6.1)
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './contract-detail.css';

interface Contract {
  id: string;
  title: string;
  vendor: string | null;
  value: number | null;
  startDate: string | null;
  endDate: string | null;
  fileUrl: string;
  status: string;
  extractedText: string | null;
  uploadedAt: string;
  analysis: {
    riskScore: number;
    riskLevel: string;
    keyTerms: any;
    costAnalysis: any;
    riskAssessment: any;
    complianceCheck: any;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    vendor: '',
    value: '',
    startDate: '',
    endDate: '',
  });
  const [newTagName, setNewTagName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadContract();
    }
  }, [params.id]);

  const loadContract = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contracts/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load contract');
      }

      setContract(data.data.contract);
      setEditForm({
        title: data.data.contract.title,
        vendor: data.data.contract.vendor || '',
        value: data.data.contract.value ? String(data.data.contract.value) : '',
        startDate: data.data.contract.startDate ? data.data.contract.startDate.split('T')[0] : '',
        endDate: data.data.contract.endDate ? data.data.contract.endDate.split('T')[0] : '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          vendor: editForm.vendor || null,
          value: editForm.value ? parseFloat(editForm.value) : null,
          startDate: editForm.startDate || null,
          endDate: editForm.endDate || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contract');
      }

      setContract(data.data.contract);
      setIsEditing(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete contract');
      }

      router.push('/contracts');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch(`/api/contracts/${params.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add tag');
      }

      setNewTagName('');
      await loadContract(); // Refresh
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/contracts/${params.id}/tags?tagId=${tagId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove tag');
      }

      await loadContract(); // Refresh
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container-detail">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="container-detail">
        <div className="error-state">
          <h2>Error Loading Contract</h2>
          <p>{error || 'Contract not found'}</p>
          <button onClick={() => router.push('/contracts')} className="btn-primary">
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-detail">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => router.push('/contracts')} className="btn-back">
          ← Back to Contracts
        </button>
        <div className="header-actions">
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-secondary">
                ✏️ Edit
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger">
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-grid">
        {/* Left Column - Contract Info */}
        <div className="detail-left">
          {isEditing ? (
            <div className="edit-card">
              <h2>Edit Contract</h2>
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Vendor</label>
                <input
                  type="text"
                  value={editForm.vendor}
                  onChange={(e) => setEditForm({ ...editForm, vendor: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Value ($)</label>
                <input
                  type="number"
                  value={editForm.value}
                  onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button onClick={handleEditSave} className="btn-primary">
                  💾 Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="info-card">
              <h1>{contract.title}</h1>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Vendor</span>
                  <span className="info-value">{contract.vendor || 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Value</span>
                  <span className="info-value">
                    {contract.value ? `$${contract.value.toLocaleString()}` : 'Not specified'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start Date</span>
                  <span className="info-value">
                    {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">End Date</span>
                  <span className="info-value">
                    {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`status-badge status-${contract.status.toLowerCase()}`}>
                    {contract.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Uploaded</span>
                  <span className="info-value">
                    {new Date(contract.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="tags-section">
                <h3>Tags</h3>
                <div className="tags-container">
                  {contract.tags.map((tag) => (
                    <span key={tag.id} className="tag" style={{ backgroundColor: tag.color }}>
                      {tag.name}
                      <button onClick={() => handleRemoveTag(tag.id)} className="tag-remove">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="add-tag">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tag..."
                    className="tag-input"
                  />
                  <button onClick={handleAddTag} className="btn-add-tag">
                    + Add
                  </button>
                </div>
              </div>

              {/* File Link */}
              <div className="file-section">
                <a href={contract.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-view-file">
                  📄 View Original File
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Analysis */}
        <div className="detail-right">
          {contract.analysis ? (
            <>
              {/* Risk Overview */}
              <div className="analysis-card risk-card">
                <h3>Risk Assessment</h3>
                <div className={`risk-score risk-${contract.analysis.riskLevel.toLowerCase()}`}>
                  <span className="risk-number">{contract.analysis.riskScore}</span>
                  <span className="risk-label">{contract.analysis.riskLevel}</span>
                </div>
                {contract.analysis.riskAssessment && (
                  <div className="risk-details">
                    <p>{contract.analysis.riskAssessment.summary || 'No summary available'}</p>
                  </div>
                )}
              </div>

              {/* Key Terms */}
              {contract.analysis.keyTerms && (
                <div className="analysis-card">
                  <h3>Key Terms</h3>
                  <div className="terms-grid">
                    {Object.entries(contract.analysis.keyTerms).map(([key, value]: any) => (
                      <div key={key} className="term-item">
                        <span className="term-label">{key}</span>
                        <span className="term-value">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Analysis */}
              {contract.analysis.costAnalysis && (
                <div className="analysis-card">
                  <h3>Cost Analysis</h3>
                  <div className="cost-details">
                    <pre>{JSON.stringify(contract.analysis.costAnalysis, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Compliance */}
              {contract.analysis.complianceCheck && (
                <div className="analysis-card">
                  <h3>Compliance</h3>
                  <div className="compliance-details">
                    <pre>{JSON.stringify(contract.analysis.complianceCheck, null, 2)}</pre>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="analysis-card">
              <p>No analysis available yet.</p>
              <button className="btn-primary">Run Analysis</button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Contract?</h2>
            <p>This action cannot be undone. The contract and all associated data will be permanently deleted.</p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-danger">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
