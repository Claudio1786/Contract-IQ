# 🎨 Contract IQ Design System

**Complete design reference extracted from branding files**  
**Version:** 1.0  
**Last Updated:** November 17, 2024

---

## 📐 Brand Identity

### Logo Elements

#### Document Icon
- **Shape:** White paper with folded corner
- **Represents:** Contracts and legal documents
- **Style:** Clean, professional, modern
- **Corner fold:** Creates depth and dimensionality

#### Gradient Lines
- **Colors:** Blue (#3B82F6) to Purple (#8B5CF6) spectrum
- **Represents:** AI analysis and intelligence progression
- **Pattern:** 3 horizontal lines with decreasing width and opacity
- **Purpose:** Shows insight extraction from documents

#### AI Spark
- **Design:** Sparkle/star icon
- **Colors:** Purple/Blue gradient
- **Position:** Bottom center of document
- **Represents:** AI-powered enhancement and intelligence

#### Background Gradient
- **Primary:** #3B82F6 (Blue 500) to #2563EB (Blue 600)
- **Purpose:** Trust, depth, and technology
- **Style:** Rounded corners for modern feel

---

## 🎨 Color Palette

### Primary Colors

```css
/* Primary Blue Gradient */
--primary-blue-start: #3B82F6;  /* Blue 500 */
--primary-blue-end: #2563EB;    /* Blue 600 */

/* Usage: Logo background, primary buttons, key accents */
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
```

```css
/* Secondary Purple Gradient */
--secondary-purple-start: #8B5CF6;  /* Purple 500 */
--secondary-purple-end: #7C3AED;    /* Purple 600 */

/* Usage: Secondary accents, hover states, special highlights */
background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
```

```css
/* Brand Signature Gradient (Blue → Purple) */
--signature-start: #3B82F6;
--signature-end: #8B5CF6;

/* Usage: "IQ" text, premium features, special highlights */
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Dark Theme Backgrounds

```css
/* Dark Backgrounds (Primary Dark Theme) */
--bg-dark-1: #0f172a;    /* Slate 900 - Primary dark background */
--bg-dark-2: #1e293b;    /* Slate 800 - Secondary dark background */
--bg-dark-3: #334155;    /* Slate 700 - Elevated elements */

/* App Background (Darker) */
--bg-app-dark: #0A0E1A;  /* Used in current app */
```

### Light Theme Backgrounds

```css
/* Light Backgrounds */
--bg-light-1: #f8fafc;   /* Slate 50 - Primary light background */
--bg-light-2: #f1f5f9;   /* Slate 100 - Secondary light background */
--bg-light-3: #e2e8f0;   /* Slate 200 - Borders and dividers */
```

### Text Colors

```css
/* Text Colors */
--text-dark: #0f172a;    /* Primary text on light backgrounds */
--text-light: #f1f5f9;   /* Primary text on dark backgrounds */
--text-light-alt: #E8EAF0; /* Alternative light text */
--text-muted: #94a3b8;   /* Secondary text, captions */
--text-muted-alt: #9CA3B8; /* Alternative muted text */
```

### Status & Risk Colors

```css
/* Success / Low Risk */
--success: #22c55e;      /* Green 500 */
--success-bg: rgba(34, 197, 94, 0.1);
--success-border: rgba(34, 197, 94, 0.3);

/* Warning / Medium Risk */
--warning: #f59e0b;      /* Amber 500 */
--warning-bg: rgba(245, 158, 11, 0.1);
--warning-border: rgba(245, 158, 11, 0.3);

/* Error / High Risk */
--error: #ef4444;        /* Red 500 */
--error-bg: rgba(239, 68, 68, 0.1);
--error-border: rgba(239, 68, 68, 0.3);

/* Info */
--info: #3B82F6;         /* Blue 500 (same as primary) */
--info-bg: rgba(59, 130, 246, 0.1);
--info-border: rgba(59, 130, 246, 0.3);
```

### Accent Colors (from Brand Showcase)

```css
/* Additional Feature Colors */
--accent-blue: #3B82F6;     /* Primary features */
--accent-purple: #8B5CF6;   /* AI/Smart features */
--accent-green: #22c55e;    /* Success states */
--accent-orange: #f97316;   /* Warnings/alerts */
--accent-pink: #ec4899;     /* Special highlights */
--accent-cyan: #0ea5e9;     /* Info/data */
```

---

## 📝 Typography

### Font Stack

```css
/* Primary Font (UI & Body) */
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif;

/* Monospace (Code & Data) */
font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
```

### Type Scale

| Element | Size | Weight | Usage | Line Height |
|---------|------|--------|-------|-------------|
| **H1** | 56px | 700 (Bold) | Page titles, hero sections | 1.1-1.2 |
| **H2** | 40px | 700 (Bold) | Section headers | 1.2 |
| **H3** | 28px | 600 (Semibold) | Subsection headers | 1.3 |
| **H4** | 20px | 600 (Semibold) | Card titles | 1.4 |
| **Body** | 16px | 400 (Regular) | Main content, paragraphs | 1.5-1.6 |
| **Small** | 14px | 400 (Regular) | Captions, metadata | 1.5 |
| **Tiny** | 12px | 400 (Regular) | Labels, fine print | 1.4 |

### Line Heights

```css
--line-height-tight: 1.2;    /* Headlines */
--line-height-normal: 1.5;   /* Body text */
--line-height-relaxed: 1.8;  /* Long-form content */
```

### Letter Spacing

```css
--letter-spacing-tight: -0.02em;  /* Large headlines */
--letter-spacing-normal: 0;       /* Body text */
--letter-spacing-wide: 0.05em;    /* Labels, uppercase */
```

---

## 🖼️ Logo Usage

### Full Logo (logo-full.svg)

**Dimensions:** 400×80px (5:1 aspect ratio)

**Best For:**
- Website headers (desktop & mobile)
- Email signatures
- Marketing materials
- Presentations
- Partner communications

**Specifications:**
- Format: SVG (scalable)
- Minimum width: 200px (for readability)
- Clear space: Equal to icon height (80px) on all sides

**Color Variants:**
- Light background: Black "Contract" + gradient "IQ"
- Dark background: White "Contract" + gradient "IQ"

### Icon Only (logo-icon.svg)

**Dimensions:** 512×512px (1:1 aspect ratio)

**Best For:**
- App store icons (iOS, Android)
- Browser favicons (large sizes)
- Social media profile pictures
- App splash screens
- Shortcut icons

**Specifications:**
- Format: SVG or PNG
- Minimum size: 32×32px
- Rounded corners: 25% (128px at 512×512)

### Favicon (favicon.svg)

**Required Sizes (Export as PNG):**
- 16×16px - Browser tab (small)
- 32×32px - Browser tab (standard)
- 48×48px - Windows taskbar
- 180×180px - Apple Touch Icon
- 192×192px - Android Chrome
- 512×512px - PWA splash screen

---

## 🎯 Spacing System

### Base Unit
```css
--spacing-unit: 4px;
```

### Spacing Scale
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Clear Space (Logo)
Minimum clear space around logo = height of the document icon

```
┌─────────────────────────────────────┐
│                                     │
│         ← Clear Space →             │
│                                     │
│    ┌─────────────────────┐          │
│  ↑ │   CONTRACT IQ Logo  │  ↑       │
│  │ └─────────────────────┘  │       │
│  │     ← Clear Space →      │       │
│  ↓                          ↓       │
│                                     │
│         ← Clear Space →             │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎭 Shadows & Elevation

### Shadow Scale

```css
/* Level 1: Subtle elevation */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1),
             0 1px 2px rgba(0, 0, 0, 0.06);

/* Level 2: Cards */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1),
             0 2px 4px rgba(0, 0, 0, 0.06);

/* Level 3: Elevated cards */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1),
             0 4px 6px rgba(0, 0, 0, 0.05);

/* Level 4: Modals, popovers */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15),
             0 10px 10px rgba(0, 0, 0, 0.04);

/* Level 5: Maximum elevation */
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### Brand-Specific Glows

```css
/* Blue Glow (Primary) */
box-shadow: 
  0 0 30px rgba(59, 130, 246, 0.4),
  0 4px 12px rgba(0, 0, 0, 0.3);

/* Purple Glow (Secondary) */
box-shadow:
  0 0 30px rgba(139, 92, 246, 0.4),
  0 4px 12px rgba(0, 0, 0, 0.3);

/* Hover State Glow Enhancement */
box-shadow:
  0 0 40px rgba(59, 130, 246, 0.6),
  0 6px 16px rgba(0, 0, 0, 0.4);
```

---

## 🔘 Border Radius

```css
--radius-sm: 6px;    /* Small elements, badges */
--radius-md: 8px;    /* Buttons, inputs */
--radius-lg: 12px;   /* Cards, large buttons */
--radius-xl: 16px;   /* Large cards, modals */
--radius-2xl: 20px;  /* Feature cards */
--radius-full: 9999px; /* Pills, circular elements */

/* Logo Icon Radius */
--radius-logo-icon: 12px; /* 50px icon */
--radius-logo-large: 24px; /* 120px icon */
--radius-logo-app: 128px;  /* 512px app icon (25%) */
```

---

## 🎨 Gradients Library

### Background Gradients

```css
/* Primary Background Gradient */
background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

/* Hero Radial Gradient */
background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);

