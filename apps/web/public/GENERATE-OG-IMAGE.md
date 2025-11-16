# How to Generate the OG Preview Image

The OG (Open Graph) image is used when someone shares your Contract IQ URL on social media, messaging apps, or when pasting links.

## Quick Method (Recommended)

1. **Open the template in Chrome:**
   - Navigate to `apps/web/public/og-preview-template.html`
   - Open it in Chrome browser

2. **Set correct dimensions:**
   - Press `F12` to open Developer Tools
   - Press `Ctrl+Shift+M` (Windows) or `Cmd+Shift+M` (Mac) for device mode
   - Click "Dimensions" dropdown
   - Select "Responsive"
   - Set width: `1200` and height: `630`

3. **Take screenshot:**
   - Right-click on the page
   - Select "Capture screenshot"
   - Save as: `og-image.png`
   - Move the file to `apps/web/public/og-image.png`

## Alternative: Online Tool

Use https://www.screenshotmachine.com/
1. Upload `og-preview-template.html`
2. Set size to 1200×630
3. Download PNG
4. Save as `og-image.png` in the public folder

## Alternative: Node.js Script

If you have Puppeteer installed:

```bash
npm install puppeteer
```

Then create `generate-og.js`:

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    const filePath = 'file://' + path.join(__dirname, 'og-preview-template.html');
    await page.goto(filePath);
    await page.screenshot({ 
        path: 'og-image.png', 
        type: 'png' 
    });
    await browser.close();
    console.log('✅ OG image generated successfully!');
})();
```

Run: `node generate-og.js`

## Verification

After generating, you should have:
- File: `apps/web/public/og-image.png`
- Dimensions: 1200×630 pixels
- Format: PNG
- File size: ~100-200KB (optimized)

## Testing

Test your OG image on:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: Share in post composer (no validator)
- **iMessage**: Send URL to yourself

The OG meta tags are already configured in your app's layout.tsx!
