# PuzzlyNest Enhancement & Delivery Plan

## 1. PROJECT SUMMARY

| Attribute | Details |
|-----------|---------|
| **Project** | PuzzlyNest — Free brain games platform for kids (4-12) and seniors (60+) |
| **Domain** | [puzzlynest.com](https://puzzlynest.com) (alt: puzzlynest.io) |
| **Stack** | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Google Cloud Run |
| **Game Catalog** | 100 games defined in catalog, 72 custom components, 4 generic engines |
| **Engines** | `ArcadeBaseEngine`, `PuzzleGridEngine`, `QuizEngine`, `TileMatchingEngine` |
| **Features** | Achievement system, daily challenges, sound manager, social sharing, SEO structured data, 5 SEO landing pages, 4 puzzle tools, blog |
| **Deployment** | Docker + Cloud Build → Cloud Run (`us-central1`) |
| **GCP Project** | `gen-lang-client-0667918696` |
| **GitHub Repo** | `coredrivnops/puzzlynest` (branch: `main`) |

---

## ⚠️ DEPLOYMENT NOTICE — MANUAL DEPLOY REQUIRED

**Auto-deploy is NOT configured for PuzzlyNest.**

Verified via `gcloud builds triggers list --project=gen-lang-client-0667918696`:
The GCP project has active triggers for `blobforge` and `hearthiq-app` only — **no trigger exists for `puzzlynest`**.

Until Phase 10 (CI/CD) is executed, **every phase must end with a manual deployment**:

```bash
# Quick deploy via Cloud Build (preferred — uses cloudbuild.yaml)
gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

# OR: direct deploy from source
gcloud run deploy puzzlynest \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --project gen-lang-client-0667918696
```

Each phase handoff prompt below includes this step as the final task.

---

### Health Score: **8/10** *(updated after Phase 1 & 2 completion)*

| Area | Status |
|------|--------|
| ✅ 72+ custom game implementations | DONE |
| ✅ "Coming Soon" stubs removed | DONE (Phase 1) |
| ✅ PlayZen branding fully cleaned | DONE (Phase 1) |
| ✅ RelatedGames + Breadcrumbs components | DONE (Phase 2) |
| ✅ SEO landing pages with canonicals | DONE |
| ✅ Font preconnect in layout | DONE |
| ⚠️ No security headers in next.config.ts | Phase 3 |
| ⚠️ No test coverage | Phase 9 |
| ⚠️ No PWA/offline support | Phase 6 |
| ❌ No auto-deploy Cloud Build trigger | Phase 10 |

---

## 2. ISSUE BREAKDOWN

### 🔴 Critical Bugs / Blockers

| # | Issue | File(s) | Status |
|---|-------|---------|--------|
| C1 | `CardGameStub.tsx` shows **"Coming Soon"** text | `components/games/CardGameStub.tsx` | ✅ Fixed (Phase 1) |
| C2 | `DominoesGame.tsx` contains "Coming Soon" reference | `components/games/DominoesGame.tsx` | ✅ Fixed (Phase 1) |
| C3 | `GamePlayer.tsx` has "Coming Soon" fallback path | `components/GamePlayer.tsx` | ✅ Fixed (Phase 1) |
| C4 | AdSense client ID is a TODO placeholder | `lib/analytics.ts` | ⏳ Post-approval |

### 🟡 Quick Wins

| # | Issue | File(s) | Status |
|---|-------|---------|--------|
| Q1 | Stale "PlayZen" branding in `achievements.ts` | `lib/achievements.ts` | ✅ Fixed (Phase 1) |
| Q2 | Stale "PlayZen" branding in `soundManager.ts` | `lib/soundManager.ts` | ✅ Fixed (Phase 1) |
| Q3 | Docs reference "PlayZen" | `docs/ENHANCEMENTS.md` | ✅ Fixed (Phase 1) |
| Q4 | Copyright year "2024-2025" | `README.md` | ✅ Fixed (Phase 1) |
| Q5 | README says "11 playable games" | `README.md` | ✅ Fixed (Phase 1) |

### 🔵 Technical Debt & Code Quality

| # | Issue | Scope | Status |
|---|-------|-------|--------|
| T1 | Zero test coverage | Project-wide | Phase 9 |
| T2 | `globals.css` is 1160 lines — monolithic | `app/globals.css` | Phase 7 |
| T3 | `games.ts` is 1188 lines (36KB) | `lib/games.ts` | Phase 7 |
| T4 | `seoContent.ts` is 808 lines (52KB) | `lib/seoContent.ts` | Phase 7 |
| T5 | Many game components use `any` type | `components/games/` | Phase 9 |
| T6 | No ESLint strict mode | `eslint.config.mjs` | Phase 9 |

### 🟢 Missing / Incomplete Features

| # | Feature | Status |
|---|---------|--------|
| F1 | **Related Games** component | ✅ Done (Phase 2) |
| F2 | **Open Graph images** per game | Phase 3 |
| F3 | **Blog expansion** — only 4 articles | Phase 5 |
| F4 | **PWA / Service Worker** | Phase 6 |
| F5 | **Breadcrumb navigation** | ✅ Done (Phase 2) |
| F6 | **Game completion analytics** | Phase 4 |
| F7 | **High score persistence** | Phase 4 |
| F8 | ~28 games on generic engines | Phase 8 |

### 🟠 Performance & Security

| # | Concern | Status |
|---|---------|--------|
| P1 | No Content Security Policy headers | Phase 3 |
| P2 | No `<link rel="preconnect">` for Google Fonts | ✅ Done (Phase 2) |
| P3 | 4.2MB `dictionary.txt` served uncompressed | Phase 3 |
| P4 | No loading skeletons for dynamic imports | Phase 3 |

---

## 3. PHASED EXECUTION PLAN

---

### ✅ Phase 1: Critical Fixes & Branding Cleanup — COMPLETE
- **Objective:** Eliminate AdSense blockers and fix all branding inconsistencies
- **Status:** ✅ Complete — commit `8280bc5`
- **Deliverables:** Playable CardGameStub, Dominoes comment fixed, GamePlayer fallback clean, localStorage keys migrated, README/docs updated

---

### ✅ Phase 2: SEO & Discoverability Boost — COMPLETE
- **Objective:** Add Related Games, breadcrumbs, font preconnects
- **Status:** ✅ Complete — commit `b637987`
- **Deliverables:** `Breadcrumbs.tsx`, `RelatedGames.tsx`, game page integration, `getGamesByCategory()` enhanced

---

### Phase 3: Performance & Security Hardening
- **Objective:** Optimize load times, add security headers, handle large assets
- **Scope:** `next.config.ts`, `public/dictionary.txt`, `components/GamePlayer.tsx`, `app/layout.tsx`
- **Type:** Enhancement
- **Tasks:**
  1. Add security headers in `next.config.ts` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`)
  2. Ensure `dictionary.txt` (4.2MB) loads lazily — only fetched on mount in word game components, not at module import time
  3. Add Skeleton loading states in `GamePlayer.tsx` for dynamic imports — use existing `Skeleton.tsx` with `<Suspense>`
  4. Add `<meta name="apple-mobile-web-app-capable">` and `<meta name="apple-mobile-web-app-status-bar-style">` to `layout.tsx`
  5. **Deploy:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** Low
- **Dependencies:** None
- **Acceptance Criteria:**
  - `curl -I https://puzzlynest.com` shows security headers after deploy
  - `dictionary.txt` not loaded on `/play/sudoku-classic` (Network tab)
  - Game loading shows Skeleton animation instead of blank space
- **Stakeholder Impact:** Better Core Web Vitals, security posture, mobile experience

---

### Phase 4: Achievement System & Analytics Integration
- **Objective:** Wire achievement system to Google Analytics events and improve UX
- **Scope:** `lib/achievements.ts`, `lib/analytics.ts`, `components/AchievementPopup.tsx`, `components/GamePlayer.tsx`, `app/page.tsx`
- **Type:** Enhancement
- **Tasks:**
  1. Create/verify GA4 tracking functions in `lib/analytics.ts`: `trackGameStart()`, `trackGameComplete()`, `trackAchievementUnlock()`
  2. Call `trackAchievementUnlock()` when achievement unlocks in `achievements.ts`
  3. Wrap game component render in a client-side tracker that calls `trackGameStart()` on mount
  4. Review `AchievementPopup.tsx` — add `aria-live`, close button, ensure smooth animations
  5. Add prominent "Daily Challenge" CTA card to homepage hero
  6. Add "Achievements" link to navigation or footer
  7. **Deploy:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** Medium
- **Dependencies:** None
- **Acceptance Criteria:**
  - GA4 real-time dashboard shows game events when testing
  - Achievement popup fires correctly with sound on unlock
  - Daily challenge CTA visible on homepage
- **Stakeholder Impact:** Data-driven insights; gamification improves retention

---

### Phase 5: Blog Expansion & Content Marketing
- **Objective:** Add 4 new blog articles targeting high-volume keywords (reach 8+ total)
- **Scope:** `app/blog/`, new article pages, `lib/structuredData.ts`, `app/sitemap.ts`
- **Type:** New Feature / Content
- **Tasks:**
  1. Study existing blog article structure before writing new ones
  2. Create `getArticleSchema()` in `lib/structuredData.ts` if it doesn't exist
  3. Write article: **"10 Best Free Brain Training Games to Play Online in 2026"** (~1200 words)
  4. Write article: **"How Daily Puzzles Improve Memory: The Science Behind Brain Games"** (~1200 words)
  5. Write article: **"Free Educational Games for Kids: A Parent's Complete Guide 2026"** (~1200 words)
  6. Write article: **"Solitaire Strategy: Expert Tips to Win More Games"** (~1000 words)
  7. Update `app/blog/page.tsx` index to list all 8+ articles
  8. Update `app/sitemap.ts` to include all 4 new article URLs
  9. **Deploy:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** High (split into 5a: articles 1-2 + schema, 5b: articles 3-4 + blog index + sitemap)
- **Dependencies:** None
- **Acceptance Criteria:**
  - `/blog` shows 8+ articles
  - Each article has valid `Article` JSON-LD (test at validator.schema.org)
  - Each article links to ≥3 game pages
  - New URLs appear in `/sitemap.xml`
- **Stakeholder Impact:** SEO content depth; authority in brain games niche

---

### Phase 6: PWA & Offline Support
- **Objective:** Make PuzzlyNest installable as a PWA with basic offline caching
- **Scope:** `public/manifest.json`, `public/sw.js` [NEW], `public/icons/`, `app/layout.tsx`, `components/ServiceWorker.tsx` [NEW]
- **Type:** New Feature
- **Tasks:**
  1. Create/update `public/manifest.json` (name, short_name, icons, theme_color, display: standalone)
  2. Generate PWA icons at 192×192 and 512×512 into `public/icons/`
  3. Create `public/sw.js` — cache-first for `/_next/static/`, network-first for pages
  4. Create `components/ServiceWorker.tsx` (client component) to register sw.js via `useEffect`
  5. Add `<ServiceWorker />` to `app/layout.tsx` and add manifest link + iOS meta tags
  6. **Deploy:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** Medium
- **Dependencies:** Phase 3 (security headers required for service worker registration)
- **Acceptance Criteria:**
  - Chrome DevTools → Application → Manifest shows PuzzlyNest loaded
  - Chrome DevTools → Application → Service Workers shows sw.js active
  - "Add to Home Screen" prompt appears on Android Chrome
  - Lighthouse PWA score ≥ 85
- **Stakeholder Impact:** Mobile home screen installation; higher return visit rate

---

### Phase 7: CSS Architecture Refactor
- **Objective:** Break up monolithic `globals.css` (1160 lines) into modular CSS files
- **Scope:** `app/globals.css`, `app/animations.css` [NEW], `components/Navigation.module.css` [NEW], `components/game-player.css` [NEW]
- **Type:** Refactor
- **Tasks:**
  1. Audit all rules in `globals.css` — categorise into: tokens, resets, navigation, game-player, utilities, animations, bg-orbs
  2. Extract `@keyframes` → `app/animations.css`, import via `@import './animations.css'`
  3. Extract navigation styles → `components/Navigation.module.css`, update `Navigation.tsx` class refs
  4. Extract game-player styles → CSS Modules for `GamePlayer`, update className refs
  5. Extract bg-orb animations → `app/bg-orbs.css`, import in `globals.css`
  6. Keep: design tokens, resets, `.card`, `.btn`, `.container`, `.game-grid` in `globals.css` (target: <300 lines)
  7. Run `npm run build`, do full visual check of all pages
  8. **Deploy:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** High (split into 7a: navigation + token extraction, 7b: game + animations if needed)
- **Dependencies:** None
- **Acceptance Criteria:**
  - `globals.css` < 300 lines
  - `npm run build` passes clean
  - Homepage, games page, game page, blog are visually identical to before
- **Stakeholder Impact:** Developer velocity; no user-facing change

---

### Phase 8: Game Quality Pass — Replace Generic Engine Fallbacks
- **Objective:** Replace ~28 games using generic engines with custom implementations
- **Scope:** `components/games/` [NEW files], `components/GamePlayer.tsx`
- **Type:** New Feature
- **Sub-phases (one session each):**
  - **8a — Kids Learning (7 games):** `money-counting`, `rhyming-words`, `sight-words`, `phonics-sounds`, `animal-sounds`, `seasons-weather`, `body-parts`
  - **8b — Creative Play (6 games):** `pixel-art`, `room-decorator`, `cake-decorator`, `pet-salon`, `stamp-art`, `pattern-designer`
  - **8c — Arcade/Action (5 games):** `candy-collect`, `jump-adventure`, `break-the-bricks` (improved), `racing-simple` (improved), `dodge-obstacles` (improved)
  - **8d — Relaxation/Visual (6 games):** `vocabulary-builder`, `dot-connect`, `tile-matching` (enhanced), `mosaic-puzzles`, `jigsaw-medium`, `jigsaw-hard`
- **Each sub-phase ends with:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** Very High (4 sessions)
- **Dependencies:** Phase 1 (stubs removed)
- **Acceptance Criteria:**
  - All 100 game IDs map to a unique custom component (no generic fallback UI)
  - Each game has distinct start → play → win/lose → restart mechanics
- **Stakeholder Impact:** Game quality → engagement → more ad impressions per session

---

### Phase 9: Testing Infrastructure
- **Objective:** Add Jest + React Testing Library with baseline tests for critical paths
- **Scope:** `package.json`, `jest.config.ts` [NEW], `lib/__tests__/`, `components/__tests__/`
- **Type:** Enhancement
- **Tasks:**
  1. Install: `jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom ts-jest`
  2. Create `jest.config.ts` with jsdom environment, ts-jest transform, `@/` path alias
  3. Write `lib/__tests__/games.test.ts` — verify catalog integrity: 100 games, unique IDs, required fields
  4. Write `lib/__tests__/achievements.test.ts` — test save/load, localStorage migration, achievement unlock
  5. Write `components/__tests__/GamePlayer.test.tsx` — verify 10+ game IDs render components, no "Coming Soon"
  6. Add `"test"` and `"test:coverage"` scripts to `package.json`
  7. Add "## Testing" section to `README.md`
  8. **Deploy:** `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
- **Estimated Token Load:** Medium
- **Dependencies:** Phase 1 (stubs removed — tests would fail on "Coming Soon" text)
- **Acceptance Criteria:**
  - `npm test` passes with 0 failures
  - All 3 test files execute
  - `README.md` has Testing section
- **Stakeholder Impact:** CI safety net; prevents regressions in future phases

---

### Phase 10: CI/CD Auto-Deploy Pipeline
- **Objective:** Create Cloud Build trigger so every push to `main` auto-deploys PuzzlyNest — **eliminating the manual deploy step permanently**
- **Scope:** GCP Cloud Build trigger, `cloudbuild.yaml` (add pre-deploy test steps), `README.md`, optional `.github/workflows/`
- **Type:** Enhancement
- **Tasks:**
  1. Update `cloudbuild.yaml` — prepend steps before docker build: `npm ci`, `npm run lint`, `npm test`
  2. Create Cloud Build trigger:
     ```bash
     gcloud builds triggers create github \
       --repo-name=puzzlynest \
       --repo-owner=coredrivnops \
       --branch-pattern="^main$" \
       --build-config=cloudbuild.yaml \
       --project=gen-lang-client-0667918696 \
       --name="puzzlynest-main-deploy"
     ```
  3. Optionally create `.github/workflows/pr-checks.yml` for PR-level lint + test (no deploy)
  4. Add Cloud Build status badge to `README.md`
  5. Test by pushing a commit — verify auto-trigger fires in Cloud Build console
  6. Update `docs/DEPLOYMENT_GUIDE.md` — mark automated deployment as active, remove manual-only notes
- **Estimated Token Load:** Low
- **Dependencies:** Phase 9 (tests must exist to run in pipeline)
- **Acceptance Criteria:**
  - `gcloud builds triggers list --project=gen-lang-client-0667918696` shows `puzzlynest-main-deploy`
  - Push to `main` auto-triggers Cloud Build → Cloud Run deploy
  - Failed `npm test` blocks docker build step
  - Build completes < 5 minutes from push
- **Stakeholder Impact:** Zero-touch deployments; faster iteration cycle; no more manual deploys

---

## 4. PHASING PRINCIPLES APPLIED

| Principle | How Applied |
|-----------|-------------|
| Each phase is single-session executable | All phases estimated Low-High token load; Phase 5 and 8 have explicit split guidance |
| High token tasks split | Phase 5 (blog), Phase 7 (CSS), Phase 8 (games) all have sub-phase guidance |
| Priority ordering | Critical fixes → Quick wins → Enhancements → New features |
| Tangible deliverable per phase | Each phase has clear acceptance criteria and visible output |
| No broken state | Each phase leaves the project deployable and functional |
| Manual deploy bridging | Until Phase 10, every phase ends with the `gcloud builds submit` command |

---

## 5. EXECUTION HANDOFF PROMPTS

---

### ✅ Phase 1 Handoff Prompt — EXECUTED (commit 8280bc5)
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).

OBJECTIVE: Eliminate all "Coming Soon" text and fix stale "PlayZen" branding.

TASKS (in order):
1. Replace components/games/CardGameStub.tsx — convert it into a minimal playable
   card matching game using emoji pairs. Remove ALL "Coming Soon" text.
2. Check components/games/DominoesGame.tsx for "Coming Soon" references and remove them.
3. Update components/GamePlayer.tsx — ensure the fallback for unmapped game IDs
   renders a description + browse CTA, NEVER "Coming Soon" text.
4. In lib/achievements.ts, rename localStorage key from 'playzen_progress' to
   'puzzlynest_progress'. Add migration logic: if old key exists, copy data to new
   key and delete old key.
5. In lib/soundManager.ts, rename any 'playzen' references to 'puzzlynest'.
6. Update README.md: copyright year → "2024-2026", "11 playable" → "72+ unique games",
   fix deployment region from 'europe-west1' to 'us-central1'.
7. Update docs/ENHANCEMENTS.md: replace all "PlayZen" with "PuzzlyNest".
8. Run: npx tsc --noEmit — must pass with 0 errors.
9. git add . && git commit -m "fix: Phase 1 - remove stubs, fix branding" && git push origin main
10. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- grep "coming soon" components/ returns 0 results
- grep "playzen" lib/ components/ returns 0 results (except legacyKey migration var)
- TypeScript compiles clean

STATUS: ✅ COMPLETE
```

---

### ✅ Phase 2 Handoff Prompt — EXECUTED (commit b637987)
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).

