# Contract IQ UX v3.0 Implementation Plan
*Generated: 2025-11-12*

## Executive Summary

This document breaks down the UX v3.0 redesign specification into concrete implementation phases, considering our current Next.js + TailwindCSS stack and existing components. The plan emphasizes systematic progression from design tokens to advanced features, with validation checkpoints at each phase.

## Current State Assessment

### ✅ Existing Foundation
- **Stack**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Components**: Basic Pill component, Contract Detail view (~55k lines), Contract Skeleton
- **Structure**: Monorepo with packages/ui design system
- **Styling**: Dark theme established, Inter font configured
- **Features**: Contract viewing, portfolio dashboard, routing structure

### 🔄 Gap Analysis
- **Missing**: Chat interface, streaming UI, citation system, design tokens
- **Needs Update**: Color system (using slate, need full palette), component library expansion
- **Requires Addition**: WebSocket client, PDF.js integration, drag-drop uploads

## Phase-Based Implementation Plan

### **Phase 1: Foundation & Design System (Weeks 1-2)**
*Goal: Establish robust design tokens and core component primitives*

#### Week 1: Design Token System
- **1.1 Color System Expansion**
  - Update `apps/web/tailwind.config.ts` with full v3.0 palette
  - Add CSS custom properties in `globals.css`
  - Document semantic color usage (slate/amber/emerald/rose)
  
- **1.2 Typography Scale**
  - Configure Inter font weights (Regular, Medium, Semibold)
  - Add JetBrains Mono for citations and code
  - Define typography utility classes

- **1.3 Spacing & Elevation System**
  - Implement 8-point spacing scale (4px base)
  - Add shadow/elevation custom utilities
  - Create spacing documentation

#### Week 2: Core Components
- **2.1 Button System** (`packages/ui/src/button.tsx`)
  - Primary, secondary, ghost, danger variants
  - Size variations (sm, md, lg)
  - Loading and disabled states
  - Keyboard accessibility

- **2.2 Input Components** (`packages/ui/src/input.tsx`)
  - Text input with focus states
  - Textarea with auto-expand
  - Form validation styling
  - Accessibility attributes

- **2.3 Card System** (`packages/ui/src/card.tsx`)
  - Base card with elevation
  - Risk card variants with colored borders
  - Analytics card layouts
  - Hover animations

**Phase 1 Validation Criteria:**
- [ ] All design tokens pass contrast accessibility tests
- [ ] Components render correctly in Storybook (if applicable)
- [ ] Type safety maintained across component API
- [ ] Visual regression tests pass

### **Phase 2: Chat-First Interface (Weeks 3-4)**
*Goal: Implement core chat experience with streaming*

#### Week 3: Chat Layout Shell
- **3.1 Layout Architecture**
  - Create `apps/web/app/chat/layout.tsx` 
  - Implement collapsible sidebar (64px collapsed, 320px expanded)
  - Add keyboard shortcuts (Cmd/Ctrl + B for sidebar toggle)
  - Responsive breakpoint handling

- **3.2 Chat Message System** (`components/chat/`)
  - Message container with metadata
  - User vs AI message styling
  - Timestamp and status indicators
  - Message actions (copy, export, retry)

- **3.3 Input Interface**
  - Persistent bottom input with auto-expand (4 lines max)
  - Character counter (1000 char limit)
  - Send button with loading states
  - File attachment UI hooks

#### Week 4: Streaming & WebSocket Integration
- **4.1 WebSocket Client** (`lib/websocket.ts`)
  - Connection management with retry logic
  - Message queuing and acknowledgments
  - Error handling and reconnection
  - TypeScript interfaces for message types

- **4.2 Streaming UI Patterns**
  - Typing indicator with three-dot animation
  - Token-by-token streaming display (50ms cadence)
  - Skeleton states for loading responses
  - Progressive disclosure for long responses

- **4.3 Empty State & Onboarding**
  - Hero section with value proposition
  - Interactive suggested prompts as chips
  - Upload contracts call-to-action
  - Demo video integration

