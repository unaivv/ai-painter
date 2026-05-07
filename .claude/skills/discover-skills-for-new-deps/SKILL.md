# discover-skills-for-new-deps

Scan `package.json` for newly added or changed dependencies, search autoskills for matching skills, and install any relevant ones automatically.

## Trigger

Invoke this skill whenever:
- A new library or framework is installed (`npm install <pkg>`, `npm add`, `pnpm add`, etc.)
- `package.json` dependencies or devDependencies change
- The user says "install X", "add X library", "use X"

## Steps

1. **Read `package.json`** — capture the full `dependencies` and `devDependencies`
2. **Read `skills-lock.json`** (if it exists) — identifies already-installed skills
3. **For each new or unfamiliar dependency**, extract the core library name (strip `@types/`, scope prefixes, version ranges)
4. **Run `npx autoskills search <lib>`** for each candidate — collect any results not already in `skills-lock.json`
5. **If new skills are found**, run `npx autoskills` in the project root — let it detect technologies and install matching skills
6. **Update `skills-lock.json`** if autoskills doesn't do it automatically
7. **Report** which skills were installed and which libs had no matching skill

## Rules

- Never install skills that are already in `skills-lock.json`
- Only install skills that clearly match the added library — do not install unrelated skills
- If autoskills finds nothing for a lib, note it and move on — do not invent or hallucinate skills
- Keep this report short: one line per skill installed, one line per lib with no match

## Example output

```
New deps detected: zustand, react-query

Skills installed:
  ✔ wshobson/agents/state-management (zustand)
  ✔ vercel-labs/agent-skills/react-query-patterns (react-query)

No skills found for: react-query (already covered by react-best-practices)
```
