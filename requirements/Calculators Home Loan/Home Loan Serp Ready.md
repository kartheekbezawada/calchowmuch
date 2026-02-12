SERP-Ready Improvements for /loans/home-loan/
1) Upgrade JSON-LD (keep single script, @graph)

Keep one <script type="application/ld+json"> and extend @graph with:

Add: WebSite + Organization

These help unify site identity across pages (Google may use for brand understanding).

Improve: WebPage

Add:

@id

isPartOf → WebSite

primaryImageOfPage

publisher → Organization

Improve: SoftwareApplication

Your current SoftwareApplication is acceptable, but for SERP you should add:

@id

softwareVersion (optional)

provider (Organization)

featureList (short list of what the calculator outputs)

keywords (careful, concise)

inLanguage

offers currency should align with your target market (UK site → GBP). If you want global neutrality, omit currency or keep USD consistently site-wide. Don’t mix per page.

Improve: FAQPage

Add an @id and optionally link it to page via isPartOf or keep it in graph only.
Ensure questions/answers match visible text exactly (you already do).

Improve: BreadcrumbList

Add @id and ensure the “Loans” breadcrumb matches the actual page (you have /loans/ in breadcrumb — keep it if that page exists and is indexable).

2) Recommended SERP-ready JSON-LD (drop-in replacement)

Replace your existing JSON-LD script contents with the following (same data, higher quality). Keep data-static-ld="true" if your pipeline uses it.

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
      "@id": "https://calchowmuch.com/loans/home-loan/#webpage",
      "url": "https://calchowmuch.com/loans/home-loan/",
      "name": "Home Loan | Calculate How Much Online Calculator - Free Tool",
      "description": "Estimate monthly mortgage payments, amortization schedule, payoff timeline, and interest savings from extra payments with our free Home Loan Calculator.",
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
      "@id": "https://calchowmuch.com/loans/home-loan/#softwareapplication",
      "name": "Home Loan Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "url": "https://calchowmuch.com/loans/home-loan/",
      "description": "Estimate monthly mortgage payments, amortization schedule, payoff timeline, and interest savings from extra payments with our free Home Loan Calculator.",
      "inLanguage": "en",
      "provider": { "@id": "https://calchowmuch.com/#organization" },
      "featureList": [
        "Monthly payment estimate",
        "Lifetime totals (principal vs interest)",
        "Amortization schedule (monthly/yearly)",
        "Extra payment and lump-sum payoff impact"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://calchowmuch.com/loans/home-loan/#breadcrumbs",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
        { "@type": "ListItem", "position": 2, "name": "Loans", "item": "https://calchowmuch.com/loans/" },
        { "@type": "ListItem", "position": 3, "name": "Home Loan", "item": "https://calchowmuch.com/loans/home-loan/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://calchowmuch.com/loans/home-loan/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a home loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A home loan (also called a mortgage) is a secured loan from a bank or lender used to buy, build, or refinance a property. The property serves as collateral until the loan is fully repaid."
          }
        },
        {
          "@type": "Question",
          "name": "How much can I borrow for a home loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most lenders typically allow borrowing between 4x to 5.5x of your annual income. The exact amount depends on your income, credit profile, monthly expenses, existing debts, and job stability."
          }
        },
        {
          "@type": "Question",
          "name": "What is Loan-to-Value (LTV)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LTV is the percentage of the property price financed by a loan. For example, if a property is worth 250,000 and the loan is 200,000, the LTV is 80%. Lower LTV usually helps you qualify for better interest rates."
          }
        },
        {
          "@type": "Question",
          "name": "How do interest rates affect my monthly payment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Higher interest rates increase both your monthly payment and total interest paid over time. Even a small rate change (e.g., 0.5%) can significantly impact total repayment."
          }
        },
        {
          "@type": "Question",
          "name": "What is a typical home loan term?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most home loans run for 20 to 35 years, with 25 years being the most common choice, depending on affordability and borrower preference."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between fixed and variable rates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fixed-rate loan: Your interest rate remains the same for a set period. Variable-rate loan: Your rate can change based on market conditions or lender policy."
          }
        },
        {
          "@type": "Question",
          "name": "How much deposit do I need to buy a house?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most buyers need a deposit between 5% and 20% of the property value. A higher deposit generally helps secure lower interest rates."
          }
        },
        {
          "@type": "Question",
          "name": "What additional costs come with a home loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Common extra costs include property valuation fees, legal/conveyancing fees, loan processing fees, property taxes, and home insurance."
          }
        },
        {
          "@type": "Question",
          "name": "Can I repay my home loan early?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, but some lenders charge an early repayment fee, especially during fixed-rate periods. Always check your loan terms before making extra payments."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if I miss payments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Missing payments can harm your credit score, lead to penalties, and in severe cases may result in repossession of the property."
          }
        }
      ]
    }
  ]
}
</script>


Why this is “more SERP-ready”:

Establishes site/entity identity (WebSite, Organization)

Adds stable @id anchors for de-duplication

Better connects the page to the site and publisher

Keeps FAQ eligibility safe (content is on-page)

Keeps SoftwareApplication exactly 1 (your audit requirement)

3) Content SERP readiness (minimal edits)

Your meta description is already good. Two practical tweaks:

Ensure H1 includes “Calculator” somewhere near the top of visible UI (either in helper text or subtitle), e.g.:

H1: “Home Loan Calculator”

Keep <title> as is or also include “Calculator”.

Google often uses on-page headings heavily. Right now your H1 is just “Home Loan”.

4) Sitemap update (SERP hygiene)

Ensure sitemap has:

https://calchowmuch.com/loans/home-loan/

lastmod updated on release day

Also ensure /loans/ exists and is in sitemap (since breadcrumb references it).

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