**Phase 2 Validation Criteria:**
- [ ] Chat interface responsive across all breakpoints
- [ ] WebSocket connection stable with error recovery
- [ ] Streaming animation smooth (60fps target)
- [ ] Keyboard navigation fully functional

### **Phase 3: Citation & Source System (Weeks 5-6)**
*Goal: Implement rich citation system with contract viewer*

#### Week 5: Citation Components
- **5.1 Citation Badges** (`components/citations/`)
  - Inline citation markers with hover previews
  - Citation numbering and confidence scores
  - Preview popover with 150ms delay
  - Click-to-expand behavior

- **5.2 Citation Panel**
  - Split layout (55% chat / 45% citation)
  - Sibling citations navigation
  - Quick actions (highlight, export, share)
  - Accessible button labels and focus management

- **5.3 Contract Context**
  - Citation source display with metadata
  - Clause context with surrounding text
  - Risk level indicators
  - Related citations suggestions

#### Week 6: PDF Viewer Integration
- **6.1 PDF.js Setup**
  - Install and configure PDF.js for client-side rendering
  - Lazy loading for large documents
  - Zoom and navigation controls
  - Page thumbnail sidebar

- **6.2 Document Highlighting**
  - Yellow highlight overlays for cited text
  - Smooth scroll-to-citation
  - Multi-highlight support
  - Print-friendly styling

- **6.3 Layout Coordination**
  - Chat/PDF split view (40% chat / 60% PDF)
  - Synchronized scrolling between citation and document
  - Mobile-optimized bottom sheet for citations
  - Context preservation during navigation

**Phase 3 Validation Criteria:**
- [ ] Citations render correctly with confidence scores
- [ ] PDF viewer performance acceptable (<2s load time)
- [ ] Highlighting accurate to source text
- [ ] Mobile citation sheets fully functional

### **Phase 4: Document Processing & Upload (Weeks 7-8)**
*Goal: Complete upload workflow with progress tracking*

#### Week 7: Upload Interface
- **7.1 Drag-Drop Zone** (`components/upload/`)
  - Blue dashed border with active states
  - Multi-file selection support
  - File type validation (PDF, DOCX, TXT)
  - Size limit enforcement (10MB default)

- **7.2 Progress Tracking**
  - Per-file progress cards with estimated time
  - Processing stages (Upload → OCR → Analysis → Complete)
  - Error handling with recovery options
  - Batch upload queue management

- **7.3 Processing Feedback**
  - Real-time status updates via WebSocket
  - Critical risk alerts during processing
  - Processing step visualization
  - Success confirmation with actions

#### Week 8: Advanced Upload Features
- **8.1 Error Recovery**
  - OCR fallback for scanned documents
  - Retry mechanisms with exponential backoff
  - Manual intervention options
  - Support contact escalation (after 3 attempts)

- **8.2 Upload Optimization**
  - Client-side compression for large files
  - Resume interrupted uploads
  - Background processing indicators
  - Notification system for completed uploads

- **8.3 Integration Testing**
  - End-to-end upload-to-analysis workflow
  - Error scenario testing
  - Performance testing with large files
  - Accessibility testing for screen readers

**Phase 4 Validation Criteria:**
- [ ] Upload success rate >95% for supported formats
- [ ] Error messages clear and actionable
- [ ] Progress indicators accurate within 10%
- [ ] Accessibility compliance for upload flow

### **Phase 5: Analytics & Advanced Features (Weeks 9-10)**
*Goal: Implement analytics cards and specialized views*

#### Week 9: Analytics Dashboard
- **9.1 Analytics Cards** (`components/analytics/`)
  - Thick-bordered cards with gradient charts
  - Vendor spend breakdowns with inline links
  - YoY growth indicators
  - Export action buttons

- **9.2 Chart Components**
  - Gradient bar charts for spend data
  - Pie charts for renewal concentration
  - Timeline charts for contract lifecycle
  - Interactive legends and tooltips

- **9.3 Data Visualization**
  - Responsive chart sizing
  - Color coding aligned with risk levels
  - Animation on data updates
  - Drill-down capabilities

#### Week 10: Specialized Views
- **10.1 Renewal Waterfall**
  - Month-based timeline sections
  - Collapsible detail rows
  - Risk icon severity indicators
  - Inline actions (View Details, Create Task)

