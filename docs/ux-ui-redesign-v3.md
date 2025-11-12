---
title: Contract IQ UX/UI Redesign v3.0
description: Production-ready chat-first UX system for SaaS & vendor contract intelligence
date: 2025-11-12
authors:
  - Claudio Aversa
  - Droid (Factory AI)
---

# Contract IQ — UX/UI Redesign v3.0

## Overview

This document captures the full v3.0 redesign specification for Contract IQ. It reflects the competitive analysis of ToltIQ and Corpus IQ, codifies the production-ready design system, and outlines a phased implementation guide for our chat-first contract intelligence experience.

## 1. Core Design Philosophy

### Conversational Primacy

- Chat is the primary interface, not an auxiliary feature.
- All insights are accessible through natural language.
- Progressive disclosure keeps the surface area simple while allowing experts to dive deeper on demand.

### Source-First Trust

- Eliminate black-box outputs by grounding every insight in source contract language.
- Citations are first-class UI elements with rich previews and fast access to contract context.

### Speed & Feedback

- Target sub-200 ms first-token response times.
- Employ streaming UI patterns everywhere.
- Prefer skeleton states to spinners for perceived responsiveness.

### Information Density with Breathing Room

- Provide dense data views for power users while keeping layouts scannable.
- Maintain generous whitespace (minimum 24 px between major sections).
- Create hierarchy via typography, weight, and color rather than heavy borders.

## 2. Enhanced Visual Design System

### Typography

- **Primary font:** Inter (Google Fonts)
  - Display: Inter Semibold 28 px / 36 px
  - H1: Inter Semibold 24 px / 32 px
  - H2: Inter Medium 20 px / 28 px
  - H3: Inter Medium 16 px / 24 px
  - Body Large: Inter Regular 15 px / 24 px (chat messages)
  - Body: Inter Regular 14 px / 22 px (general UI)
  - Body Small: Inter Regular 13 px / 20 px (metadata, timestamps)
  - Caption: Inter Regular 12 px / 18 px (labels, hints)
- **Monospace font:** JetBrains Mono (citations, code, contract references)
  - Citation: JetBrains Mono Medium 13 px / 20 px

### Expanded Color System

```css
/* Primary palette */
--primary-600: #2563eb;
--primary-500: #3b82f6;
--primary-400: #60a5fa;
--primary-50: #eff6ff;

/* Semantic colors */
--success-600: #16a34a;
--success-50: #f0fdf4;
--warning-600: #ea580c;
--warning-50: #fff7ed;
--danger-600: #dc2626;
--danger-50: #fef2f2;

/* Neutral palette */
--gray-900: #111827;
--gray-700: #374151;
--gray-500: #6b7280;
--gray-300: #d1d5db;
--gray-100: #f3f4f6;
--gray-50: #f9fafb;
--white: #ffffff;

/* Functional */
--focus-ring: rgba(37, 99, 235, 0.5);
--overlay: rgba(17, 24, 39, 0.4);
--shadow-sm: rgba(0, 0, 0, 0.05);
--shadow-md: rgba(0, 0, 0, 0.1);
--shadow-lg: rgba(0, 0, 0, 0.15);
```

### Spacing Scale

| Token | Size |
|-------|------|
| xs    | 4 px |
| sm    | 8 px |
| md    | 12 px |
| lg    | 16 px |
| xl    | 24 px |
| 2xl   | 32 px |
| 3xl   | 48 px |
| 4xl   | 64 px |

### Shadow & Elevation

```css
--elevation-1: 0 1px 3px rgba(0, 0, 0, 0.05);
--elevation-2: 0 4px 6px rgba(0, 0, 0, 0.07);
--elevation-3: 0 10px 15px rgba(0, 0, 0, 0.1);
--elevation-4: 0 20px 25px rgba(0, 0, 0, 0.15);
```

## 3. Screen-by-Screen Specifications

### Screen 1 — Empty State

- Center-aligned hero with value proposition and suggested prompts.
- Dual call-to-action buttons: **Upload Contracts** and **Watch 2-min Demo**.
- Suggested prompts are interactive chips with subtle hover states.
- Input expands on focus and supports drag-and-drop.
- Logo fade-in animation (300 ms delay) reinforces premium feel.

### Screen 2 — Active Chat Interface

