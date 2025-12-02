Feature: In-App Application Review Workflow
Summary

Soraya requested a systematic, trackable process for reviewing applications inside the dashboard, including comments and submission workflows. Today reviewers rely on docs and ad-hoc updates. We need structured review stages, collaborative commenting, and submission tracking so nothing slips through.

Goals

- Provide a canonical review pipeline (e.g., Draft → Internal Review → Ready to Submit → Submitted).
- Allow reviewers to leave timestamped comments and mention teammates on each application.
- Track submission readiness, blockers, and final submission confirmation within the app.
- Expose reviewer assignments and deadlines directly on application detail pages.

Requirements
1. Workflow Definition
   - Define allowable statuses and transitions for applications.
   - Model the workflow in the data layer (Prisma schema / Supabase tables, Zustand stores, or API endpoints).
   - Enforce transitions via service layer or mutations to avoid invalid jumps.
2. Review UI/UX
   - Update the application detail view with a status timeline component.
   - Add a comment thread with @mentions, file attachments, and resolved/unresolved markers.
   - Provide quick actions (approve, request changes, mark ready to submit) gated by roles/permissions.
3. Submission Management
   - Capture submission metadata: submission date, method (portal/email), confirmation links, attached files.
   - Notify owners when submission deadlines are within configurable thresholds.
   - Record audit history for who moved an application to Submitted and when.
4. Notifications & Integrations
   - Hook into existing notification/email service (once available) so status changes notify stakeholders.
   - Expose review status in dashboard overview widgets for leadership visibility.

Acceptance Criteria

- Applications have a defined status field with validated transitions reflected in UI controls.
- Commenting works end-to-end, including mentions and resolution states.
- Submission details are stored and viewable, including attachments or confirmation links.
- Automated reminders fire when deadlines approach without status updates.
- QA showcases at least one full lifecycle from Draft to Submitted using only in-app workflows.

