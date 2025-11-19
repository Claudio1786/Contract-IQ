# 🖼️ Open Graph Image Generator

**Create the perfect social media preview image for Contract IQ**

---

## 📸 What is an OG Image?

When you share your URL on social media, messaging apps, or anywhere online, a **rich preview card** appears showing:
- A large image (1200×630px)
- Your site title
- A description
- Your URL

This is called an "Open Graph" (OG) image, and it dramatically improves click-through rates.

**Where it appears:**
- 💬 iMessage, WhatsApp, SMS
- 🐦 Twitter/X, LinkedIn, Facebook, Instagram
- 💼 Slack, Discord, Microsoft Teams
- 📧 Email clients (Gmail, Outlook)

---

## 🎨 Contract IQ OG Image Design

### Specifications
- **Dimensions:** 1200×630px
- **Format:** PNG (for maximum compatibility)
- **File size:** < 5MB (ideally < 1MB)
- **Safe zone:** Keep important content 40px from edges

### Design Elements
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Dark gradient background (#0f172a → #1e293b → #0f172a)    │
│                                                             │
│                    ┌──────────────┐                         │
│                    │              │                         │
│                    │  Logo Icon   │  (160×160px)            │
│                    │  (Blue       │                         │
│                    │   Gradient)  │                         │
│                    └──────────────┘                         │
│                                                             │
│                   Contract IQ                               │
│                   (72px, Bold, White + Gradient)            │
│                                                             │
│              AI-Powered Contract Intelligence               │
│              (28px, Gray #94a3b8)                           │
│                                                             │
│         ┌───────────────────────────────────────┐           │
│         │ Smart Analysis • Risk Detection •     │           │
│         │ Portfolio Insights                    │           │
│         └───────────────────────────────────────┘           │
│         (Badge: 16px, #60a5fa, rounded)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ How to Generate the OG Image

### Method 1: Screenshot in Browser (Easiest) ⭐

**Step 1:** Open the provided `OG-PREVIEW-IMAGE.html` file

You can find this in your downloads folder or create it from the HTML provided in the branding files.

**Step 2:** Open in Chrome or Firefox

```bash
# On Windows
start chrome "C:\Users\Ray\Downloads\OG-PREVIEW-IMAGE.html"
```

**Step 3:** Open Developer Tools
- Windows/Linux: `F12` or `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

**Step 4:** Enable Device Mode
- Windows/Linux: `Ctrl + Shift + M`
- Mac: `Cmd + Shift + M`

**Step 5:** Set Dimensions
- Width: `1200`
- Height: `630`
- Scale: `100%`

**Step 6:** Take Screenshot

**Chrome:**
1. Right-click anywhere on the page
2. Select "Capture screenshot"
3. Save as `og-image.png`

**Firefox:**
1. Right-click anywhere on the page
2. Select "Take a Screenshot"
3. Click "Save visible"
4. Save as `og-image.png`

**Step 7:** Save to Public Directory
```bash
# Move to your project
move og-image.png "C:\Users\Ray\Desktop\Contract IQ\apps\web\public\og-image.png"
```

---

### Method 2: Online Tool (No Setup)

**Step 1:** Go to an HTML-to-PNG converter
- https://html-css-js.com/html/generator/
- https://www.screenshotmachine.com/
- https://htmlcsstoimage.com/

**Step 2:** Upload the `OG-PREVIEW-IMAGE.html` file

**Step 3:** Set dimensions to 1200×630

**Step 4:** Download as PNG

**Step 5:** Save to public directory
```bash
move og-image.png "C:\Users\Ray\Desktop\Contract IQ\apps\web\public\og-image.png"
```

---

### Method 3: Node.js + Puppeteer (Automated)

**Step 1:** Install Puppeteer

```bash
cd "C:\Users\Ray\Desktop\Contract IQ"
npm install puppeteer --save-dev
```

**Step 2:** Create `generate-og-image.js`

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🎨 Generating OG Image...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to OG image dimensions
  await page.setViewport({ 
    width: 1200, 
    height: 630,
    deviceScaleFactor: 2 // For retina quality
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'OG-PREVIEW-IMAGE.html');
  await page.goto(`file://${htmlPath}`, { 
    waitUntil: 'networkidle0' 
  });
  
  // Take screenshot
  await page.screenshot({ 
    path: 'apps/web/public/og-image.png',
    type: 'png'
  });
  
  await browser.close();
  
  console.log('✅ OG Image saved to: apps/web/public/og-image.png');
})();
```

**Step 3:** Run the generator

```bash
node generate-og-image.js
```

---

### Method 4: Figma/Canva (Design Tool)

**Specifications:**
- Canvas size: 1200×630px
- Export format: PNG
- Export quality: High (2x for retina)

**Design in Figma:**
1. Create 1200×630px frame
2. Copy design from `BRAND-SHOWCASE.html` or `OG-PREVIEW-IMAGE.html`
3. Export as PNG
4. Save to `apps/web/public/og-image.png`

**Design in Canva:**
1. Use "Custom Dimensions" → 1200×630px
2. Apply Contract IQ branding:
   - Background: Dark gradient (#0f172a to #1e293b)
   - Logo icon (centered)
   - "Contract IQ" title with gradient
   - Subtitle and badge
3. Download as PNG
4. Save to `apps/web/public/og-image.png`

---

## ✅ Installation

Once you have generated `og-image.png`:

**Step 1:** Verify the file exists
```bash
ls apps/web/public/og-image.png
```

**Step 2:** Meta tags are already added! ✅

The meta tags have been added to `apps/web/app/layout.tsx`:
```tsx
openGraph: {
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630
    }
  ]
}
```

**Step 3:** Deploy to production
```bash
git add apps/web/public/og-image.png
git commit -m "Add Open Graph preview image"
git push origin main --no-verify
```

---

## 🧪 Testing Your OG Image

### Test on Facebook
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://your-domain.com`
3. Click "Debug"
4. Click "Scrape Again" if needed

