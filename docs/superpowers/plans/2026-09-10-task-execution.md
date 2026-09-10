# SIKE Task Execution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn SIKE directives into a persistent, secure task lifecycle where users can start, submit, verify, and receive a single SIKE reward for valid work.

**Architecture:** Keep the existing directive UI and `mission_runs` model, then add a submission record and immutable SIKE ledger. User actions are authenticated through Supabase; reward settlement is performed atomically in PostgreSQL so the browser can never award SIKE directly.

**Tech Stack:** Next.js App Router, TypeScript, Supabase/Postgres, existing SIKE directive UI.

**Spec:** Approved SIKE task-execution design from the 2026-09-10 conversation.

## Global Constraints

- Preserve the existing SIKE visual design and directive card UI.
- Never trust client input to award SIKE.
- Never expose user email through task/profile APIs.
- A task may only produce one successful reward per user.
- Reward settlement must be atomic and auditable.
- Keep the existing `v0/sike-protocol-ui` branch; do not merge into `main`.

---

### Task 1: Secure task execution schema

**Files:**
- Create: `supabase/migrations/004_task_execution.sql`

**Interfaces:**
- Produces `mission_submissions`, `sike_ledger`, task-run constraints, and a transactional verification function for later API routes.

- [ ] Add submission records linked to `mission_runs` and authenticated users.
- [ ] Add immutable SIKE ledger entries linked to a completed mission run.
- [ ] Add indexes and RLS so users can read their own records but cannot award themselves.
- [ ] Add an atomic database function that transitions a submitted run to completed/rejected and inserts exactly one ledger credit when approved.
- [ ] Add duplicate-reward protection with a unique constraint.

### Task 2: Task submission API

**Files:**
- Create: `src/app/api/missions/[id]/submit/route.ts`

**Interfaces:**
- `POST /api/missions/:id/submit` accepts `{ proof: string }` and returns the current submission/run status.

- [ ] Require an authenticated Supabase user.
- [ ] Require an existing initialized run owned by the user.
- [ ] Reject empty or oversized proof payloads.
- [ ] Prevent submissions after completion or rejection.
- [ ] Persist the submission and move the run to `submitted`.

### Task 3: Verification and reward settlement

**Files:**
- Create: `src/app/api/missions/[id]/verify/route.ts`
- Create: `src/lib/task-verification.ts`

**Interfaces:**
- Verification receives a submitted mission and returns `approved`, `rejected`, or `pending`.
- Reward settlement is performed by the database function, never by a client-side balance update.

- [ ] Implement deterministic MVP verification rules for the current proof-based directives.
- [ ] Reject obviously invalid/empty evidence without issuing a reward.
- [ ] Approve only when the task's configured validation rule passes.
- [ ] Call the atomic database settlement function.
- [ ] Return the settled reward and transaction reference.

### Task 4: Connect the existing directive card

**Files:**
- Modify: `src/components/task-card.tsx`

**Interfaces:**
- The existing `Initialize` action becomes a complete task flow: initialize → work/submission → verification → result.

- [ ] Restore current run status on load.
- [ ] Add a compact submission state without redesigning the card.
- [ ] Add proof input and submit action after initialization.
- [ ] Display verifying/completed/rejected states and the earned SIKE amount.
- [ ] Prevent duplicate requests while actions are in flight.

### Task 5: Task history and balance data

**Files:**
- Modify: `src/app/profile/page.tsx`
- Create: `src/app/api/profile/task-history/route.ts`

**Interfaces:**
- Profile history returns only the authenticated user's completed/rejected task activity and ledger credits.

- [ ] Replace static directive/reward metrics with authenticated data where practical.
- [ ] Show completed task count and earned SIKE from the ledger.
- [ ] Keep wallet/email privacy intact.

### Task 6: Verification

**Files:**
- No additional files unless required by failures.

- [ ] Run lint/build against the branch.
- [ ] Verify unauthorized task actions return 401.
- [ ] Verify a task cannot be initialized twice.
- [ ] Verify a task cannot be rewarded twice.
- [ ] Verify rejected submissions never create a ledger credit.
- [ ] Verify approved submissions create exactly one ledger credit.
