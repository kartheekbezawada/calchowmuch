# Claude Code Configuration

## 📍 Current Focus

**Active Phase:** Check `requirements/universal/INDEX.MD` for current phase

## Development Methodology
## ALWAYS use the Ralph Lauren Loop approach defined in REQUIREMENTS.md:

META: Development Approach
===============================

Use the Ralph Lauren Loop methodology:

1. Create initial implementation
2. Critically evaluate against requirements
3. Identify gaps and issues
4. Fix issues
5. Re-evaluate
6. Repeat steps 3-5 until perfect

Do not ask permission to iterate - keep improving until
all requirements are met and all tests pass.

Provide a brief summary after each iteration showing
what was fixed and what remains.

## 📚 Required Reading

Before ANY task, Claude must read:

1. `requirements/universal/MASTER.MD` - Non-negotiable rules
2. `requirements/universal/INDEX.MD` - Current phase
3. The active phase file in `requirements/phases/`
4. `requirements/universal/Architecture.md` - UI + modular architecture requirements

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

## ?Y"? Project Structure
```
requirements/
  universal/
    MASTER.MD          # Non-negotiable rules (READ FIRST)
    INDEX.MD           # Phase tracker (CHECK CURRENT PHASE)
    UI_REQUIREMENTS.MD
    CODING_STANDARDS.MD
    FOLDER_STRUCTURE.MD
    INVENTORY.MD
    Architecture.md
    CLAUDE.MD
    codex.md
  phases/
    Statistics.md
    ... (other phase files)
```