/* Feature Section Gradient */
background: linear-gradient(180deg, #0A0E1A 0%, #0F1420 100%);
```

### Component Gradients

```css
/* Primary Button */
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);

/* Secondary Feature */
background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);

/* Text Gradient (Brand Signature) */
background: linear-gradient(135deg, #E8EAF0 0%, #8B5CF6 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Icon Background Gradients (Feature Cards)

```css
/* Blue Feature */
background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);

/* Purple Feature */
background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);

/* Green Feature */
background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%);

/* Orange Feature */
background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%);

/* Pink Feature */
background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.1) 100%);

/* Cyan Feature */
background: linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%);
```

---

## 🎯 Icons & Emojis

### Current Emoji Usage (To Be Replaced with SVGs)

| Screen/Component | Emoji | Description | SVG Replacement Needed |
|------------------|-------|-------------|------------------------|
| **Logo** | 📄 | Document | ✅ Have SVG |
| **AI Chat** | 💬 | Chat bubble | ⚠️ Need SVG |
| **Risk Analysis** | 🎯 | Target/precision | ⚠️ Need SVG |
| **Dashboard** | 📊 | Charts/analytics | ⚠️ Need SVG |
| **Negotiation** | 🤝 | Handshake | ⚠️ Need SVG |
| **Instant Insights** | ⚡ | Lightning/speed | ⚠️ Need SVG |
| **Alerts** | 🔔 | Bell/notification | ⚠️ Need SVG |
| **Launch/CTA** | 🚀 | Rocket | ⚠️ Need SVG |
| **Hero Badge** | ✨ | Sparkle/AI | ✅ Have as part of logo |

### AI Spark Icon (Brand Element)

**Design:**
- Center circle with radial rays
- 8 directional rays
- Purple to Blue gradient

```svg
<g transform="translate(x, y)">
  <circle cx="0" cy="0" r="12" fill="url(#gradient-spark)"/>
  <path d="M0 -24L0 -16M0 16L0 24M-24 0L-16 0M24 0L16 0M-18 -18L-12 -12M18 -18L12 -12M-18 18L-12 12M18 18L12 12" 
        stroke="url(#gradient-spark)" stroke-width="4" stroke-linecap="round"/>
</g>
```

---

## 🎪 Component Patterns

### Cards

```css
.card {
  background: rgba(26, 31, 46, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 40px;
  transition: all 0.4s ease;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(99, 102, 241, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Buttons

```css
/* Primary Button */
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
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 0 50px rgba(59, 130, 246, 0.7),
    0 12px 28px rgba(0, 0, 0, 0.4);
}

