# CalcHowMuch — Agent Workflow Diagram

> Factory Pipeline: **Requirement → Build → Test → Log → Ready to Merge**

---

## Full Pipeline

```mermaid
flowchart TD
    subgraph HUMAN["🧑 HUMAN"]
        H1["Provides Requirement"]
        H2["Reviews Code"]
        H3["Merges to Main"]
    end

    subgraph AGENT["🤖 AGENT (Copilot / Codex / Claude Code)"]
        subgraph BUILD["Step 2 — BUILD"]
            B1["Read UNIVERSAL_REQUIREMENTS.md"]
            B2["Read Project Bible.md"]
            B3["Read calculator-specific rules"]
            B4["Implement code change"]
            B5["Ensure sitemap coverage"]
        end

        subgraph TEST["Step 3 — TEST (All Gates)"]
            T1["npm run lint"]
            T2["npm run test (Unit)"]
            T3["npm run test:e2e (E2E)"]
            T4["npm run test:cwv:all (CWV Guard)"]
            T5["SEO P1–P5 checks"]
            T6["SERP Readiness (Section I)"]
            T7["npm run test:iss001 (ISS-001)"]
            T8["FAQ Schema Guard"]
        end

        subgraph LOG["Step 4 — LOG"]
            L1["Create RELEASE_SIGNOFF_{ID}.md
from template"]
            L2["Add row to Master Table"]
        end

        R1["✅ 'Ready to merge'"]
    end

    subgraph ADMIN_MODE["⚡ ADMIN Override"]
        A1["Keyword ADMIN in message"]
        A2["Skip all gates"]
        A3["Execute immediately"]
    end

    H1 -->|"Requirement"| B1
    B1 --> B2 --> B3 --> B4 --> B5
    B5 --> T1

    T1 --> T2 --> T3 --> T4 --> T5 --> T6 --> T7 --> T8

    T8 -->|"All Pass"| L1
    T8 -->|"Any Fail"| B4

    L1 --> L2 --> R1

    R1 -->|"Informs Human"| H2
    H2 --> H3

    A1 --> A2 --> A3

    style HUMAN fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style AGENT fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style BUILD fill:#fef9c3,stroke:#ca8a04,stroke-width:1px
    style TEST fill:#fce7f3,stroke:#db2777,stroke-width:1px
    style LOG fill:#e0e7ff,stroke:#4f46e5,stroke-width:1px
    style ADMIN_MODE fill:#fef2f2,stroke:#dc2626,stroke-width:2px,stroke-dasharray: 5 5
    style R1 fill:#bbf7d0,stroke:#16a34a,stroke-width:2px
```

---

## Document Chain

```mermaid
flowchart LR
    UR["UNIVERSAL_REQUIREMENTS.md\n(Highest authority)"]
    PB["Project Bible.md\n(Strategy & design)"]
    RC["RELEASE_CHECKLIST.md\n(Pass/fail gates)"]
    RS["RELEASE_SIGNOFF.md\n(Template)"]
    RSF["release-signoffs/\nRELEASE_SIGNOFF_{ID}.md\n(Per-release evidence)"]
    MT["Release Sign-Off\nMaster Table.md\n(Historical record)"]

    UR --> PB --> RC --> RS --> RSF --> MT

    style UR fill:#fef2f2,stroke:#dc2626,stroke-width:2px
    style PB fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style RC fill:#fce7f3,stroke:#db2777,stroke-width:2px
    style RS fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px
    style RSF fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style MT fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

## Roles at a Glance

```mermaid
flowchart LR
    subgraph HUMAN_ROLE["🧑 HUMAN"]
        direction TB
        HR1["Provides requirements"]
        HR2["Reviews code"]
        HR3["Merges to main"]
        HR4["Has final release authority"]
    end

    subgraph AGENT_ROLE["🤖 AGENT"]
        direction TB
        AR1["Builds the requirement"]
        AR2["Runs ALL tests"]
        AR3["Fills release sign-off"]
        AR4["Says 'Ready to merge'"]
        AR5["Does NOT merge"]
    end

    HUMAN_ROLE ---|"Requirement"| AGENT_ROLE
    AGENT_ROLE ---|"Ready to merge"| HUMAN_ROLE

    style HUMAN_ROLE fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style AGENT_ROLE fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

## Test Gate Matrix

```mermaid
flowchart TD
    subgraph TESTS["All Test Gates — Must Pass"]
        direction TB
        G1["Lint — npm run lint"]
        G2["Unit — npm run test"]
        G3["E2E — npm run test:e2e"]
        G4["CWV — npm run test:cwv:all\nCLS ≤ 0.10 · LCP ≤ 2.5s · INP ≤ 200ms"]
        G5["SERP — Metadata · Schema · Indexability\nInternal Links · Intent Coverage"]
        G6["SEO P1–P5 — Title · Schema · Lighthouse\nAccessibility · Infra"]
        G7["ISS-001 — npm run test:iss001\n(when layout touched)"]
        G8["FAQ Guard — Schema matches visible content"]
    end

    G1 --> G2 --> G3 --> G4 --> G5 --> G6 --> G7 --> G8

    G8 -->|"All Pass ✅"| PASS["Proceed to LOG"]
    G8 -->|"Any Fail ❌"| FIX["Fix & Re-test"]
    FIX --> G1

    style TESTS fill:#fce7f3,stroke:#db2777,stroke-width:2px
    style PASS fill:#bbf7d0,stroke:#16a34a,stroke-width:2px
    style FIX fill:#fef2f2,stroke:#dc2626,stroke-width:2px
```

---

## ADMIN Override Flow

```mermaid
flowchart LR
    MSG["Message contains\nkeyword ADMIN"] --> SKIP["Skip FSM\nSkip tests\nSkip sign-off"]
    SKIP --> EXEC["Execute\nimmediately"]
    EXEC --> DONE["ADMIN ends\nwith message"]
    DONE --> NORMAL["Next message:\nnormal LAW applies"]

    style MSG fill:#fef2f2,stroke:#dc2626,stroke-width:2px
    style SKIP fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style EXEC fill:#fce7f3,stroke:#db2777,stroke-width:2px
    style DONE fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px
    style NORMAL fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

> **One-Line Intent:** Requirement comes in. Agent builds, tests, and logs. Human merges. ADMIN overrides everything.