- Collapsible sidebar defaults to icon-only (64 px) to maximize chat width.
- Conversation panel showcases message metadata, inline options, streaming responses, and collapsible risk sections.
- Risk cards include inline actions, colored left borders, and progressive disclosure for medium/low risk.
- Persistent input anchored to bottom with auto-expand up to four lines and 1000-character counter.
- Keyboard shortcut: `Cmd/Ctrl + B` toggles sidebar.

### Screen 3 — Citation System

- Split layout (55 % chat / 45 % citation panel) activated on citation click.
- Citations render with confidence scores, quick actions, and sibling citations list.
- Hover previews (150 ms delay) provide 200-character snippets prior to expanding.
- Accessible buttons with descriptive `aria-label` values.

### Screen 4 — Full Contract Viewer

- Split layout shifts to 40 % chat / 60 % PDF viewer.
- Employ PDF.js for client-side rendering with lazy-loaded pages.
- Highlight cited clause via thick yellow border.
- Provide navigation (zoom, download, pagination) and maintain chat context.

### Screen 5 — Document Upload Flow

- Drag-drop zone with blue dashed border accentuates active state.
- Per-file progress cards detail status, steps, and estimated time remaining.
- Critical risk alerts surface inline during processing with contextual actions.
- Error handling offers recovery choices (e.g., OCR for scanned PDFs).

### Screen 6 — Analytics Cards

- Thick-bordered cards with gradient bar charts and inline vendor links.
- Summaries include key insights, YoY growth, and renewal concentration.
- Action buttons trigger exports and drill-down explorations.

### Screen 7 — Renewal Waterfall Timeline

- Month-based sections with collapsible detail rows.
- Risk icons communicate severity at a glance.
- Inline actions (View Details, Create Task) reduce navigation friction.
- `.ics` export generates 30-day early reminders with contract metadata.

### Screen 8 — Negotiation Playbook

- Structured card with must-haves, nice-to-haves, leverage, timeline, and email templates.
- Use emoji markers and progress indicators to reinforce priorities.
- Provide ready-to-copy assets (email template, exports, share actions).

## 4. Component Library

### Buttons

```tsx
// Primary Button
<button className="btn-primary">Send Message</button>
```

```css
.btn-primary {
  background: var(--primary-600);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font: 14px/20px "Inter", sans-serif;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
}

.btn-primary:hover {
  background: var(--primary-500);
  transform: translateY(-1px);
  box-shadow: var(--elevation-2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}
```

Variants include primary, secondary, ghost, and danger treatments aligned with semantic colors.

### Inputs

```tsx
<div className="input-group">
  <label htmlFor="query">Ask a question</label>
  <input
    type="text"
    id="query"
    placeholder="What renewals are coming up?"
    className="input-text"
  />
</div>
```

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-text {
  padding: 12px 16px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font: 14px/22px "Inter", sans-serif;
  transition: border-color 150ms ease;
}