OBJECTIVE: Add Related Games component, breadcrumbs, and verify SEO foundations.

TASKS (in order):
1. Create components/RelatedGames.tsx — shows up to 6 games from same category.
   Use getGamesByCategory() from lib/games.ts (update to support excludeId + limit).
   Style with glassmorphism cards: category badge, difficulty stars, play time, hover lift.
2. Create components/Breadcrumbs.tsx — semantic <nav><ol><li> with schema.org
   BreadcrumbList microdata, aria-label, aria-current="page" on current item.
3. Update app/play/[gameId]/page.tsx — render Breadcrumbs above game player,
   RelatedGames below SEO content. Use absolute URLs in JSON-LD schemas.
4. Verify app/layout.tsx has <link rel="preconnect"> for fonts.googleapis.com
   and fonts.gstatic.com — add if missing.
5. Verify all 5 SEO landing pages have canonical URLs in metadata.alternates.
6. Run: npx tsc --noEmit — must pass with 0 errors.
7. git add . && git commit -m "feat: Phase 2 - RelatedGames, Breadcrumbs, SEO" && git push origin main
8. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- Every /play/[id] page shows up to 6 related game cards
- Breadcrumb nav visible above game player
- TypeScript compiles clean

STATUS: ✅ COMPLETE
```

---

### Phase 3 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1 and 2 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Add security headers, lazy-load dictionary, add loading skeletons.

CONTEXT:
- next.config.ts currently has NO security headers
- public/dictionary.txt is 4.2MB — loaded by word game components
- components/Skeleton.tsx exists and can be used as a Suspense fallback
- app/layout.tsx already has basic theme-color (check and add iOS PWA meta if missing)

TASKS (in order):
1. Open next.config.ts. Add an async headers() function returning these headers for
   all routes (path: '/**'):
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: camera=(), microphone=(), geolocation=()
   - X-XSS-Protection: 1; mode=block

2. Search for all word game components that load dictionary.txt (search for fetch('/dictionary')
   or 'dictionary.txt' across components/games/). Ensure word list loading happens inside
   a useEffect on component mount ONLY — not at module import time. Show a spinner while loading.

3. In components/GamePlayer.tsx, wrap the dynamic <GameComponent> render in a
   React Suspense boundary: <Suspense fallback={<Skeleton />}>.
   Import React.Suspense and the Skeleton component.

4. In app/layout.tsx, add if missing:
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

5. Run: npx tsc --noEmit — 0 errors required.
6. Run: npm run build — must complete successfully.
7. git add . && git commit -m "feat: Phase 3 - security headers, lazy dict, loading skeletons"
8. git push origin main
9. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- curl -I https://puzzlynest.com shows X-Content-Type-Options after deploy
- dictionary.txt absent from Network tab on /play/sudoku-classic
- Game pages show Skeleton animation during bundle load
- npm run build passes clean

TOKEN CONSTRAINT: Stay within single session. Stop cleanly after all steps.
Report all files changed and approximate tokens used.
```

