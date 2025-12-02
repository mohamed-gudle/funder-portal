Feature: Real Data-Driven Open Call & Submission Visibility
Summary

Soraya and Olivia emphasized that the next dashboard iteration must rely on actual portfolio data, not placeholders. The open calls surface should show which calls have been applied to, where deadlines are approaching, which calls are recently active, and which submissions still need follow-up. This effort ensures the pipeline view is actionable each day.

Goals

- Replace stubbed data in the open calls feature with synced data from the production data sources (CRM, grant tracker, or Supabase tables).
- Surface upcoming deadlines and applied/not-applied state for every open call directly in the dashboard.
- Provide a persistent list of submitted applications with their statuses so relationship managers can track follow-up tasks.
- Highlight “recently active” open calls to help the team focus on programs that changed in the last 7 days.

Requirements
1. Data Integration
   - Define the reliable data source(s) for open calls, applications, and submission statuses.
   - Implement scheduled sync or live queries in `src/features/open-calls` to pull authoritative data (no mocks).
   - Store metadata needed for deadlines (due date, reminder windows) so UI logic can compute urgency badges.
2. Open Calls Dashboard Enhancements
   - Extend the existing open call table/cards to include columns for `Applied?`, `Next Deadline`, and `Last Activity`.
   - Add filtering/tabs for “All”, “Recently Updated”, and “Upcoming Deadlines”.
   - Display a badge or chip when a call was updated in the last 7 days.
3. Submitted Applications Panel
   - Introduce a “Submitted Applications” list that lives beside or below the open calls view.
   - Each record shows call name, submission date, current status (e.g., Under Review, Awaiting Feedback), and assigned owner.
   - Provide sorting and quick links to the underlying record (detail page or external URL).
4. Status & Activity Tracking
   - Track application follow-up status and allow marking items as “followed up” or “needs action”.
   - Persist activity logs so the “recently active” calculation is auditable.

Acceptance Criteria

- Dashboard pulls live data; no hard-coded fixtures remain in `open-calls` or related stores.
- Every open call row shows whether the org applied and the next upcoming deadline date.
- A “Recently Active” pill accurately reflects calls touched in the past 7 days.
- A dedicated submitted applications list is visible with statuses and owner information.
- QA checklist confirms date math, filtering, and status indicators behave correctly for edge cases (no deadline, multiple submissions, etc.).

