# Reperto: Application Implementation Plan

> **Purpose:** This document is the authoritative implementation brief for GitHub Copilot. Build the application incrementally, respect the phase boundaries, and do not introduce deferred features unless explicitly requested.
>
> **Product name:** Reperto  
> **Tagline:** Build your repertoire. Understand every move.  
> **Primary stack:** Next.js, TypeScript, Vercel, Supabase, PostgreSQL, Tailwind CSS, shadcn/ui, chess.js, Stockfish WebAssembly  
> **Primary product loop:** Build repertoire → train due positions → review mistakes → improve retention

---

## 1. Copilot operating instructions

When implementing Reperto:

1. Read this entire plan before changing code.
2. Implement one phase and one logical unit at a time.
3. Before coding, inspect the existing repository and reuse established conventions.
4. Do not replace working architecture without a documented reason.
5. Do not add packages when the platform or an existing dependency already provides the capability.
6. Keep chess rules, persistence, UI state, engine analysis and scheduling in separate modules.
7. Use strict TypeScript. Do not introduce `any` unless a third-party boundary makes it unavoidable and the reason is documented.
8. Validate untrusted data with Zod at every server boundary.
9. Treat Supabase Row Level Security as the security boundary. Frontend filtering is not authorization.
10. Never expose the Supabase secret or legacy `service_role` key to the browser.
11. Use database migrations for every schema, function, policy and grant change.
12. Add or update tests with each feature.
13. Prefer Server Components for initial reads and Client Components only where interaction requires them.
14. Keep Stockfish in a Web Worker. Never run analysis on the main UI thread.
15. Do not silently accept engine moves as repertoire moves.
16. Do not simulate production data unless a seed or fixture is explicitly marked as synthetic.
17. Ensure every implemented page has loading, empty, success and error states.
18. Ensure core workflows remain usable at 320 px width and with keyboard navigation.
19. Run lint, type-check, unit tests and production build before marking a task complete.
20. At the end of each implementation task, summarize changed files, migrations, tests and any remaining risks.

---

## 2. Product definition

Reperto is a modern chess-learning application focused first on opening repertoire creation and spaced-repetition training. It will later support puzzles, imported-game comparison and deeper analysis.

### 2.1 Target user

An improving chess player who:

- has an approximate online rating between 800 and 1800;
- knows some opening moves but forgets variations under time pressure;
- wants to build a personal repertoire rather than memorize every theoretical line;
- needs explanations and structured review, not only engine evaluations;
- may import PGN games from Chess.com, Lichess or another source later.

### 2.2 MVP outcome

A user must be able to:

1. Register and sign in.
2. Create a repertoire for White, Black or both.
3. Build opening variations by moving pieces on a chessboard.
4. Mark positions as trainable.
5. Generate training cards from those positions.
6. Practise cards due for review.
7. Receive precise feedback about repertoire membership and correctness.
8. Grade recall as Again, Hard, Good or Easy.
9. Return later and receive cards according to the scheduling algorithm.
10. View progress and recurring mistakes.

### 2.3 Explicitly deferred from MVP

- Multiplayer chess
- Social feeds, followers or public comments
- Coach and classroom management
- Payments and subscriptions
- Native mobile applications
- Automatic Chess.com or Lichess synchronization
- Full server-side batch analysis
- AI-generated explanations
- Endgame tablebases
- Complete public opening explorer
- Puzzle rating system

---

## 3. Technical architecture

### 3.1 Application stack

- **Framework:** Next.js App Router
- **Language:** TypeScript with strict mode
- **UI:** React, Tailwind CSS and shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod resolvers
- **Validation:** Zod
- **Chess rules:** chess.js
- **Chessboard:** a maintained React board library, initially evaluate `react-chessboard`
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth with cookie-based server-side sessions
- **Data access:** `@supabase/ssr` and `@supabase/supabase-js`
- **Hosting:** Vercel
- **Engine:** Stockfish WebAssembly in a Web Worker
- **Testing:** Vitest, Testing Library, Playwright and Supabase database tests
- **Monitoring, later:** Sentry
- **Product analytics, later:** PostHog with privacy-conscious events

### 3.2 Architecture boundaries

Use the following boundaries:

- **UI components:** presentation and interaction only
- **Feature services:** application workflows
- **Chess domain:** legal moves, positions, notation and tree operations
- **Training domain:** card creation, grading and scheduling
- **Engine adapter:** UCI communication and parsed analysis results
- **Repositories:** database reads and writes
- **Server boundaries:** authentication, validation and authorization context

React components must not:

- construct raw SQL;
- send raw UCI commands;
- implement scheduling formulas;
- infer data ownership;
- contain PGN parsing rules beyond invoking a domain service.

### 3.3 Recommended repository structure

