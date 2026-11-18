Read reperto-plan.md completely before modifying the project.

Implement only Phase 0: Foundation. The project already uses Next.js 16, React 19, Tailwind CSS 4, shadcn with Base UI, the Nova preset, Lucide icons and Geist typography.

First inspect the generated files and create a concise implementation checklist. Then implement:

1. Reperto semantic design tokens for both light and dark themes.
2. A next-themes provider supporting Light, Dark and System.
3. Flash-free theme initialization and correct hydration handling.
4. Theme-color metadata for light and dark browser themes.
5. A responsive application shell:
   - desktop sidebar;
   - mobile top bar;
   - mobile bottom navigation.
6. Reusable page-header, empty-state, error-state and loading-skeleton components.
7. Route groups and base layouts for:
   - marketing;
   - authentication;
   - protected application pages.
8. Placeholder pages for dashboard, repertoires, train, progress and settings.
9. Vitest and Testing Library configuration with useful initial tests.
10. Required scripts for lint, typecheck, test and build.

Important constraints:

- Do not implement Supabase authentication yet.
- Do not create database tables or migrations yet.
- Do not implement the chessboard, Stockfish, repertoires or training logic.
- Use semantic CSS variables rather than raw light-only colors.
- Every component must work in Light, Dark and System modes.
- Preserve the Base UI and shadcn component architecture.
- Use strict TypeScript and accessible semantic markup.
- Keep server and client components separated appropriately.
- Do not add packages unless they are necessary for Phase 0.

At completion, run:
npm run lint
npm run typecheck
npm run test
npm run build

Fix every error before stopping. Then summarize changed files, tests, design decisions and remaining Phase 1 work.