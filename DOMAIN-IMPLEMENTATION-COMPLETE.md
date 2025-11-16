# ✅ Custom Domain Implementation Complete

**Domain:** contract-iq.org  
**Status:** ✅ Code Updated | 🔄 Awaiting DNS Configuration  
**Date:** November 16, 2025

---

## 📦 What Was Done

### 1. Application Code Updates ✅

- **Updated `apps/web/app/layout.tsx`:**
  - OpenGraph URL: `https://contract-iq.org`
  - OG Image: `https://contract-iq.org/og-image.png` (absolute path)
  - All social media meta tags reference new domain

- **Updated `apps/web/lib/email-service.ts`:**
  - Email from address: `Contract IQ <notifications@contract-iq.org>`
  - All email templates use new domain

- **Created production config template:**
  - `.env.production.example` with all environment variables
  - Includes `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` for new domain

### 2. Documentation Created ✅

- **`DOMAIN-SETUP.md`** (14 KB, comprehensive guide)
  - Complete Vercel setup instructions
  - Exact Namecheap DNS configuration
  - DNS propagation testing
  - SSL certificate setup
  - Social media preview testing
  - Full troubleshooting section

- **`QUICK-DOMAIN-SETUP.md`** (Quick reference)
  - 5-minute setup guide
  - 3-step process
  - Quick tests and checklist

### 3. Commits Made ✅

```
✅ 7c8dbc1 - Implement custom domain: contract-iq.org
✅ a47b7bc - Add quick domain setup reference guide
```

---

## 🚀 Next Steps (Your Action Required)

### Step 1: Add Domain to Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Select your **Contract IQ** project
3. Go to: **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `contract-iq.org` → Click **Add**
6. Click **Add Domain** again
7. Enter: `www.contract-iq.org` → Click **Add**

Vercel will show you the DNS records to configure.

### Step 2: Configure Namecheap DNS (3 minutes)

1. **Login to Namecheap:**
   - https://ap.www.namecheap.com/
   - Click **Domain List**
   - Click **Manage** next to contract-iq.org

2. **Go to Advanced DNS:**
   - Click **Advanced DNS** tab

3. **Delete Current Records:**
   - Remove: `www` CNAME to `parkingpage.namecheap.com`
   - Remove: `@` URL Redirect to `http://www.contract-iq.org`

4. **Add These 2 Records:**

   **Record 1: Root Domain (A Record)**
   ```
   Type:   A Record
   Host:   @
   Value:  76.76.21.21
   TTL:    Automatic
   ```

   **Record 2: WWW Subdomain (CNAME Record)**
   ```
   Type:   CNAME Record
   Host:   www
   Value:  cname.vercel-dns.com
   TTL:    Automatic
   ```

5. **Save Changes**

### Step 3: Wait for Propagation (15-30 minutes)

DNS changes take time to propagate globally. Check status:

- **DNS Checker:** https://dnschecker.org/
  - Enter: `contract-iq.org`
  - Should show: `76.76.21.21` globally

- **Vercel Dashboard:**
  - Domains page will automatically verify
  - Status changes from "Invalid" to "Valid Configuration"
  - SSL certificate auto-provisions (5-10 min)

### Step 4: Test Your Live Site

Once DNS propagates and Vercel shows green checkmarks:

1. **Visit:** https://contract-iq.org
   - Should load your app with SSL (green padlock 🔒)

2. **Test Social Previews:**
   - **Facebook:** https://developers.facebook.com/tools/debug/
   - **Twitter:** https://cards-dev.twitter.com/validator
   - Enter: `https://contract-iq.org`
   - Should show your OG image

3. **Test WWW:**
   - https://www.contract-iq.org
   - Should work or redirect to root

### Step 5: Update Environment Variables (Optional)

If you have environment variables in Vercel:

1. Go to: **Settings** → **Environment Variables**
2. Add/Update:
   ```
   NEXTAUTH_URL=https://contract-iq.org
   NEXT_PUBLIC_APP_URL=https://contract-iq.org
   ```
