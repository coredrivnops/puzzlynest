# PuzzlyNest Deployment Configuration

## Deployment Type: Container (Standardized December 2024)

### Infrastructure
- **Platform**: Google Cloud Run
- **Region**: europe-west1
- **Service Name**: puzzlynest
- **Domains**: puzzlynest.com, puzzlynest.io, www.puzzlynest.com

### Deployment Files
- `Dockerfile` - Multi-stage build for Next.js standalone
- `cloudbuild.yaml` - Cloud Build configuration for auto-deploy
- `.dockerignore` - Excludes unnecessary files from build

### Manual Deployment
```bash
cd c:/Users/shrav/Documents/project-srao4
gcloud builds submit --config=cloudbuild.yaml
```

### Automatic Deployment (via Cloud Build Trigger)
Trigger Name: `puzzlynest-deploy`
- Triggers on push to `main` branch
- Uses `cloudbuild.yaml` configuration

### Cloud Run Configuration
- Port: 8080
- Memory: 512Mi
- CPU: 1
- Min Instances: 0
- Max Instances: 10
- Concurrency: 80

### Environment Variables
Set in Cloud Run service:
- (Add any required env vars here)

---
*Last Updated: December 30, 2024*
*Standardized to Container approach for consistency across all projects*