- **10.2 Negotiation Playbook**
  - Structured card layout
  - Must-haves vs nice-to-haves sections
  - Emoji markers for priority levels
  - Ready-to-copy email templates

- **10.3 Export Functionality**
  - .ics calendar export with 30-day reminders
  - PDF report generation
  - CSV data exports
  - Shareable links with permissions

**Phase 5 Validation Criteria:**
- [ ] Charts render correctly across all device sizes
- [ ] Export functions produce valid file formats
- [ ] Interactive elements accessible via keyboard
- [ ] Performance acceptable with large datasets

## Technical Implementation Details

### Required Dependencies
```json
{
  "dependencies": {
    "pdfjs-dist": "^4.0.379",
    "react-window": "^1.8.8",
    "framer-motion": "^10.16.5",
    "date-fns": "^2.30.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "storybook": "^7.5.3",
    "@storybook/react": "^7.5.3",
    "@testing-library/jest-dom": "^6.4.5"
  }
}
```

### File Structure Plan
```
apps/web/
├── app/
│   ├── chat/                    # Chat interface routes
│   ├── contracts/              # Contract detail views
│   ├── dashboard/              # Analytics dashboard
│   └── upload/                 # Document upload flow
├── components/
│   ├── chat/                   # Chat-specific components
│   ├── citations/              # Citation system
│   ├── upload/                 # Upload flow components
│   ├── analytics/              # Dashboard components
│   └── pdf-viewer/             # Document viewer
└── lib/
    ├── websocket.ts            # WebSocket client
    ├── pdf-utils.ts            # PDF.js utilities
    └── upload-utils.ts         # Upload helpers

packages/ui/src/
├── button.tsx                  # Button variants
├── input.tsx                   # Input components
├── card.tsx                    # Card variants
├── citation.tsx               # Citation components
└── tokens/                     # Design token exports
```

### Performance Targets
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Chat Message Render**: <100ms
- **PDF Load Time**: <2s for 10MB files
- **WebSocket Reconnection**: <5s automatic retry

### Accessibility Standards
- **WCAG 2.1 AA Compliance**: All components
- **Keyboard Navigation**: Full interface coverage
- **Screen Reader**: Proper ARIA labels and live regions
- **Focus Management**: Visible focus indicators (3px offset)
- **Color Contrast**: Minimum 4.5:1 for normal text

## Risk Mitigation

### Technical Risks
1. **PDF.js Performance**: Large documents may impact browser performance
   - *Mitigation*: Implement virtualized pages and lazy loading
   
2. **WebSocket Reliability**: Connection drops during long conversations
   - *Mitigation*: Implement robust reconnection with message queuing

3. **Mobile Performance**: Complex UI may be slow on low-end devices
   - *Mitigation*: Progressive enhancement and performance budgets

### Timeline Risks
1. **Scope Creep**: Additional features requested during implementation
   - *Mitigation*: Strict phase boundaries with stakeholder sign-off

2. **Integration Complexity**: API changes affecting frontend development
   - *Mitigation*: Mock API layer for parallel development

## Success Metrics

### Development Metrics
- **Component Test Coverage**: >85%
- **TypeScript Strict Mode**: Zero errors
- **Accessibility Audit**: Zero critical issues
- **Performance Budget**: Bundle size <500KB gzipped

### User Experience Metrics
- **Task Completion Rate**: >90% for core workflows
- **Time to First Insight**: <30s from upload to analysis
- **User Error Rate**: <5% for primary actions
- **Mobile Usability**: Feature parity with desktop

## Next Actions

1. **Stakeholder Review**: Present this plan for approval and timeline confirmation
2. **Resource Allocation**: Confirm developer assignments and availability  
3. **API Coordination**: Align with backend development for WebSocket endpoints
4. **Design Assets**: Request any missing Figma components or specifications
5. **Environment Setup**: Configure development/staging environments for testing

---

*This implementation plan aligns with Contract IQ's brand directives (slate, amber, emerald, rose) and incorporates competitor UX benchmarks while maintaining focus on chat-first contract intelligence.*