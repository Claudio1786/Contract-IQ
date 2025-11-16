# 🌐 Custom Domain Setup: contract-iq.org

**Domain:** contract-iq.org  
**Registrar:** Namecheap  
**Hosting:** Vercel  
**Status:** ✅ Domain Purchased | 🔄 DNS Configuration Required

---

## 🚀 Quick Setup Guide

Follow these steps in order to connect your custom domain to your Vercel deployment.

---

## Step 1: Configure Domain in Vercel Dashboard

### 1.1 Add Domain to Vercel Project

1. **Go to Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Select your **Contract IQ** project

2. **Open Settings:**
   - Click **Settings** tab
   - Click **Domains** in sidebar

3. **Add Your Domain:**
   - Click **Add Domain**
   - Enter: `contract-iq.org`
   - Click **Add**
   
4. **Add www Subdomain:**
   - Click **Add Domain** again
   - Enter: `www.contract-iq.org`
   - Click **Add**

5. **Vercel will show you DNS records** - Copy these for next step

---

## Step 2: Configure DNS in Namecheap

### 2.1 Clear Current DNS Records

1. **Go to Namecheap Dashboard:**
   - Login: https://ap.www.namecheap.com/
   - Click **Domain List**
   - Click **Manage** next to contract-iq.org

2. **Navigate to Advanced DNS:**
   - Click **Advanced DNS** tab

3. **Remove Existing Records:**
   - Delete the parking page CNAME record (`www → parkingpage.namecheap.com`)
   - Delete the URL redirect record (`@ → http://www.contract-iq.org`)

### 2.2 Add Vercel DNS Records

Add these records exactly as shown:

#### Record 1: Root Domain (A Record)
```
Type:   A Record
Host:   @
Value:  76.76.21.21
TTL:    Automatic (or 300)
```

#### Record 2: WWW Subdomain (CNAME Record)
```
Type:   CNAME Record
Host:   www
Value:  cname.vercel-dns.com
TTL:    Automatic (or 300)
```

**Important:** Remove the trailing dot if Namecheap adds it automatically.

### 2.3 Screenshots Reference

Your DNS settings should look like this:

```
┌──────────────────────────────────────────────────────────┐
│ Host Records                                              │
├──────────┬────────┬──────────────────────┬───────────────┤
│ Type     │ Host   │ Value                │ TTL           │
├──────────┼────────┼──────────────────────┼───────────────┤
│ A        │ @      │ 76.76.21.21          │ Automatic     │
│ CNAME    │ www    │ cname.vercel-dns.com │ Automatic     │
└──────────┴────────┴──────────────────────┴───────────────┘
```

---

## Step 3: Verify Domain in Vercel

1. **Return to Vercel Dashboard:**
   - Go back to your project → Settings → Domains

2. **Wait for DNS Propagation:**
   - Vercel will automatically verify the DNS records
   - This can take 5-60 minutes
   - Status will change from "Invalid Configuration" to "Valid Configuration"

3. **Check Domain Status:**
   - Both `contract-iq.org` and `www.contract-iq.org` should show green checkmarks
   - SSL certificate will be automatically provisioned (may take 5-10 minutes)

---

## Step 4: Configure Domain Redirect (Optional)

You can choose which domain is primary:

### Option A: Redirect www to root (Recommended)
- Primary: `https://contract-iq.org`
- Redirects: `www.contract-iq.org` → `contract-iq.org`

### Option B: Redirect root to www
- Primary: `https://www.contract-iq.org`
- Redirects: `contract-iq.org` → `www.contract-iq.org`

**To configure in Vercel:**
1. Go to Settings → Domains
2. Click the three dots next to the domain you want to redirect FROM
3. Select **Redirect to...** and choose the target domain

---

## Step 5: Update Environment Variables

If you have any environment variables that reference the domain:

1. **Go to Vercel Dashboard:**
   - Settings → Environment Variables

2. **Update these variables (if they exist):**
   ```
   NEXTAUTH_URL=https://contract-iq.org
   NEXT_PUBLIC_APP_URL=https://contract-iq.org
   ```