.input-text:focus {
  outline: none;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.input-text::placeholder {
  color: var(--gray-500);
}
```

### Cards

- Risk cards feature 12 px radius, elevation-1 default, left border keyed to risk level, and inline footer actions.

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--elevation-1);
  transition: box-shadow 150ms ease;
}

.card:hover {
  box-shadow: var(--elevation-2);
}

.risk-high {
  border-left: 4px solid var(--danger-600);
}
```

### Citations

```tsx
<span className="citation" data-citation="1">[1]</span>
```

```css
.citation {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  background: var(--primary-50);
  color: var(--primary-600);
  font: 12px/20px "JetBrains Mono", monospace;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 150ms ease;
}

.citation:hover {
  background: var(--primary-600);
  color: white;
  transform: scale(1.1);
}
```

### Progress Bars & Toasts

- Gradient progress fills with pulsing animation communicate active processing.
- Toasts occupy top-right with slide-in motion (300 ms) and risk-colored left borders.

## 5. Interaction Patterns & Micro-Interactions

### Streaming Responses

- Typing indicator uses three-dot bounce animation with staggered delays.
- Streaming tokens fade-in with 50 ms cadence for smooth perception.

### Citation Hover Preview

- Hover delay of 150 ms prevents accidental popovers.
- Previews use elevation-3 shadow, 8 px radius, and 16 px padding.

### File Drop Zone

- Active drag state applies scale transform and low-opacity gradient halo.
- Pulse animation emphasizes the actionable zone when files hover near viewport.

### Sidebar Animation

- Width animates with cubic-bezier(0.4, 0, 0.2, 1) easing over 250 ms.
- Content fades in after expansion (50 ms delay) to reduce visual jank.

## 6. Responsive Behavior

### Breakpoints

- **Mobile (<768 px):** Stack chat and sidebar vertically; citations render as bottom sheets.
- **Tablet (768 px – 1024 px):** Chat split stacks vertically with citation panel occupying 40 % height.
- **Desktop (>1024 px):** Grid-based split (55/45) for chat and citation panels.

### Mobile Patterns

- Citation sheets slide up with drag handles and max 70 % viewport height.
- Sidebar toggles in from off-canvas with 300 ms transition.

## 7. Accessibility Enhancements

- Keyboard shortcuts: `Cmd/Ctrl + K` for search, `Cmd/Ctrl + B` for sidebar, `Esc` to close panels.
- Form controls use explicit `aria-label` and `aria-describedby` attributes.
- Chat stream lives within `aria-live="polite"` region for assistive technology.
- Screen reader utilities (e.g., `.sr-only`, skip links) ensure navigation parity.
- Focus indicators use high-contrast 3 px outlines with 2 px offset.

## 8. Performance Considerations

- Lazy-load heavyweight modules via `React.lazy` and `Suspense`.
- Apply virtualized scrolling (React Window) for large conversation histories.
- Debounce search interactions (300 ms) to limit API churn.

## 9. Engineering Handoff Checklist

- ✅ Figma file with screens and components.
- ✅ SVG sprite for iconography.
- ✅ CSS variable token map (colors, typography, spacing, elevation).
- ✅ Component specs covering buttons, inputs, cards, modals, toasts.
- ✅ Interaction specs capturing animation timing, easing, hover/loading/error states.
- ✅ Responsive breakpoints and mobile behaviours.
- ✅ Accessibility requirements (ARIA labels, keyboard shortcuts, focus order, WCAG AA contrast).
- ✅ Technical requirements: WebSocket streaming, PDF.js integration, React Window lists, drag-drop uploads, citation tracking.

## 10. Key Improvements Summary

### v2 → v3 Upgrades

- Collapsible sidebar reclaims 260 px for conversation area.
- Enhanced risk cards with inline actions and colored accents.
- Revamped citation system with richer context and faster navigation.
- Detailed progress indicators covering per-file processing and risk alerts.
- Conversational analytics cards combining charts, insights, and actions.
- Renewal waterfall timeline with inline task creation.
- Comprehensive negotiation playbook with structured strategy assets.
- Production-ready component library with accessible defaults.
- Cohesive micro-interactions for streaming, hover, focus, and transitions.

### Why It Matters

- **Speed:** Layout efficiency and virtualization reduce cognitive and system load.
- **Trust:** Confidence scores and contextual citations bolster credibility.
- **Actionability:** Inline buttons reduce paths from insight to action.
- **Clarity:** Hierarchy via typography and spacing maintains readability.
- **Delight:** Subtle animations reinforce polish without sacrificing performance.

## 11. Phased Development Plan

### Phase 1 (Weeks 1–2): Foundation

- Establish design tokens (colors, type, spacing).
- Build core component primitives (buttons, inputs, cards, citations).
- Implement collapsible sidebar shell.
- Create chat message layout with streaming skeletons.

### Phase 2 (Weeks 3–4): Core Features

- Deliver WebSocket streaming interface for AI responses.
- Implement inline citation system with preview and panel views.
- Build drag-and-drop file upload workflow with progress UI.
- Add granular processing feedback and alerts.

### Phase 3 (Weeks 5–6): Advanced Features

- Integrate full contract viewer via PDF.js with synchronized highlights.
- Ship analytics cards (spend breakdown, renewal waterfall, insights).
- Generate negotiation playbooks with share/export utilities.
- Implement export flows (PDF, CSV, ICS).

### Phase 4 (Weeks 7–8): Polish

- Finalize responsive breakpoints and mobile experiences.
- Conduct accessibility audit and remediations.
- Optimize performance (lazy loading, virtualization, debounced interactions).
- Facilitate user testing and iterate on feedback.

---

This specification is production ready and aligns Contract IQ with best-in-class chat-first experiences observed in the competitive landscape. It balances conversational primacy, source-backed trust, and actionable insights tailored to SaaS and vendor contract workflows.