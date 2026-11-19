# ADR-0001: Reperto Phase 0 foundation

## Status
Accepted

## Decisions
- Next.js App Router with Server Components by default.
- Client Components only for theme state, current-path navigation and interactive primitives.
- Semantic HSL design tokens support light, dark and system themes from the first release.
- `next-themes` manages user preference and the root class.
- Responsive shell uses a desktop sidebar and mobile top/bottom navigation.
- Vitest, jsdom and Testing Library provide the initial unit-test foundation.
- Authentication, Supabase schema, chess logic and Stockfish remain outside Phase 0.
