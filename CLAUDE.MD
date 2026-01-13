# Claude Code Configuration

## 📍 Current Focus

**Active Phase:** Check `docs/requirements/INDEX.md` for current phase

## Development Methodology
## ALWAYS use the Ralph Lauren Loop approach defined in REQUIREMENTS.md:
1. Implement
2. Self-review against checklist
3. Fix issues
4. Re-test
5. Iterate until perfect

## 📚 Required Reading

Before ANY task, Claude must read:

1. `docs/requirements/MASTER.md` - Non-negotiable rules
2. `docs/requirements/INDEX.md` - Current phase
3. The active phase file in `docs/requirements/phases/`

---

## 🔄 Workflow

1. Read MASTER.md rules (every time)
2. Check INDEX.md for current phase
3. Read the active phase requirements
4. Implement the task
5. Create PR
6. After merge, update INDEX.md

---

## ✅ After PR Merge

When a PR is merged, always:
```
1. Update INDEX.md:
   - Mark phase as ✅ Done
   - Set progress to 100%
   - Add PR number
   - Update current phase pointer
   - Update last updated date

2. Update phase file:
   - Mark completed tasks with ✅
   - Add PR number to tasks
```

---

## 🚫 Never

- Skip reading MASTER.md
- Violate non-negotiable rules
- Work on future phases without approval
- Forget to update INDEX.md after merge

---

## 📁 Project Structure
```
docs/requirements/
├── MASTER.md          # Non-negotiable rules (READ FIRST)
├── INDEX.md           # Phase tracker (CHECK CURRENT PHASE)
└── phases/            # Individual phase requirements
    ├── phase-01-*.md
    ├── phase-02-*.md
    └── ...
```