3. Go to: **Deployments** tab
4. Click the 3 dots on latest deployment
5. Click **Redeploy**

---

## 📊 Expected DNS Configuration

Your Namecheap DNS should look like this after Step 2:

```
┌──────────────────────────────────────────────────────┐
│ Host Records                                         │
├─────────┬──────┬────────────────────┬────────────────┤
│ Type    │ Host │ Value              │ TTL            │
├─────────┼──────┼────────────────────┼────────────────┤
│ A       │ @    │ 76.76.21.21        │ Automatic      │
│ CNAME   │ www  │ cname.vercel-dns.com│ Automatic     │
└─────────┴──────┴────────────────────┴────────────────┘
```

---

## ✅ Success Checklist

Use this to track your progress:

- [ ] **Vercel:** Domain `contract-iq.org` added
- [ ] **Vercel:** Domain `www.contract-iq.org` added
- [ ] **Namecheap:** Old parking CNAME deleted
- [ ] **Namecheap:** Old URL redirect deleted
- [ ] **Namecheap:** A record added (`@ → 76.76.21.21`)
- [ ] **Namecheap:** CNAME added (`www → cname.vercel-dns.com`)
- [ ] **DNS:** Propagated globally (check dnschecker.org)
- [ ] **Vercel:** Shows "Valid Configuration" with green checkmark
- [ ] **SSL:** Certificate issued (green padlock in browser)
- [ ] **Website:** https://contract-iq.org loads correctly
- [ ] **WWW:** https://www.contract-iq.org works
- [ ] **Social:** Facebook/Twitter previews show OG image
- [ ] **Env Vars:** Updated in Vercel (if needed)
- [ ] **Redeployed:** If env vars were changed

---

## 🎉 You're Live!

Once all checkboxes are complete, your Contract IQ app is:

✅ Live on custom domain  
✅ Protected with SSL  
✅ Optimized for social sharing  
✅ Professional branding complete  

**Your URLs:**
- **Main:** https://contract-iq.org
- **WWW:** https://www.contract-iq.org
- **API:** https://contract-iq.org/api
- **All Routes:** Work with new domain

---

## 📝 Domain Info

- **Domain:** contract-iq.org
- **Registrar:** Namecheap
- **Purchased:** Nov 16, 2025
- **Expires:** Nov 16, 2026
- **Auto-Renew:** ✅ Enabled
- **Protection:** ✅ WhoisGuard Enabled
- **DNS:** Namecheap BasicDNS
- **Hosting:** Vercel
- **SSL:** Let's Encrypt (auto-renewed)

---

## 🆘 Having Issues?

### DNS not propagating?
- Wait 30-60 minutes
- Clear your DNS cache: `ipconfig /flushdns` (Windows)
- Check: https://dnschecker.org/

### Vercel shows "Invalid Configuration"?
- Verify DNS records match exactly
- No typos in values
- Remove any trailing dots
- Wait for propagation

### SSL certificate error?
- Wait 10-15 minutes for Vercel to provision
- Refresh Domains page in Vercel
- Click "Renew Certificate" if needed

### Still seeing parking page?
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check DNS with `nslookup contract-iq.org`

**Full troubleshooting guide:** See `DOMAIN-SETUP.md`

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs/concepts/projects/domains
- **Namecheap Support:** https://support.namecheap.com/
- **DNS Checker:** https://dnschecker.org/
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html
- **OG Debugger (Facebook):** https://developers.facebook.com/tools/debug/
- **Card Validator (Twitter):** https://cards-dev.twitter.com/validator

---

🌐 **contract-iq.org** - Your professional domain is ready to go live!

**Estimated Setup Time:** 30-45 minutes (including DNS propagation)  
**Difficulty:** Easy - Just follow the steps!  
**Support:** Full documentation provided in `DOMAIN-SETUP.md`
