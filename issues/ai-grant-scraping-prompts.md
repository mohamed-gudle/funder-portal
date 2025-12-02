Feature: Robust AI Prompting for Grant Discovery
Summary

Soraya stressed that the AI prompts driving grant scraping must be carefully crafted. We need reliable prompt templates, safeguards, and a collaborative workflow to finalize prompts and operational details before scaling the automation.

Goals

- Establish a library of vetted prompt templates optimized for scraping relevant grants from public sources.
- Provide tooling for product + partnerships teams to iterate on prompts together (“sit together” working session).
- Instrument the scraping pipeline to evaluate prompt performance (precision/recall of relevant grants).
- Document operational guidelines so prompts can be maintained safely.

Requirements
1. Prompt Template Library
   - Store prompts in version-controlled files (e.g., `src/lib/ai/prompts/grantScraper.ts`) with metadata (sector, language, objective).
   - Support variable substitution (region, funding size, beneficiary type) to minimize duplication.
2. Collaboration Workflow
   - Build an internal prompt playground UI or CLI tool where stakeholders can test prompts against sample sources.
   - Capture notes/decisions from working sessions and link them to prompt versions.
3. Scraping Pipeline Enhancements
   - Ensure the scraper logs which prompt generated each result and confidence signals.
   - Add evaluation metrics or manual labeling queues so the team can score relevance.
4. Documentation & Safeguards
   - Document best practices, data sources, and rate limits in `/docs/ai-grant-scraping.md`.
   - Add guardrails to prevent prompts from hitting prohibited sites or exposing sensitive queries.

Acceptance Criteria

- Prompt templates live in code with clear metadata and can be programmatically selected per sector.
- Stakeholders can run a prompt test via UI/CLI and capture feedback before deployment.
- Scraper logs associate grant results with prompt versions and store evaluation data.
- Documentation exists that describes how prompts are created, reviewed, approved, and rolled out.

