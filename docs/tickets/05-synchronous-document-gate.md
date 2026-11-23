# 05: Gate claims on page-level document validation

**What to build:** A persisted claim is checked page by page before processing; the member receives a specific next step for clear document problems, uncertain pages go to review, and only a complete confident document set is queued.

**Blocked by:** 03 — Persist idempotent claim submissions; 04 — Prove Decisions API page classification.

**Status:** ready-for-agent

- [ ] PDF pages render safely to page images; an uploaded image is one page; preserve document ID, page number, hash, and stable page mapping.
- [ ] Decisions adapter classifies pages in batches up to 10 with one independent same-question/page answer each; labels and outputs are schema-validated.
- [ ] Initial labels cover `PRESCRIPTION`, `HOSPITAL_BILL`, `LAB_REPORT`, `DIAGNOSTIC_REPORT`, `PHARMACY_BILL`, `DISCHARGE_SUMMARY`, `DENTAL_REPORT`, `OTHER`, and `UNREADABLE`, with policy-configured equivalences where needed.
- [ ] Backend reads required/optional document types from the selected policy and deterministically computes gate outcome; no model policy decisions or free-form member instructions.
- [ ] Clear wrong/missing requirements yield `NEEDS_DOCUMENTS` with detected/required types and specific actionable instructions; claim ID and trace are preserved and no `PROCESS_CLAIM` job is created.
- [ ] Any low-confidence/unreadable page yields `DOCUMENT_REVIEW_REQUIRED`, taking precedence over an apparently missing type; no processing job is created.
- [ ] If exact patient names are needed to explain a cross-document mismatch, a conditional Responses API structured extraction runs on relevant pages; uncertain names route to review.
- [ ] A confident complete set yields `PROCESSING` and exactly one durable `PROCESS_CLAIM` job in the same transaction as the status change.
- [ ] Tests include mixed PDF page types, multiple files, wrong/missing types, confidence boundary, uncertainty precedence, patient mismatch, and provider-independent mocked results.
