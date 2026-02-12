1) Fix title/meta truncation (SERP hygiene)

Your current <title> and OG/Twitter titles are truncated with .... That is not ideal.

Replace with fully specified values:

Title: Remortgage Calculator (Switching) | Compare Rates & Break-even | CalcHowMuch

Meta description (140–160 chars, not truncated):
Compare your current mortgage vs a new deal. See monthly savings, break-even month, and total savings over 2–10 years with our remortgage calculator.

Update OG/Twitter titles/descriptions to match (no ...).

2) Add JSON-LD (single script, @graph) — REQUIRED

Insert this into <head> before Cloudflare analytics script.

<script type="application/ld+json" data-static-ld="true">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://calchowmuch.com/#website",
      "url": "https://calchowmuch.com/",
      "name": "CalcHowMuch",
      "inLanguage": "en"
    },
    {
      "@type": "Organization",
      "@id": "https://calchowmuch.com/#organization",
      "name": "CalcHowMuch",
      "url": "https://calchowmuch.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://calchowmuch.com/assets/images/og-default.png"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://calchowmuch.com/loans/remortgage-switching/#webpage",
      "url": "https://calchowmuch.com/loans/remortgage-switching/",
      "name": "Remortgage Calculator (Switching) | Compare Rates & Break-even | CalcHowMuch",
      "description": "Compare your current mortgage vs a new deal. See monthly savings, break-even month, and total savings over 2–10 years with our remortgage calculator.",
      "isPartOf": { "@id": "https://calchowmuch.com/#website" },
      "publisher": { "@id": "https://calchowmuch.com/#organization" },
      "inLanguage": "en",
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://calchowmuch.com/assets/images/og-default.png"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://calchowmuch.com/loans/remortgage-switching/#softwareapplication",
      "name": "Remortgage / Switching Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "url": "https://calchowmuch.com/loans/remortgage-switching/",
      "description": "Compare your current mortgage to a new rate and term over a chosen horizon. See savings, break-even month, and cumulative costs.",
      "inLanguage": "en",
      "provider": { "@id": "https://calchowmuch.com/#organization" },
      "featureList": [
        "Monthly and annual savings",
        "Break-even month",
        "Total savings over horizon (2–10 years)",
        "Cost comparison table (monthly/yearly)"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://calchowmuch.com/loans/remortgage-switching/#breadcrumbs",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
        { "@type": "ListItem", "position": 2, "name": "Loans", "item": "https://calchowmuch.com/loans/" },
        { "@type": "ListItem", "position": 3, "name": "Remortgage / Switching", "item": "https://calchowmuch.com/loans/remortgage-switching/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://calchowmuch.com/loans/remortgage-switching/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does this remortgage comparison show?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It compares cumulative cost of your current mortgage versus a new rate and term over your chosen horizon."
          }
        },
        {
          "@type": "Question",
          "name": "Why is horizon length important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A longer horizon shows how differences compound over time, which can change your switching decision."
          }
        },
        {
          "@type": "Question",
          "name": "Can a lower rate still be a weak switch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. If the term changes materially, short-term monthly relief may not always mean strongest long-term value."
          }
        },
        {
          "@type": "Question",
          "name": "How should I read break-even month?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It is the first month where cumulative new-deal cost becomes lower than the current-deal cost."
          }
        },
        {
          "@type": "Question",
          "name": "Should I compare monthly and yearly table views?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Monthly reveals timing details, while yearly helps you evaluate strategy with less noise."
          }
        },
        {
          "@type": "Question",
          "name": "What if my current payment differs from formula output?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This calculator computes baseline from balance, rate, and term for consistency across all scenarios."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this for quick refinancing checks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. It is designed for fast directional decisions before lender-specific fee and product validation."
          }
        },
        {
          "@type": "Question",
          "name": "Does changing term length affect total saving?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Term length influences monthly payment profile and cumulative interest over your horizon."
          }
        },
        {
          "@type": "Question",
          "name": "Is this a lender approval or offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. It is an estimate tool. Final terms depend on product rules, credit profile, and underwriting."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use this for better decisions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Keep balance fixed, vary one input at a time, and compare outcomes across multiple horizon years."
          }
        }
      ]
    }
  ]
}
</script>


Audit expectations satisfied:

WebPage present

SoftwareApplication count == 1

FAQPage present and matches visible FAQ

BreadcrumbList present

3) Make H1 SERP-aligned (small but high value)

Change:

Remortgage / Switching
to:

Remortgage Calculator (Switching)

This aligns visible intent with query terms.

4) Sitemap.xml update

Ensure sitemap includes:

https://calchowmuch.com/loans/remortgage-switching/

correct <lastmod> on release date

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