```text
reperto/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── callback/route.ts
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── repertoires/page.tsx
│   │   ├── repertoires/new/page.tsx
│   │   ├── repertoires/[repertoireId]/page.tsx
│   │   ├── train/page.tsx
│   │   ├── train/[sessionId]/page.tsx
│   │   ├── progress/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── health/route.ts
│   │   └── pgn/route.ts
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
├── components/
│   ├── chess/
│   ├── layout/
│   ├── repertoire/
│   ├── training/
│   └── ui/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── repertoires/
│   ├── training/
│   └── engine/
├── lib/
│   ├── chess/
│   ├── engine/
│   ├── supabase/
│   ├── validation/
│   └── utils/
├── public/
│   └── stockfish/
├── supabase/
│   ├── migrations/
│   ├── tests/
│   └── seed.sql
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
├── middleware.ts
├── .env.example
└── package.json
```

Feature folders may contain `actions.ts`, `queries.ts`, `schemas.ts`, `types.ts`, `service.ts` and tests. Avoid generic `helpers.ts` files containing unrelated behavior.

---

## 4. Visual design system

### 4.1 Design direction

Reperto should feel warm, editorial, focused and modern. Take inspiration from the color language and restrained visual hierarchy associated with Claude, but do not copy Claude's interface, wordmark, icons, layouts or proprietary assets.

The visual identity must combine:

- warm ivory canvases rather than cold white;
- near-black ink for primary text;
- muted clay-orange as the primary accent;
- subtle sage and sky accents for semantic states;
- low-contrast layered surfaces;
- generous spacing;
- rounded but not excessively bubbly components;
- minimal shadows;
- typography that feels thoughtful and readable;
- chess-specific visual language that is original to Reperto.

### 4.2 Core color tokens

Use semantic CSS variables. Do not use raw hex values directly in components.

#### Light theme

```css
:root {
  --background: 48 33% 97%;          /* #FAF9F5 */
  --foreground: 60 2% 8%;            /* #141413 */

  --surface-1: 48 25% 98%;
  --surface-2: 45 20% 95%;           /* near #F0EEE6 */
  --surface-3: 44 18% 90%;           /* near #E8E6DC */

  --card: 48 25% 98%;
  --card-foreground: 60 2% 8%;
  --popover: 48 25% 98%;
  --popover-foreground: 60 2% 8%;

  --primary: 15 63% 60%;             /* clay #D97757 */
  --primary-hover: 15 52% 51%;       /* deeper clay near #C6613F */
  --primary-foreground: 48 33% 97%;

  --secondary: 45 15% 91%;
  --secondary-foreground: 60 2% 8%;

  --muted: 45 14% 92%;
  --muted-foreground: 48 5% 45%;

  --accent: 37 70% 87%;              /* warm manila */
  --accent-foreground: 60 2% 8%;

  --info: 210 45% 61%;               /* muted sky #6A9BCC */
  --success: 82 20% 46%;             /* muted olive #788C5D */
  --warning: 37 70% 60%;
  --destructive: 4 55% 50%;

  --border: 45 14% 86%;
  --input: 45 14% 86%;
  --ring: 15 63% 60%;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}
```

#### Dark theme

```css
.dark {
  --background: 0 0% 6%;
  --foreground: 48 33% 97%;

  --surface-1: 0 0% 8%;
  --surface-2: 0 0% 11%;
  --surface-3: 45 3% 15%;

  --card: 0 0% 8%;
  --card-foreground: 48 33% 97%;
  --popover: 0 0% 10%;
  --popover-foreground: 48 33% 97%;

  --primary: 15 63% 60%;
  --primary-hover: 15 68% 65%;
  --primary-foreground: 0 0% 6%;

  --secondary: 45 3% 15%;
  --secondary-foreground: 48 33% 97%;

  --muted: 45 3% 15%;
  --muted-foreground: 48 6% 68%;

  --accent: 15 22% 20%;
  --accent-foreground: 48 33% 97%;

  --info: 210 45% 61%;
  --success: 82 20% 52%;
  --warning: 37 70% 60%;
  --destructive: 4 62% 58%;

  --border: 45 3% 20%;
  --input: 45 3% 20%;
  --ring: 15 63% 60%;
}
```

Before release, test all text/background combinations against WCAG 2.2 AA. Do not use clay orange with white text for small text unless the measured contrast passes. Prefer near-black text on clay for smaller primary buttons when required.

### 4.3 Chessboard palette

The board must harmonize with the application rather than use generic bright green.

Recommended light board:

- Light square: `#E8E3D7`
- Dark square: `#9A8F7A`
- Selected square: `#D97757`
- Legal move marker: `rgba(20,20,19,0.20)`
- Last move: `rgba(217,119,87,0.30)`
- Check highlight: `rgba(184,65,58,0.55)`

Recommended dark board:

- Light square: `#B9B1A2`
- Dark square: `#5E5A50`
- Selected square: `#D97757`
- Last move: `rgba(217,119,87,0.38)`

Use a clean, readable piece set with clear silhouettes. Do not replace chess symbols with novelty icons.