/* Secondary Button */
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
}

.btn-secondary:hover {
  background: rgba(45, 51, 71, 1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

### Badges

```css
/* Badge/Pill */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50px;
  font-size: 14px;
  color: #C4B5FD;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}
```

---

## 🖼️ Open Graph / Social Media

### OG Image Specifications

**Dimensions:** 1200×630px

**Design Elements:**
- Dark gradient background (#0f172a to #1e293b to #0f172a)
- Large logo icon (160px) centered
- "Contract IQ" title with gradient "IQ"
- "AI-Powered Contract Intelligence" subtitle
- Badge: "Smart Analysis • Risk Detection • Portfolio Insights"

**Meta Tags:**

```html
<!-- Open Graph (Facebook, LinkedIn, iMessage, WhatsApp) -->
<meta property="og:title" content="Contract IQ - AI-Powered Contract Intelligence" />
<meta property="og:description" content="Smart contract analysis, risk detection, and portfolio insights powered by AI" />
<meta property="og:image" content="https://your-domain.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://your-domain.com" />
<meta property="og:type" content="website" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Contract IQ - AI-Powered Contract Intelligence" />
<meta name="twitter:description" content="Smart contract analysis, risk detection, and portfolio insights powered by AI" />
<meta name="twitter:image" content="https://your-domain.com/og-image.png" />
```

---

## ✅ Brand Guidelines Summary

### DO's ✅

- ✅ Use SVG files for web and digital applications
- ✅ Maintain clear space equal to icon height around logo
- ✅ Use official color gradients exactly as specified
- ✅ Keep aspect ratios when scaling
- ✅ Use appropriate logo variant for background color
- ✅ Export PNG at 2x resolution for retina displays
- ✅ Use monochrome version (white/black) when color isn't available

### DON'Ts ❌

- ❌ Don't stretch or distort the logo
- ❌ Don't change brand colors or create new color combinations
- ❌ Don't rotate the logo at any angle
- ❌ Don't add effects, shadows, or outlines (they're already built-in)
- ❌ Don't place on busy backgrounds that reduce legibility
- ❌ Don't separate icon from wordmark in full logo
- ❌ Don't use low-resolution bitmap formats when SVG is available

---

## 🎯 v3.5 UX Improvement Checklist

### Icons to Convert from Emoji to SVG

| Priority | Screen | Current Emoji | Replacement Needed |
|----------|--------|---------------|-------------------|
| 🔴 High | Dashboard | 📊 | Chart icon SVG |
| 🔴 High | AI Chat | 💬 | Chat bubble SVG |
| 🔴 High | Risk Analysis | 🎯 | Target/scope SVG |
| 🔴 High | Negotiation | 🤝 | Handshake SVG |
| 🟡 Medium | Alerts | 🔔 | Bell SVG |
| 🟡 Medium | Instant Insights | ⚡ | Lightning SVG |
| 🟡 Medium | Hero CTAs | 🚀 | Rocket SVG |

### Design Polish Tasks

- [ ] Replace all emoji icons with SVG equivalents
- [ ] Standardize icon sizes (24px, 32px, 48px, 64px)
- [ ] Apply consistent icon background gradients
- [ ] Enhance micro-interactions (hover states, transitions)
- [ ] Standardize card shadows and elevation
- [ ] Optimize spacing using spacing scale
- [ ] Review and polish typography hierarchy
- [ ] Test responsive breakpoints

---

## 📚 Reference Files

1. **logo-full.svg** - Full horizontal logo (400×80px)
2. **logo-icon.svg** - Square icon (512×512px)
3. **favicon.svg** - Scalable favicon
4. **OG-PREVIEW-IMAGE.html** - Social media preview template (1200×630px)
5. **BRAND-SHOWCASE.html** - Interactive brand showcase
6. **BRANDING-GUIDE.md** - Complete branding guidelines

---

## 📞 Quick Reference

### Most Common Values

```css
/* Primary Colors */
--primary-blue: #3B82F6;
--primary-purple: #8B5CF6;

/* Background */
--bg-dark: #0A0E1A;

/* Text */
--text-primary: #E8EAF0;
--text-secondary: #9CA3B8;

/* Spacing */
--space-standard: 16px;
--space-section: 48px;

/* Border Radius */
--radius-button: 12px;
--radius-card: 20px;
```

---

**✅ This design system is extracted from official Contract IQ branding files and represents the complete visual identity for the application.**
