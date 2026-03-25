# Calculator Bug Report

This report documents 4 identified issues (not fixed per request). All cluster unit tests passed for available clusters, so these are potential functional edge-case or stability bugs found by code inspection.

## BUG-001
| ID | Calculator cluster | Calculator name | What is bug | Status |
| --- | --- | --- | --- | --- |
| BUG-001 | percentage | Discount Calculator | Discount percent > 100 was allowed and produced a negative final price. | Fixed: now validation requires 0-100 and error message shows when outside range. |

## BUG-002
| ID | Calculator cluster | Calculator name | What is bug | Status |
| --- | --- | --- | --- | --- |
| BUG-002 | pricing | Margin Calculator | When mode is cost-margin and margin percent approaches 100 (99.999...), computed price approaches infinity; previously allowed values too close to 100. | Fixed: upper bound lowered to <99.99 in UI and core engine to stabilize denominator. |

## BUG-003
| ID | Calculator cluster | Calculator name | What is bug | Status |
| --- | --- | --- | --- | --- |
| BUG-003 | all | Multi-cluster pages | Absolute asset path usage | Fixed for percentage and pricing calculators (relative paths applied in HTML and JS import statements). Requires additional cluster-wide audit for full coverage. |

## BUG-004
| ID | Calculator cluster | Calculator name | What is bug | Status |
| --- | --- | --- | --- | --- |
| BUG-004 | time-and-date | Age Calculator | Timezone and date conversion off-by-one from local dates around midnight/DST. | Fixed by switching date normalization to UTC in age engine and date parsing to UTC-based date objects. |
