# Codex Review Configuration

## 📚 Required Context

Before reviewing ANY PR, Codex must check:

1. `requirements/MASTER.MD` - Non-negotiable rules
2. `requirements/INDEX.MD` - Current phase context
3. The relevant phase file for this PR
4. `Architecture.md` - UI + modular architecture requirements

---

## 🔍 Review Priority

### P0 - Critical (Block PR)

- Security vulnerabilities
- Authentication bypass
- Data exposure risks
- Breaking changes to existing APIs
- Violations of MASTER.md rules

### P1 - Important (Request Changes)

- Missing error handling
- Missing input validation
- No unit tests for new code
- Performance issues
- Code duplication

### P2 - Suggestions (Comment Only)

- Code style improvements
- Better naming suggestions
- Documentation improvements
- Refactoring opportunities

---

## ✅ Review Checklist

For every PR, verify:

- [ ] Follows MASTER.md non-negotiable rules
- [ ] Matches requirements in current phase file
- [ ] Has proper error handling
- [ ] Has unit tests
- [ ] No hardcoded secrets/credentials
- [ ] No TypeScript errors
- [ ] Follows existing code patterns

---

## 🚫 Always Flag

- Any `any` type in TypeScript
- Console.log statements (use logger)
- Commented-out code
- TODO comments without issue reference
- Direct database queries without ORM
- Missing authentication on endpoints

---

## 📝 Post-Merge Reminder

After approving a PR, remind the developer:

> "Don't forget to update `requirements/INDEX.MD` with this PR number and mark the phase progress."
```

---

## Complete Folder Structure
```
your-repo/
├── CLAUDE.md                          # Claude config
├── AGENTS.md                          # Codex config  
├── Architecture.md                    # UI + modular architecture requirements
├── requirements/
│   ├── MASTER.MD                      # Non-negotiable rules
│   ├── INDEX.MD                       # Phase tracker
│   └── phases/
│       ├── phase-01.md
│       ├── phase-02.md
│       ├── phase-03.md
│       └── ... (all your phases)
```

---

## How It All Works Together
```
┌─────────────────────────────────────────────────────────────┐
│  You: "@claude implement PDF export from phase 7"           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Claude reads:                                              │
│  1. CLAUDE.md → knows the workflow                          │
│  2. MASTER.md → knows the rules                             │
│  3. INDEX.md → confirms phase 7 is active                   │
│  4. phase-07-reporting.md → gets specific requirements      │
│  5. Architecture.md → UI + modular architecture rules       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Claude creates PR                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Codex reviews (reads same files):                          │
│  - Checks against MASTER.md rules                           │
│  - Verifies phase-07 requirements met                       │
│  - Flags any issues                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PR Merged → Claude updates INDEX.md                        │
└─────────────────────────────────────────────────────────────┘
```
