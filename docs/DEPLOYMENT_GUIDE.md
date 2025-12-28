# PuzzlyNest Deployment Guide

## 🚀 Deployment Overview

PuzzlyNest is deployed on **Google Cloud Run** with the following architecture:
- **Container**: Node.js 20 Alpine
- **Region**: europe-west1 (Belgium)
- **Domains**: puzzlynest.com, puzzlynest.io

---

## 📋 Pre-Deployment Checklist

### 1. Google Cloud Setup
- [ ] GCP Project created
- [ ] Billing enabled
- [ ] Cloud Run API enabled
- [ ] Container Registry API enabled

### 2. Domain DNS Configuration
After registering domains on BigRock, configure DNS:

**For puzzlynest.com:**
```
Type: A     Host: @    Points to: Cloud Run IP (after deployment)
Type: CNAME Host: www  Points to: ghs.googlehosted.com
```

**For puzzlynest.io:**
```
Type: CNAME Host: @    Points to: ghs.googlehosted.com
Type: CNAME Host: www  Points to: ghs.googlehosted.com
```

### 3. Environment Variables
Create `.env.local` from `.env.example` and fill in:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` - Google AdSense

---

## 🔧 Deployment Commands

### Manual Deployment
```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Deploy from source
gcloud run deploy puzzlynest \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080
```

### Automated Deployment (Cloud Build)
```bash
# Submit build
gcloud builds submit --config cloudbuild.yaml
```

### Connect Custom Domain
```bash
# Add domain mapping
gcloud run domain-mappings create \
  --service puzzlynest \
  --domain puzzlynest.com \
  --region europe-west1
```

---

## 🔑 Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new GA4 property for "PuzzlyNest"
3. Create Web data stream for `puzzlynest.com`
4. Copy **Measurement ID** (G-XXXXXXXXXX)
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

---

## 💰 Google AdSense Setup

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign up with puzzlynest.com
3. Add the verification code (automatic in our setup)
4. Wait for approval (1-14 days)
5. After approval:
   - Create ad units (Banner, Sidebar, In-Game)
   - Add unit IDs to `.env.local`

### COPPA Compliance (Important!)
Since we have games for kids, enable COPPA compliance:
- In AdSense > Settings > Ad serving
- Enable "Tag as child-directed"

---

## 🔍 Google Search Console Setup

1. Go to [Search Console](https://search.google.com/search-console)
2. Add property: `puzzlynest.com`
3. Verify ownership via DNS TXT record
4. Add verification code to `.env.local`:
   ```
   NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION=verification-code
   ```
5. Submit sitemap: `https://puzzlynest.com/sitemap.xml`

---

## 🌐 DNS Configuration (BigRock)

After Cloud Run deployment, get the service URL and configure DNS:

### Method 1: Domain Mapping (Recommended)
1. GCP Console > Cloud Run > puzzlynest > Manage Custom Domains
2. Add domain: puzzlynest.com
3. Add domain: puzzlynest.io
4. Copy the CNAME records
5. In BigRock DNS:
   - Type: CNAME, Host: @, Points to: ghs.googlehosted.com
   - Type: CNAME, Host: www, Points to: ghs.googlehosted.com

### Method 2: Using Cloudflare (Advanced)
1. Add puzzlynest.com to Cloudflare
2. Update BigRock nameservers to Cloudflare
3. Add CNAME record pointing to Cloud Run URL
4. Enable SSL: Full (Strict)

---

## 📊 Monitoring

### Cloud Run Metrics
- GCP Console > Cloud Run > puzzlynest > Metrics
- Monitor: Requests, Latency, Container instances

### Google Analytics
- Real-time dashboard: Users, Pages, Events
- Game-specific tracking via `trackGameEvent()`

### Error Reporting
- GCP Console > Error Reporting
- Set up alerts for critical errors

---

## 🔄 Updates & Redeployment

### Push Update
```bash
git add .
git commit -m "Update description"
git push origin main

# Redeploy
gcloud run deploy puzzlynest --source . --region europe-west1 --allow-unauthenticated
```

### Rollback
```bash
# List revisions
gcloud run revisions list --service puzzlynest --region europe-west1

# Rollback to specific revision
gcloud run services update-traffic puzzlynest \
  --to-revisions=puzzlynest-XXXXX=100 \
  --region europe-west1
```

---

## 💵 Cost Estimation

| Resource | Estimate |
|----------|----------|
| Cloud Run | $0-5/month (pay per use) |
| Container Registry | $0.03/GB storage |
| Domain (BigRock) | ₹3,500/year (~$42) |
| **Total** | ~$5-10/month |

Cloud Run free tier includes:
- 2 million requests/month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check logs
gcloud builds log --limit=100
```

### Container Crashes
```bash
# Check logs
gcloud run logs read puzzlynest --region europe-west1 --limit=50
```

### Domain Not Working
- Verify DNS propagation: `nslookup puzzlynest.com`
- Check SSL certificate status in Cloud Run console

---

## 📝 Important URLs

- **Production**: https://puzzlynest.com
- **Alternate**: https://puzzlynest.io
- **GitHub**: https://github.com/shravanrrao/puzzlynest
- **Cloud Run Console**: https://console.cloud.google.com/run
- **Analytics**: https://analytics.google.com
- **AdSense**: https://www.google.com/adsense
- **Search Console**: https://search.google.com/search-console
