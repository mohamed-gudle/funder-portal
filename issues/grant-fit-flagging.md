Feature: Grant Fit Flagging & Relevance Scoring
Summary

Olivia asked for a way to flag grants that are the most relevant or best fit the organization’s criteria. We need scoring logic and UI affordances to quickly bubble up high-potential grants.

Goals

- Define scoring inputs (sector alignment, average grant size, geographic fit, relationship strength, etc.).
- Compute a composite “Fit Score” for each open call/opportunity.
- Allow users to manually override/flag grants as “Top Fit” when qualitative signals matter.
- Surface filters and visual cues so teams can focus on the best matches.

Requirements
1. Scoring Model
   - Determine automated factors and weightings; implement in a shared utility (e.g., `src/lib/scoring/grantFit.ts`).
   - Recalculate scores when inputs change (new intel, document updates, AI recommendations).
2. Manual Flagging & Notes
   - Provide UI controls to mark a grant as “Flagged” or “Watchlist”, with note capture.
   - Audit manual overrides with user + timestamp.
3. Visualization
   - Display fit score badges in open call tables, detail pages, and saved searches.
   - Add filters/sorting for “Top Fit”, “Medium Fit”, etc.
   - Include fit score summaries in analytics widgets and exports.
4. Validation & Feedback
   - Gather feedback loops so users can rate whether the score matched reality; feed into future model tuning.

Acceptance Criteria

- Each open call displays an auto-calculated fit score plus optional manual flag.
- Users can filter/sort lists by fit score or flag state.
- Overrides and notes persist and are auditable.
- Analytics/export views include fit metrics for leadership reporting.

