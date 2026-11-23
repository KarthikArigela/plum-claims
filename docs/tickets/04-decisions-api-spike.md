# 04: Prove Decisions API page classification

**What to build:** The team has executable evidence that the official Python SDK, account, and Decisions API can classify synthetic medical-document page images and map every answer to its own page before the gate depends on it.

**Blocked by:** 01 — Establish local app foundation.

**Status:** ready-for-agent

- [ ] Verify official SDK support and account access for `gpt-6-luna` Decisions API, typed choices/confidence/probabilities, and question-specific image inputs.
- [ ] An opt-in live spike classifies one synthetic page and a multi-page batch, using the same “What document is this?” question independently for each page.
- [ ] Verify responses unambiguously associate each answer with the correct page and support the needed image formats.
- [ ] Confirm SDK retry defaults, error types, request IDs, relevant rate-limit headers, and configuration needed to enforce three actual attempts.
- [ ] Mocked contract tests cover expected result shapes and errors without network or credentials.
- [ ] No document bytes, base64 payloads, secrets, or sensitive extracted values are logged.
- [ ] If observed SDK/account capability differs from documentation, provide evidence and pause this integration for the user’s decision; do not silently switch to Responses-only gate.
