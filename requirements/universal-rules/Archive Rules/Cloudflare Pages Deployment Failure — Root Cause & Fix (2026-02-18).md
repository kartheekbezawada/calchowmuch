Summary

Production/preview deployments on Cloudflare Pages started failing even though the repo was correct. Redirects and URL migrations appeared “not working” on the live site because the new changes never reached production. Cloudflare continued serving the previous successful deployment.

The failure was caused by a mismatch between:

a newly enforced safe mode in scripts/generate-mpa-pages.js (requires explicit scope), and

the existing Cloudflare build command, which ran the generator without providing scope or allowing full generation.

Symptoms Observed

Cloudflare Pages build failed with an error:

Safe mode: this generator requires explicit scope...

New changes (including _redirects for canonical URL migrations) did not appear in production.

Old URLs still returned 200 instead of 301 because redirects were not deployed.

curl -I tests showed:

/sitemap/ redirected correctly (from old deployment)

migrated calculator URLs did not redirect because new _redirects did not go live

Root Cause
Safe Mode Enforcement Added

node scripts/generate-mpa-pages.js was updated to run in safe mode, which blocks full-site regeneration unless explicitly instructed via one of:

GENERATE_ALL_ROUTES=1 (environment variable), or

--all, or

TARGET_ROUTE=/path/, or

TARGET_CALC_ID=<id>

Cloudflare Build Command Was Not Updated

Cloudflare Pages build command remained:

node scripts/generate-mpa-pages.js


Because it did not pass GENERATE_ALL_ROUTES=1 or a scoped target, the build failed. When builds fail, Cloudflare does not deploy the new version and keeps serving the last successful deployment.

Why setting env var did not fix immediately

Even after adding GENERATE_ALL_ROUTES=1 in Variables and Secrets, the Cloudflare build environment still behaved as if the variable wasn’t available (likely due to environment scoping/preview-vs-prod or injection timing). The definitive fix was to force the variable inside the build command itself.

Resolution (Final Fix Applied)
Updated Cloudflare Pages Build Command

In Cloudflare Pages → Settings → Build configuration, change build command to:

GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js


This ensures:

generator safe mode is explicitly overridden for CI

build succeeds and deploy proceeds

Result

Cloudflare deployment becomes green ✅

New _redirects rules finally deploy ✅

Old URLs start returning 301 → new canonical URLs ✅

Verification Steps

After successful deploy, validate:

1) Redirect behavior

Old URL should 301 to new canonical:

curl -I https://calchowmuch.com/percentage-calculators/percent-change/


Expected:

HTTP/2 301

location: /percentage-calculators/percent-change-calculator/

New canonical should return 200:

curl -I https://calchowmuch.com/percentage-calculators/percent-change-calculator/


Expected:

HTTP/2 200

2) Sitemap behavior
curl -I https://calchowmuch.com/sitemap/


Expected:

301 to /sitemap.xml

Lessons / Governance Rule (Prevent Repeat)
Rule: Cloudflare CI must always be explicit

Because the generator is in safe mode to protect cluster isolation, CI must run with an explicit intent. The standard is:

Cloudflare deploys must run full generation using GENERATE_ALL_ROUTES=1

Local/dev workflows can remain scoped using TARGET_ROUTE or TARGET_CALC_ID

Permanent Standard

Safe mode stays (prevents accidental cross-cluster regeneration)

CI full-site generation stays explicit (prevents broken deployments)

Final State

Deployment pipeline corrected ✅

URL migration redirects are able to go live ✅

Cluster migration can continue safely with scoped workflows locally ✅
