// Quick Mock API Server for Contract IQ Demo
// Run with: node mock-api.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock negotiation guidance endpoint
app.post('/ai/negotiation', (req, res) => {
  console.log('Negotiation request:', req.body);
  res.json({
    guidance_id: 'mock-guid-123',
    contract_id: req.body.context?.contract_id || 'mock-contract',
    template_id: req.body.context?.template_id || 'mock-template',
    topic: req.body.context?.topic || 'Mock Topic',
    generated_at: new Date().toISOString(),
    summary: 'This is a mock negotiation guidance response for demonstration purposes.',
    fallback_recommendation: 'Consider alternative terms if primary position fails.',
    talking_points: [
      'Highlight the mutual benefits of the proposed terms',
      'Reference industry standard practices',
      'Emphasize long-term partnership value'
    ],
    risk_callouts: [
      'Monitor compliance requirements in this jurisdiction',
      'Consider impact on renewal terms'
    ],
    confidence: 0.85,
    cached: false,
    model: 'mock-model-v1',
    latency_ms: 1500,
    documentation_url: null,
    generated_prompt: null
  });
});

// Mock negotiation history endpoint
app.get('/ai/negotiation/history', (req, res) => {
  res.json({
    items: [
      {
        guidance_id: 'hist-123',
        contract_id: 'saas-msa',
        template_id: 'enterprise-saas',
        topic: 'Liability Caps',
        generated_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        summary: 'Historical guidance on liability limitations',
        fallback_recommendation: 'Standard industry fallback terms',
        talking_points: ['Industry benchmarks', 'Risk distribution'],
        risk_callouts: ['Regulatory compliance'],
        confidence: 0.78,
        cached: true,
        model: 'gemini-1.5-flash',
        latency_ms: 850,
        documentation_url: null,
        generated_prompt: null,
        context: {
          topic: 'Liability Caps',
          contract_id: 'saas-msa',
          template_id: 'enterprise-saas',
          current_position: 'Seeking $10M liability cap',
          target_position: '$5M liability cap',
          metadata: {}
        }
      }
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Mock Contract IQ API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI endpoint ready: POST http://localhost:${PORT}/ai/negotiation`);
});