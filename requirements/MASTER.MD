# Project Level Rules Non Negotiable
# **NON-NEGOTIABLE** - These rules apply to ALL phases and must NEVER be violated.


Project Name: Calculator App
Description: A modular, high-performance, SEO-friendly calculator platform focused on answering real-world “How much?” questions using simple, transparent logic.
Tech Stack: Static HTML, CSS, JavaScript, CDN-hosted


What This Project Is For
=======================================
This project exists to provide clear, fast, and trustworthy calculators that help users answer practical questions such as:
    How much time will it take to pay off debt?
    How much percentage increase or decrease occurred?
    How do fractions combine or simplify?
    The focus is decision support, not just raw computation.


Define the target users
==================================
    General users looking for quick, understandable answers
    Students and learners needing explanations with examples
    Financially conscious users exploring “how much” scenarios
    Search users landing via long-tail, intent-driven queries
    This is not a developer SDK or a math engine library

Define the key value proposition
================================
    One calculator = one focused question
    Simple UI with no unnecessary complexity
    Static explanations that build trust and SEO value
    Extremely fast load times (static, CDN-first)
    Modular architecture that scales to many calculators without becoming fragile


Architecture — NON-NEGOTIABLE (Must Follow)
==========================================
    These rules apply to all phases and all PRs.
    Follow the existing folder structure exactly
    One calculator per folder
    One calculator per entry HTML page
    Keep layout, navigation, and calculator logic separated
    No circular dependencies
    Components must remain modular and reusable
    Shared logic must live in shared utilities (no duplication)

Naming & Documentation Consistency (Important)
================================================

    The calculator folder name credit-card-payoff is the canonical reference
    Navigation display names may differ slightly (e.g. “Credit Payoff”)
    Documentation must prefer folder name conventions when referring to calculators internally
    Avoid ambiguous naming in docs

    Example:
        Folder: credit-card-payoff
        Navigation label: Credit Payoff
        Documentation reference: Credit Card Payoff (credit-card-payoff)


Must Follow
    - Must follow requirements/INVENTORY.MD; if it does not exist, create it and update the inventory table
    - Must follow requirements/CODING_STANDARDS.MD
    - Must follow requirements/FOLDER_STRUCTURE.MD
    - Must follow ARCHITECTURE.MD


Never Do (Hard Rules)
==============================
    These actions are strictly forbidden:
    Never delete data without a soft-delete strategy
    Never bypass authentication (if/when applicable)
    Never commit directly to main
    Never ignore runtime or linting errors
    Never hardcode environment-specific values
    Never merge PRs that violate architectural rules

Definition of Done (Strict)
====================================
    A task or PR is considered complete only when:
    ✅ Code is written and works as intended
    ✅ Unit tests pass
    ✅ No runtime or linting errors
    ✅ Code reviewed by Codex
    ✅ PR reviewed and approved
    ✅ PR merged correctly
    ✅ INDEX.md (or equivalent documentation) updated

    If any item is missing, the task is not done.

Enforcement
=====================
    Codex reviews must respect this document
    PRs violating any Non-Negotiable rule must be rejected
    This document is authoritative over informal discussions



Tests must pass before merge.
(Exact test framework can be project-defined; do not invent a new framework unless repo already uses one.)

Documentation Accuracy Rules (MUST FOLLOW)
==============================================
Documentation must reflect the repo truth.
If calculator folders exist but are not referenced in navigation.json, docs must list them and label status as:
    Active
    Work-in-progress
    Legacy/Deprecated

Example:
If these exist:
    public/calculators/math/basic-operations/
    public/calculators/math/percentage-increase/
    Docs must acknowledge them and state whether they’re inactive or legacy.

