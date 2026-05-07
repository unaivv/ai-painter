# AI Painter — Coding Standards

## Architecture

- **Screaming Architecture**: folder names reveal features, not frameworks
- **Hexagonal**: domain logic lives in `src/domain/`, adapters in `src/infrastructure/`
- **Atomic Design**: `atoms/` → `molecules/` → `organisms/` → `templates/` → `pages/`
- **Container / Presentational**: containers manage state/logic, presentational components are pure UI

```
src/
  domain/          # Pure business logic, no framework dependencies
  infrastructure/  # Adapters: API clients, storage, external services
  ui/
    atoms/
    molecules/
    organisms/
    templates/
    pages/
  hooks/           # Shared custom hooks
  store/           # Global state (if needed)
```

## TypeScript

- Strict mode enabled — no `any`, no `@ts-ignore`
- Prefer `type` over `interface` for data shapes; use `interface` only for extendable contracts
- Explicit return types on all public functions
- Avoid enums — use `const` objects with `as const`

## React

- Functional components only — no class components
- Props destructured in the signature
- No default exports for components — named exports only
- Co-locate state as low as possible; lift only when needed
- Avoid `useEffect` for derived state — compute it inline

## Naming

- Components: `PascalCase`
- Files: `kebab-case` for non-components, `PascalCase.tsx` for components
- Hooks: `useCamelCase`
- Types/interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`

## Code Quality

- No comments describing WHAT — code is self-documenting
- One comment max per non-obvious WHY
- Functions ≤ 20 lines; extract if longer
- No magic numbers — extract to named constants
- Early returns over nested conditionals

## Imports

- Absolute imports via `@/` alias
- No barrel files (`index.ts` re-exports) unless for public API boundaries
- Group: external → internal → relative, separated by blank lines

## Testing

- Tests live next to source: `ComponentName.test.tsx`
- Unit tests for domain logic
- Integration tests for containers
- No mocking of internal modules — mock only at boundaries (API, storage)

## Styling

- CSS Modules or Tailwind — no inline styles, no global CSS overrides
- BEM naming if using CSS Modules

## Git

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
- No "Co-Authored-By" or AI attribution lines
- No `--no-verify` bypasses