---

### Phase 4 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-3 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Wire achievement system to GA4 events. Improve daily challenge discoverability.

CONTEXT:
- lib/achievements.ts has AchievementManager (progress tracking, unlock logic)
- lib/analytics.ts has Google Analytics helpers — check what's already there before creating
- components/AchievementPopup.tsx renders unlock notifications
- Daily challenge system exists somewhere in lib/ — search and verify it works
- GA4 is initialized in components/GoogleAnalytics.tsx using next/script

TASKS (in order):
1. In lib/analytics.ts, add/verify these GA4 tracking functions using window.gtag():
   - trackGameStart(gameId: string, gameName: string): void
   - trackGameComplete(gameId: string, result: 'win' | 'loss', durationSeconds?: number): void
   - trackAchievementUnlock(achievementId: string, achievementName: string): void
   All must guard with: if (typeof window === 'undefined' || !window.gtag) return;

2. In lib/achievements.ts (or AchievementManager class), call trackAchievementUnlock()
   at the point an achievement becomes newly unlocked.

3. Create components/GameTracker.tsx — a 'use client' component that:
   - Accepts gameId and gameName as props
   - Calls trackGameStart() on mount (useEffect)
   - Renders nothing (return null — it's a side-effect-only component)
   Add <GameTracker gameId={game.id} gameName={game.name} /> inside GamePlayer.tsx
   (client components can be inside server component tree if used carefully).

4. In components/AchievementPopup.tsx:
   - Add role="status" aria-live="polite" to the popup container
   - Add a visible close (×) button if one doesn't already exist
   - Verify CSS animations are smooth (check for existing keyframes)

5. In app/page.tsx (homepage), add a "Daily Challenge" card prominently in the hero section:
   - Show today's featured game with "Play Today's Challenge →" CTA
   - Style it distinctively (gold/amber gradient border, 🏆 icon)
   - Use the daily challenge system to pick today's game

6. In components/Navigation.tsx or components/Footer.tsx, add an "Achievements" link.

7. Run: npx tsc --noEmit — 0 errors required.
8. git add . && git commit -m "feat: Phase 4 - GA4 events, achievement UX, daily challenge CTA"
9. git push origin main
10. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- Open /play/sudoku-classic in browser → DevTools Console shows gtag calls for game_start
- Unlock an achievement (or simulate) → gtag call for achievement_unlock fires
- "Daily Challenge" CTA visible on homepage
- /achievements linked from nav or footer

TOKEN CONSTRAINT: Stay within single session. Stop cleanly after all steps.
Report all files changed and approximate tokens used.
```

---

### Phase 5 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-4 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Add 4 SEO-optimized blog articles with Article schema. Reach 8+ total articles.

CONTEXT:
- app/blog/ contains existing blog articles — study the page.tsx structure of one before writing
- lib/structuredData.ts has schema helpers — check if getArticleSchema() exists; create if not
- app/sitemap.ts generates the XML sitemap — new articles must be added
- Today's date: 2026-02-21. Use this as datePublished for all articles.

TASKS (in order):
1. Inspect one existing blog article in app/blog/*/page.tsx to understand the structure:
   metadata format, JSX layout, how schemas are included.

2. In lib/structuredData.ts, add getArticleSchema() function if missing:
   Input: { title, description, url, datePublished, dateModified, authorName }
   Returns: Article JSON-LD object (schema.org/Article)

3. Create 4 new blog article pages (each ~1000-1200 words of real, useful content):

   3a. app/blog/best-brain-training-games-2026/page.tsx
       Title: "10 Best Free Brain Training Games to Play Online in 2026"
       Keywords: best brain training games, free brain games 2026
       Internal links: at least 5 game pages (sudoku, memory match, logic grid, etc.)

   3b. app/blog/how-puzzles-improve-memory/page.tsx
       Title: "How Daily Puzzles Improve Memory: The Science Behind Brain Games"
       Keywords: puzzles improve memory, brain games benefits
       Internal links: memory games, /memory-games-online, specific game pages

   3c. app/blog/free-educational-games-kids-2026/page.tsx
       Title: "Free Educational Games for Kids: A Parent's Complete Guide 2026"
       Keywords: free educational games for kids, kids learning games online
       Internal links: kids game pages, /games/kids category

   3d. app/blog/solitaire-strategy-tips/page.tsx
       Title: "Solitaire Strategy: Expert Tips to Win More Games"
       Keywords: solitaire strategy, how to win solitaire, free solitaire online
       Internal links: solitaire-klondike, solitaire-spider, solitaire-freecell, pyramid-solitaire

4. Each article page must include:
   - Full metadata object (title, description, canonical URL, openGraph)
   - Article JSON-LD schema via getArticleSchema()
   - Visible Breadcrumbs component (Home > Blog > [Article Title])
   - datePublished: "2026-02-21", dateModified: "2026-02-21"

5. Update app/blog/page.tsx to list all 8+ articles (existing + 4 new ones).

6. Update app/sitemap.ts to add the 4 new article URLs with lastModified: "2026-02-21".

7. Run: npx tsc --noEmit — 0 errors required.
8. git add . && git commit -m "feat: Phase 5 - 4 SEO blog articles with Article schema"
9. git push origin main
10. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- /blog lists 8+ articles
- Each new article URL returns 200 (not 404)
- Article JSON-LD validates at validator.schema.org
- New URLs appear in /sitemap.xml
- Each article has ≥3 internal links to game pages

TOKEN CONSTRAINT: High-token phase. Split if needed:
- 5a: getArticleSchema() + articles 1-2
- 5b: articles 3-4 + blog index + sitemap update
Report files changed and tokens used.
```

---

### Phase 6 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-5 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Make PuzzlyNest installable as a PWA with offline static asset caching.

CONTEXT:
- Security headers are in place (Phase 3) — required for service worker
- public/ contains static assets
- app/layout.tsx is the root layout
- GCP project: gen-lang-client-0667918696

TASKS (in order):
1. Create/update public/manifest.json:
   {
     "name": "PuzzlyNest - Free Brain Games",
     "short_name": "PuzzlyNest",
     "description": "100+ free brain games and puzzles for all ages. No download required!",
     "start_url": "/",
     "scope": "/",
     "display": "standalone",
     "orientation": "any",
     "theme_color": "#0f0f23",
     "background_color": "#0f0f23",
     "icons": [
       { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
     ],
     "categories": ["games", "education", "entertainment"]
   }

2. Generate PWA icons using generate_image tool:
   - public/icons/icon-192.png: "PuzzlyNest logo, purple puzzle nest icon on dark background,
     minimal geometric design, 192x192 app icon style"
   - public/icons/icon-512.png: same prompt, 512x512

3. Create public/sw.js — service worker:
   - CACHE_NAME = 'puzzlynest-v1'
   - Install: pre-cache ['/', '/games', '/manifest.json']
   - Fetch: cache-first for /_next/static/ paths; network-first for everything else
   - Activate: clear old cache versions (cache names !== CACHE_NAME)

4. Create components/ServiceWorker.tsx:
   'use client'
   import { useEffect } from 'react'
   export default function ServiceWorker() {
     useEffect(() => {
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker.register('/sw.js').catch(console.error)
       }
     }, [])
     return null
   }

5. In app/layout.tsx:
   - Import and render <ServiceWorker /> inside <body> (before {children})
   - Add to <head>: <link rel="manifest" href="/manifest.json" />
   - Add: <meta name="apple-mobile-web-app-title" content="PuzzlyNest" />

6. Run: npm run build — sw.js must be treated as a static file (in public/).
7. Test locally with npm run dev — open Chrome DevTools > Application to verify.
8. git add . && git commit -m "feat: Phase 6 - PWA manifest, service worker, installable"
9. git push origin main
10. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- Chrome DevTools → Application → Manifest shows PuzzlyNest manifest
- Chrome DevTools → Application → Service Workers shows sw.js active
- Lighthouse PWA audit score ≥ 85
- Mobile Chrome shows "Add to Home Screen" option

TOKEN CONSTRAINT: Stay within single session. Stop cleanly after all steps.
Report files changed and tokens used.
```

---

### Phase 7 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-6 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Refactor app/globals.css (1160+ lines) into modular focused CSS files.

CONTEXT:
- app/globals.css is the ONLY CSS file — it contains everything for the entire app
- Tailwind CSS is configured but the project primarily uses vanilla CSS classes
- Components use className="card", "btn", "btn-primary", "container", "game-grid" etc.
- DO NOT change any JSX className values unless you're migrating to CSS Modules
- Target: globals.css < 300 lines (design tokens + resets + shared utilities only)

TASKS (in order):
1. Read the ENTIRE globals.css file. Create a written audit mapping every block to one of:
   A) Tokens: CSS variables (--color-*, --radius-*, --shadow-*, --font-*)
   B) Resets: html, body, *, box-sizing
   C) Navigation: .nav, .nav-*, header, .mobile-menu, .hamburger
   D) Game-player: .game-container, .game-canvas-wrapper, .game-header, .game-title, .game-overlay
   E) Utilities: .card, .btn, .btn-*, .badge, .container, .game-grid, .section-title
   F) Animations: @keyframes * (all animation definitions)
   G) Background: .bg-orbs, .orb, .orb-* (the animated background orbs)
   H) Scrollbar / misc

2. Create app/animations.css — move all @keyframes blocks here.
   Add @import './animations.css'; at the TOP of globals.css.

3. Create app/bg-orbs.css — move .bg-orbs, .orb styles here.
   Add @import './bg-orbs.css'; to globals.css.

4. Create app/navigation.css — move nav/header styles here.
   Add @import './navigation.css'; to globals.css.
   (Note: full CSS Modules migration is out of scope for this phase — just extract to separate file)

5. Create app/game-player.css — move game container/canvas/header/title/overlay styles here.
   Add @import './game-player.css'; to globals.css.

6. Verify globals.css now contains ONLY: imports, tokens, resets, and shared utilities.
   Count lines: (Get-Content app/globals.css).Count — must be < 300.

7. Run: npm run build — must succeed with 0 errors or warnings.

8. Visual check (use browser or describe what to check):
   - / (homepage) — orbs visible, nav correct
   - /games — game grid renders
   - /play/sudoku-classic — game container visible
   - /blog — blog index renders

9. git add . && git commit -m "refactor: Phase 7 - modular CSS, globals.css < 300 lines"
10. git push origin main
11. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- (Get-Content app/globals.css).Count -lt 300 → True
- npm run build exits cleanly
- App looks identical to before on all 4 sample pages

TOKEN CONSTRAINT: High-token phase. If file is too large to process in one session:
- 7a: audit + extract animations + bg-orbs (lowest risk extractions first)
- 7b: extract navigation + game-player + final globals.css cleanup
Report files changed and tokens used.
```

---

### Phase 8 Handoff Prompt (per sub-phase)
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-7 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Implement [N] custom game components for games currently using generic engine fallbacks.

THIS SESSION IS: Sub-phase [8a / 8b / 8c / 8d]

TARGET GAMES THIS SESSION:
[Paste the relevant sub-phase game list here, e.g. for 8a:]
1. money-counting — Drag coins/bills to reach a target dollar amount
2. rhyming-words — Show a word, choose the rhyming word from 4 options
3. sight-words — Flash a word for 2 seconds, then type it from memory
4. phonics-sounds — Show a letter, pick the word that starts with it
5. animal-sounds — Show an animal image, match it to its name from 3 options
6. seasons-weather — Drag weather icons into the correct season bucket
7. body-parts — Click the correct body part highlighted on an outline diagram

CONTEXT:
- All existing custom components are in components/games/ — study 3 similar ones first
- components/GamePlayer.tsx has the gameComponents map — you MUST register each new component here
- Every component receives: { game: Game } where Game is from lib/games.ts
- Required UI states: loading/start screen → gameplay → win/lose screen → restart button
- Use existing className="game-container", "game-canvas-wrapper", "game-header", "game-title"
- Use React hooks (useState, useEffect, useCallback) — no external game libraries

TASKS (in order):
1. Read 2-3 existing game components to understand patterns (e.g., SudokuGame, MemoryMatchGame).
2. For each target game:
   a. Create components/games/[GameNameCamelCase]Game.tsx
   b. Implement the game mechanic described above (or inferred from the game name/description)
   c. Include: start screen, gameplay, score/progress indicator, win/lose state, restart button
3. In GamePlayer.tsx, add each new component to the gameComponents Record:
   'game-id': dynamic(() => import('./games/GameNameGame')),
4. Manually verify each game is playable by reading the code logic (no browser needed).
5. Run: npx tsc --noEmit — 0 errors required.
6. git add . && git commit -m "feat: Phase 8[a/b/c/d] - [N] custom game implementations"
7. git push origin main
8. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- All [N] game IDs now appear in gameComponents map in GamePlayer.tsx
- Each game has distinct gameplay (not a copy of another game)
- No game shows the generic fallback UI ("Browse 80+ Games" fallback must NOT appear)
- npx tsc --noEmit exits with 0 errors

TOKEN CONSTRAINT: ~6-7 games per session. If a game requires complex logic (drag-and-drop,
canvas, animation), reduce the count for that session and carry the remainder to next session.
Report files changed and tokens used.
```

---

### Phase 9 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-8 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Add Jest + React Testing Library with baseline tests for all critical paths.

CONTEXT:
- NO test framework is currently installed — start from scratch
- lib/games.ts exports GAMES (100 games), getGameById(), getGamesByCategory()
- lib/achievements.ts exports AchievementManager with progress tracking
- components/GamePlayer.tsx has gameComponents Record (all 100 games should be mapped after Phase 8)
- localStorage is used in achievements.ts (will need mocking in tests)

TASKS (in order):
1. Install dependencies:
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom ts-jest

2. Create jest.config.ts at project root:
   - testEnvironment: 'jsdom'
   - transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] }
   - setupFilesAfterFramework: ['@testing-library/jest-dom']
   - moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' }
   - testPathIgnorePatterns: ['node_modules', '.next']

3. Create lib/__tests__/games.test.ts:
   - GAMES array has exactly 100 entries
   - All game IDs are unique (no duplicates)
   - All games have required fields: id, name, description, category, ageGroup, difficulty, estimatedPlayTime
   - getGameById('sudoku-classic') returns the Sudoku Classic game
   - getGamesByCategory('brain-training').length > 0
   - getGamesByCategory('nonexistent') returns []
   - getGamesByCategory('brain-training', 'sudoku-classic') does not include sudoku-classic

4. Create lib/__tests__/achievements.test.ts:
   - Mock localStorage before each test
   - Test: saveProgress() writes to 'puzzlynest_progress' key
   - Test: loadProgress() reads from 'puzzlynest_progress' key
   - Test: if 'playzen_progress' exists but 'puzzlynest_progress' does not, data migrates automatically
   - Test: achievement unlock updates the progress object

5. Create components/__tests__/GamePlayer.test.tsx:
   - For each of: ['sudoku-classic', 'memory-match', 'solitaire-klondike',
     'abc-tracing', 'counting-fun'] — verify the game ID is in the gameComponents map
   - Verify the fallback component renders game.name (not "Coming Soon")
   - Mock dynamic imports with jest.mock

6. Add to package.json:
   "test": "jest --passWithNoTests",
   "test:coverage": "jest --coverage --passWithNoTests"

7. Add "## Testing" section to README.md:
   ```md
   ## Testing
   npm test          # Run all tests
   npm run test:coverage  # Run tests with coverage report
   ```

8. Run: npm test — must exit with code 0 (all tests pass).
9. git add . && git commit -m "feat: Phase 9 - Jest + RTL, baseline test suite"
10. git push origin main
11. DEPLOY: gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696

ACCEPTANCE CRITERIA:
- npm test exits with code 0
- All 3 test files run and pass
- README.md has a ## Testing section

TOKEN CONSTRAINT: Stay within single session. Stop cleanly after all steps.
Report files changed and tokens used.
```

---

### Phase 10 Handoff Prompt
```
You are working on PuzzlyNest (c:\Users\shrav\Documents\project-srao4).
Phases 1-9 are complete. Read docs/IMPLEMENTATION_PLAN.md for context.

OBJECTIVE: Create a Cloud Build trigger so every push to main auto-deploys PuzzlyNest.
After this phase, the manual "gcloud builds submit" step is permanently eliminated.

CONTEXT:
- GCP Project: gen-lang-client-0667918696
- GitHub repo: coredrivnops/puzzlynest (branch: main)
- cloudbuild.yaml exists — currently: docker build → docker push → cloud run deploy
- npm test passes (Phase 9 complete) — safe to add to CI pipeline
- No Cloud Build trigger exists for puzzlynest yet (verified: only blobforge and hearthiq-app have triggers)

TASKS (in order):
1. Update cloudbuild.yaml — prepend these steps BEFORE the existing docker build step:
   - Step: Install deps (node:20-alpine, npm ci)
   - Step: Lint (node:20-alpine, npm run lint) — add "lint": "next lint" to package.json if missing
   - Step: Test (node:20-alpine, npm test)
   Keep existing docker build + docker push + cloud run deploy steps after.

2. Create the Cloud Build GitHub trigger via gcloud CLI:
   gcloud builds triggers create github \
     --repo-name=puzzlynest \
     --repo-owner=coredrivnops \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml \
     --project=gen-lang-client-0667918696 \
     --name="puzzlynest-main-deploy" \
     --description="Auto-deploy PuzzlyNest on push to main"

3. Add to .github/workflows/pr-checks.yml (create this file):
   Trigger: pull_request to main
   Steps: checkout, node setup, npm ci, npm run lint, npm test
   (This catches issues on PRs before merge — no deploy here)

4. Add build badge to README.md (get URL from Cloud Build console after trigger is created):
   [![Build Status](https://storage.googleapis.com/...)](https://console.cloud.google.com/cloud-build/...)

5. Update docs/DEPLOYMENT_GUIDE.md:
   - Mark "Automated Deployment (Cloud Build)" section as ✅ ACTIVE
   - Update trigger name to "puzzlynest-main-deploy"
   - Note that npm test + lint run before docker build
   - Remove the "⚠️ MANUAL DEPLOY REQUIRED" notice from top of IMPLEMENTATION_PLAN.md

6. Test the trigger: make a small commit and push to main. Watch Cloud Build console.
   Verify the build triggers automatically without running gcloud builds submit.

7. git add . && git commit -m "ci: Phase 10 - Cloud Build auto-deploy trigger, PR checks"
8. git push origin main
   (This push itself should trigger the new auto-deploy!)

ACCEPTANCE CRITERIA:
- gcloud builds triggers list --project=gen-lang-client-0667918696 shows "puzzlynest-main-deploy"
- Pushing commit to main shows build triggered in Cloud Build console within 30 seconds
- A simulated npm test failure (bad test) shows build fails BEFORE the docker step
- Build + deploy completes in < 5 minutes total
- .github/workflows/pr-checks.yml runs on PR open/update

TOKEN CONSTRAINT: Stay within single session. Stop cleanly after all steps.
Report final state and tokens used. Update IMPLEMENTATION_PLAN.md Phase 10 status to COMPLETE.
```

---

## 6. MASTER SUMMARY TABLE

| Phase | Title | Type | Priority | Token Load | Depends On | Status |
|-------|-------|------|----------|------------|------------|--------|
| **1** | Critical Fixes & Branding | Bug Fix | 🔴 Critical | Medium | None | ✅ DONE (8280bc5) |
| **2** | SEO & Discoverability | Enhancement | 🟠 High | Medium | None | ✅ DONE (b637987) |
| **3** | Performance & Security | Enhancement | 🟠 High | Low | None | ⏳ **NEXT** |
| **4** | Achievements & Analytics | Enhancement | 🟡 Medium | Medium | None | ⏳ Pending |
| **5** | Blog Expansion | Content | 🟡 Medium | High | None | ⏳ Pending |
| **6** | PWA & Offline Support | New Feature | 🟡 Medium | Medium | Phase 3 | ⏳ Pending |
| **7** | CSS Architecture Refactor | Refactor | 🟢 Low | High | None | ⏳ Pending |
| **8a** | Game Quality — Kids (7 games) | New Feature | 🟢 Low | High | Phase 1 | ⏳ Pending |
| **8b** | Game Quality — Creative (6 games) | New Feature | 🟢 Low | High | Phase 1 | ⏳ Pending |
| **8c** | Game Quality — Arcade (5 games) | New Feature | 🟢 Low | High | Phase 1 | ⏳ Pending |
| **8d** | Game Quality — Relaxation (6 games) | New Feature | 🟢 Low | High | Phase 1 | ⏳ Pending |
| **9** | Testing Infrastructure | Enhancement | 🟢 Low | Medium | Phase 1 | ⏳ Pending |
| **10** | CI/CD Auto-Deploy | Enhancement | 🟢 Low | Low | Phase 9 | ⏳ Pending |

---

> [!IMPORTANT]
> **⚠️ NO AUTO-DEPLOY** — PuzzlyNest has no Cloud Build trigger. Until Phase 10, end every phase with:
> `gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0667918696`
>
> **Phases 1-2 are complete.** Phase 3 is the immediate next priority (security + performance).