3. **Redeploy:**
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

---

## Step 6: Test Your Domain

### 6.1 DNS Propagation Check

Test if DNS is propagated worldwide:
- **Tool:** https://dnschecker.org/
- **Enter:** contract-iq.org
- **Check:** Should show `76.76.21.21` globally

### 6.2 Website Access

Test your live site:

1. **Root Domain:**
   - https://contract-iq.org
   - Should load your app with valid SSL

2. **WWW Subdomain:**
   - https://www.contract-iq.org
   - Should load or redirect to root

3. **SSL Certificate:**
   - Click the padlock in browser
   - Should show "Issued by: Let's Encrypt"
   - Valid for contract-iq.org and www.contract-iq.org

### 6.3 Social Media Preview

Test Open Graph meta tags:

- **Facebook:** https://developers.facebook.com/tools/debug/
  - Enter: https://contract-iq.org
  - Click "Scrape Again"
  - Should show your OG preview image

- **Twitter:** https://cards-dev.twitter.com/validator
  - Enter: https://contract-iq.org
  - Should show large image card

---

## 📋 Troubleshooting

### Issue: Domain shows "Invalid Configuration" in Vercel

**Solution:**
- Wait 30-60 minutes for DNS propagation
- Verify DNS records are exact (no typos)
- Use `nslookup contract-iq.org` to check if DNS is resolving

### Issue: SSL Certificate Error

**Solution:**
- Wait 10-15 minutes for Vercel to provision SSL
- Refresh the Domains page in Vercel dashboard
- Force SSL renewal: Settings → Domains → Click "Renew Certificate"

### Issue: www subdomain not working

**Solution:**
- Verify CNAME record: `www → cname.vercel-dns.com`
- Ensure no trailing dot in the value
- Wait for DNS propagation

### Issue: Old parking page still showing

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private browsing mode
- Check DNS propagation: https://dnschecker.org/

---

## ✅ Post-Setup Checklist

- [ ] Domain added to Vercel project
- [ ] DNS A record configured for `@` (root)
- [ ] DNS CNAME record configured for `www`
- [ ] DNS propagation complete (verified on dnschecker.org)
- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] SSL certificate issued (green padlock in browser)
- [ ] Website loads at https://contract-iq.org
- [ ] www subdomain works (or redirects)
- [ ] Environment variables updated with new domain
- [ ] Social media previews working (Facebook/Twitter debuggers)

---

## 🎉 Success!

Once all checklist items are complete, your Contract IQ app is live on your custom domain!

**Your URLs:**
- **Primary:** https://contract-iq.org
- **WWW:** https://www.contract-iq.org (redirects or works)
- **API:** https://contract-iq.org/api
- **Admin:** Your existing routes work

---

## 📊 DNS Records Summary

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| A | @ | 76.76.21.21 | Points root domain to Vercel |
| CNAME | www | cname.vercel-dns.com | Points www to Vercel |

---

## 🔐 Security Notes

1. **HTTPS Only:**
   - Vercel automatically redirects HTTP to HTTPS
   - SSL certificate auto-renews every 90 days

2. **Domain Protection:**
   - Your Namecheap domain has WhoisGuard protection (enabled)
   - Auto-renew is enabled (expires Nov 16, 2026)

3. **DNS Security:**
   - Consider upgrading to Namecheap PremiumDNS for DDoS protection
   - Current: BasicDNS (sufficient for most use cases)

---

## 📝 Notes

- **Domain Purchased:** Nov 16, 2025
- **Domain Expires:** Nov 16, 2026
- **Auto-Renew:** ✅ Enabled
- **DNS Provider:** Namecheap BasicDNS
- **Hosting:** Vercel (Free tier or Pro)

---

## 🆘 Need Help?

- **Vercel Support:** https://vercel.com/support
- **Namecheap Support:** https://support.namecheap.com/
- **DNS Checker:** https://dnschecker.org/
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

🌐 **contract-iq.org** - Your professional custom domain for Contract IQ!
