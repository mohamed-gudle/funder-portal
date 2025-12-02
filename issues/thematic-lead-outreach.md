Feature: Thematic Lead Outreach & Bilateral Prioritization
Summary

Soraya wants the tracker to drive targeted outreach: send sector-specific updates to thematic leads, surface clear decision pathways, and prioritize bilateral conversations. The tracker also needs rich contact records so the team can quickly find organization and individual contact info while working a call.

Goals

- Map each open call to a sector and its designated thematic lead(s).
- Automate generation of outreach messages per sector using the email service.
- Provide configurable “decision pathway” checklists that guide the next action for each call.
- Enable prioritization of bilateral conversations and store contact/organization details inline.

Requirements
1. Sector & Lead Mapping
   - Extend open call data models with `sector`, `thematicLeads[]`, and priority scores.
   - Add admin UI or metadata management so sectors/leads can be updated without code changes.
2. Outreach Automation
   - Integrate with the email service (`src/lib/email`) to send templated updates per sector/lead.
   - Allow users to trigger “Send thematic update” actions from the dashboard, pre-filling context (call summary, deadlines).
   - Log outreach attempts and responses inside the tracker.
3. Decision Pathways
   - Define reusable pathway templates (e.g., “Assess Eligibility → Draft Concept → Schedule Bilateral Call”).
   - Attach pathway progress to each open call, showing which steps are done/pending.
4. Bilateral Prioritization & Contact Records
   - Introduce a “Bilateral Priority” flag with scoring (High/Med/Low) and sorting/filtering.
   - Store organization + contact details (name, role, email, phone, notes) for each record.
   - Surface contact cards directly in the bilateral tracker and open call detail views.

Acceptance Criteria

- Each open call shows its sector, assigned thematic leads, and bilateral priority score.
- Users can trigger sector-specific outreach emails that log under the call’s activity history.
- Decision pathways are visible, editable, and persist completion states.
- Contact details for organizations/individuals display inline and power bilateral prioritization filters.