### 4.4 Typography

Avoid relying on proprietary Anthropic fonts.

Recommended open-source stack:

- **Interface and headings:** Inter or Geist Sans
- **Editorial display moments:** Source Serif 4 or Lora
- **Moves, FEN, PGN and statistics:** Geist Mono or JetBrains Mono

Usage:

- Page titles: sans-serif, 32–44 px desktop, 28–34 px mobile, weight 550–650
- Section titles: sans-serif, 20–28 px
- Body: sans-serif, 15–17 px, line-height 1.55–1.7
- Editorial marketing copy: serif may be used selectively
- Move notation: monospace, tabular numbers where relevant
- Eyebrows and labels: 11–12 px, medium weight, modest letter spacing

Do not make the entire application serif. Reperto is an interactive tool, not a magazine.

### 4.5 Spacing and shape

Use an 8 px base rhythm with 4 px for fine adjustments.

- Dense control gap: 8 px
- Standard component gap: 12–16 px
- Card padding: 16–24 px
- Section gap: 32–48 px
- Page padding: 16 px mobile, 24 px tablet, 32 px desktop
- Maximum reading width: 720 px
- Maximum application width: 1600 px

Radii:

- Inputs and compact buttons: 8–10 px
- Cards and panels: 14–18 px
- Large marketing surfaces: 20–28 px
- Pills only for tags and compact filters

### 4.6 Shadows and borders

Prefer tonal layering over heavy shadows.

- Use 1 px warm-gray borders.
- Use subtle shadows only for floating menus, dialogs and elevated overlays.
- Avoid generic `shadow-xl` on ordinary cards.
- Never use glassmorphism as the default visual language.
- Avoid gradients except for extremely subtle decorative backgrounds on the landing page.

### 4.7 Motion

- Standard transition: 140–200 ms
- Panel expansion: 200–280 ms
- Use ease-out for entry and ease-in for exit
- Respect `prefers-reduced-motion`
- Never animate the chessboard in a way that delays input
- Use restrained move animation, approximately 120–180 ms
- Provide immediate feedback before secondary animation

---

## 5. Navigation and responsive layout

### 5.1 Desktop shell

Use a left sidebar approximately 240–272 px wide containing:

- Reperto wordmark
- Dashboard
- Repertoires
- Train
- Progress
- Later: Games and Puzzles
- Bottom area: theme switcher, settings and user menu

The active item uses a warm surface and a small clay indicator rather than a fully saturated navigation block.

### 5.2 Mobile shell

- Compact top bar with Reperto wordmark and contextual action
- Bottom navigation for Dashboard, Repertoires, Train and Progress
- User/settings actions in a sheet
- During training, minimize navigation and prioritize the board
- During editing, show board first and the move tree in a tabbed or resizable lower sheet

### 5.3 Page hierarchy

Every application page should use:

1. Breadcrumb or contextual back action when appropriate
2. Page title
3. One-sentence description if the purpose is not obvious
4. Primary action
5. Main content
6. Empty/error/loading state within the same structure

---

## 6. Core product pages

### 6.1 Marketing landing page

Sections:

1. Minimal navigation with sign-in and “Start building” CTA
2. Hero with product statement and an original Reperto board/training mockup
3. Three-step loop: Build, Train, Remember
4. Repertoire editor feature section
5. Training feedback feature section
6. Privacy and local-analysis statement
7. Final CTA
8. Footer with legal and Stockfish notices

The landing page should be elegant and restrained. Do not use a grid of 12 generic feature cards.

### 6.2 Authentication

Pages:

- Sign in
- Sign up
- Forgot password
- Reset password
- Email confirmation state

Use a centered panel, warm canvas and optional chess-position illustration. Authentication forms require visible labels, inline validation and generic credential errors that do not reveal whether an account exists.

### 6.3 Dashboard

Display:

- Greeting and next recommended action
- Due today card with prominent “Start training” action
- Repertoire overview
- Seven-day training activity
- Accuracy and response-time summary
- Difficult positions
- Recent repertoire edits

Empty dashboard state:

- Explain the product loop
- Offer “Create your first repertoire”
- Optionally provide two sample choices: White repertoire or Black response repertoire

### 6.4 Repertoire list

Each repertoire card shows:

- Name
- Side badge
- Opening or starting move summary
- Number of trainable positions
- Due cards
- Last edited timestamp
- Continue editing action
- Start training action
- Overflow menu for rename, duplicate, archive and delete

Support grid and compact list layouts only if both are genuinely useful. Start with one polished responsive layout.

### 6.5 Repertoire editor

Desktop composition:

- Chessboard: 48–56% of usable workspace
- Right workspace: move tree, comments and metadata
- Top toolbar: back, repertoire name, save state, board flip and menu
- Optional narrow evaluation rail added only in the Stockfish phase

Required behavior:

- Drag pieces or click source and destination squares
- Validate moves with chess.js
- Navigate forward/back through nodes
- Add new branches from any position
- Mark one child as main line
- Add comments to a move
- Mark a resulting position as trainable
- Delete a branch with descendant count warning
- Undo unsaved local edits where practical
- Autosave with states: Saving, Saved, Offline/Error
- Restore the selected node on refresh through URL or local state
- Show a transposition indicator for repeated normalized positions
- Provide keyboard navigation with Left/Right arrows when focus is not in an input

Move tree presentation:

- Main line reads naturally from left to right or top to bottom
- Variations are visually indented and collapsible
- Current node uses a clay highlight
- Trainable nodes have a subtle training icon
- Comments are visible without overwhelming notation
- Avoid a spreadsheet appearance

### 6.6 Trainer

Desktop:

- Board on the left
- Session context and feedback on the right

Mobile:

- Progress and concise prompt above board
- Board uses nearly full viewport width
- Feedback drawer below board
- Grade buttons remain reachable without covering the board

Training sequence:

1. Load the prompt FEN.
2. Orient the board from the trainee's side.
3. Play any required opponent setup move if the card design needs it.
4. Prompt the user to find the repertoire move.
5. Validate legality.
6. Compare UCI move to primary and accepted answers.
7. Give feedback.
8. Reveal explanation/comment when available.
9. Ask for Again, Hard, Good or Easy when the response is correct or revealed.
10. Save an immutable review record and updated card schedule transactionally.
11. Continue to the next card.

Feedback states:

- Correct repertoire move
- Accepted repertoire alternative
- Strong but not in your repertoire
- Legal but inaccurate
- Incorrect
- Illegal move
- Move revealed

Do not use only color to communicate these states.

### 6.7 Progress

Initial sections:

- Reviews completed
- Current due count
- Accuracy over seven and thirty days
- New, learning and mature cards
- Lapses
- Accuracy by repertoire
- Most failed positions
- Average response time

Charts must include accessible labels and text summaries. Do not create an opaque composite chess score in the MVP.

### 6.8 Settings

Sections:

- Profile
- Theme: system, light or dark
- Board orientation defaults
- Board coordinates and move animation
- Training defaults
- Privacy and data export
- Account deletion

---

## 7. Data model

Use `uuid` primary keys generated by PostgreSQL. Use `timestamptz` for all timestamps. Use `created_at` and `updated_at` consistently. Add appropriate indexes for foreign keys and due-date queries.

### 7.1 `profiles`

- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `username text unique null`
- `avatar_url text null`
- `preferred_language text not null default 'en'`
- `chess_rating integer null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- Rating, if present, between 100 and 4000
- Username normalized and length-limited

### 7.2 `repertoires`

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`
- `description text null`
- `side text not null check (side in ('white','black','both'))`
- `initial_fen text not null`
- `is_archived boolean not null default false`
- `is_public boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- `(user_id, updated_at desc)`
- `(user_id, is_archived)`

Do not implement public sharing in MVP even though `is_public` provides a future migration path.

### 7.3 `repertoire_nodes`

- `id uuid primary key`
- `repertoire_id uuid not null references repertoires(id) on delete cascade`
- `parent_node_id uuid null references repertoire_nodes(id) on delete cascade`
- `ply integer not null check (ply > 0)`
- `fen_before text not null`
- `move_uci text not null`
- `move_san text not null`
- `fen_after text not null`
- `position_key text not null`
- `comment text null`
- `nag integer null`
- `is_main_line boolean not null default false`
- `is_trainable boolean not null default true`
- `sort_order integer not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints and indexes:

- Unique `(repertoire_id, parent_node_id, move_uci)`, with a root-safe implementation for null parents
- Index `(repertoire_id, parent_node_id, sort_order)`
- Index `(repertoire_id, position_key)`
- Validate that a parent belongs to the same repertoire using a database trigger or controlled database function
- Enforce at most one main-line child per parent with a partial unique index where practical