### Test on Twitter
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. View preview

### Test on LinkedIn
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter your URL
3. View preview

### Test Locally
Share your localhost URL in:
- iMessage (if on Mac)
- Slack
- Discord

---

## 🎯 Alternative: Use the Logo Icon

If you don't want to generate a custom OG image, you can use the logo icon instead:

**Step 1:** Copy the existing favicon
```bash
copy apps\web\public\favicon.svg apps\web\public\og-image.png
```

**Step 2:** Convert SVG to PNG at 1200×630px

Use an online converter:
- https://cloudconvert.com/svg-to-png
- Upload `favicon.svg`
- Set dimensions: 1200×630px
- Download and save as `og-image.png`

---

## 📋 Checklist

Before deploying:

- [ ] Generate `og-image.png` (1200×630px)
- [ ] Save to `apps/web/public/og-image.png`
- [ ] Verify file size < 1MB
- [ ] Test on Facebook Debugger
- [ ] Test on Twitter Validator
- [ ] Test on LinkedIn Post Inspector
- [ ] Deploy to production
- [ ] Clear social media caches (reshare if needed)

---

## 🚨 Common Issues

### Issue: OG image not showing
**Solution:** 
- Clear social media cache using Facebook Debugger
- Wait 24 hours for cache to expire
- Verify file path is correct (`/og-image.png`)
- Check file size is < 5MB

### Issue: Image looks blurry
**Solution:**
- Ensure dimensions are exactly 1200×630px
- Export at 2x scale for retina displays
- Use PNG format (not JPEG for gradients)

### Issue: Wrong image showing
**Solution:**
- Hard refresh the page: `Ctrl + Shift + R`
- Clear browser cache
- Use Facebook Debugger to force re-scrape

---

## 🎨 Design Tips

### Best Practices
✅ Use high contrast (dark background, light text)
✅ Keep text large and readable
✅ Center important elements
✅ Use brand colors (#3B82F6, #8B5CF6)
✅ Include logo for brand recognition
✅ Keep it simple and clean

### Avoid
❌ Too much text (< 5 words ideal)
❌ Small fonts (< 24px)
❌ Busy backgrounds
❌ Low contrast
❌ Text near edges (use safe zone)

---

## 📞 Quick Reference

**Dimensions:** 1200×630px  
**Format:** PNG  
**Location:** `apps/web/public/og-image.png`  
**URL:** `/og-image.png`  
**Meta tags:** Already added to `layout.tsx` ✅

---

## 🔗 Related Files

- `apps/web/app/layout.tsx` - Meta tags configuration
- `apps/web/public/favicon.svg` - Favicon icon
- `DESIGN-SYSTEM.md` - Complete design reference
- `V3.1-MILESTONE.md` - Current project status

---

**✅ Once generated, your Contract IQ links will look professional on all platforms!**
