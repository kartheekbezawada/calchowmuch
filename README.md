# CalcHowMuch

CalcHowMuch is a multi-page calculator website built to help people make practical decisions with clear, searchable, and easy-to-use tools.

Small documentation-only updates can be made here without affecting live calculator behavior.
Runtime changes are implemented in route source files and generated public assets, not in this README.

This README is a project scope document. It explains what the project includes, how calculators are organised, and how quality is protected. It is written for people who need to understand the product and delivery model, not just the code.

## Project Purpose

CalcHowMuch exists to publish calculator pages that are:

- easy for users to find through search
- easy to use on desktop and mobile
- clear enough to support a real decision, not just a number
- supported by explanation content, FAQs, and important notes
- governed by a release process before they are considered ready

The platform covers calculator categories such as:

- salary
- finance
- loans
- credit cards
- pricing
- math
- percentage
- time and date
- sleep and nap

## What The Project Delivers

Each calculator is treated as a publishable product page, not just a formula.

In practice, that means a release usually includes:

- a calculator experience
- supporting explanation content
- FAQ content where required
- SEO metadata and structured data
- navigation to and from related calculators
- sitemap coverage for public pages
- test evidence and release sign-off

## Scope Of The Website

The site is a static, SEO-focused calculator platform. It does not rely on a traditional backend application to render calculator pages for users at request time.

Key scope decisions:

- calculators are delivered as static pages
- calculator navigation uses standard links and full page loads
- public pages must be discoverable and governed
- explanation content is part of the product, not an optional add-on
- release quality is controlled through documented gates

## Calculator Architecture

The project uses a multi-page architecture.

This means:

- each calculator has its own route
- moving between calculators uses normal `<a href>` links
- the project does not use single-page-app calculator navigation
- calculator pages are generated into public, static HTML output

At a high level, a calculator page can contain:

- a calculator pane
- an explanation pane
- standalone content for non-calculator routes when needed

The main supported route patterns are:

- `calc_exp`: calculator plus explanation
- `calc_only`: calculator without explanation
- `exp_only`: explanation without calculator
- `content_shell`: structured content page inside the site shell

This architecture is used because it supports:

- stronger SEO crawlability
- clearer route ownership
- predictable page-level testing
- simpler release control

## Project Structure

The project is organised around public routes, cluster ownership, requirements, and tests.

Important areas:

- `public/`
  Public route output and route source fragments.
- `clusters/`
  Cluster-owned route configuration and assets.
- `config/`
  Shared configuration such as cluster ownership and registry data.
- `requirements/`
  Governance, release rules, and project requirements.
- `tests_specs/`
  Unit, end-to-end, SEO, layout, and release-oriented test coverage.
- `scripts/`
  Build and generation utilities used to produce route output.

In simple terms:

- `public/` is what gets served
- `requirements/` defines the rules
- `tests_specs/` checks that releases meet those rules

## How Calculators Are Treated

A calculator is not considered complete just because the formula works.

A release-ready calculator normally needs to satisfy all of the following:

- correct calculation logic
- usable page layout
- mobile-friendly interaction
- explanation content in the required format
- SEO and schema coverage
- sitemap presence if the route is public
- release evidence showing checks were completed

This keeps the project focused on publishable user value, not isolated code delivery.

## Testing Strategy

The testing strategy is layered. Different tests answer different risks.

### 1. Unit Tests

Unit tests check calculation logic, helper functions, metadata guards, and other rule-based behaviour.

These tests answer:

- does the calculator produce the correct result?
- do important rules and metadata stay valid?
- did a local code change break a known rule?

### 2. End-To-End Tests

End-to-end tests check real page behaviour in the browser.

These tests answer:

- can a user open the calculator page successfully?
- do inputs, actions, and results work as expected?
- does the route behave correctly in a real browsing flow?

### 3. SEO And SERP Checks

SEO checks validate that public pages are release-ready from a search and indexing perspective.

These checks cover areas such as:

- title and metadata presence
- structured data and FAQ expectations
- page-level SEO contract compliance
- sitemap inclusion for public routes

### 4. Layout And Visual Stability Checks

Some tests protect layout behaviour and visual stability.

These checks are used to catch issues such as:

- broken calculator shell layouts
- unstable page rendering
- regressions in required page structure

### 5. Performance And CWV Checks

Performance checks are used to confirm that calculator pages remain efficient enough for release expectations.

This matters because the project depends on static, search-friendly pages that should load cleanly and behave predictably.

## Release And Quality Control

The project follows a governed release flow.

The high-level sequence is:

1. requirement
2. build
3. release checklist
4. release sign-off
5. ready to merge

Important release rules:

- failing checks must be fixed before release readiness
- public routes must be represented in the sitemap
- release evidence must be recorded
- the agent can prepare work, but does not merge

## Source Of Truth

The main governance document for implementation and release expectations is:

- `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`

Related release control documents include:

- `requirements/universal-rules/RELEASE_CHECKLIST.md`
- `requirements/universal-rules/RELEASE_SIGNOFF.md`

## Who This README Is For

This document is intended for:

- project owners
- reviewers
- content and SEO stakeholders
- contributors who need to understand the platform before changing it

