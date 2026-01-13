# Claude Code Configuration

## 📍 Current Focus

**Active Phase:** Check `requirements/INDEX.MD` for current phase

## Development Methodology
## ALWAYS use the Ralph Lauren Loop approach defined in REQUIREMENTS.md:
1. Implement
2. Self-review against checklist
3. Fix issues
4. Re-test
5. Iterate until perfect

## 📚 Required Reading

Before ANY task, Claude must read:

1. `requirements/MASTER.MD` - Non-negotiable rules
2. `requirements/INDEX.MD` - Current phase
3. The active phase file in `requirements/phases/`
4. `Architecture.md` - UI + modular architecture requirements

---

## 🔄 Workflow

1. Read MASTER.MD rules (every time)
2. Check INDEX.MD for current phase
3. Read the active phase requirements
4. Implement the task
5. Create PR
6. After merge, update INDEX.MD

---

## ✅ After PR Merge

When a PR is merged, always:
```
1. Update INDEX.MD:
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

- Skip reading MASTER.MD
- Violate non-negotiable rules
- Work on future phases without approval
- Forget to update INDEX.MD after merge

---

## 📁 Project Structure
```
requirements/
├── MASTER.MD          # Non-negotiable rules (READ FIRST)
├── INDEX.MD           # Phase tracker (CHECK CURRENT PHASE)
└── phases/            # Individual phase requirements
    ├── phase-01-*.md
    ├── phase-02-*.md
    └── ...
```
