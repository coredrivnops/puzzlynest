// Google Search Console Verification Instructions
// 
// HOW TO USE THIS FOR VERIFICATION:
// 
// 1. Go to Google Search Console: https://search.google.com/search-console
// 2. Add your property (puzzlynest.com)
// 3. Choose "URL prefix" method (not Domain)
// 4. Select "HTML tag" verification method
// 5. Copy ONLY the content value from the meta tag
//    Example: if Google gives you:
//    <meta name="google-site-verification" content="abc123xyz" />
//    Copy only: abc123xyz
// 6. Set the environment variable in Cloud Run:
//    
//    gcloud run services update puzzlynest \
//      --region europe-west1 \
//      --set-env-vars "NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION=abc123xyz"
//
// 7. Wait 2-3 minutes for deployment, then click Verify in Search Console
//
// ALTERNATIVE: Add directly to .env.local for local testing:
// NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION=abc123xyz

export const VERIFICATION_INSTRUCTIONS = `
Google Search Console Verification Guide for PuzzlyNest
========================================================

METHOD 1: HTML Meta Tag (Recommended)
--------------------------------------
1. Go to: https://search.google.com/search-console
2. Click "Add property"
3. Enter: https://puzzlynest.com (or your Cloud Run URL for testing)
4. Select "URL prefix" property type
5. Choose "HTML tag" verification
6. Copy the content value (e.g., "abc123xyz")
7. Run this command:
   
   gcloud run services update puzzlynest --region europe-west1 --set-env-vars "NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION=abc123xyz"

8. Wait 3 minutes, then click Verify

METHOD 2: URL Prefix with Cloud Run URL (For Immediate Testing)
----------------------------------------------------------------
If DNS is still propagating, verify your Cloud Run URL first:
1. Add property: https://puzzlynest-623622256552.europe-west1.run.app
2. This verifies your app is working
3. Later, add puzzlynest.com as a separate property

METHOD 3: Google Analytics Verification
----------------------------------------
If you have Google Analytics set up:
1. Ensure GA tracking code is on all pages (already done)
2. In Search Console, choose "Google Analytics" verification
3. Use the same Google account for both GA and Search Console
`;