### 7.4 `training_cards`

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `repertoire_id uuid not null references repertoires(id) on delete cascade`
- `node_id uuid not null references repertoire_nodes(id) on delete cascade`
- `prompt_fen text not null`
- `expected_move_uci text not null`
- `status text not null check (status in ('new','learning','review','relearning','suspended'))`
- `difficulty double precision not null`
- `stability double precision not null`
- `scheduled_days integer not null default 0`
- `due_at timestamptz not null default now()`
- `last_reviewed_at timestamptz null`
- `lapses integer not null default 0`
- `repetitions integer not null default 0`
- `scheduler_version text not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- `(user_id, status, due_at)`
- `(repertoire_id, due_at)`
- Unique `(user_id, node_id)` unless future card modes require otherwise

### 7.5 `training_card_moves`

- `card_id uuid references training_cards(id) on delete cascade`
- `node_id uuid references repertoire_nodes(id) on delete cascade`
- `move_uci text not null`
- `answer_type text not null check (answer_type in ('primary','accepted','alternative'))`
- Primary key `(card_id, move_uci)`

### 7.6 `training_sessions`

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `repertoire_id uuid null references repertoires(id) on delete set null`
- `mode text not null check (mode in ('due','new','mistakes','opening','custom'))`
- `started_at timestamptz not null default now()`
- `completed_at timestamptz null`
- `cards_planned integer not null`
- `cards_completed integer not null default 0`
- `correct_answers integer not null default 0`
- `settings jsonb not null default '{}'::jsonb`

### 7.7 `training_reviews`

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `card_id uuid not null references training_cards(id) on delete cascade`
- `session_id uuid not null references training_sessions(id) on delete cascade`
- `attempted_move_uci text null`
- `result text not null`
- `rating integer not null check (rating between 1 and 4)`
- `response_time_ms integer null check (response_time_ms >= 0)`
- `previous_due_at timestamptz not null`
- `next_due_at timestamptz not null`
- `previous_state jsonb not null`
- `next_state jsonb not null`
- `engine_evaluation_before integer null`
- `engine_evaluation_after integer null`
- `created_at timestamptz not null default now()`

Reviews are immutable audit records. Never update old reviews to reflect a changed scheduler.

### 7.8 Future tables

Create only in their implementation phase:

- `openings`
- `games`
- `game_moves`
- `analysis_jobs`
- `puzzles`
- `puzzle_themes`
- `puzzle_attempts`

---

## 8. Position and move representation

### 8.1 Canonical formats

- Store positions as FEN.
- Store moves canonically as UCI.
- Store SAN as display data and regenerate or verify it during writes.
- Import/export collections as PGN.

### 8.2 Position key

Create a tested `createPositionKey(fen)` utility.

For opening transposition detection, include:

- piece placement;
- side to move;
- castling availability;
- en passant target only when it creates a legally relevant distinction.

Exclude:

- halfmove clock;
- fullmove number.

Document the exact normalization algorithm and add unit tests for castling rights, en passant and equivalent positions.

### 8.3 Repertoire tree strategy

The MVP stores a move tree, not a fully merged graph.

When duplicate position keys exist:

- show a transposition indicator;
- link to other occurrences;
- do not automatically merge children, comments or training state;
- preserve each line's pedagogical context.

---

## 9. Supabase security model

### 9.1 Project settings

- Enable Data API
- Do not grant API access to new tables automatically
- Enable RLS on new tables automatically

### 9.2 Keys

Browser-accessible:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only if eventually needed:

- `SUPABASE_SECRET_KEY`

Never name a secret variable with the `NEXT_PUBLIC_` prefix.

### 9.3 Grants and RLS

For every exposed table:

1. Revoke unnecessary default privileges.
2. Grant only required operations to `authenticated`.
3. Grant nothing to `anon` unless the product explicitly requires public reads.
4. Enable RLS.
5. Add operation-specific policies.
6. Add database tests verifying allowed and denied scenarios.

Directly owned tables use `user_id = auth.uid()`.

Child tables such as `repertoire_nodes` must authorize through their parent repertoire using `exists` checks. Do not duplicate user ownership merely to avoid writing a correct policy unless there is a measured performance need.

### 9.4 Required RLS tests

For each user-owned resource, verify:

- anonymous read denied;
- anonymous write denied;
- owner select allowed;
- owner insert allowed;
- owner update allowed;
- owner delete allowed;
- other user select denied;
- other user update denied;
- other user delete denied;
- child insertion into another user's parent denied;
- changing ownership through update denied.

### 9.5 Database functions

Use a database function only when an operation must be transactional or difficult to secure as multiple client calls, for example:

- saving a training review and rescheduling its card;
- setting one main line while clearing siblings;
- deleting and reconciling a repertoire branch;
- regenerating cards after a repertoire change.

Use `security invoker` by default. If `security definer` is unavoidable, set a safe `search_path`, validate ownership explicitly and revoke public execution.

---

## 10. Authentication

Implement:

- email and password registration;
- sign-in;
- sign-out;
- email confirmation if enabled;
- password reset;
- secure server-side session refresh;
- protected application routes.

Create a profile row from an authenticated onboarding operation or a carefully tested database trigger.

Requirements:

- redirect signed-in users away from auth pages;
- redirect signed-out users to sign-in with a safe return path;
- avoid open redirects;
- do not disclose whether an email exists during password reset;
- clear user-specific query caches after sign-out.

---

## 11. Repertoire editor implementation

### 11.1 State model

Maintain separate state for:

- persisted repertoire tree;
- current selected node/path;
- chess.js game instance for current position;
- optimistic mutation status;
- unsaved comment draft;
- UI preferences such as orientation and collapsed branches.

Do not use the rendered board as the source of truth. The source of truth is the selected persisted position plus controlled local moves.

### 11.2 Create move workflow

1. User makes a legal move.
2. Convert move to UCI and SAN.
3. Calculate `fen_before`, `fen_after`, `ply` and normalized `position_key`.
4. Check whether the same move already exists beneath the current parent.
5. If it exists, navigate to it instead of creating a duplicate.
6. Otherwise optimistically add the node.
7. Execute a validated server mutation.
8. Reconcile returned canonical data.
9. Roll back and show a useful error if the mutation fails.

### 11.3 Delete branch workflow

- Calculate descendant count.
- Warn clearly that descendants and associated cards will be removed.
- Require explicit confirmation.
- Delete through one server-side operation.
- Move selection to the parent after success.
- Refresh card and due counts.

### 11.4 Autosave

Autosave comments with a debounce around 600–900 ms. Structural moves should save immediately. Show persistent status near the title:

- Saving…
- Saved
- Could not save

Do not claim “Saved” until the server confirms persistence.

---

## 12. Training and spaced repetition

### 12.1 Card generation

Generate one card for each trainable repertoire decision where the user is expected to move.

Examples:

- White repertoire: usually train positions where White is to move.
- Black repertoire: usually train positions where Black is to move.
- Both: card creation follows an explicit per-node trainable flag.

A card must be reconciled when:

- its repertoire node is created;
- `is_trainable` changes;
- the expected move changes;
- its branch is deleted;
- the repertoire side changes.

### 12.2 Scheduler interface

Implement scheduling behind an interface:

```ts
interface Scheduler {
  version: string;
  review(input: ReviewInput): ReviewResult;
  initialize(now: Date): CardSchedule;
}
```

Use an FSRS-compatible implementation where practical. Persist `scheduler_version` and enough before/after state to audit and migrate schedules.

### 12.3 Ratings

Use four explicit ratings:

- **Again (1):** failed recall or revealed answer
- **Hard (2):** correct with major hesitation or after a weak first attempt
- **Good (3):** correct with normal effort
- **Easy (4):** immediate confident recall

The application may preselect a rating based on response, but the user should understand the effect before submission.

### 12.4 Transactional review

Saving a review must atomically:

1. Verify the authenticated user owns the card.
2. Read the current schedule.
3. Calculate the next schedule.
4. Insert the immutable review.
5. Update the card.
6. Update session counters.
7. Return the next state.

Prevent duplicate submissions using an idempotency key or client review identifier.

### 12.5 Due query

Default order:

1. Overdue learning/relearning cards
2. Other overdue review cards
3. Due-now cards
4. New cards, limited by session settings

Avoid selecting an unlimited number of cards into memory. Plan a session with a bounded number, initially 10–20.

---

## 13. Stockfish integration phase

### 13.1 Engine boundary

Create an adapter such as:

```ts
interface ChessEngine {
  initialize(): Promise<void>;
  analysePosition(fen: string, options: AnalysisOptions): Promise<AnalysisResult>;
  evaluateMove(fen: string, moveUci: string, options: AnalysisOptions): Promise<MoveEvaluation>;
  stop(): void;
  dispose(): void;
}
```

The adapter owns all UCI strings and parsing.

### 13.2 Worker behavior

- Run Stockfish inside a dedicated Web Worker.
- Use one worker per active analysis surface, not per component render.
- Cancel obsolete analysis when FEN changes.
- Ignore late messages from cancelled request IDs.
- Surface initialization and unsupported-browser errors.
- Provide a single-threaded fallback.
- Use device-aware hash settings.

Initial limits:

- Immediate feedback: 300–800 ms
- Deliberate analysis: 2–5 seconds
- `MultiPV = 3`
- 32–64 MB hash mobile
- 64–128 MB hash desktop

### 13.3 Classification

Results must distinguish:

- repertoire membership;
- engine quality;
- legality.

A move can be “strong but not in your repertoire.” Never label that simply wrong.

Treat initial centipawn thresholds as configurable:

- `< 20`: best/excellent
- `20–50`: good
- `50–100`: inaccuracy
- `100–200`: mistake
- `> 200`: blunder

Also account for mate scores, MultiPV equivalence and changes in winning probability.

### 13.4 Licensing

Before deploying Stockfish assets:

- include GPLv3 license text;
- include Stockfish copyright notices;
- preserve the exact source and build information corresponding to the distributed build;
- expose notices from an About or Licenses page;
- keep Stockfish as a separated engine component communicating through UCI.

---

## 14. Accessibility requirements

Target WCAG 2.2 AA.

Required:

- Complete keyboard navigation
- Visible focus styles
- Minimum 44 × 44 px touch targets for primary mobile controls
- Labels for every input
- No state communicated by color alone
- Accessible dialog titles and descriptions
- Semantic headings
- `aria-live` for move feedback and save status
- Reduced-motion support
- Text alternatives for charts
- Sufficient contrast in both themes
- Board interaction alternative through move input or accessible square controls where feasible

For the chessboard, announce:

- selected square;
- moved piece and destination;
- illegal move;
- check or game-ending state;
- training answer result.

---

## 15. Performance requirements

Initial targets:

- Lighthouse performance at least 90 on marketing and authentication pages under normal test conditions
- Avoid loading Stockfish on pages that do not use it
- Lazy-load chessboard and engine code where appropriate
- Keep initial application JavaScript reasonable and inspect bundle output
- Use Server Components for non-interactive reads
- Paginate or virtualize large repertoire trees if profiling shows a need
- Use indexes for due-card and ownership queries
- Debounce only text edits, not chess moves
- Cache static opening reference data later, not private mutable user data indiscriminately

---

## 16. Error and empty states

Every major feature must define:

- loading skeleton;
- empty state;
- validation error;
- authorization/not-found state;
- transient server error with retry;
- destructive confirmation;
- offline or failed-save status where relevant.

Examples:

- No repertoires: “Create your first repertoire” with a concise explanation.
- No due cards: show next due time and optional new-card practice.
- Failed engine initialization: continue repertoire training without engine validation.
- Invalid PGN later: show the line/token that could not be parsed when safely available.

Do not show raw PostgreSQL, Supabase or UCI error messages to users.

---

## 17. Testing strategy

### 17.1 Unit tests

Test:

- FEN validation
- position-key normalization
- UCI/SAN conversion
- legal move handling
- castling, en passant and promotion
- repertoire tree insertion/navigation
- scheduler behavior
- UCI output parsing
- move classification
- Zod schemas

### 17.2 Database tests

Test all grants, policies and transactional functions with at least two users and anonymous context.

### 17.3 Integration tests

Test:

- create repertoire and branch;
- generate cards from trainable nodes;
- complete a review;
- reschedule card;
- delete a branch and reconcile cards;
- mark a move as the main line;
- authentication callback and protected route behavior.

### 17.4 Playwright journeys

1. Sign up or use a test account.
2. Sign in.
3. Create a White repertoire.
4. Add a main line and a variation.
5. Add a comment and mark a position trainable.
6. Refresh and reopen the exact position.
7. Start training.
8. Submit a correct move.
9. Submit an incorrect move.
10. Grade a review.
11. Complete the session.
12. Verify dashboard counts.
13. Verify another user cannot access the repertoire by URL.
14. Verify mobile trainer layout.

---

## 18. Observability and privacy

When monitoring is added, capture:

- unhandled client errors;
- route failures;
- authentication callback failures;
- database function failures;
- Stockfish initialization failures;
- PGN parser failures;
- analysis timeouts.

Never send:

- access or refresh tokens;
- authorization headers;
- secret keys;
- password fields;
- complete private PGNs by default;
- arbitrary repertoire comments without explicit diagnostic consent.

Product analytics events may include:

- `repertoire_created`
- `repertoire_node_added`
- `training_started`
- `training_answered`
- `training_completed`
- `engine_analysis_started`

PostgreSQL remains the authoritative source for review history and user progress.

---

## 19. Delivery phases

### Phase 0: Foundation

Deliver:

- Next.js TypeScript project
- Tailwind and shadcn/ui foundations
- design tokens and themes
- Vercel project integration
- Supabase local and remote setup
- environment template
- lint, type-check, tests and build scripts
- CI workflow
- route groups and application shell
- architecture decision records

Exit criteria:

- production build succeeds;
- pull requests receive preview deployments;
- environment secrets are correctly separated;
- light and dark themes work;
- shell is responsive at 320 px.

### Phase 1: Authentication and secure data foundation

Deliver:

- auth flows;
- server-side session handling;
- protected routes;
- profile migration;
- repository migrations for repertoires and nodes;
- explicit grants and RLS policies;
- database policy tests.

Exit criteria:

- User A cannot access User B's records;
- anonymous access is denied;
- sessions survive refresh;
- sign-out clears protected state.

### Phase 2: Chessboard foundation

Deliver:

- interactive board;
- legal move validation;
- FEN loading;
- SAN/UCI conversion;
- promotion UI;
- move history;
- board flipping;
- draw/checkmate state;
- chess utility tests.

Exit criteria:

- all special moves work;
- illegal moves never mutate state;
- board is keyboard and mobile usable.

### Phase 3: Repertoire editor

Deliver:

- repertoire CRUD;
- persistent move tree;
- variation creation and navigation;
- main line;
- comments;
- trainable flag;
- deletion;
- autosave;
- transposition indicator;
- basic PGN export.

Exit criteria:

- complex variations persist after refresh;
- duplicate child moves are rejected;
- selected position can be restored;
- RLS isolation remains intact.

### Phase 4: Training MVP

Deliver:

- training-card generation;
- scheduler abstraction;
- due query;
- training sessions;
- move assessment;
- review transaction;
- session summary;
- progress dashboard.

Exit criteria:

- the complete Build → Train → Review loop works;
- failures return sooner than successes;
- immutable review history exists;
- duplicate review submissions are prevented.

### Phase 5: Stockfish

Deliver:

- Worker adapter;
- UCI parser;
- MultiPV;
- cancellation;
- engine feedback for non-repertoire moves;
- graceful fallback;
- licensing notices.

Exit criteria:

- engine does not block UI;
- obsolete results are discarded;
- strong non-repertoire moves are labelled correctly.

### Phase 6: Games and repertoire comparison

Deliver later:

- PGN import;
- game replay;
- opening identification;
- first deviation detection;
- exercise generation from deviations.

### Phase 7: Puzzles

Deliver later:

- puzzle player;
- themes;
- attempts;
- personal puzzles from mistakes.

---

## 20. Initial implementation backlog

### Milestone A: Repository and visual foundation

- [ ] Create Next.js App Router project with strict TypeScript
- [ ] Configure ESLint and formatting
- [ ] Install Tailwind and shadcn/ui
- [ ] Implement semantic color variables
- [ ] Implement light, dark and system themes
- [ ] Add typography
- [ ] Build desktop sidebar and mobile navigation
- [ ] Build reusable page header, card, empty state and error state
- [ ] Add CI for lint, type-check, test and build
- [ ] Add `.env.example`

### Milestone B: Supabase authentication

- [ ] Configure browser Supabase client
- [ ] Configure server Supabase client
- [ ] Configure session middleware
- [ ] Implement sign-up
- [ ] Implement sign-in
- [ ] Implement sign-out
- [ ] Implement password reset
- [ ] Implement callback route
- [ ] Protect application routes
- [ ] Add profile migration and policies
- [ ] Add RLS tests

### Milestone C: Repertoire database

- [ ] Add `repertoires` migration
- [ ] Add `repertoire_nodes` migration
- [ ] Add constraints and indexes
- [ ] Add grants
- [ ] Add RLS policies
- [ ] Add cross-parent ownership tests
- [ ] Generate database TypeScript types
- [ ] Build repository layer

### Milestone D: Chess domain

- [ ] Add chess.js
- [ ] Implement FEN validation
- [ ] Implement position-key normalization
- [ ] Implement move-to-UCI helper
- [ ] Implement SAN display helper
- [ ] Implement special-move tests
- [ ] Integrate chessboard component
- [ ] Build accessible promotion dialog

### Milestone E: Repertoire editor

- [ ] Repertoire list
- [ ] Create repertoire dialog/page
- [ ] Editor shell
- [ ] Current-path state
- [ ] Persist move
- [ ] Navigate tree
- [ ] Branch rendering
- [ ] Set main line
- [ ] Add/edit comments
- [ ] Toggle trainable
- [ ] Delete branch
- [ ] Autosave status
- [ ] Restore selected node
- [ ] Transposition indicator

### Milestone F: Training

- [ ] Add training tables
- [ ] Add scheduler abstraction
- [ ] Implement card reconciliation
- [ ] Implement due-card query
- [ ] Implement session creation
- [ ] Implement trainer UI
- [ ] Implement answer classification
- [ ] Implement review transaction
- [ ] Add idempotency
- [ ] Implement summary
- [ ] Implement dashboard and progress counts

---

## 21. Definition of done

A task is complete only when:

- behavior works in the application;
- TypeScript passes without suppressed errors;
- lint passes;
- relevant unit/integration/E2E tests pass;
- database changes are represented by migrations;
- RLS implications were tested;
- loading, empty and error states exist;
- desktop and mobile layouts were checked;
- keyboard interaction was checked;
- no secret is exposed;
- documents and environment examples are updated;
- changed files and known limitations are summarized.

---

## 22. MVP acceptance criteria

Reperto is ready for a private MVP when:

- a user can register, sign in and sign out;
- a user can create separate White and Black repertoires;
- a user can create multiple legal variations on a chessboard;
- a user can add comments and select trainable positions;
- repertoire data survives refresh, logout and deployment;
- cards are generated and scheduled;
- a user can complete a due-card session;
- correct, accepted and incorrect moves are distinguished;
- failed cards return sooner;
- progress reflects saved reviews;
- User A cannot access User B's data through UI, API or guessed URLs;
- the app is usable on current desktop and mobile browsers;
- production contains no client-exposed secret;
- critical workflows have automated tests.

---

## 23. Final product rule

Reperto is not a generic chessboard with Stockfish attached. Every implementation decision must support the core learning loop:

> **Build a personal repertoire, practise the important positions, understand mistakes and remember the right move when it matters.**

If a proposed feature does not strengthen that loop or establish a necessary foundation, defer it.

---

## 24. Reference links

- [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel documentation](https://vercel.com/docs)
- [Stockfish official repository](https://github.com/official-stockfish/Stockfish)
- [Lichess Stockfish WebAssembly builds](https://github.com/lichess-org/stockfish-web)

