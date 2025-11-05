## Analytics Instrumentation Plan

### Acquisition
- **Events:** `marketing.cta_click`, `signup.started`, `signup.completed`
- **Metrics:** Landing → signup conversion, source attribution, CAC.
- **Tools:** GA4 or Plausible, Segment, server-side event capture.

### Activation
- **Events:** `workspace.created`, `data_source.connected`, `contract.uploaded`, `contract.processed`
- **Metrics:** Time-to-first-upload, % users processing ≥2 contracts within 7 days, extraction latency.
- **Dashboards:** Activation funnel, cohort breakdown by persona.

### Engagement
- **Events:** `contract.viewed`, `benchmark.viewed`, `risk.acknowledged`, `playbook.generated`
- **Metrics:** Weekly active usage, benchmarks per session, alert engagement, feature adoption by persona.
- **Dashboards:** Weekly usage trends, feature heatmap, seat utilization.

### Value Delivery
- **Events:** `alert.acknowledged`, `task.completed`, `report.exported`, `outcome.logged`
- **Metrics:** Time-to-first-value (<14 days), savings captured, compliance incidents prevented, NPS.
- **Dashboards:** ROI tracker, case study pipeline, compliance scoreboard.

### Retention & Expansion
- **Events:** `subscription.renewed`, `seat.added`, `plan.upgraded`
- **Metrics:** Net revenue retention, seat expansion rate, churn reasons.
- **Dashboards:** Renewal forecast, churn analysis by persona/segment.

### Data Quality & Moat
- **Events:** `benchmark.updated`, `rule.versioned`, nightly QA job outputs.
- **Metrics:** Benchmark coverage %, extraction accuracy trend, manual review backlog.
- **Dashboards:** Data quality heatmap, rule drift tracker, contribution leaderboard.

### Implementation Notes
- Standardize event schema in an `analytics` module with type-safe wrappers.
- Use feature flags to stage instrumentation before GA release.
- Automate data exports to warehouse (BigQuery/Snowflake) for cross-team reporting.