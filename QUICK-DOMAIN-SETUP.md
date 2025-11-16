# ⚡ Quick Domain Setup - contract-iq.org

**5-Minute Setup Guide** | Full details in `DOMAIN-SETUP.md`

---

## 🎯 What You Need

- ✅ Domain purchased: **contract-iq.org** (Namecheap)
- 🔄 Vercel project deployed
- ⏱️ 15-30 minutes for DNS propagation

---

## 📋 3-Step Setup

### Step 1: Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Select your **Contract IQ** project
3. **Settings** → **Domains**
4. Add both:
   - `contract-iq.org`
   - `www.contract-iq.org`

### Step 2: Namecheap DNS (3 minutes)

1. Login: https://ap.www.namecheap.com/
2. **Domain List** → **Manage** → **Advanced DNS**
3. **Delete existing records** (parking page + redirect)
4. **Add these 2 records:**

```
Record 1:
Type:   A Record
Host:   @
Value:  76.76.21.21
TTL:    Automatic

Record 2:
Type:   CNAME Record
Host:   www
Value:  cname.vercel-dns.com
TTL:    Automatic
```

### Step 3: Verify (15-30 minutes)

1. Wait for DNS propagation (check: https://dnschecker.org/)
2. Vercel will auto-verify and provision SSL
3. Test: https://contract-iq.org ✅

---

## 🔍 Quick Tests

✅ **DNS Working?**
```bash
nslookup contract-iq.org
# Should show: 76.76.21.21
```

✅ **SSL Active?**
- Visit: https://contract-iq.org
- Look for green padlock 🔒

✅ **Social Preview?**
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator

---

## ⚙️ Vercel Environment Variables (Optional)

Add these in **Settings** → **Environment Variables**:

```
NEXTAUTH_URL=https://contract-iq.org
NEXT_PUBLIC_APP_URL=https://contract-iq.org
```

Then **Redeploy** from Deployments tab.

---

## 🆘 Issues?

| Problem | Solution |
|---------|----------|
| "Invalid Configuration" | Wait 30 min, check DNS records |
| SSL error | Wait 10 min for certificate |
| Old parking page | Clear browser cache |
| www not working | Verify CNAME: `www → cname.vercel-dns.com` |

**Full troubleshooting:** See `DOMAIN-SETUP.md`

---

## ✅ Success Checklist

- [ ] Both domains added to Vercel
- [ ] DNS A record: `@ → 76.76.21.21`
- [ ] DNS CNAME: `www → cname.vercel-dns.com`
- [ ] Green checkmark in Vercel dashboard
- [ ] https://contract-iq.org loads with SSL
- [ ] Social media previews working

---

🚀 **Ready to go live in 30 minutes!**
