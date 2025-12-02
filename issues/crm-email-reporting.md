Feature: Email Sync & Reporting Template Exports
Summary

Soraya asked for email updates to flow into the tracker (similar to Salesforce) and for reporting templates that summarize calls applied to and organizations engaged. We need two capabilities: log inbound/outbound emails against records and export structured reports.

Goals

- Sync relevant email threads into the tracker so engagement history lives in one place.
- Allow users to download/export reporting templates covering calls applied to and org engagements.
- Provide filters (date range, sector, owner) before exporting.
- Ensure compliance with email privacy/security requirements.

Requirements
1. Email Integration
   - Decide on ingestion method (IMAP sync, forwarding, or BCC to unique address).
   - Parse emails and associate them with open calls, bilateral engagements, or org contacts.
   - Display email threads in the UI, including sender, recipients, subject, timestamps, and attachments.
2. Reporting Templates
   - Define export schemas for “Calls Applied To” and “Organizations Engaged”.
   - Implement export endpoints (CSV/XLSX/PDF) accessible from the dashboard.
   - Include summary metrics (count of calls, stages, upcoming deadlines) at the top of exports.
3. User Controls & Security
   - Provide opt-in settings per user/team for email syncing.
   - Mask or redact sensitive content where necessary.
   - Log export events for auditing.

Acceptance Criteria

- Emails related to a call/application automatically show up in that record’s activity feed.
- Users can trigger a “Download Reporting Template” action and receive a correctly formatted file.
- Export includes all required columns and respects applied filters.
- Security review completed for email storage and export endpoints.

