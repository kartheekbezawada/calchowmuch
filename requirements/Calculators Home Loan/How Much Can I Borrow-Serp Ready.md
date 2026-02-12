Codex Task: SERP-Ready Structured Data + Sitemap Update
1) Page scope and canonical

Target slug: /loans/how-much-can-i-borrow/

Canonical is already: https://calchowmuch.com/loans/how-much-can-i-borrow/ 

Home Loan

Implement schema injection only for this page (page-scoped, not global).

2) JSON-LD — REQUIRED (single script, @graph)

Inject exactly one JSON-LD <script type="application/ld+json"> in <head> for this page, containing an @graph with:

WebPage (1)

SoftwareApplication (exactly 1)

FAQPage (1) — FAQs are already on the page and must match visible FAQ content 

Home Loan

BreadcrumbList (1)

Hard requirements

Must be in initial HTML (server-rendered/static), not client-only.

Must be valid JSON (no trailing commas).

SoftwareApplication count must be 1.

3) Use these page facts (from the HTML)

Title: How Much Can I Borrow | Calculate How Much Online Calculator 

Home Loan

Meta description exists (keep it, but do not truncate mid-word if your build pipeline currently truncates) 

Home Loan

H1: How Much Can I Borrow 

Home Loan

FAQ section exists with 10 Q/As (use them verbatim for FAQPage mainEntity) 

Home Loan

Breadcrumb intent based on nav: Home → Home Loan → How Much Can I Borrow 

Home Loan

4) JSON-LD content (paste this as the exact structure; fill any missing fields with your site constants)

Use this as the schema payload (update IDs if you have a standard pattern):

{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://calchowmuch.com/loans/how-much-can-i-borrow/#webpage",
      "url": "https://calchowmuch.com/loans/how-much-can-i-borrow/",
      "name": "How Much Can I Borrow | Calculate How Much Online Calculator",
      "description": "How Much Can I Borrow calculator with fast inputs and clear results. Calculate How Much provides explanations, examples, and assumptions to help you plan con...",
      "isPartOf": { "@id": "https://calchowmuch.com/#website" },
      "inLanguage": "en"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://calchowmuch.com/loans/how-much-can-i-borrow/#softwareapplication",
      "name": "How Much Can I Borrow Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "url": "https://calchowmuch.com/loans/how-much-can-i-borrow/",
      "description": "Estimate your maximum affordable loan using income multiples or a payment-to-income cap.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://calchowmuch.com/loans/how-much-can-i-borrow/#breadcrumbs",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
        { "@type": "ListItem", "position": 2, "name": "Home Loan", "item": "https://calchowmuch.com/loans/home-loan/" },
        { "@type": "ListItem", "position": 3, "name": "How Much Can I Borrow", "item": "https://calchowmuch.com/loans/how-much-can-i-borrow/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://calchowmuch.com/loans/how-much-can-i-borrow/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is this a guaranteed amount I can borrow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This is only an estimate. Final approval depends on your credit score, employment stability, and the lender's own policies and affordability criteria."
          }
        },
        {
          "@type": "Question",
          "name": "Why is my borrowing less than 5x my income?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Because lenders adjust for your monthly expenses, existing debt commitments, and interest rate stress tests that simulate higher future rates."
          }
        },
        {
          "@type": "Question",
          "name": "Can I borrow more with a longer loan term?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Often yes. A longer term lowers monthly payments and can increase affordability, but you will pay significantly more interest over the life of the loan."
          }
        },
        {
          "@type": "Question",
          "name": "Do different lenders give different amounts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Each lender has its own criteria for income multiples, expense allowances, and stress test rates. Shopping around or using a broker can help."
          }
        },
        {
          "@type": "Question",
          "name": "What is an income multiple?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An income multiple is a simple multiplier applied to your annual salary. For example, at 4.5x on a 90,000 salary, the maximum loan would be 405,000."
          }
        },
        {
          "@type": "Question",
          "name": "How does the payment-to-income method work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It calculates the maximum monthly payment you can afford after subtracting expenses and debts from your monthly income, then works backwards to find the loan amount."
          }
        },
        {
          "@type": "Question",
          "name": "Does a larger deposit increase how much I can borrow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A deposit increases your total purchasing power but does not directly change the loan amount. Lenders base borrowing on income and affordability, not deposit size."
          }
        },
        {
          "@type": "Question",
          "name": "Should I use gross or net income?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gross income is typically used for income multiple calculations. Net monthly income is more appropriate for payment-to-income checks as it reflects your actual take-home pay."
          }
        },
        {
          "@type": "Question",
          "name": "How do interest rates affect my borrowing power?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Higher rates mean higher monthly payments for the same loan amount, which reduces the maximum you can borrow. Even a 0.5% change can shift borrowing power significantly."
          }
        },
        {
          "@type": "Question",
          "name": "Should I speak to a mortgage broker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If you are serious about buying, a broker can match you with the lender most likely to approve your application and secure the best rate for your circumstances."
          }
        }
      ]
    }
  ]
}


Note: If you want strict geo targeting later (UK), add areaServed and use GBP in Offer. For global, keep the Offer as “0” and a default currency.

5) Sitemap.xml — REQUIRED

Add a <url> entry (or ensure it exists) for:

https://calchowmuch.com/loans/how-much-can-i-borrow/

Set <lastmod> to build date (YYYY-MM-DD)

Keep changefreq/priority consistent with your current sitemap strategy.

6) Verification steps (must pass)

Confirm JSON-LD exists in initial HTML:

curl -sS http://127.0.0.1:8002/loans/how-much-can-i-borrow/ | grep -n 'application/ld+json'


Confirm SoftwareApplication count == 1, and FAQPage present.

Re-run your local audit; the “Missing JSON-LD WebPage / SoftwareApplication / FAQPage / BreadcrumbList” checks must pass.

#### Fix Google “duplicate FAQ” structured data.

Requirement:
- FAQs (visible content) stay in the HTML page.
- FAQPage JSON-LD must exist exactly once per page.
- Remove any global FAQPage injection that duplicates page-scoped FAQPage.
- Implement a schema-injection guard so only one JSON-LD @graph is emitted.

Acceptance checks:
1) For each calculator URL:
   curl -sS <url> | grep -o '"@type":"FAQPage"' | wc -l
   MUST equal 1
2) The FAQPage mainEntity Q/A must match the visible FAQ cards on that page.
3) Re-run local SEO audit: no “duplicate FAQPage” warnings.
