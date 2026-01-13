Calculator Inventory & Status Disclosure
================================================
This documentation must acknowledge all calculator folders, even if they are not active in navigation.

Active Calculators (in navigation.json)
---------------------------------------
The following calculators are active and wired into the live UI:

| Folder | Name | Status |
|--------|------|--------|
| public/calculators/math/basic/ | Basic Calculator | Active |
| public/calculators/math/percentage-tools/ | Percentage Tools | Active |
| public/calculators/math/percentage-increase/ | Percentage Increase | Active |
| public/calculators/math/fraction-calculator/ | Fraction Calculator | Active |
| public/calculators/finance/credit-card-payoff/ | Credit Card Payoff | Active |

Math Calculators (Work-in-Progress / Legacy)
--------------------------------------------
The following folders exist under public/calculators/math/ but are not active:

| Folder | Status |
|--------|--------|
| basic-operations | Legacy (superseded by basic/) |

These calculators are currently:
    - Not active in navigation.json
    - Present in the repository but not wired into the live UI
    - Classified for documentation purposes as **Work-in-progress / unverified** and **not for production use** until explicitly reclassified by maintainers

Requirement:
    Documentation must explicitly state the status of such calculators:
        Legacy
        Work-in-progress
        Deprecated
        Silent omission is not allowed

A "complete understanding" document must reflect actual repository state, not just active UI elements.
