
Coding Standards (Corrected for HTML/CSS/JS) NON-NEGOTIABLE 
===================================================
    
    JavaScript Standards (MUST FOLLOW)
    ===================================
    Use plain JavaScript (no TypeScript assumptions).
    No duplicated utility logic across calculators.
    All user input must be validated (including divide-by-zero and empty inputs).
    All calculator compute functions must handle errors safely:
        return clear error state or message
        never throw unhandled exceptions in the browser

    Avoid global variables; scope code to modules.
    Keep calculator-specific logic inside its module.js.

    HTML Standards (MUST FOLLOW)
    =================================
    Each calculator page must include:
        unique <title>
        unique meta description
        one <h1>
    Explanation content must be present as HTML (static).
    Use semantic headings (H2/H3) inside explanation pane.
    Forms/inputs must have labels.

    CSS Standards (MUST FOLLOW)
    ============================
    Layout CSS belongs in shared layout stylesheet(s).
    Calculator UI styling belongs in shared calculator stylesheet(s).
    Avoid inline styles in calculator HTML.
    Do not duplicate CSS rules across calculator folders.
    Default calculator input and button sizing must be defined in shared calculator styles and reused across calculators.

    Testing Standards (MUST FOLLOW)
    =================================
    All new calculator logic must have unit tests.
    Minimum 80% coverage for new compute logic.
