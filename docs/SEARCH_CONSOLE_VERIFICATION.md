# Google Search Console Verification - Complete Guide

## 🎯 Your Current Status

| Item | Status |
|------|--------|
| DNS A Records | ✅ Configured (pointing to 216.239.x.x) |
| DNS TXT Record | ✅ Configured (google-site-verification=0AleaJFoytwt0FGN19_Ky-1LTRnDKAxEx9VFJ6) |
| Cloud Run Service | ✅ Running at https://puzzlynest-623622256552.europe-west1.run.app |
| Domain Mapping | ⚠️ May need configuration |

---

## 🚀 SOLUTION 1: Verify Cloud Run URL First (Immediate)

This works right now while we fix the custom domain:

### Steps:

1. **Go to Google Search Console**
   - URL: https://search.google.com/search-console

2. **Add Property**
   - Click "+ Add property"
   - Choose **URL prefix** (not Domain)
   - Enter: `https://puzzlynest-623622256552.europe-west1.run.app`

3. **Choose HTML Tag Verification**
   - Copy the content value from the meta tag
   - Example: If Google shows `<meta name="google-site-verification" content="abc123xyz" />`
   - Copy only: `abc123xyz`

4. **Update Cloud Run Environment Variable**
   ```powershell
   gcloud run services update puzzlynest --region europe-west1 --update-env-vars "NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION=abc123xyz"
   ```
   (Replace `abc123xyz` with your actual verification code)

5. **Wait 2-3 minutes** for deployment

6. **Click Verify** in Google Search Console

---

## 🌐 SOLUTION 2: Custom Domain Setup Required

Your DNS is configured, but Cloud Run needs a domain mapping to accept traffic at puzzlynest.com.

### Steps:

1. **Go to Google Cloud Console**
   - URL: https://console.cloud.google.com/run

2. **Select your puzzlynest service**

3. **Click "MANAGE CUSTOM DOMAINS" tab** (or "INTEGRATIONS" → "Custom domains")

4. **Click "ADD MAPPING"**

5. **Verify domain ownership** (if prompted)
   - Your TXT record is already in place
   - Google should detect: `google-site-verification=0AleaJFoytwt0FGN19_Ky-1LTRnDKAxEx9VFJ6`

6. **Map puzzlynest.com to the service**

7. **Wait for SSL certificate** (can take up to 24 hours)

---

## 🔧 SOLUTION 3: Verify in Search Console with Existing TXT Record

Since your TXT record is already configured, you may be able to verify immediately:

1. **Go to Google Search Console**
   - URL: https://search.google.com/search-console

2. **Add Property**
   - Choose **Domain** property type
   - Enter just: `puzzlynest.com` (no https)

3. **Choose DNS verification**
   - Your TXT record `google-site-verification=0AleaJFoytwt0FGN19_Ky-1LTRnDKAxEx9VFJ6` is already set

4. **Click Verify**

### ⚠️ If DNS verification fails:
   - Double-check the full TXT record value matches exactly
   - TXT records may take 24-48 hours to fully propagate
   - Try using a different DNS checker: https://dnschecker.org/ → Enter puzzlynest.com → Select TXT

---

## 📋 Troubleshooting DNS

### Check TXT Record Propagation

Use these tools to verify your TXT record is visible globally:

1. **Google Admin Toolbox**: https://toolbox.googleapps.com/apps/dig/#TXT/puzzlynest.com
2. **DNS Checker**: https://dnschecker.org/#TXT/puzzlynest.com
3. **What's My DNS**: https://www.whatsmydns.net/#TXT/puzzlynest.com

### Current TXT Record (from nslookup):
```
puzzlynest.com  text = "google-site-verification=0AleaJFoytwt0FGN19_Ky-1LTRnDKAxEx9VFJ6"
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| TXT record not found | Wait 24-48 hours for propagation |
| Wrong format | Ensure TXT record includes full string with quotes |
| Multiple TXT records | Keep only the Google verification TXT record |
| Verification code changed | Google may have generated a new code - check Search Console |

---

## 📞 BigRock DNS Settings Checklist

Verify these records exist in your BigRock DNS panel:

| Type | Host/Name | Value |
|------|-----------|-------|
| **A** | @ | 216.239.32.21 |
| **A** | @ | 216.239.34.21 |
| **A** | @ | 216.239.36.21 |
| **A** | @ | 216.239.38.21 |
| **AAAA** | @ | 2001:4860:4802:32::15 |
| **AAAA** | @ | 2001:4860:4802:34::15 |
| **AAAA** | @ | 2001:4860:4802:36::15 |
| **AAAA** | @ | 2001:4860:4802:38::15 |
| **TXT** | @ | google-site-verification=0AleaJFoytwt0FGN19_Ky-1LTRnDKAxEx9VFJ6 |

**For www subdomain:**
| Type | Host/Name | Value |
|------|-----------|-------|
| **CNAME** | www | ghs.googlehosted.com |

---

## ✅ Recommended Action Sequence

1. **TODAY**: Verify the Cloud Run URL using Solution 1
2. **TODAY**: Complete the domain mapping in Cloud Console using Solution 2
3. **WAIT 24-48 HOURS**: For full DNS propagation
4. **VERIFY**: Custom domain in Search Console

---

*Last Updated: December 29, 2025*
