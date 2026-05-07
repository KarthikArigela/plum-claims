This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where empty lines have been removed, line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
AGENTS.md
app/api/claims/[id]/route.ts
app/api/claims/route.ts
app/api/policy/route.ts
app/claims/[id]/page.tsx
app/favicon.ico
app/fonts/GT-Alpina-Standard-Bold-Trial.otf
app/fonts/GT-Alpina-Standard-Light-Trial.otf
app/fonts/GT-Alpina-Standard-Medium-Trial.otf
app/fonts/GT-Alpina-Standard-Regular-Trial.otf
app/fonts/PassengerSans-Bold.otf
app/fonts/PassengerSans-Light.otf
app/fonts/PassengerSans-Medium.otf
app/fonts/PassengerSans-Regular.otf
app/fonts/PassengerSans-Semibold.otf
app/globals.css
app/layout.tsx
app/page.tsx
CLAUDE.md
data/policy_terms.json
data/test_cases.json
eslint.config.mjs
lib/agents/1-DocumentVerifier.ts
lib/agents/2-InformationExtractor.ts
lib/agents/3-PolicyEngine.ts
lib/agents/4-FraudDetector.ts
lib/agents/5-DecisionSynthesizer.ts
lib/openai.ts
lib/pipeline.ts
lib/policy/policyLoader.ts
lib/traces/traceMessages.ts
lib/types/claim.types.ts
lib/utils/rejectionMessageMapper.ts
next.config.ts
package.json
postcss.config.mjs
problem-statement/assignment.md
problem-statement/policy_terms.json
problem-statement/README.md
problem-statement/sample_documents_guide.md
problem-statement/test_cases.json
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
README.md
reports/mock/clean_baseline.jpg
reports/mock/Doc 1.png
reports/mock/Doc 10.jpeg
reports/mock/Doc 11.png
reports/mock/Doc 2.png
reports/mock/Doc 3.png
reports/mock/Doc 4.png
reports/mock/Doc 5.png
reports/mock/Doc 6.png
reports/mock/Doc 7.png
reports/mock/Doc 8.png
reports/mock/Doc 9.png
reports/mock/document_ruiner.py
reports/mock/mock_generator.py
reports/mock/mockgenerator/tc002_blurry_pharma.jpg
reports/mock/mockgenerator/tc004_apollo_bill.jpg
reports/mock/mockgenerator/tc004_prescription.jpg
reports/mock/mockgenerator/tc007_fortis_mri.jpg
reports/mock/mockgenerator/tc011_stamped_rx.jpg
reports/mock/Plum Architecture.png
reports/mock/plum_stress_engine.py
reports/mock/plumstressengine/tc002_blackout_photo.jpg
reports/mock/plumstressengine/tc003_mismatched_name_bill.jpg
reports/mock/plumstressengine/tc006_dental_mixed_corrected.jpg
reports/mock/plumstressengine/tc011_damaged_lab_report.jpg
reports/mock/Screenshot 2026-05-06 024827.png
reports/mock/stress_test/tc002_blackout_photo.jpg
reports/mock/stress_test/tc003_mismatched_name_bill.jpg
reports/mock/stress_test/tc006_dental_mixed_corrected.jpg
reports/mock/stress_test/tc011_damaged_lab_report.jpg
reports/mock/stress_test/tc012_obesity_exclusion.jpg
reports/mock/tc002_blurry_pharmacy_bill.jpg
reports/mock/tc005_stamped_prescription.jpg
reports/test-cases/COMB-1/COMB-1 Full Output.png
reports/test-cases/COMB-1/COMB-1 Input.png
reports/test-cases/COMB-1/COMB-1 Output Minimized.png
reports/test-cases/COMB-1/Doc 10.jpeg
reports/test-cases/COMB-1/Doc 9.png
reports/test-cases/COMB-2/COMB-2 Full Output .png
reports/test-cases/COMB-2/COMB-2 Input.png
reports/test-cases/COMB-2/COMB-2 Output Minimized.png
reports/test-cases/COMB-2/Doc 1.png
reports/test-cases/COMB-2/Doc 2.png
reports/test-cases/COMB-3/COMB-3 Full Output.png
reports/test-cases/COMB-3/COMB-3 Input.png
reports/test-cases/COMB-3/COMB-3 Output Minimized.png
reports/test-cases/COMB-3/Doc 10.jpeg
reports/test-cases/COMB-3/Doc 11.png
reports/test-cases/COMB-4/COMB-4 Full Output.png
reports/test-cases/COMB-4/COMB-4 Input.png
reports/test-cases/COMB-4/COMB-4 Output Minimized.png
reports/test-cases/COMB-4/Doc 12.png
reports/test-cases/COMB-4/Doc 13.png
reports/test-cases/COMB-5/COMB-5 Input.png
reports/test-cases/COMB-5/COMB-5 Output.png
reports/test-cases/COMB-5/Doc 3.png
scripts/test-agents.ts
scripts/test-engine.ts
scripts/test-llm.ts
scripts/test-pipeline.ts
scripts/test-route.cjs
tsconfig.json
```

# Files

## File: .gitignore
````
 1: # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2: 
 3: # dependencies
 4: /node_modules
 5: /.pnp
 6: .pnp.*
 7: .yarn/*
 8: !.yarn/patches
 9: !.yarn/plugins
10: !.yarn/releases
11: !.yarn/versions
12: 
13: # testing
14: /coverage
15: 
16: # next.js
17: /.next/
18: /out/
19: 
20: # production
21: /build
22: 
23: # misc
24: .DS_Store
25: *.pem
26: 
27: # debug
28: npm-debug.log*
29: yarn-debug.log*
30: yarn-error.log*
31: .pnpm-debug.log*
32: 
33: # env files (can opt-in for committing if needed)
34: .env*
35: 
36: # vercel
37: .vercel
38: 
39: # typescript
40: *.tsbuildinfo
41: next-env.d.ts
````

## File: CLAUDE.md
````markdown
1: @AGENTS.md
````

## File: data/test_cases.json
````json
  1: {
  2:   "version": "2.0",
  3:   "description": "Test cases for the claims processing system. Each case describes what is submitted and what the system must produce. How the system gets there is your design decision.",
  4:   "test_cases": [
  5:     {
  6:       "case_id": "TC001",
  7:       "case_name": "Wrong Document Uploaded",
  8:       "description": "Member submits two prescriptions for a consultation claim that requires a prescription and a hospital bill.",
  9:       "input": {
 10:         "member_id": "EMP001",
 11:         "policy_id": "PLUM_GHI_2024",
 12:         "claim_category": "CONSULTATION",
 13:         "treatment_date": "2024-11-01",
 14:         "claimed_amount": 1500,
 15:         "documents": [
 16:           {
 17:             "file_id": "F001",
 18:             "file_name": "dr_sharma_prescription.jpg",
 19:             "actual_type": "PRESCRIPTION"
 20:           },
 21:           {
 22:             "file_id": "F002",
 23:             "file_name": "another_prescription.jpg",
 24:             "actual_type": "PRESCRIPTION"
 25:           }
 26:         ]
 27:       },
 28:       "expected": {
 29:         "decision": null,
 30:         "system_must": [
 31:           "Stop before making any claim decision",
 32:           "Tell the member specifically what document type was uploaded and what is needed instead",
 33:           "Not return a generic error — the message must name the uploaded document type and the required document type"
 34:         ]
 35:       }
 36:     },
 37:     {
 38:       "case_id": "TC002",
 39:       "case_name": "Unreadable Document",
 40:       "description": "Member uploads a valid prescription but a blurry, unreadable photo of their pharmacy bill.",
 41:       "input": {
 42:         "member_id": "EMP004",
 43:         "policy_id": "PLUM_GHI_2024",
 44:         "claim_category": "PHARMACY",
 45:         "treatment_date": "2024-10-25",
 46:         "claimed_amount": 800,
 47:         "documents": [
 48:           {
 49:             "file_id": "F003",
 50:             "file_name": "prescription.jpg",
 51:             "actual_type": "PRESCRIPTION",
 52:             "quality": "GOOD"
 53:           },
 54:           {
 55:             "file_id": "F004",
 56:             "file_name": "blurry_bill.jpg",
 57:             "actual_type": "PHARMACY_BILL",
 58:             "quality": "UNREADABLE"
 59:           }
 60:         ]
 61:       },
 62:       "expected": {
 63:         "decision": null,
 64:         "system_must": [
 65:           "Identify that the pharmacy bill cannot be read",
 66:           "Ask the member to re-upload that specific document",
 67:           "Not reject the claim outright"
 68:         ]
 69:       }
 70:     },
 71:     {
 72:       "case_id": "TC003",
 73:       "case_name": "Documents Belong to Different Patients",
 74:       "description": "The prescription is for Rajesh Kumar but the hospital bill is for a different patient, Arjun Mehta.",
 75:       "input": {
 76:         "member_id": "EMP001",
 77:         "policy_id": "PLUM_GHI_2024",
 78:         "claim_category": "CONSULTATION",
 79:         "treatment_date": "2024-11-01",
 80:         "claimed_amount": 1500,
 81:         "documents": [
 82:           {
 83:             "file_id": "F005",
 84:             "file_name": "prescription_rajesh.jpg",
 85:             "actual_type": "PRESCRIPTION",
 86:             "patient_name_on_doc": "Rajesh Kumar"
 87:           },
 88:           {
 89:             "file_id": "F006",
 90:             "file_name": "bill_arjun.jpg",
 91:             "actual_type": "HOSPITAL_BILL",
 92:             "patient_name_on_doc": "Arjun Mehta"
 93:           }
 94:         ]
 95:       },
 96:       "expected": {
 97:         "decision": null,
 98:         "system_must": [
 99:           "Detect that the documents belong to different people",
100:           "Surface this to the member with the specific names found on each document",
101:           "Not proceed to a claim decision"
102:         ]
103:       }
104:     },
105:     {
106:       "case_id": "TC004",
107:       "case_name": "Clean Consultation — Full Approval",
108:       "description": "Complete, valid consultation claim with correct documents, valid member, covered treatment, within all limits.",
109:       "input": {
110:         "member_id": "EMP001",
111:         "policy_id": "PLUM_GHI_2024",
112:         "claim_category": "CONSULTATION",
113:         "treatment_date": "2024-11-01",
114:         "claimed_amount": 1500,
115:         "ytd_claims_amount": 5000,
116:         "documents": [
117:           {
118:             "file_id": "F007",
119:             "actual_type": "PRESCRIPTION",
120:             "content": {
121:               "doctor_name": "Dr. Arun Sharma",
122:               "doctor_registration": "KA/45678/2015",
123:               "patient_name": "Rajesh Kumar",
124:               "date": "2024-11-01",
125:               "diagnosis": "Viral Fever",
126:               "medicines": [
127:                 "Paracetamol 650mg",
128:                 "Vitamin C 500mg"
129:               ]
130:             }
131:           },
132:           {
133:             "file_id": "F008",
134:             "actual_type": "HOSPITAL_BILL",
135:             "content": {
136:               "hospital_name": "City Clinic, Bengaluru",
137:               "patient_name": "Rajesh Kumar",
138:               "date": "2024-11-01",
139:               "line_items": [
140:                 {
141:                   "description": "Consultation Fee",
142:                   "amount": 1000
143:                 },
144:                 {
145:                   "description": "CBC Test",
146:                   "amount": 300
147:                 },
148:                 {
149:                   "description": "Dengue NS1 Test",
150:                   "amount": 200
151:                 }
152:               ],
153:               "total": 1500
154:             }
155:           }
156:         ]
157:       },
158:       "expected": {
159:         "decision": "APPROVED",
160:         "approved_amount": 1350,
161:         "notes": "10% co-pay applied on consultation category (₹150 deducted)",
162:         "confidence_score": "above 0.85"
163:       }
164:     },
165:     {
166:       "case_id": "TC005",
167:       "case_name": "Waiting Period — Diabetes",
168:       "description": "Member joined 2024-09-01. Claims for diabetes treatment on 2024-10-15, which is within the 90-day waiting period for diabetes.",
169:       "input": {
170:         "member_id": "EMP005",
171:         "policy_id": "PLUM_GHI_2024",
172:         "claim_category": "CONSULTATION",
173:         "treatment_date": "2024-10-15",
174:         "claimed_amount": 3000,
175:         "documents": [
176:           {
177:             "file_id": "F009",
178:             "actual_type": "PRESCRIPTION",
179:             "content": {
180:               "doctor_name": "Dr. Sunil Mehta",
181:               "doctor_registration": "GJ/56789/2014",
182:               "patient_name": "Vikram Joshi",
183:               "diagnosis": "Type 2 Diabetes Mellitus",
184:               "medicines": [
185:                 "Metformin 500mg",
186:                 "Glimepiride 1mg"
187:               ]
188:             }
189:           },
190:           {
191:             "file_id": "F010",
192:             "actual_type": "HOSPITAL_BILL",
193:             "content": {
194:               "patient_name": "Vikram Joshi",
195:               "date": "2024-10-15",
196:               "total": 3000
197:             }
198:           }
199:         ]
200:       },
201:       "expected": {
202:         "decision": "REJECTED",
203:         "rejection_reasons": [
204:           "WAITING_PERIOD"
205:         ],
206:         "system_must": [
207:           "State the date from which the member will be eligible for diabetes-related claims"
208:         ]
209:       }
210:     },
211:     {
212:       "case_id": "TC006",
213:       "case_name": "Dental Partial Approval — Cosmetic Exclusion",
214:       "description": "Bill includes root canal treatment (covered) and teeth whitening (cosmetic, excluded). System must approve only the covered procedure.",
215:       "input": {
216:         "member_id": "EMP002",
217:         "policy_id": "PLUM_GHI_2024",
218:         "claim_category": "DENTAL",
219:         "treatment_date": "2024-10-15",
220:         "claimed_amount": 12000,
221:         "documents": [
222:           {
223:             "file_id": "F011",
224:             "actual_type": "HOSPITAL_BILL",
225:             "content": {
226:               "hospital_name": "Smile Dental Clinic",
227:               "patient_name": "Priya Singh",
228:               "line_items": [
229:                 {
230:                   "description": "Root Canal Treatment",
231:                   "amount": 8000
232:                 },
233:                 {
234:                   "description": "Teeth Whitening",
235:                   "amount": 4000
236:                 }
237:               ],
238:               "total": 12000
239:             }
240:           }
241:         ]
242:       },
243:       "expected": {
244:         "decision": "PARTIAL",
245:         "approved_amount": 8000,
246:         "system_must": [
247:           "Itemize which line items were approved and which were rejected",
248:           "State the reason for each rejection at the line-item level"
249:         ]
250:       }
251:     },
252:     {
253:       "case_id": "TC007",
254:       "case_name": "MRI Without Pre-Authorization",
255:       "description": "MRI scan costing ₹15,000 submitted without pre-authorization. Policy requires pre-auth for MRI above ₹10,000.",
256:       "input": {
257:         "member_id": "EMP007",
258:         "policy_id": "PLUM_GHI_2024",
259:         "claim_category": "DIAGNOSTIC",
260:         "treatment_date": "2024-11-02",
261:         "claimed_amount": 15000,
262:         "documents": [
263:           {
264:             "file_id": "F012",
265:             "actual_type": "PRESCRIPTION",
266:             "content": {
267:               "doctor_name": "Dr. Venkat Rao",
268:               "doctor_registration": "AP/67890/2017",
269:               "diagnosis": "Suspected Lumbar Disc Herniation",
270:               "tests_ordered": [
271:                 "MRI Lumbar Spine"
272:               ]
273:             }
274:           },
275:           {
276:             "file_id": "F013",
277:             "actual_type": "LAB_REPORT",
278:             "content": {
279:               "test_name": "MRI Lumbar Spine"
280:             }
281:           },
282:           {
283:             "file_id": "F014",
284:             "actual_type": "HOSPITAL_BILL",
285:             "content": {
286:               "line_items": [
287:                 {
288:                   "description": "MRI Lumbar Spine",
289:                   "amount": 15000
290:                 }
291:               ],
292:               "total": 15000
293:             }
294:           }
295:         ]
296:       },
297:       "expected": {
298:         "decision": "REJECTED",
299:         "rejection_reasons": [
300:           "PRE_AUTH_MISSING"
301:         ],
302:         "system_must": [
303:           "Explain that pre-authorization was required and not obtained",
304:           "Tell the member what they should do to resubmit with pre-auth"
305:         ]
306:       }
307:     },
308:     {
309:       "case_id": "TC008",
310:       "case_name": "Per-Claim Limit Exceeded",
311:       "description": "Claimed amount of ₹7,500 exceeds the per-claim limit of ₹5,000.",
312:       "input": {
313:         "member_id": "EMP003",
314:         "policy_id": "PLUM_GHI_2024",
315:         "claim_category": "CONSULTATION",
316:         "treatment_date": "2024-10-20",
317:         "claimed_amount": 7500,
318:         "ytd_claims_amount": 10000,
319:         "documents": [
320:           {
321:             "file_id": "F015",
322:             "actual_type": "PRESCRIPTION",
323:             "content": {
324:               "doctor_name": "Dr. R. Gupta",
325:               "doctor_registration": "DL/34567/2016",
326:               "diagnosis": "Gastroenteritis",
327:               "medicines": [
328:                 "Antibiotics",
329:                 "Probiotics",
330:                 "ORS"
331:               ]
332:             }
333:           },
334:           {
335:             "file_id": "F016",
336:             "actual_type": "HOSPITAL_BILL",
337:             "content": {
338:               "line_items": [
339:                 {
340:                   "description": "Consultation Fee",
341:                   "amount": 2000
342:                 },
343:                 {
344:                   "description": "Medicines",
345:                   "amount": 5500
346:                 }
347:               ],
348:               "total": 7500
349:             }
350:           }
351:         ]
352:       },
353:       "expected": {
354:         "decision": "REJECTED",
355:         "rejection_reasons": [
356:           "PER_CLAIM_EXCEEDED"
357:         ],
358:         "system_must": [
359:           "State the per-claim limit and the claimed amount clearly in the rejection message"
360:         ]
361:       }
362:     },
363:     {
364:       "case_id": "TC009",
365:       "case_name": "Fraud Signal — Multiple Same-Day Claims",
366:       "description": "Member EMP008 has already submitted 3 claims today before this one arrives. This is the 4th claim from the same member on the same day.",
367:       "input": {
368:         "member_id": "EMP008",
369:         "policy_id": "PLUM_GHI_2024",
370:         "claim_category": "CONSULTATION",
371:         "treatment_date": "2024-10-30",
372:         "claimed_amount": 4800,
373:         "claims_history": [
374:           {
375:             "claim_id": "CLM_0081",
376:             "date": "2024-10-30",
377:             "amount": 1200,
378:             "provider": "City Clinic A"
379:           },
380:           {
381:             "claim_id": "CLM_0082",
382:             "date": "2024-10-30",
383:             "amount": 1800,
384:             "provider": "City Clinic B"
385:           },
386:           {
387:             "claim_id": "CLM_0083",
388:             "date": "2024-10-30",
389:             "amount": 2100,
390:             "provider": "Wellness Center"
391:           }
392:         ],
393:         "documents": [
394:           {
395:             "file_id": "F017",
396:             "actual_type": "PRESCRIPTION",
397:             "content": {
398:               "diagnosis": "Migraine",
399:               "doctor_name": "Dr. S. Khan"
400:             }
401:           },
402:           {
403:             "file_id": "F018",
404:             "actual_type": "HOSPITAL_BILL",
405:             "content": {
406:               "total": 4800
407:             }
408:           }
409:         ]
410:       },
411:       "expected": {
412:         "decision": "MANUAL_REVIEW",
413:         "system_must": [
414:           "Flag the unusual same-day claim pattern",
415:           "Route to manual review rather than auto-rejecting",
416:           "Include the specific signals that triggered the flag in the output"
417:         ]
418:       }
419:     },
420:     {
421:       "case_id": "TC010",
422:       "case_name": "Network Hospital — Discount Applied",
423:       "description": "Valid claim at Apollo Hospitals, a network hospital. Network discount must be applied before co-pay.",
424:       "input": {
425:         "member_id": "EMP010",
426:         "policy_id": "PLUM_GHI_2024",
427:         "claim_category": "CONSULTATION",
428:         "treatment_date": "2024-11-03",
429:         "claimed_amount": 4500,
430:         "hospital_name": "Apollo Hospitals",
431:         "ytd_claims_amount": 8000,
432:         "documents": [
433:           {
434:             "file_id": "F019",
435:             "actual_type": "PRESCRIPTION",
436:             "content": {
437:               "doctor_name": "Dr. S. Iyer",
438:               "doctor_registration": "TN/56789/2013",
439:               "patient_name": "Deepak Shah",
440:               "diagnosis": "Acute Bronchitis",
441:               "medicines": [
442:                 "Amoxicillin 500mg",
443:                 "Salbutamol Inhaler"
444:               ]
445:             }
446:           },
447:           {
448:             "file_id": "F020",
449:             "actual_type": "HOSPITAL_BILL",
450:             "content": {
451:               "hospital_name": "Apollo Hospitals",
452:               "patient_name": "Deepak Shah",
453:               "line_items": [
454:                 {
455:                   "description": "Consultation Fee",
456:                   "amount": 1500
457:                 },
458:                 {
459:                   "description": "Medicines",
460:                   "amount": 3000
461:                 }
462:               ],
463:               "total": 4500
464:             }
465:           }
466:         ]
467:       },
468:       "expected": {
469:         "decision": "APPROVED",
470:         "approved_amount": 3240,
471:         "notes": "Network discount (20%) applied first on ₹4,500 = ₹3,600. Co-pay (10%) applied on ₹3,600 = ₹360 deducted. Final: ₹3,240.",
472:         "system_must": [
473:           "Apply network discount before co-pay, not after",
474:           "Show the breakdown of discount and co-pay in the decision output"
475:         ]
476:       }
477:     },
478:     {
479:       "case_id": "TC011",
480:       "case_name": "Component Failure — Graceful Degradation",
481:       "description": "One component of your system fails mid-processing (simulate with the flag below). The overall pipeline must continue, produce a decision, and make the failure visible in the output with an appropriately reduced confidence score.",
482:       "input": {
483:         "member_id": "EMP006",
484:         "policy_id": "PLUM_GHI_2024",
485:         "claim_category": "ALTERNATIVE_MEDICINE",
486:         "treatment_date": "2024-10-28",
487:         "claimed_amount": 4000,
488:         "simulate_component_failure": true,
489:         "documents": [
490:           {
491:             "file_id": "F021",
492:             "actual_type": "PRESCRIPTION",
493:             "content": {
494:               "doctor_name": "Vaidya T. Krishnan",
495:               "doctor_registration": "AYUR/KL/2345/2019",
496:               "diagnosis": "Chronic Joint Pain",
497:               "treatment": "Panchakarma Therapy"
498:             }
499:           },
500:           {
501:             "file_id": "F022",
502:             "actual_type": "HOSPITAL_BILL",
503:             "content": {
504:               "hospital_name": "Ayur Wellness Centre",
505:               "total": 4000,
506:               "line_items": [
507:                 {
508:                   "description": "Panchakarma Therapy (5 sessions)",
509:                   "amount": 3000
510:                 },
511:                 {
512:                   "description": "Consultation",
513:                   "amount": 1000
514:                 }
515:               ]
516:             }
517:           }
518:         ]
519:       },
520:       "expected": {
521:         "decision": "APPROVED",
522:         "system_must": [
523:           "Not crash or return a 500 error",
524:           "Indicate in the output that a component failed and was skipped",
525:           "Return a confidence score lower than a normal full-pipeline approval",
526:           "Include a note that manual review is recommended due to incomplete processing"
527:         ]
528:       }
529:     },
530:     {
531:       "case_id": "TC012",
532:       "case_name": "Excluded Treatment",
533:       "description": "Member claims for bariatric consultation and a diet program. Obesity treatment is explicitly excluded under the policy.",
534:       "input": {
535:         "member_id": "EMP009",
536:         "policy_id": "PLUM_GHI_2024",
537:         "claim_category": "CONSULTATION",
538:         "treatment_date": "2024-10-18",
539:         "claimed_amount": 8000,
540:         "documents": [
541:           {
542:             "file_id": "F023",
543:             "actual_type": "PRESCRIPTION",
544:             "content": {
545:               "doctor_name": "Dr. P. Banerjee",
546:               "doctor_registration": "WB/34567/2015",
547:               "diagnosis": "Morbid Obesity — BMI 37",
548:               "treatment": "Bariatric Consultation and Customised Diet Plan"
549:             }
550:           },
551:           {
552:             "file_id": "F024",
553:             "actual_type": "HOSPITAL_BILL",
554:             "content": {
555:               "line_items": [
556:                 {
557:                   "description": "Bariatric Consultation",
558:                   "amount": 3000
559:                 },
560:                 {
561:                   "description": "Personalised Diet and Nutrition Program",
562:                   "amount": 5000
563:                 }
564:               ],
565:               "total": 8000
566:             }
567:           }
568:         ]
569:       },
570:       "expected": {
571:         "decision": "REJECTED",
572:         "rejection_reasons": [
573:           "EXCLUDED_CONDITION"
574:         ],
575:         "confidence_score": "above 0.90"
576:       }
577:     }
578:   ],
579:   "notes": [
580:     "TC001–TC003 test early document problem detection. The quality of the user-facing message is part of the evaluation — not just whether the system stops.",
581:     "TC010 tests financial calculation order — network discount must be applied before co-pay.",
582:     "TC011 tests resilience. A system that crashes on component failure does not pass this case.",
583:     "For your eval report, show the full decision output for each case, not just pass/fail."
584:   ]
585: }
````

## File: eslint.config.mjs
````javascript
 1: import { defineConfig, globalIgnores } from "eslint/config";
 2: import nextVitals from "eslint-config-next/core-web-vitals";
 3: import nextTs from "eslint-config-next/typescript";
 4: 
 5: const eslintConfig = defineConfig([
 6:   ...nextVitals,
 7:   ...nextTs,
 8:   // Override default ignores of eslint-config-next.
 9:   globalIgnores([
10:     // Default ignores of eslint-config-next:
11:     ".next/**",
12:     "out/**",
13:     "build/**",
14:     "next-env.d.ts",
15:   ]),
16: ]);
17: 
18: export default eslintConfig;
````

## File: lib/policy/policyLoader.ts
````typescript
 1: import fs from 'fs';
 2: import path from 'path';
 3: export interface PolicyMember {
 4:   member_id: string;
 5:   name: string;
 6:   date_of_birth: string;
 7:   gender: string;
 8:   relationship: string;
 9:   join_date?: string; // Exists for primary member
10:   primary_member_id?: string; // Exists for dependent
11:   dependents?: string[];
12: }
13: export interface OpdCategoryRules {
14:   sub_limit: number;
15:   copay_percent: number;
16:   network_discount_percent?: number;
17:   requires_prescription: boolean;
18:   requires_pre_auth?: boolean;
19:   pre_auth_threshold?: number;
20:   high_value_tests_requiring_pre_auth?: string[];
21:   covered: boolean;
22:   branded_drug_copay_percent?: number;
23:   generic_mandatory?: boolean;
24:   requires_dental_report?: boolean;
25:   covered_procedures?: string[];
26:   excluded_procedures?: string[];
27:   covered_items?: string[];
28:   excluded_items?: string[];
29:   requires_registered_practitioner?: boolean;
30:   max_sessions_per_year?: number;
31:   covered_systems?: string[];
32: }
33: export interface PolicyTerms {
34:   policy_id: string;
35:   policy_name: string;
36:   insurer: string;
37:   policy_holder: {
38:     company_name: string;
39:     employee_count: number;
40:     policy_start_date: string;
41:     policy_end_date: string;
42:     renewal_status: string;
43:   };
44:   coverage: {
45:     sum_insured_per_employee: number;
46:     annual_opd_limit: number;
47:     per_claim_limit: number;
48:     family_floater: {
49:       enabled: boolean;
50:       combined_limit: number;
51:       covered_relationships: string[];
52:     };
53:   };
54:   opd_categories: Record<string, OpdCategoryRules>;
55:   waiting_periods: {
56:     initial_waiting_period_days: number;
57:     pre_existing_conditions_days: number;
58:     specific_conditions: Record<string, number>;
59:   };
60:   exclusions: {
61:     conditions: string[];
62:     dental_exclusions: string[];
63:     vision_exclusions: string[];
64:   };
65:   pre_authorization: {
66:     required_for: string[];
67:     validity_days: number;
68:   };
69:   network_hospitals: string[];
70:   submission_rules: {
71:     deadline_days_from_treatment: number;
72:     minimum_claim_amount: number;
73:     currency: string;
74:   };
75:   document_requirements: Record<string, { required: string[]; optional: string[] }>;
76:   fraud_thresholds: {
77:     same_day_claims_limit: number;
78:     monthly_claims_limit: number;
79:     high_value_claim_threshold: number;
80:     auto_manual_review_above: number;
81:     fraud_score_manual_review_threshold: number;
82:   };
83:   members: PolicyMember[];
84: }
85: export function loadPolicy(): PolicyTerms {
86:   // Read the policy_terms.json synchronously for simplicity
87:   const filePath = path.join(process.cwd(), 'data', 'policy_terms.json');
88:   const fileContents = fs.readFileSync(filePath, 'utf-8');
89:   return JSON.parse(fileContents) as PolicyTerms;
90: }
````

## File: lib/traces/traceMessages.ts
````typescript
  1: /**
  2:  * Centralized trace message templates
  3:  *
  4:  * Each template is:
  5:  * - ONE SENTENCE ONLY (golden rule)
  6:  * - Plum Voice: Transparent (explain why), Caring (we/you), Simple (no jargon), Elegant (professional)
  7:  * - Data-driven: substitutes actual values (amounts, dates, names)
  8:  * - Hardcoded: fast, deterministic, auditable
  9:  */
 10: // ──────────────────────────────────────────────────────────────────
 11: // DOCUMENT VERIFIER TRACES
 12: // ──────────────────────────────────────────────────────────────────
 13: export const DocumentVerifierTraces = {
 14:   // FILE UPLOAD CHECKS
 15:   fileDataMissing: (fileIndex: number) =>
 16:     `Upload ${fileIndex + 1} didn't come through - please try uploading again.`,
 17:   // DOCUMENT CLASSIFICATION
 18:   // NOTE: Omit classification-only traces (e.g., "identified as prescription")
 19:   // - these are internal metadata, not decision-informing checks.
 20:   classificationFailed: (fileName: string) =>
 21:     `Couldn't identify "${fileName}" - please upload a clearer photo with good lighting.`,
 22:   // REQUIRED DOCUMENT CHECKS
 23:   requiredDocumentFound: (docType: string) =>
 24:     `Found your ${docType.replace(/_/g, ' ').toLowerCase()}.`,
 25:   requiredDocumentMissing: (docType: string) =>
 26:     `Missing your ${docType.replace(/_/g, ' ').toLowerCase()} (required for this claim type).`,
 27:   requiredDocumentWrong: (foundType: string, expectedType: string) =>
 28:     `Found ${foundType.replace(/_/g, ' ').toLowerCase()} instead of ${expectedType.replace(/_/g, ' ').toLowerCase()} (not what we need for this claim).`,
 29:   // READABILITY CHECKS
 30:   documentUnreadable: (docType: string, issues: string[]) =>
 31:     `${docType.replace(/_/g, ' ')} photo is too dark/blurry - please re-upload a clearer image.`,
 32:   documentReadable: (docType: string) =>
 33:     `${docType.replace(/_/g, ' ')} is clear and readable.`,
 34:   // CROSS-DOCUMENT CONSISTENCY
 35:   patientNameMismatch: (names: Map<string, string>) => {
 36:     const namesList = Array.from(names)
 37:       .map(([type, name]) => `${type}: "${name}"`)
 38:       .join(', ');
 39:     return `Patient names don't match across documents (${namesList}) - verify these are the right documents.`;
 40:   },
 41:   patientNameMatch: (patientName: string) =>
 42:     `All documents are for the same patient ("${patientName}") - names match.`,
 43: };
 44: // ──────────────────────────────────────────────────────────────────
 45: // POLICY ENGINE TRACES
 46: // ──────────────────────────────────────────────────────────────────
 47: export const PolicyEngineTraces = {
 48:   // MEMBER CHECKS
 49:   memberNotFound: (memberId: string) =>
 50:     `Member ID ${memberId} not found on this policy.`,
 51:   memberFound: (memberId: string, name: string) =>
 52:     `Member ${memberId} (${name}) is active on this policy.`,
 53:   // POLICY PERIOD CHECKS
 54:   policyActive: (treatmentDate: string) =>
 55:     `Your coverage was active on the treatment date (${treatmentDate}).`,
 56:   policyInactive: (treatmentDate: string, endDate: string) =>
 57:     `Your coverage ended ${endDate}; treatment date ${treatmentDate} is outside your active period.`,
 58:   // SUBMISSION DEADLINE CHECKS
 59:   submissionOnTime: (daysElapsed: number, deadline: number) =>
 60:     `Claim submitted ${daysElapsed} days after treatment (deadline is ${deadline} days).`,
 61:   submissionLate: (daysElapsed: number, deadline: number) =>
 62:     `Claim submitted ${daysElapsed} days after treatment (deadline was ${deadline} days).`,
 63:   // MINIMUM AMOUNT CHECKS
 64:   amountAboveMinimum: (amount: number, minimum: number) =>
 65:     `Claim amount ₹${amount.toLocaleString('en-IN')} meets the minimum of ₹${minimum.toLocaleString('en-IN')}.`,
 66:   amountBelowMinimum: (amount: number, minimum: number) =>
 67:     `Claim amount ₹${amount.toLocaleString('en-IN')} is below the minimum of ₹${minimum.toLocaleString('en-IN')}.`,
 68:   // WAITING PERIOD CHECKS
 69:   waitingPeriodCompleted: (periodDays: number) =>
 70:     `You've completed the ${periodDays}-day waiting period (eligible for claims now).`,
 71:   waitingPeriodActive: (periodDays: number, daysRemaining: number, eligibleDate: string) =>
 72:     `Treatment is within the ${periodDays}-day waiting period (${daysRemaining} days remaining; you're eligible from ${eligibleDate}).`,
 73:   conditionWaitingPeriodActive: (condition: string, periodDays: number, daysRemaining: number) =>
 74:     `"${condition}" has a ${periodDays}-day waiting period (${daysRemaining} days remaining).`,
 75:   conditionWaitingPeriodCompleted: (condition: string) =>
 76:     `No waiting period restrictions for "${condition}".`,
 77:   // CATEGORY COVERAGE CHECKS
 78:   categoryNotCovered: (category: string) =>
 79:     `${category} claims aren't covered under your plan.`,
 80:   categoryCovered: (category: string) =>
 81:     `${category} claims are covered under your plan.`,
 82:   // EXCLUSIONS CHECKS
 83:   conditionExcluded: (diagnosis: string) =>
 84:     `"${diagnosis}" is excluded from coverage under your plan.`,
 85:   conditionNotExcluded: () =>
 86:     `Nothing in your claim is on the exclusions list.`,
 87:   partialCoverageExcluded: (excludedItems: string[]) =>
 88:     `Some items in your claim aren't covered (${excludedItems.join(', ')}); we'll approve what we can.`,
 89:   // PRE-AUTHORIZATION CHECKS
 90:   preAuthRequired: (category: string) =>
 91:     `${category} claims need approval before treatment (please resubmit with pre-auth).`,
 92:   preAuthItemRequired: (item: string, threshold: number) =>
 93:     `"${item}" (₹${threshold.toLocaleString('en-IN')}+) needs approval before treatment.`,
 94:   preAuthNotRequired: () =>
 95:     `Pre-authorization isn't required for this claim.`,
 96:   // ANNUAL OPD LIMIT CHECKS
 97:   annualLimitAvailable: (remaining: number, total: number) =>
 98:     `You have ₹${remaining.toLocaleString('en-IN')} remaining in your ₹${total.toLocaleString('en-IN')} annual limit.`,
 99:   annualLimitExhausted: (used: number, total: number, resetDate: string) =>
100:     `You've used your annual limit of ₹${total.toLocaleString('en-IN')} (resets ${resetDate}).`,
101:   // CATEGORY SUB-LIMIT CHECKS
102:   withinCategoryLimit: (amount: number, limit: number, category: string) =>
103:     `Claim ₹${amount.toLocaleString('en-IN')} is within the ${category} limit of ₹${limit.toLocaleString('en-IN')}.`,
104:   exceedsCategoryLimit: (amount: number, limit: number, category: string) =>
105:     `Claim ₹${amount.toLocaleString('en-IN')} exceeds the ${category} limit (₹${limit.toLocaleString('en-IN')}); we can approve ₹${limit.toLocaleString('en-IN')}.`,
106:   // PER-CLAIM LIMIT CHECKS
107:   withinPerClaimLimit: (amount: number, limit: number) =>
108:     `Claim ₹${amount.toLocaleString('en-IN')} is within the per-claim limit of ₹${limit.toLocaleString('en-IN')}.`,
109:   exceedsPerClaimLimit: (amount: number, limit: number) =>
110:     `Claim ₹${amount.toLocaleString('en-IN')} exceeds the per-claim limit of ₹${limit.toLocaleString('en-IN')}; we can approve ₹${limit.toLocaleString('en-IN')}.`,
111:   // NETWORK DISCOUNT (INFO)
112:   networkStatusUnknown: (hospital: string) =>
113:     `Couldn't confirm if "${hospital}" is in our network (we'll proceed without discount).`,
114:   networkDiscountApplied: (hospital: string, percent: number) =>
115:     `"${hospital}" is in our network - applying ${percent}% discount.`,
116:   // COPAY (INFO)
117:   copayApplied: (percent: number, amount: number) =>
118:     `Your plan includes a ${percent}% co-pay (your share: ₹${amount.toLocaleString('en-IN')}).`,
119:   // CONSISTENCY CHECKS
120:   hospitalMismatch: () =>
121:     `Hospital name mismatch between input and documents.`,
122:   dateMismatch: () =>
123:     `Treatment date mismatch between input and documents.`,
124:   // FINAL AMOUNTS (INFO)
125:   approvalAmount: (amount: number) =>
126:     `Everything checks out - approved refund: ₹${amount.toLocaleString('en-IN')}.`,
127: };
128: // ──────────────────────────────────────────────────────────────────
129: // INFORMATION EXTRACTOR TRACES
130: // ──────────────────────────────────────────────────────────────────
131: export const InformationExtractorTraces = {
132:   // DATA EXTRACTION
133:   dataExtracted: (docType: string, confidence: number, fieldsFound?: number, fieldsExpected?: number) => {
134:     const details = fieldsFound && fieldsExpected ? ` (${fieldsFound}/${fieldsExpected} fields)` : '';
135:     return `Extracted data from ${docType}${details}.`;
136:   },
137:   extractionFailed: (docType: string) =>
138:     `Couldn't extract details from ${docType} (we'll continue with other documents).`,
139:   // PROVIDER EXTRACTION
140:   providerIdentified: (provider: string) =>
141:     `Treatment was at ${provider}.`,
142:   // DIAGNOSIS EXTRACTION
143:   diagnosisIdentified: (diagnosis: string) =>
144:     `Diagnosis: ${diagnosis}.`,
145: };
146: // ──────────────────────────────────────────────────────────────────
147: // FRAUD DETECTOR TRACES
148: // ──────────────────────────────────────────────────────────────────
149: export const FraudDetectorTraces = {
150:   // HIGH VALUE CHECKS
151:   highValueClaim: (amount: number, threshold: number) =>
152:     `Claim ₹${amount.toLocaleString('en-IN')} is above the high-value threshold (₹${threshold.toLocaleString('en-IN')}) - flagging for specialist review.`,
153:   normalValueClaim: (amount: number) =>
154:     `Claim amount ₹${amount.toLocaleString('en-IN')} is within normal range.`,
155:   // SAME-DAY CLAIMS CHECK
156:   multipleSameDayClaims: (count: number, date: string) =>
157:     `${count} claims submitted on ${date} - flagging for legitimacy check.`,
158:   normalSameDayActivity: (date: string) =>
159:     `No unusual activity on ${date}.`,
160:   // MONTHLY FREQUENCY CHECK
161:   highMonthlyFrequency: (count: number, month: string) =>
162:     `${count} claims in ${month} (above normal frequency) - flagging for specialist review.`,
163:   normalMonthlyFrequency: () =>
164:     `Monthly claim frequency looks normal.`,
165:   // FRAUD RULES CHECK
166:   manualReviewFlagged: (reason: string) =>
167:     `Flagging for specialist review (${reason}); this is a standard safety check, not a rejection.`,
168: };
````

## File: lib/utils/rejectionMessageMapper.ts
````typescript
 1: // Map verbose technical rejection reasons to simple, user-friendly messages
 2: export function simplifyRejectionReasons(reasons: string[]): string[] {
 3:   const mappings: Array<{ pattern: RegExp; simplified: string }> = [
 4:     // Document verification issues (Stricter patterns to avoid "Found X instead of Y" confusion)
 5:     { pattern: /missing.*prescription|need.*prescription|provide.*prescription/i, simplified: 'We need a prescription to process this claim.' },
 6:     { pattern: /missing.*hospital.bill|need.*hospital.bill|provide.*hospital.bill|required.*hospital.bill/i, simplified: 'We need a hospital bill or itemized receipt.' },
 7:     { pattern: /missing.*lab.report|need.*lab.report|provide.*lab.report/i, simplified: 'We need your lab test report.' },
 8:     { pattern: /missing.*discharge.summary|need.*discharge.summary|provide.*discharge.summary/i, simplified: 'We need your discharge summary.' },
 9:     { pattern: /missing.*pharmacy.bill|need.*pharmacy.bill|provide.*pharmacy.bill/i, simplified: 'We need a pharmacy receipt or medicine bill.' },
10:     { pattern: /unreadable|unclear|dark|blurry|shadowed|low-contrast/i, simplified: 'The document was too unclear to read. Please upload a clearer photo.' },
11:     { pattern: /name.*mismatch|names.*don't.*match|names.*don.*t.*match|spelling.*variation/i, simplified: 'The names on your documents don\'t match. Please verify your documents are for the same person.' },
12:     // Policy and timing issues
13:     { pattern: /waiting.period|within.*waiting.*period/i, simplified: 'This treatment falls within the waiting period of your policy.' },
14:     { pattern: /not covered|isn.*t covered|aren.*t covered|category.*isn.*t|claim.*category.*not/i, simplified: 'This claim category isn\'t covered under your plan.' },
15:     { pattern: /pre.auth|pre-auth|pre.*authorisation|pre.*authorization/i, simplified: 'This claim requires pre-authorization. Please resubmit with approval.' },
16:     { pattern: /annual.*limit|limit.*exceeded|used.*up.*year/i, simplified: 'You\'ve used your annual coverage limit.' },
17:     { pattern: /submission.*deadline|days.*after.*treatment|claimed.*more.*than.*days/i, simplified: 'This claim was submitted too long after treatment. Claims must be submitted within 30 days.' },
18:     { pattern: /outside.*active.*period|inactive|falls.*outside.*policy|period/i, simplified: 'Treatment date is outside your active policy period.' },
19:     // Member and policy issues
20:     { pattern: /member.*not.*found|couldn.*t find.*member|member.*doesn.*t exist/i, simplified: 'We couldn\'t find this member on the policy. Please verify your member ID.' },
21:     { pattern: /excluded.*condition|matches.*excluded|condition.*not.*covered/i, simplified: 'This medical condition is excluded from your policy coverage.' },
22:   ]
23:   return reasons.map(reason => {
24:     for (const { pattern, simplified } of mappings) {
25:       if (pattern.test(reason)) {
26:         return simplified
27:       }
28:     }
29:     // Fallback: return original if no mapping found
30:     return reason
31:   })
32: }
````

## File: next.config.ts
````typescript
1: import type { NextConfig } from "next";
2: const nextConfig: NextConfig = {
3:   /* config options here */
4: };
5: export default nextConfig;
````

## File: postcss.config.mjs
````javascript
1: const config = {
2:   plugins: {
3:     "@tailwindcss/postcss": {},
4:   },
5: };
6: 
7: export default config;
````

## File: problem-statement/assignment.md
````markdown
  1: # AI Engineer Assignment
  2: ## Health Insurance Claims Processing System
  3: 
  4: ### About Plum
  5: 
  6: Plum is India's leading employee health benefits platform, protecting 6,000+ companies and 600,000+ lives. Our AI Pod builds the intelligent systems that power our claims, policy, and member care operations. We process 75,000+ claims annually today and are on a path to 10 million lives by 2030. The only way we get there without linearly scaling our operations team is by building systems that are reliable, explainable, and genuinely intelligent.
  7: 
  8: This assignment is a real problem we work on.
  9: 
 10: ---
 11: 
 12: ### The Problem
 13: 
 14: When an employee submits a health insurance claim, they upload a set of medical documents — bills, prescriptions, lab reports — along with some basic details. Someone on our team then reviews those documents against the member's policy to decide whether to approve, partially approve, or reject the claim.
 15: 
 16: This process is manual today. It is slow, inconsistent, and doesn't scale. Your job is to automate it.
 17: 
 18: ---
 19: 
 20: ### What the System Must Do
 21: 
 22: The following are non-negotiable behaviors. How you build them is entirely up to you.
 23: 
 24: **1. Accept a claim submission**
 25: A claim consists of member details, the type of treatment, a claimed amount, and one or more uploaded documents (images or PDFs).
 26: 
 27: **2. Catch document problems early**
 28: Before any processing happens, the system must verify that the right documents have been uploaded for the claim type. If a member uploads the wrong document — for example, a prescription where a hospital bill is required — the system must stop immediately and tell them exactly what is wrong and what they need to provide instead. A generic error is not acceptable. The message must be specific enough that the member knows precisely what to do next.
 29: 
 30: **3. Extract structured information**
 31: The system must extract relevant information from the uploaded documents — patient details, diagnosis, treatment, amounts, dates, doctor details. Documents will not be clean. Expect handwritten prescriptions, rubber stamps over text, phone photos of bills, and inconsistent formats.
 32: 
 33: **4. Make a claim decision**
 34: Using the extracted information and the member's policy terms, the system must produce one of the following decisions: `APPROVED`, `PARTIAL`, `REJECTED`, or `MANUAL_REVIEW`. Every decision must include the approved amount (if any), the reason, and a confidence score.
 35: 
 36: **5. Make every decision explainable**
 37: For any claim, someone on the operations team must be able to look at the system's output and understand exactly what happened — what was checked, what passed, what failed, and why the final decision was made. If a claim was rejected because of a waiting period, the trace must show that. If confidence dropped because a document was partially unreadable, that must be visible too. Black-box decisions are not acceptable.
 38: 
 39: **6. Handle failures gracefully**
 40: Individual components of your system will fail — LLM timeouts, parsing errors, bad inputs. The system must not crash. It must continue with whatever it has, reflect the degraded state in the output, and adjust its confidence accordingly.
 41: 
 42: ---
 43: 
 44: ### Policy and Member Data
 45: 
 46: The file `policy_terms.json` contains the complete policy configuration your system should use: coverage categories, sub-limits, co-pay rules, waiting periods, exclusions, pre-authorization requirements, network hospitals, and the member roster.
 47: 
 48: Your system must read and apply these rules from the file. Do not hardcode policy logic.
 49: 
 50: ---
 51: 
 52: ### Deliverables
 53: 
 54: **1. Working System**
 55: A running application with a UI for claim submission and decision review. Provide a deployed URL or clear local setup instructions. Source code on GitHub or GitLab with a clean commit history.
 56: 
 57: **2. Architecture Document**
 58: Explain the system you built. What are the components, how do they interact, and why did you design it this way? What did you consider and reject? What are the limitations of your current design and how would you address them at 10x the current load? This document is as important as the code.
 59: 
 60: **3. Component Contracts**
 61: For every significant component in your system, define its interface: what it accepts as input, what it produces as output, and what errors it can raise. These should be precise enough that another engineer could reimplement any single component without reading its code.
 62: 
 63: **4. Eval Report**
 64: Run all 12 test cases from `test_cases.json` through your system. For each case, show the decision your system produced, the full trace, and whether it matched the expected outcome. Where it didn't match, explain why.
 65: 
 66: **5. Demo Video** (8–12 minutes)
 67: Cover three things: a claim that gets stopped early due to a document problem (show the error message), a successful end-to-end approval with the full trace visible, and one technical decision you are genuinely proud of and one you would change given more time.
 68: 
 69: ---
 70: 
 71: ### Evaluation Criteria
 72: 
 73: | Criteria | Weight | What We're Looking For |
 74: |----------|--------|------------------------|
 75: | **System Design** | 30% | Is the architecture well-reasoned? Are components cleanly separated with clear responsibilities? Does it hold up under failure? Would it scale? |
 76: | **Engineering Quality** | 25% | Code clarity, error handling, data modeling, async where it matters, test coverage |
 77: | **Observability** | 20% | Can we reconstruct exactly why any claim got any decision just from the trace? |
 78: | **AI Integration** | 15% | Are LLMs being used thoughtfully? Is output structured and validated? Is failure handled? |
 79: | **Document Verification** | 10% | Does early document detection work? Are error messages specific and actionable? |
 80: 
 81: ---
 82: 
 83: ### Bonus Points
 84: - Multi-agentic architectures will will have bonus points System Design.
 85: 
 86: ---
 87: 
 88: ### Timeline
 89: 
 90: 2-3 days from receipt of this assignment.
 91: 
 92: Submit your repository link, deployed URL, and eval report. Be prepared for a 60-minute technical review where you will walk us through your architecture and we will ask you to extend it live.
 93: 
 94: ---
 95: 
 96: ### Notes
 97: 
 98: - Make conscious trade-offs and document them — your judgment about what to cut is part of what we are evaluating.
 99: - Every significant component must have tests. A system with no tests is incomplete.
100: - Use AI coding tools freely. We expect it.
101: - If you are stuck for more than two hours on something, make an assumption, document it, and move on.
102: 
103: ---
104: 
105: ### Resources
106: 
107: - `policy_terms.json` — policy configuration, coverage rules, member roster
108: - `test_cases.json` — 12 test cases with expected outcomes
109: - `sample_documents_guide.md` — Indian medical document formats and extraction guidance
````

## File: problem-statement/policy_terms.json
````json
  1: {
  2:   "policy_id": "PLUM_GHI_2024",
  3:   "policy_name": "Group Health Insurance — Standard Plan",
  4:   "insurer": "ICICI Lombard General Insurance",
  5:   "policy_holder": {
  6:     "company_name": "TechCorp Solutions Pvt Ltd",
  7:     "employee_count": 500,
  8:     "policy_start_date": "2024-04-01",
  9:     "policy_end_date": "2025-03-31",
 10:     "renewal_status": "ACTIVE"
 11:   },
 12:   "coverage": {
 13:     "sum_insured_per_employee": 500000,
 14:     "annual_opd_limit": 50000,
 15:     "per_claim_limit": 5000,
 16:     "family_floater": {
 17:       "enabled": true,
 18:       "combined_limit": 150000,
 19:       "covered_relationships": ["SELF", "SPOUSE", "CHILDREN", "PARENTS"]
 20:     }
 21:   },
 22:   "opd_categories": {
 23:     "consultation": {
 24:       "sub_limit": 2000,
 25:       "copay_percent": 10,
 26:       "network_discount_percent": 20,
 27:       "requires_prescription": true,
 28:       "requires_pre_auth": false,
 29:       "covered": true
 30:     },
 31:     "diagnostic": {
 32:       "sub_limit": 10000,
 33:       "copay_percent": 0,
 34:       "network_discount_percent": 10,
 35:       "requires_prescription": true,
 36:       "requires_pre_auth": false,
 37:       "pre_auth_threshold": 10000,
 38:       "high_value_tests_requiring_pre_auth": ["MRI", "CT Scan", "PET Scan"],
 39:       "covered": true
 40:     },
 41:     "pharmacy": {
 42:       "sub_limit": 15000,
 43:       "copay_percent": 0,
 44:       "branded_drug_copay_percent": 30,
 45:       "generic_mandatory": true,
 46:       "requires_prescription": true,
 47:       "covered": true
 48:     },
 49:     "dental": {
 50:       "sub_limit": 10000,
 51:       "copay_percent": 0,
 52:       "requires_prescription": false,
 53:       "requires_dental_report": true,
 54:       "covered": true,
 55:       "covered_procedures": [
 56:         "Root Canal Treatment",
 57:         "Tooth Extraction",
 58:         "Dental Filling",
 59:         "Scaling and Polishing",
 60:         "Dental X-Ray",
 61:         "Crown Placement",
 62:         "Gum Treatment"
 63:       ],
 64:       "excluded_procedures": [
 65:         "Teeth Whitening",
 66:         "Veneers",
 67:         "Orthodontic Treatment (Braces)",
 68:         "Implants (Cosmetic)",
 69:         "Bleaching"
 70:       ]
 71:     },
 72:     "vision": {
 73:       "sub_limit": 5000,
 74:       "copay_percent": 0,
 75:       "requires_prescription": true,
 76:       "covered": true,
 77:       "covered_items": ["Glasses", "Contact Lenses", "Eye Examination", "Cataract Surgery"],
 78:       "excluded_items": ["LASIK Surgery", "Cosmetic Eye Surgery", "Refractive Surgery"]
 79:     },
 80:     "alternative_medicine": {
 81:       "sub_limit": 8000,
 82:       "copay_percent": 0,
 83:       "requires_prescription": true,
 84:       "requires_registered_practitioner": true,
 85:       "max_sessions_per_year": 20,
 86:       "covered_systems": ["Ayurveda", "Homeopathy", "Unani", "Siddha", "Naturopathy"],
 87:       "covered": true
 88:     }
 89:   },
 90:   "waiting_periods": {
 91:     "initial_waiting_period_days": 30,
 92:     "pre_existing_conditions_days": 365,
 93:     "specific_conditions": {
 94:       "diabetes": 90,
 95:       "hypertension": 90,
 96:       "thyroid_disorders": 90,
 97:       "joint_replacement": 730,
 98:       "maternity": 270,
 99:       "mental_health": 180,
100:       "obesity_treatment": 365,
101:       "hernia": 365,
102:       "cataract": 365
103:     }
104:   },
105:   "exclusions": {
106:     "conditions": [
107:       "Self-inflicted injuries",
108:       "War or nuclear hazard",
109:       "Substance abuse treatment",
110:       "Experimental treatments",
111:       "Infertility and assisted reproduction",
112:       "Obesity and weight loss programs",
113:       "Bariatric surgery",
114:       "Cosmetic or aesthetic procedures",
115:       "Vaccination (non-medically necessary)",
116:       "Health supplements and tonics"
117:     ],
118:     "dental_exclusions": [
119:       "Teeth whitening",
120:       "Orthodontic treatment",
121:       "Cosmetic dental procedures"
122:     ],
123:     "vision_exclusions": [
124:       "LASIK",
125:       "Refractive surgery"
126:     ]
127:   },
128:   "pre_authorization": {
129:     "required_for": [
130:       "MRI scan (amount > ₹10,000)",
131:       "CT scan (amount > ₹10,000)",
132:       "PET scan",
133:       "Major surgical procedures",
134:       "Planned hospitalization"
135:     ],
136:     "validity_days": 30
137:   },
138:   "network_hospitals": [
139:     "Apollo Hospitals",
140:     "Fortis Healthcare",
141:     "Max Healthcare",
142:     "Manipal Hospitals",
143:     "Narayana Health",
144:     "Medanta",
145:     "Kokilaben Dhirubhai Ambani Hospital",
146:     "Aster CMI Hospital",
147:     "Columbia Asia",
148:     "Sakra World Hospital"
149:   ],
150:   "submission_rules": {
151:     "deadline_days_from_treatment": 30,
152:     "minimum_claim_amount": 500,
153:     "currency": "INR"
154:   },
155:   "document_requirements": {
156:     "CONSULTATION": {
157:       "required": ["PRESCRIPTION", "HOSPITAL_BILL"],
158:       "optional": ["LAB_REPORT", "DIAGNOSTIC_REPORT"]
159:     },
160:     "DIAGNOSTIC": {
161:       "required": ["PRESCRIPTION", "LAB_REPORT", "HOSPITAL_BILL"],
162:       "optional": ["DISCHARGE_SUMMARY"]
163:     },
164:     "PHARMACY": {
165:       "required": ["PRESCRIPTION", "PHARMACY_BILL"],
166:       "optional": []
167:     },
168:     "DENTAL": {
169:       "required": ["HOSPITAL_BILL"],
170:       "optional": ["PRESCRIPTION", "DENTAL_REPORT"]
171:     },
172:     "VISION": {
173:       "required": ["PRESCRIPTION", "HOSPITAL_BILL"],
174:       "optional": []
175:     },
176:     "ALTERNATIVE_MEDICINE": {
177:       "required": ["PRESCRIPTION", "HOSPITAL_BILL"],
178:       "optional": []
179:     }
180:   },
181:   "fraud_thresholds": {
182:     "same_day_claims_limit": 2,
183:     "monthly_claims_limit": 6,
184:     "high_value_claim_threshold": 25000,
185:     "auto_manual_review_above": 25000,
186:     "fraud_score_manual_review_threshold": 0.80
187:   },
188:   "members": [
189:     {
190:       "member_id": "EMP001",
191:       "name": "Rajesh Kumar",
192:       "date_of_birth": "1985-03-15",
193:       "gender": "M",
194:       "relationship": "SELF",
195:       "join_date": "2024-04-01",
196:       "dependents": ["DEP001", "DEP002"]
197:     },
198:     {
199:       "member_id": "EMP002",
200:       "name": "Priya Singh",
201:       "date_of_birth": "1990-07-22",
202:       "gender": "F",
203:       "relationship": "SELF",
204:       "join_date": "2024-04-01",
205:       "dependents": []
206:     },
207:     {
208:       "member_id": "EMP003",
209:       "name": "Amit Verma",
210:       "date_of_birth": "1988-11-05",
211:       "gender": "M",
212:       "relationship": "SELF",
213:       "join_date": "2024-04-01",
214:       "dependents": ["DEP003"]
215:     },
216:     {
217:       "member_id": "EMP004",
218:       "name": "Sneha Reddy",
219:       "date_of_birth": "1992-02-28",
220:       "gender": "F",
221:       "relationship": "SELF",
222:       "join_date": "2024-04-01",
223:       "dependents": []
224:     },
225:     {
226:       "member_id": "EMP005",
227:       "name": "Vikram Joshi",
228:       "date_of_birth": "1979-09-10",
229:       "gender": "M",
230:       "relationship": "SELF",
231:       "join_date": "2024-09-01",
232:       "dependents": []
233:     },
234:     {
235:       "member_id": "EMP006",
236:       "name": "Kavita Nair",
237:       "date_of_birth": "1983-06-18",
238:       "gender": "F",
239:       "relationship": "SELF",
240:       "join_date": "2024-04-01",
241:       "dependents": []
242:     },
243:     {
244:       "member_id": "EMP007",
245:       "name": "Suresh Patil",
246:       "date_of_birth": "1975-12-30",
247:       "gender": "M",
248:       "relationship": "SELF",
249:       "join_date": "2024-04-01",
250:       "dependents": ["DEP004", "DEP005"]
251:     },
252:     {
253:       "member_id": "EMP008",
254:       "name": "Ravi Menon",
255:       "date_of_birth": "1987-04-14",
256:       "gender": "M",
257:       "relationship": "SELF",
258:       "join_date": "2024-04-01",
259:       "dependents": []
260:     },
261:     {
262:       "member_id": "EMP009",
263:       "name": "Anita Desai",
264:       "date_of_birth": "1993-08-25",
265:       "gender": "F",
266:       "relationship": "SELF",
267:       "join_date": "2024-04-01",
268:       "dependents": []
269:     },
270:     {
271:       "member_id": "EMP010",
272:       "name": "Deepak Shah",
273:       "date_of_birth": "1980-01-07",
274:       "gender": "M",
275:       "relationship": "SELF",
276:       "join_date": "2024-04-01",
277:       "dependents": ["DEP006"]
278:     },
279:     {
280:       "member_id": "DEP001",
281:       "name": "Sunita Kumar",
282:       "date_of_birth": "1987-05-20",
283:       "gender": "F",
284:       "relationship": "SPOUSE",
285:       "primary_member_id": "EMP001"
286:     },
287:     {
288:       "member_id": "DEP002",
289:       "name": "Arjun Kumar",
290:       "date_of_birth": "2015-08-12",
291:       "gender": "M",
292:       "relationship": "CHILD",
293:       "primary_member_id": "EMP001"
294:     }
295:   ]
296: }
````

## File: problem-statement/README.md
````markdown
 1: # Plum AI Engineer Assignment
 2: 
 3: ## Overview
 4: 
 5: This package contains everything you need to complete the Health Insurance Claims Processing assignment for the AI Engineer role at Plum.
 6: 
 7: ## Package Contents
 8: 
 9: ```
10: multi_agent_claims_pipeline/
11: │
12: ├── README.md                  # This file
13: ├── assignment.md              # Full assignment — read this first
14: ├── policy_terms.json          # Policy configuration, coverage rules, member roster
15: ├── test_cases.json            # 12 test scenarios with expected outcomes
16: └── sample_documents_guide.md  # Indian medical document formats and extraction guidance
17: ```
18: 
19: ## Getting Started
20: 
21: Read `assignment.md` in full before writing a single line of code. Understand the problem before you reach for a solution.
22: 
23: ## Timeline
24: 
25: 2-3 days from receipt.
````

## File: problem-statement/sample_documents_guide.md
````markdown
  1: # Sample Documents Guide
  2: 
  3: ## Overview
  4: 
  5: This guide describes the medical document types your Document Verification and Parsing agents must handle. Use this to build test documents and to design your extraction prompts. Real-world Indian medical documents are messy — your agents need to handle all the variations described here.
  6: 
  7: ---
  8: 
  9: ## Document Types
 10: 
 11: ### 1. Medical Prescription (Doctor's Rx)
 12: 
 13: **Standard layout:**
 14: 
 15: ```
 16: ┌─────────────────────────────────────────────────────┐
 17: │  Dr. Arun Sharma, MBBS, MD (Internal Medicine)      │
 18: │  Reg. No: KA/45678/2015                             │
 19: │  City Medical Centre, 12 MG Road, Bengaluru         │
 20: │  Ph: +91-80-XXXXXXXX                                │
 21: ├─────────────────────────────────────────────────────┤
 22: │  Patient: Rajesh Kumar          Date: 01-Nov-2024   │
 23: │  Age: 39 years   Gender: M                          │
 24: │  Chief Complaint: Fever since 3 days, body ache     │
 25: ├─────────────────────────────────────────────────────┤
 26: │  Diagnosis: Viral Fever                             │
 27: │                                                     │
 28: │  Rx:                                                │
 29: │  1. Tab Paracetamol 650mg — 1-1-1 x 5 days          │
 30: │  2. Tab Vitamin C 500mg — 0-0-1 x 7 days            │
 31: │                                                     │
 32: │  Investigations: CBC, Dengue NS1                    │
 33: │  Follow-up: After 5 days if no improvement          │
 34: │                                                     │
 35: │                            [Doctor's Signature]     │
 36: │                            [Registration Stamp]     │
 37: └─────────────────────────────────────────────────────┘
 38: ```
 39: 
 40: **Key fields to extract:**
 41: - Doctor name, registration number, specialization
 42: - Patient name, age, gender, date
 43: - Diagnosis (primary and secondary if any)
 44: - Medicines with dosage and duration
 45: - Tests ordered
 46: - Hospital/clinic name and address
 47: 
 48: **Real-world variations your agent must handle:**
 49: - Handwritten prescriptions (very common in India — may be partially illegible)
 50: - Pre-printed templates with handwritten fill-ins
 51: - Missing or partially visible registration numbers
 52: - Diagnoses written in medical shorthand (HTN = Hypertension, T2DM = Type 2 Diabetes, etc.)
 53: - Regional language names mixed with English medicine names
 54: - Multiple pages
 55: - Rubber stamps over text
 56: 
 57: ---
 58: 
 59: ### 2. Hospital Bill / Clinic Invoice
 60: 
 61: **Standard layout:**
 62: 
 63: ```
 64: ┌─────────────────────────────────────────────────────┐
 65: │  CITY MEDICAL CENTRE                                │
 66: │  12 MG Road, Bengaluru – 560001                     │
 67: │  GSTIN: 29XXXXX1234X1ZX                             │
 68: │  Ph: 080-XXXXXXXX                                   │
 69: ├─────────────────────────────────────────────────────┤
 70: │  BILL / RECEIPT                                     │
 71: │  Bill No: CMC/2024/08321    Date: 01-Nov-2024       │
 72: ├─────────────────────────────────────────────────────┤
 73: │  Patient Name: Rajesh Kumar                         │
 74: │  Age/Gender: 39 / Male                              │
 75: │  Referring Doctor: Dr. Arun Sharma                  │
 76: ├─────────────────────────────────────────────────────┤
 77: │  DESCRIPTION                  QTY    RATE    AMOUNT │
 78: │  Consultation Fee (OPD)        1    1000.00  1000.00│
 79: │  CBC (Complete Blood Count)    1     200.00   200.00│
 80: │  Dengue NS1 Antigen Test       1     300.00   300.00│
 81: │                                                     │
 82: │  Subtotal:                               1500.00    │
 83: │  GST (0% on medical):                       0.00    │
 84: │  Total Amount:                           1500.00    │
 85: ├─────────────────────────────────────────────────────┤
 86: │  Payment Mode: Cash / UPI / Card                    │
 87: │  Received by: [Cashier Name]    [Cashier Stamp]     │
 88: └─────────────────────────────────────────────────────┘
 89: ```
 90: 
 91: **Key fields to extract:**
 92: - Hospital name, address, GSTIN (if present)
 93: - Bill number, date
 94: - Patient name, age, gender
 95: - Itemized line items with amounts
 96: - GST amount (if any)
 97: - Total amount
 98: 
 99: **Real-world variations:**
100: - No GSTIN on small clinics
101: - Line items described vaguely ("Medicines" instead of itemized drugs)
102: - Multiple bills for the same treatment (pharmacy separate from consultation)
103: - Handwritten bills from small clinics — no printed format
104: - Amounts written in words and figures (discrepancies possible)
105: - Cancellation marks or corrections on amounts
106: 
107: ---
108: 
109: ### 3. Diagnostic / Lab Report
110: 
111: **Standard layout:**
112: 
113: ```
114: ┌─────────────────────────────────────────────────────┐
115: │  PRECISION DIAGNOSTICS PVT LTD                      │
116: │  NABL Accredited Lab   |   Lab ID: KA-NABL-1234     │
117: │  45 Jayanagar, Bengaluru   |  Ph: 080-XXXXXXXX      │
118: ├─────────────────────────────────────────────────────┤
119: │  Patient: Rajesh Kumar                              │
120: │  Age/Sex: 39 / Male                                 │
121: │  Ref Doctor: Dr. Arun Sharma                        │
122: │  Sample Date: 01-Nov-2024   Report Date: 01-Nov-2024│
123: │  Sample ID: PD-2024-18723                           │
124: ├─────────────────────────────────────────────────────┤
125: │  TEST NAME          RESULT    UNIT    NORMAL RANGE  │
126: │  CBC:                                               │
127: │  Hemoglobin         13.2      g/dL    13.0 – 17.0   │
128: │  WBC Count          9,800     /μL     4,500 – 11,000│
129: │  Platelet Count     185,000   /μL    150,000–450,000│
130: │                                                     │
131: │  Dengue NS1 Antigen  NEGATIVE           —           │
132: ├─────────────────────────────────────────────────────┤
133: │  Remarks: WBC count is towards upper normal limit.  │
134: │  Clinical correlation advised.                      │
135: │                                                     │
136: │  Dr. Meena Pillai, MD (Pathology)                   │
137: │  Reg. No: KA/89012/2018    [Signature & Stamp]      │
138: └─────────────────────────────────────────────────────┘
139: ```
140: 
141: **Key fields to extract:**
142: - Lab name, NABL status
143: - Patient name, age, gender
144: - Referring doctor
145: - Sample date and report date
146: - Each test name, result, unit, normal range
147: - Pathologist name and registration
148: - Any remarks/interpretation
149: 
150: ---
151: 
152: ### 4. Pharmacy Bill
153: 
154: **Standard layout:**
155: 
156: ```
157: ┌─────────────────────────────────────────────────────┐
158: │  HEALTH FIRST PHARMACY                              │
159: │  Drug Lic. No: KA-BLR-XXXX                          │
160: │  22 Brigade Road, Bengaluru                         │
161: ├─────────────────────────────────────────────────────┤
162: │  Bill No: HFP-24-09821    Date: 01-Nov-2024         │
163: │  Patient: Rajesh Kumar    Dr: Dr. Arun Sharma       │
164: ├─────────────────────────────────────────────────────┤
165: │  MEDICINE        BATCH   EXP    QTY  MRP    AMT     │
166: │  Paracetamol 650 A2341  03/26    15  2.50   37.50   │
167: │  Vitamin C 500   B7821  06/26    10  4.00   40.00   │
168: │                                                     │
169: │  Subtotal:                              77.50       │
170: │  Discount (5%):                         -3.88       │
171: │  Net Amount:                            73.62       │
172: ├─────────────────────────────────────────────────────┤
173: │  Pharmacist: R. Sharma   [Stamp]                    │
174: └─────────────────────────────────────────────────────┘
175: ```
176: 
177: **Key fields to extract:**
178: - Pharmacy name, drug license number
179: - Bill number, date
180: - Patient name, prescribing doctor
181: - Each medicine with batch, expiry, quantity, MRP, amount
182: - Discounts if any
183: - Net amount
184: 
185: ---
186: 
187: ## Doctor Registration Number Formats
188: 
189: Indian medical registration numbers follow state-specific formats. Your parsing agent must recognize and validate these:
190: 
191: | State | Format | Example |
192: |-------|--------|---------|
193: | Karnataka | KA/XXXXX/YYYY | KA/45678/2015 |
194: | Maharashtra | MH/XXXXX/YYYY | MH/23456/2018 |
195: | Delhi | DL/XXXXX/YYYY | DL/34567/2016 |
196: | Tamil Nadu | TN/XXXXX/YYYY | TN/56789/2013 |
197: | Gujarat | GJ/XXXXX/YYYY | GJ/56789/2014 |
198: | Andhra Pradesh | AP/XXXXX/YYYY | AP/67890/2017 |
199: | Uttar Pradesh | UP/XXXXX/YYYY | UP/45678/2016 |
200: | West Bengal | WB/XXXXX/YYYY | WB/34567/2015 |
201: | Kerala | KL/XXXXX/YYYY | KL/78901/2012 |
202: | Ayurveda (national) | AYUR/[STATE]/XXXXX/YYYY | AYUR/KL/2345/2019 |
203: 
204: ---
205: 
206: ## Common Indian Diagnoses Your Agents Will See
207: 
208: | Category | Common Diagnoses |
209: |----------|-----------------|
210: | Infections | Viral Fever, URI, Gastroenteritis, UTI, Dengue, Typhoid |
211: | Chronic | Hypertension (HTN), Type 2 Diabetes (T2DM), Hypothyroidism |
212: | Respiratory | Acute Bronchitis, Asthma, COPD exacerbation |
213: | Musculoskeletal | Lumbar Spondylosis, Cervical Spondylitis, Knee Osteoarthritis |
214: | Neurological | Migraine, Tension Headache, Vertigo |
215: | Dental | Dental Caries, Periapical Abscess, Gingivitis |
216: | Gastrointestinal | GERD, IBS, Peptic Ulcer Disease |
217: 
218: ---
219: 
220: ## Document Quality Variations to Handle
221: 
222: Your pipeline will need to be tested against all of these:
223: 
224: | Variation | Description | Handling Strategy |
225: |-----------|-------------|-------------------|
226: | Handwritten prescription | Fully or partially handwritten Rx | Use vision model with explicit OCR prompts |
227: | Phone photo of bill | Skewed, low contrast, partial shadows | Pre-process or prompt for best-effort extraction |
228: | Rubber stamp over text | Registration number or amounts obscured | Flag as LOW confidence field, do not fail entire doc |
229: | Multilingual doc | Hindi/Tamil/Telugu mixed with English | Extract English fields; flag regional fields as unextracted |
230: | Partial document | Page cut off or folded | Extract available fields; flag missing fields explicitly |
231: | Multiple corrections | Amounts crossed out and rewritten | Flag `DOCUMENT_ALTERATION` in fraud check |
232: | Duplicate stamp | Multiple "ORIGINAL" / "DUPLICATE" stamps | Note in extraction; surface to fraud detection |
233: | Scanned PDF (multi-page) | 4-5 page detailed bill | Process each page separately; aggregate line items |
234: 
235: ---
236: 
237: ## How to Create Mock Test Documents
238: 
239: For your own testing, you can generate mock documents using:
240: 
241: **Option 1 — HTML/CSS rendered to image:**
242: ```html
243: <!-- Build a prescription template in HTML, screenshot it -->
244: <!-- Use puppeteer or a browser screenshot tool -->
245: ```
246: 
247: **Option 2 — Python (ReportLab or fpdf2):**
248: ```python
249: from fpdf import FPDF
250: pdf = FPDF()
251: pdf.add_page()
252: pdf.set_font("Helvetica", size=12)
253: pdf.cell(200, 10, txt="Dr. Arun Sharma", ln=True)
254: # ... build full document
255: pdf.output("prescription.pdf")
256: ```
257: 
258: **Option 3 — PIL/Pillow for image-based mocks:**
259: ```python
260: from PIL import Image, ImageDraw, ImageFont
261: img = Image.new('RGB', (800, 1000), color='white')
262: draw = ImageDraw.Draw(img)
263: draw.text((50, 50), "Dr. Arun Sharma", fill='black')
264: # ... add text fields
265: img.save("prescription.jpg")
266: ```
267: 
268: **For blur/noise simulation:**
269: ```python
270: import cv2
271: blurred = cv2.GaussianBlur(image, (15, 15), 0)
272: # or add noise for poor quality simulation
273: ```
````

## File: problem-statement/test_cases.json
````json
  1: {
  2:   "version": "2.0",
  3:   "description": "Test cases for the claims processing system. Each case describes what is submitted and what the system must produce. How the system gets there is your design decision.",
  4:   "test_cases": [
  5:     {
  6:       "case_id": "TC001",
  7:       "case_name": "Wrong Document Uploaded",
  8:       "description": "Member submits two prescriptions for a consultation claim that requires a prescription and a hospital bill.",
  9:       "input": {
 10:         "member_id": "EMP001",
 11:         "policy_id": "PLUM_GHI_2024",
 12:         "claim_category": "CONSULTATION",
 13:         "treatment_date": "2024-11-01",
 14:         "claimed_amount": 1500,
 15:         "documents": [
 16:           {
 17:             "file_id": "F001",
 18:             "file_name": "dr_sharma_prescription.jpg",
 19:             "actual_type": "PRESCRIPTION"
 20:           },
 21:           {
 22:             "file_id": "F002",
 23:             "file_name": "another_prescription.jpg",
 24:             "actual_type": "PRESCRIPTION"
 25:           }
 26:         ]
 27:       },
 28:       "expected": {
 29:         "decision": null,
 30:         "system_must": [
 31:           "Stop before making any claim decision",
 32:           "Tell the member specifically what document type was uploaded and what is needed instead",
 33:           "Not return a generic error — the message must name the uploaded document type and the required document type"
 34:         ]
 35:       }
 36:     },
 37:     {
 38:       "case_id": "TC002",
 39:       "case_name": "Unreadable Document",
 40:       "description": "Member uploads a valid prescription but a blurry, unreadable photo of their pharmacy bill.",
 41:       "input": {
 42:         "member_id": "EMP004",
 43:         "policy_id": "PLUM_GHI_2024",
 44:         "claim_category": "PHARMACY",
 45:         "treatment_date": "2024-10-25",
 46:         "claimed_amount": 800,
 47:         "documents": [
 48:           {
 49:             "file_id": "F003",
 50:             "file_name": "prescription.jpg",
 51:             "actual_type": "PRESCRIPTION",
 52:             "quality": "GOOD"
 53:           },
 54:           {
 55:             "file_id": "F004",
 56:             "file_name": "blurry_bill.jpg",
 57:             "actual_type": "PHARMACY_BILL",
 58:             "quality": "UNREADABLE"
 59:           }
 60:         ]
 61:       },
 62:       "expected": {
 63:         "decision": null,
 64:         "system_must": [
 65:           "Identify that the pharmacy bill cannot be read",
 66:           "Ask the member to re-upload that specific document",
 67:           "Not reject the claim outright"
 68:         ]
 69:       }
 70:     },
 71:     {
 72:       "case_id": "TC003",
 73:       "case_name": "Documents Belong to Different Patients",
 74:       "description": "The prescription is for Rajesh Kumar but the hospital bill is for a different patient, Arjun Mehta.",
 75:       "input": {
 76:         "member_id": "EMP001",
 77:         "policy_id": "PLUM_GHI_2024",
 78:         "claim_category": "CONSULTATION",
 79:         "treatment_date": "2024-11-01",
 80:         "claimed_amount": 1500,
 81:         "documents": [
 82:           {
 83:             "file_id": "F005",
 84:             "file_name": "prescription_rajesh.jpg",
 85:             "actual_type": "PRESCRIPTION",
 86:             "patient_name_on_doc": "Rajesh Kumar"
 87:           },
 88:           {
 89:             "file_id": "F006",
 90:             "file_name": "bill_arjun.jpg",
 91:             "actual_type": "HOSPITAL_BILL",
 92:             "patient_name_on_doc": "Arjun Mehta"
 93:           }
 94:         ]
 95:       },
 96:       "expected": {
 97:         "decision": null,
 98:         "system_must": [
 99:           "Detect that the documents belong to different people",
100:           "Surface this to the member with the specific names found on each document",
101:           "Not proceed to a claim decision"
102:         ]
103:       }
104:     },
105:     {
106:       "case_id": "TC004",
107:       "case_name": "Clean Consultation — Full Approval",
108:       "description": "Complete, valid consultation claim with correct documents, valid member, covered treatment, within all limits.",
109:       "input": {
110:         "member_id": "EMP001",
111:         "policy_id": "PLUM_GHI_2024",
112:         "claim_category": "CONSULTATION",
113:         "treatment_date": "2024-11-01",
114:         "claimed_amount": 1500,
115:         "ytd_claims_amount": 5000,
116:         "documents": [
117:           {
118:             "file_id": "F007",
119:             "actual_type": "PRESCRIPTION",
120:             "content": {
121:               "doctor_name": "Dr. Arun Sharma",
122:               "doctor_registration": "KA/45678/2015",
123:               "patient_name": "Rajesh Kumar",
124:               "date": "2024-11-01",
125:               "diagnosis": "Viral Fever",
126:               "medicines": [
127:                 "Paracetamol 650mg",
128:                 "Vitamin C 500mg"
129:               ]
130:             }
131:           },
132:           {
133:             "file_id": "F008",
134:             "actual_type": "HOSPITAL_BILL",
135:             "content": {
136:               "hospital_name": "City Clinic, Bengaluru",
137:               "patient_name": "Rajesh Kumar",
138:               "date": "2024-11-01",
139:               "line_items": [
140:                 {
141:                   "description": "Consultation Fee",
142:                   "amount": 1000
143:                 },
144:                 {
145:                   "description": "CBC Test",
146:                   "amount": 300
147:                 },
148:                 {
149:                   "description": "Dengue NS1 Test",
150:                   "amount": 200
151:                 }
152:               ],
153:               "total": 1500
154:             }
155:           }
156:         ]
157:       },
158:       "expected": {
159:         "decision": "APPROVED",
160:         "approved_amount": 1350,
161:         "notes": "10% co-pay applied on consultation category (₹150 deducted)",
162:         "confidence_score": "above 0.85"
163:       }
164:     },
165:     {
166:       "case_id": "TC005",
167:       "case_name": "Waiting Period — Diabetes",
168:       "description": "Member joined 2024-09-01. Claims for diabetes treatment on 2024-10-15, which is within the 90-day waiting period for diabetes.",
169:       "input": {
170:         "member_id": "EMP005",
171:         "policy_id": "PLUM_GHI_2024",
172:         "claim_category": "CONSULTATION",
173:         "treatment_date": "2024-10-15",
174:         "claimed_amount": 3000,
175:         "documents": [
176:           {
177:             "file_id": "F009",
178:             "actual_type": "PRESCRIPTION",
179:             "content": {
180:               "doctor_name": "Dr. Sunil Mehta",
181:               "doctor_registration": "GJ/56789/2014",
182:               "patient_name": "Vikram Joshi",
183:               "diagnosis": "Type 2 Diabetes Mellitus",
184:               "medicines": [
185:                 "Metformin 500mg",
186:                 "Glimepiride 1mg"
187:               ]
188:             }
189:           },
190:           {
191:             "file_id": "F010",
192:             "actual_type": "HOSPITAL_BILL",
193:             "content": {
194:               "patient_name": "Vikram Joshi",
195:               "date": "2024-10-15",
196:               "total": 3000
197:             }
198:           }
199:         ]
200:       },
201:       "expected": {
202:         "decision": "REJECTED",
203:         "rejection_reasons": [
204:           "WAITING_PERIOD"
205:         ],
206:         "system_must": [
207:           "State the date from which the member will be eligible for diabetes-related claims"
208:         ]
209:       }
210:     },
211:     {
212:       "case_id": "TC006",
213:       "case_name": "Dental Partial Approval — Cosmetic Exclusion",
214:       "description": "Bill includes root canal treatment (covered) and teeth whitening (cosmetic, excluded). System must approve only the covered procedure.",
215:       "input": {
216:         "member_id": "EMP002",
217:         "policy_id": "PLUM_GHI_2024",
218:         "claim_category": "DENTAL",
219:         "treatment_date": "2024-10-15",
220:         "claimed_amount": 12000,
221:         "documents": [
222:           {
223:             "file_id": "F011",
224:             "actual_type": "HOSPITAL_BILL",
225:             "content": {
226:               "hospital_name": "Smile Dental Clinic",
227:               "patient_name": "Priya Singh",
228:               "line_items": [
229:                 {
230:                   "description": "Root Canal Treatment",
231:                   "amount": 8000
232:                 },
233:                 {
234:                   "description": "Teeth Whitening",
235:                   "amount": 4000
236:                 }
237:               ],
238:               "total": 12000
239:             }
240:           }
241:         ]
242:       },
243:       "expected": {
244:         "decision": "PARTIAL",
245:         "approved_amount": 8000,
246:         "system_must": [
247:           "Itemize which line items were approved and which were rejected",
248:           "State the reason for each rejection at the line-item level"
249:         ]
250:       }
251:     },
252:     {
253:       "case_id": "TC007",
254:       "case_name": "MRI Without Pre-Authorization",
255:       "description": "MRI scan costing ₹15,000 submitted without pre-authorization. Policy requires pre-auth for MRI above ₹10,000.",
256:       "input": {
257:         "member_id": "EMP007",
258:         "policy_id": "PLUM_GHI_2024",
259:         "claim_category": "DIAGNOSTIC",
260:         "treatment_date": "2024-11-02",
261:         "claimed_amount": 15000,
262:         "documents": [
263:           {
264:             "file_id": "F012",
265:             "actual_type": "PRESCRIPTION",
266:             "content": {
267:               "doctor_name": "Dr. Venkat Rao",
268:               "doctor_registration": "AP/67890/2017",
269:               "diagnosis": "Suspected Lumbar Disc Herniation",
270:               "tests_ordered": [
271:                 "MRI Lumbar Spine"
272:               ]
273:             }
274:           },
275:           {
276:             "file_id": "F013",
277:             "actual_type": "LAB_REPORT",
278:             "content": {
279:               "test_name": "MRI Lumbar Spine"
280:             }
281:           },
282:           {
283:             "file_id": "F014",
284:             "actual_type": "HOSPITAL_BILL",
285:             "content": {
286:               "line_items": [
287:                 {
288:                   "description": "MRI Lumbar Spine",
289:                   "amount": 15000
290:                 }
291:               ],
292:               "total": 15000
293:             }
294:           }
295:         ]
296:       },
297:       "expected": {
298:         "decision": "REJECTED",
299:         "rejection_reasons": [
300:           "PRE_AUTH_MISSING"
301:         ],
302:         "system_must": [
303:           "Explain that pre-authorization was required and not obtained",
304:           "Tell the member what they should do to resubmit with pre-auth"
305:         ]
306:       }
307:     },
308:     {
309:       "case_id": "TC008",
310:       "case_name": "Per-Claim Limit Exceeded",
311:       "description": "Claimed amount of ₹7,500 exceeds the per-claim limit of ₹5,000.",
312:       "input": {
313:         "member_id": "EMP003",
314:         "policy_id": "PLUM_GHI_2024",
315:         "claim_category": "CONSULTATION",
316:         "treatment_date": "2024-10-20",
317:         "claimed_amount": 7500,
318:         "ytd_claims_amount": 10000,
319:         "documents": [
320:           {
321:             "file_id": "F015",
322:             "actual_type": "PRESCRIPTION",
323:             "content": {
324:               "doctor_name": "Dr. R. Gupta",
325:               "doctor_registration": "DL/34567/2016",
326:               "diagnosis": "Gastroenteritis",
327:               "medicines": [
328:                 "Antibiotics",
329:                 "Probiotics",
330:                 "ORS"
331:               ]
332:             }
333:           },
334:           {
335:             "file_id": "F016",
336:             "actual_type": "HOSPITAL_BILL",
337:             "content": {
338:               "line_items": [
339:                 {
340:                   "description": "Consultation Fee",
341:                   "amount": 2000
342:                 },
343:                 {
344:                   "description": "Medicines",
345:                   "amount": 5500
346:                 }
347:               ],
348:               "total": 7500
349:             }
350:           }
351:         ]
352:       },
353:       "expected": {
354:         "decision": "REJECTED",
355:         "rejection_reasons": [
356:           "PER_CLAIM_EXCEEDED"
357:         ],
358:         "system_must": [
359:           "State the per-claim limit and the claimed amount clearly in the rejection message"
360:         ]
361:       }
362:     },
363:     {
364:       "case_id": "TC009",
365:       "case_name": "Fraud Signal — Multiple Same-Day Claims",
366:       "description": "Member EMP008 has already submitted 3 claims today before this one arrives. This is the 4th claim from the same member on the same day.",
367:       "input": {
368:         "member_id": "EMP008",
369:         "policy_id": "PLUM_GHI_2024",
370:         "claim_category": "CONSULTATION",
371:         "treatment_date": "2024-10-30",
372:         "claimed_amount": 4800,
373:         "claims_history": [
374:           {
375:             "claim_id": "CLM_0081",
376:             "date": "2024-10-30",
377:             "amount": 1200,
378:             "provider": "City Clinic A"
379:           },
380:           {
381:             "claim_id": "CLM_0082",
382:             "date": "2024-10-30",
383:             "amount": 1800,
384:             "provider": "City Clinic B"
385:           },
386:           {
387:             "claim_id": "CLM_0083",
388:             "date": "2024-10-30",
389:             "amount": 2100,
390:             "provider": "Wellness Center"
391:           }
392:         ],
393:         "documents": [
394:           {
395:             "file_id": "F017",
396:             "actual_type": "PRESCRIPTION",
397:             "content": {
398:               "diagnosis": "Migraine",
399:               "doctor_name": "Dr. S. Khan"
400:             }
401:           },
402:           {
403:             "file_id": "F018",
404:             "actual_type": "HOSPITAL_BILL",
405:             "content": {
406:               "total": 4800
407:             }
408:           }
409:         ]
410:       },
411:       "expected": {
412:         "decision": "MANUAL_REVIEW",
413:         "system_must": [
414:           "Flag the unusual same-day claim pattern",
415:           "Route to manual review rather than auto-rejecting",
416:           "Include the specific signals that triggered the flag in the output"
417:         ]
418:       }
419:     },
420:     {
421:       "case_id": "TC010",
422:       "case_name": "Network Hospital — Discount Applied",
423:       "description": "Valid claim at Apollo Hospitals, a network hospital. Network discount must be applied before co-pay.",
424:       "input": {
425:         "member_id": "EMP010",
426:         "policy_id": "PLUM_GHI_2024",
427:         "claim_category": "CONSULTATION",
428:         "treatment_date": "2024-11-03",
429:         "claimed_amount": 4500,
430:         "hospital_name": "Apollo Hospitals",
431:         "ytd_claims_amount": 8000,
432:         "documents": [
433:           {
434:             "file_id": "F019",
435:             "actual_type": "PRESCRIPTION",
436:             "content": {
437:               "doctor_name": "Dr. S. Iyer",
438:               "doctor_registration": "TN/56789/2013",
439:               "patient_name": "Deepak Shah",
440:               "diagnosis": "Acute Bronchitis",
441:               "medicines": [
442:                 "Amoxicillin 500mg",
443:                 "Salbutamol Inhaler"
444:               ]
445:             }
446:           },
447:           {
448:             "file_id": "F020",
449:             "actual_type": "HOSPITAL_BILL",
450:             "content": {
451:               "hospital_name": "Apollo Hospitals",
452:               "patient_name": "Deepak Shah",
453:               "line_items": [
454:                 {
455:                   "description": "Consultation Fee",
456:                   "amount": 1500
457:                 },
458:                 {
459:                   "description": "Medicines",
460:                   "amount": 3000
461:                 }
462:               ],
463:               "total": 4500
464:             }
465:           }
466:         ]
467:       },
468:       "expected": {
469:         "decision": "APPROVED",
470:         "approved_amount": 3240,
471:         "notes": "Network discount (20%) applied first on ₹4,500 = ₹3,600. Co-pay (10%) applied on ₹3,600 = ₹360 deducted. Final: ₹3,240.",
472:         "system_must": [
473:           "Apply network discount before co-pay, not after",
474:           "Show the breakdown of discount and co-pay in the decision output"
475:         ]
476:       }
477:     },
478:     {
479:       "case_id": "TC011",
480:       "case_name": "Component Failure — Graceful Degradation",
481:       "description": "One component of your system fails mid-processing (simulate with the flag below). The overall pipeline must continue, produce a decision, and make the failure visible in the output with an appropriately reduced confidence score.",
482:       "input": {
483:         "member_id": "EMP006",
484:         "policy_id": "PLUM_GHI_2024",
485:         "claim_category": "ALTERNATIVE_MEDICINE",
486:         "treatment_date": "2024-10-28",
487:         "claimed_amount": 4000,
488:         "simulate_component_failure": true,
489:         "documents": [
490:           {
491:             "file_id": "F021",
492:             "actual_type": "PRESCRIPTION",
493:             "content": {
494:               "doctor_name": "Vaidya T. Krishnan",
495:               "doctor_registration": "AYUR/KL/2345/2019",
496:               "diagnosis": "Chronic Joint Pain",
497:               "treatment": "Panchakarma Therapy"
498:             }
499:           },
500:           {
501:             "file_id": "F022",
502:             "actual_type": "HOSPITAL_BILL",
503:             "content": {
504:               "hospital_name": "Ayur Wellness Centre",
505:               "total": 4000,
506:               "line_items": [
507:                 {
508:                   "description": "Panchakarma Therapy (5 sessions)",
509:                   "amount": 3000
510:                 },
511:                 {
512:                   "description": "Consultation",
513:                   "amount": 1000
514:                 }
515:               ]
516:             }
517:           }
518:         ]
519:       },
520:       "expected": {
521:         "decision": "APPROVED",
522:         "system_must": [
523:           "Not crash or return a 500 error",
524:           "Indicate in the output that a component failed and was skipped",
525:           "Return a confidence score lower than a normal full-pipeline approval",
526:           "Include a note that manual review is recommended due to incomplete processing"
527:         ]
528:       }
529:     },
530:     {
531:       "case_id": "TC012",
532:       "case_name": "Excluded Treatment",
533:       "description": "Member claims for bariatric consultation and a diet program. Obesity treatment is explicitly excluded under the policy.",
534:       "input": {
535:         "member_id": "EMP009",
536:         "policy_id": "PLUM_GHI_2024",
537:         "claim_category": "CONSULTATION",
538:         "treatment_date": "2024-10-18",
539:         "claimed_amount": 8000,
540:         "documents": [
541:           {
542:             "file_id": "F023",
543:             "actual_type": "PRESCRIPTION",
544:             "content": {
545:               "doctor_name": "Dr. P. Banerjee",
546:               "doctor_registration": "WB/34567/2015",
547:               "diagnosis": "Morbid Obesity — BMI 37",
548:               "treatment": "Bariatric Consultation and Customised Diet Plan"
549:             }
550:           },
551:           {
552:             "file_id": "F024",
553:             "actual_type": "HOSPITAL_BILL",
554:             "content": {
555:               "line_items": [
556:                 {
557:                   "description": "Bariatric Consultation",
558:                   "amount": 3000
559:                 },
560:                 {
561:                   "description": "Personalised Diet and Nutrition Program",
562:                   "amount": 5000
563:                 }
564:               ],
565:               "total": 8000
566:             }
567:           }
568:         ]
569:       },
570:       "expected": {
571:         "decision": "REJECTED",
572:         "rejection_reasons": [
573:           "EXCLUDED_CONDITION"
574:         ],
575:         "confidence_score": "above 0.90"
576:       }
577:     }
578:   ],
579:   "notes": [
580:     "TC001–TC003 test early document problem detection. The quality of the user-facing message is part of the evaluation — not just whether the system stops.",
581:     "TC010 tests financial calculation order — network discount must be applied before co-pay.",
582:     "TC011 tests resilience. A system that crashes on component failure does not pass this case.",
583:     "For your eval report, show the full decision output for each case, not just pass/fail."
584:   ]
585: }
````

## File: public/file.svg
````xml
1: <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````xml
1: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````xml
1: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````xml
1: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: reports/mock/document_ruiner.py
````python
 1: import cv2
 2: import numpy as np
 3: from PIL import Image, ImageDraw, ImageFont, ImageEnhance
 4: import random
 5: class DocumentRuiner:
 6:     @staticmethod
 7:     def simulate_bad_phone_photo(image_path, output_path, blur_intensity=5, darken_factor=0.6):
 8:         """
 9:         Simulates a poorly lit, out-of-focus mobile phone picture of a bill.
10:         Perfect for TC002 (Unreadable Document).
11:         """
12:         # 1. Load image with OpenCV
13:         img = cv2.imread(image_path)
14:         # 2. Apply Gaussian Blur (simulating out of focus)
15:         # blur_intensity must be an odd number
16:         blur_val = blur_intensity if blur_intensity % 2 != 0 else blur_intensity + 1
17:         blurred = cv2.GaussianBlur(img, (blur_val, blur_val), 0)
18:         # 3. Add camera noise (simulating high ISO in low light)
19:         row, col, ch = blurred.shape
20:         gauss = np.random.normal(0, 15, (row, col, ch))
21:         gauss = gauss.reshape(row, col, ch)
22:         noisy = blurred + gauss
23:         noisy = np.clip(noisy, 0, 255).astype(np.uint8)
24:         # 4. Convert to PIL to drop brightness and contrast
25:         pil_img = Image.fromarray(cv2.cvtColor(noisy, cv2.COLOR_BGR2RGB))
26:         # Darken the image
27:         enhancer = ImageEnhance.Brightness(pil_img)
28:         darkened = enhancer.enhance(darken_factor)
29:         # Lower contrast (washed out look)
30:         enhancer = ImageEnhance.Contrast(darkened)
31:         final_img = enhancer.enhance(0.7)
32:         # 5. Apply a slight rotation (phone wasn't held straight)
33:         final_img = final_img.rotate(random.uniform(-2.0, 2.0), expand=True, fillcolor=(220, 220, 220))
34:         final_img.save(output_path)
35:         print(f"Saved bad phone photo to: {output_path}")
36:     @staticmethod
37:     def add_rubber_stamp(image_path, output_path, stamp_text, position_x, position_y):
38:         """
39:         Overlays a semi-transparent, rotated rubber stamp.
40:         Perfect for TC005 (Occluding the Doctor's Reg No).
41:         """
42:         # Load the base image
43:         base = Image.open(image_path).convert("RGBA")
44:         # Create a blank transparent layer for the stamp
45:         stamp_layer = Image.new("RGBA", base.size, (255, 255, 255, 0))
46:         draw = ImageDraw.Draw(stamp_layer)
47:         # Use a default font (or load a specific one if you download a TTF)
48:         # font = ImageFont.truetype("arial.ttf", 40)
49:         font = ImageFont.load_default() 
50:         # Draw the stamp text (Blue ink, with some transparency - Alpha 150)
51:         stamp_color = (20, 40, 200, 150)
52:         # Draw a bounding box for the stamp
53:         draw.rectangle(
54:             [position_x - 10, position_y - 10, position_x + 200, position_y + 40], 
55:             outline=stamp_color, 
56:             width=3
57:         )
58:         # Draw the text
59:         draw.text((position_x, position_y), stamp_text, fill=stamp_color, font=font)
60:         # Rotate JUST the stamp layer to make it look quickly slapped on
61:         stamp_layer = stamp_layer.rotate(random.uniform(-15, 15), center=(position_x, position_y))
62:         # Composite the stamp over the base document
63:         final = Image.alpha_composite(base, stamp_layer)
64:         # Convert back to RGB to save as JPG
65:         final = final.convert("RGB")
66:         final.save(output_path)
67:         print(f"Saved stamped document to: {output_path}")
68: # ==========================================
69: # HOW TO USE IT
70: # ==========================================
71: if __name__ == "__main__":
72:     # First, let's create a dummy "clean" image to test on using PIL
73:     dummy_img = Image.new('RGB', (800, 1000), color='white')
74:     d = ImageDraw.Draw(dummy_img)
75:     d.text((50, 50), "HEALTH FIRST PHARMACY", fill='black')
76:     d.text((50, 100), "Paracetamol 650mg - 15 Tabs - Rs 37.50", fill='black')
77:     d.text((50, 150), "Reg No: GJ/56789/2014", fill='black') # Target for the stamp
78:     dummy_img.save("clean_baseline.jpg")
79:     ruiner = DocumentRuiner()
80:     # 1. Create the TC002 Unreadable Pharmacy Bill
81:     ruiner.simulate_bad_phone_photo(
82:         image_path="clean_baseline.jpg", 
83:         output_path="tc002_blurry_pharmacy_bill.jpg",
84:         blur_intensity=7, # Increase for more blur
85:         darken_factor=0.5
86:     )
87:     # 2. Create the TC005 Stamped Diabetes Prescription
88:     ruiner.add_rubber_stamp(
89:         image_path="clean_baseline.jpg",
90:         output_path="tc005_stamped_prescription.jpg",
91:         stamp_text="RECEIVED - ORIGINAL",
92:         position_x=45,  # Placing it directly over the Reg No text
93:         position_y=140
94:     )
````

## File: reports/mock/mock_generator.py
````python
  1: import cv2
  2: import numpy as np
  3: from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
  4: import random
  5: import os
  6: # Plum Brand Colors
  7: PLUM_MAIN = (43, 11, 33)       # #2b0b21
  8: PLUM_SECONDARY = (94, 44, 77)  # #5e2c4d
  9: PLUM_OFFWHITE = (255, 244, 235) # #fff4eb
 10: PLUM_PINK = (255, 64, 82)      # #ff4052
 11: class PlumMockEngine:
 12:     def __init__(self):
 13:         # Load fonts - Adjust paths as per your OS
 14:         try:
 15:             self.font_bold = ImageFont.truetype("arialbd.ttf", 24)
 16:             self.font_regular = ImageFont.truetype("arial.ttf", 18)
 17:             self.font_small = ImageFont.truetype("arial.ttf", 14)
 18:             # Use a cursive font for diagnosis/handwriting simulation
 19:             self.font_hand = ImageFont.truetype("DancingScript-Regular.ttf", 28)
 20:         except:
 21:             print("Warning: Custom fonts not found, using defaults.")
 22:             self.font_bold = self.font_regular = self.font_small = self.font_hand = ImageFont.load_default()
 23:     def create_base_paper(self, color=PLUM_OFFWHITE):
 24:         """Creates an A4-style high-res canvas."""
 25:         return Image.new('RGB', (800, 1100), color=color)
 26:     def draw_header(self, draw, title, subtitle, reg_no):
 27:         """Draws the professional header for doctors/hospitals."""
 28:         draw.rectangle([0, 0, 800, 120], fill=PLUM_MAIN)
 29:         draw.text((40, 30), title, font=self.font_bold, fill=PLUM_OFFWHITE)
 30:         draw.text((40, 65), subtitle, font=self.font_small, fill=PLUM_OFFWHITE)
 31:         draw.text((600, 30), "REG NO:", font=self.font_small, fill=PLUM_PINK)
 32:         draw.text((600, 50), reg_no, font=self.font_regular, fill=PLUM_OFFWHITE)
 33:     # ==========================================
 34:     # DOCUMENT TYPES
 35:     # ==========================================
 36:     def generate_prescription(self, patient_name, diagnosis, date):
 37:         img = self.create_base_paper()
 38:         draw = ImageDraw.Draw(img)
 39:         self.draw_header(draw, "DR. ARUN SHARMA, MBBS, MD", "City Medical Centre, 12 MG Road, Bengaluru", "KA/2015/45678")
 40:         # Rx Content
 41:         draw.text((40, 160), f"Patient: {patient_name}", font=self.font_bold, fill=PLUM_MAIN)
 42:         draw.text((600, 160), f"Date: {date}", font=self.font_regular, fill=PLUM_MAIN)
 43:         draw.line([40, 200, 760, 200], fill=PLUM_SECONDARY, width=2)
 44:         draw.text((40, 230), "Rx", font=self.font_bold, fill=PLUM_PINK)
 45:         # The Handwriting Stress Test
 46:         draw.text((40, 280), "Diagnosis:", font=self.font_bold, fill=PLUM_MAIN)
 47:         draw.text((160, 275), diagnosis, font=self.font_hand, fill=(30, 30, 120)) # Blue ink
 48:         medicines = [
 49:             "1. Tab. Paracetamol 650mg --- 1-1-1 (5 days)",
 50:             "2. Tab. Vitamin C 500mg --- 0-0-1 (10 days)",
 51:             "3. Syrup Benadryl --- 5ml before bed"
 52:         ]
 53:         y = 350
 54:         for med in medicines:
 55:             draw.text((60, y), med, font=self.font_regular, fill=PLUM_MAIN)
 56:             y += 40
 57:         return img
 58:     def generate_hospital_bill(self, hospital_name, patient_name, items, total):
 59:         img = self.create_base_paper(color=(255, 255, 255))
 60:         draw = ImageDraw.Draw(img)
 61:         # Modern Hospital Look
 62:         draw.rectangle([0, 0, 800, 10], fill=PLUM_PINK)
 63:         draw.text((40, 40), hospital_name.upper(), font=self.font_bold, fill=PLUM_MAIN)
 64:         draw.text((40, 75), "TAX INVOICE / RECEIPT", font=self.font_small, fill=PLUM_SECONDARY)
 65:         # Meta info
 66:         draw.text((40, 150), f"Bill to: {patient_name}", font=self.font_regular, fill=PLUM_MAIN)
 67:         draw.text((600, 150), "Date: 01-Nov-2024", font=self.font_regular, fill=PLUM_MAIN)
 68:         # Table Header
 69:         draw.rectangle([40, 200, 760, 240], fill=PLUM_SECONDARY)
 70:         draw.text((50, 210), "Description", font=self.font_regular, fill=PLUM_OFFWHITE)
 71:         draw.text((650, 210), "Amount (₹)", font=self.font_regular, fill=PLUM_OFFWHITE)
 72:         y = 260
 73:         for item, price in items:
 74:             draw.text((50, y), item, font=self.font_regular, fill=PLUM_MAIN)
 75:             draw.text((650, y), f"{price:,.2f}", font=self.font_regular, fill=PLUM_MAIN)
 76:             y += 50
 77:             draw.line([40, y-10, 760, y-10], fill=(230, 230, 230), width=1)
 78:         # Grand Total
 79:         draw.text((500, y+20), "GRAND TOTAL:", font=self.font_bold, fill=PLUM_MAIN)
 80:         draw.text((650, y+20), f"₹ {total:,.2f}", font=self.font_bold, fill=PLUM_PINK)
 81:         return img
 82:     # ==========================================
 83:     # THE "RUINER" TOOLS (OpenCV & Filters)
 84:     # ==========================================
 85:     def apply_perspective_warp(self, pil_img):
 86:         """Makes the document look like a skewed phone photo."""
 87:         open_cv_image = np.array(pil_img)
 88:         rows, cols, ch = open_cv_image.shape
 89:         # Define 4 corners of the source and move them slightly randomly
 90:         pts1 = np.float32([[0, 0], [cols, 0], [0, rows], [cols, rows]])
 91:         pts2 = np.float32([
 92:             [random.randint(0, 30), random.randint(0, 30)], 
 93:             [cols - random.randint(0, 30), random.randint(0, 30)], 
 94:             [random.randint(0, 30), rows - random.randint(0, 30)], 
 95:             [cols - random.randint(0, 30), rows - random.randint(0, 30)]
 96:         ])
 97:         M = cv2.getPerspectiveTransform(pts1, pts2)
 98:         dst = cv2.warpPerspective(open_cv_image, M, (cols, rows), borderValue=(50, 50, 50))
 99:         return Image.fromarray(dst)
100:     def apply_digital_chaos(self, pil_img, blur=0, noise=0, darkness=1.0):
101:         """Simulates low light, ISO noise, and blur."""
102:         # 1. Darken
103:         enhancer = ImageEnhance.Brightness(pil_img)
104:         img = enhancer.enhance(darkness)
105:         # 2. Gaussian Blur
106:         if blur > 0:
107:             img = img.filter(ImageFilter.GaussianBlur(radius=blur))
108:         # 3. ISO Noise (OpenCV)
109:         if noise > 0:
110:             cv_img = np.array(img)
111:             n = np.random.normal(0, noise, cv_img.shape)
112:             cv_img = np.clip(cv_img + n, 0, 255).astype(np.uint8)
113:             img = Image.fromarray(cv_img)
114:         return img
115:     def add_rubber_stamp(self, pil_img, text="PAID", color=(20, 40, 180, 180)):
116:         """Adds an ink stamp that overlaps text."""
117:         overlay = Image.new('RGBA', pil_img.size, (0,0,0,0))
118:         d = ImageDraw.Draw(overlay)
119:         # Draw a messy circle/rect stamp
120:         coords = [450, 700, 650, 800]
121:         d.rectangle(coords, outline=color, width=5)
122:         d.text((470, 730), text, font=self.font_bold, fill=color)
123:         # Rotate the stamp randomly
124:         overlay = overlay.rotate(random.randint(-20, 20), resample=Image.BICUBIC)
125:         # Merge
126:         pil_img = pil_img.convert("RGBA")
127:         combined = Image.alpha_composite(pil_img, overlay)
128:         return combined.convert("RGB")
129: # ==========================================
130: # RUN GENERATION
131: # ==========================================
132: if __name__ == "__main__":
133:     engine = PlumMockEngine()
134:     if not os.path.exists("mocks"): os.makedirs("mocks")
135:     # 1. TC004 - Clean Happy Path (Rajesh Kumar)
136:     rx = engine.generate_prescription("Rajesh Kumar", "Viral Fever and URI", "01-Nov-2024")
137:     rx.save("mocks/tc004_prescription.jpg")
138:     bill_items = [("Consultation Fee", 1000), ("CBC Test", 300), ("Dengue NS1", 200)]
139:     bill = engine.generate_hospital_bill("Apollo Hospitals", "Rajesh Kumar", bill_items, 1500)
140:     bill.save("mocks/tc004_apollo_bill.jpg")
141:     # 2. TC002 - The "Unreadable" Horror (Blurry Pharmacy)
142:     pharma_items = [("Amoxicillin", 120), ("Paracetamol", 40)]
143:     pharma_bill = engine.generate_hospital_bill("HealthFirst Pharmacy", "Sneha Reddy", pharma_items, 160)
144:     pharma_bill = engine.apply_digital_chaos(pharma_bill, blur=4, noise=30, darkness=0.5)
145:     pharma_bill = engine.apply_perspective_warp(pharma_bill)
146:     pharma_bill.save("mocks/tc002_blurry_pharma.jpg")
147:     # 3. TC011 - The "Stamp Over Text" (Low Confidence)
148:     kavita_rx = engine.generate_prescription("Kavita Nair", "Severe Osteoarthritis", "28-Oct-2024")
149:     kavita_rx = engine.add_rubber_stamp(kavita_rx, "DUPLICATE COPY", color=(180, 20, 20, 150))
150:     kavita_rx.save("mocks/tc011_stamped_rx.jpg")
151:     # 4. TC007 - The High Value MRI (Fortis)
152:     mri_items = [("MRI Lumbar Spine", 14500), ("Contrast Media", 500)]
153:     mri_bill = engine.generate_hospital_bill("Fortis Healthcare", "Suresh Patil", mri_items, 15000)
154:     mri_bill.save("mocks/tc007_fortis_mri.jpg")
155:     print("Success! 6 mock documents generated in /mocks folder.")
````

## File: reports/mock/plum_stress_engine.py
````python
  1: import cv2
  2: import numpy as np
  3: from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
  4: import random
  5: import os
  6: # Plum Brand Colors
  7: PLUM_MAIN = (43, 11, 33)       # #2b0b21
  8: PLUM_SECONDARY = (94, 44, 77)  # #5e2c4d
  9: PLUM_OFFWHITE = (255, 244, 235) # #fff4eb
 10: PLUM_PINK = (255, 64, 82)      # #ff4052
 11: class PlumStressEngine:
 12:     def __init__(self):
 13:         # Paths for Windows/Linux - Adjust if necessary
 14:         self.font_path = "arial.ttf" 
 15:         self.hand_font_path = "DancingScript-Regular.ttf" # Download this!
 16:         try:
 17:             self.f_h1 = ImageFont.truetype("arialbd.ttf", 32)
 18:             self.f_h2 = ImageFont.truetype("arialbd.ttf", 20)
 19:             self.f_body = ImageFont.truetype("arial.ttf", 16)
 20:             self.f_hand = ImageFont.truetype(self.hand_font_path, 26)
 21:             self.f_hand_small = ImageFont.truetype(self.hand_font_path, 20)
 22:         except:
 23:             self.f_h1 = self.f_h2 = self.f_body = self.f_hand = self.f_hand_small = ImageFont.load_default()
 24:     def create_canvas(self):
 25:         return Image.new('RGB', (850, 1200), color=PLUM_OFFWHITE)
 26:     # ==========================================
 27:     # CORE DOCUMENT GENERATORS
 28:     # ==========================================
 29:     def generate_lab_report(self, patient_name, tests):
 30:         img = self.create_canvas()
 31:         draw = ImageDraw.Draw(img)
 32:         # Header
 33:         draw.rectangle([0, 0, 850, 150], fill=PLUM_MAIN)
 34:         draw.text((40, 40), "PRECISION DIAGNOSTICS", font=self.f_h1, fill=PLUM_OFFWHITE)
 35:         draw.text((40, 85), "NABL ACCREDITED LAB | Reg: LAB-KA-9921", font=self.f_body, fill=PLUM_PINK)
 36:         # Patient Info
 37:         draw.text((40, 180), f"Patient: {patient_name}", font=self.f_h2, fill=PLUM_MAIN)
 38:         draw.text((600, 180), "Date: 01-Nov-2024", font=self.f_body, fill=PLUM_MAIN)
 39:         draw.line([40, 220, 810, 220], fill=PLUM_SECONDARY, width=2)
 40:         # Table Header
 41:         draw.text((50, 240), "TEST NAME", font=self.f_h2, fill=PLUM_SECONDARY)
 42:         draw.text((400, 240), "RESULT", font=self.f_h2, fill=PLUM_SECONDARY)
 43:         draw.text((600, 240), "NORMAL RANGE", font=self.f_h2, fill=PLUM_SECONDARY)
 44:         y = 280
 45:         for test, res, range_val in tests:
 46:             draw.text((50, y), test, font=self.f_body, fill=PLUM_MAIN)
 47:             draw.text((400, y), res, font=self.f_h2, fill=(20, 80, 20)) # Dark Green Result
 48:             draw.text((600, y), range_val, font=self.f_body, fill=(100, 100, 100))
 49:             y += 45
 50:             draw.line([40, y-5, 810, y-5], fill=(220, 220, 220), width=1)
 51:         return img
 52:     def generate_dental_bill(self, patient_name, items):
 53:         img = self.create_canvas()
 54:         draw = ImageDraw.Draw(img)
 55:         # Elegant Dental Header
 56:         draw.rectangle([0, 0, 850, 100], fill=PLUM_SECONDARY)
 57:         draw.text((40, 35), "SMILE CARE DENTAL", font=self.f_h1, fill=PLUM_OFFWHITE)
 58:         draw.text((40, 130), f"BILLING TO: {patient_name}", font=self.f_h2, fill=PLUM_MAIN)
 59:         y = 200
 60:         total = 0
 61:         for item, price in items:
 62:             draw.text((50, y), item, font=self.f_body, fill=PLUM_MAIN)
 63:             draw.text((650, y), f"Rs. {price}", font=self.f_body, fill=PLUM_MAIN)
 64:             total += price
 65:             y += 50
 66:         draw.line([500, y, 750, y], fill=PLUM_MAIN, width=2)
 67:         draw.text((500, y+20), "NET PAYABLE:", font=self.f_h2, fill=PLUM_PINK)
 68:         draw.text((650, y+20), f"₹ {total}", font=self.f_h1, fill=PLUM_PINK)
 69:         return img
 70:     # ==========================================
 71:     # THE "CRAZY" RUINER TOOLS
 72:     # ==========================================
 73:     def add_handwritten_correction(self, pil_img, x, y, old_val, new_val):
 74:         """Crosses out a printed value and writes a new one by hand."""
 75:         draw = ImageDraw.Draw(pil_img)
 76:         # Scratch out
 77:         draw.line([x-5, y+10, x+80, y+5], fill=(200, 0, 0), width=3)
 78:         # New value in "handwriting"
 79:         draw.text((x+90, y-5), f"Rs. {new_val}", font=self.f_hand, fill=(20, 20, 150))
 80:         return pil_img
 81:     def apply_coffee_stain(self, pil_img):
 82:         """Adds a nasty brown alpha-blended stain."""
 83:         stain_layer = Image.new('RGBA', pil_img.size, (0,0,0,0))
 84:         draw = ImageDraw.Draw(stain_layer)
 85:         # Create a random blob
 86:         draw.ellipse([100, 100, 350, 350], fill=(139, 69, 19, 60)) # Brown alpha 60
 87:         draw.ellipse([150, 150, 300, 300], fill=(139, 69, 19, 40)) 
 88:         pil_img = pil_img.convert("RGBA")
 89:         combined = Image.alpha_composite(pil_img, stain_layer)
 90:         return combined.convert("RGB")
 91:     def apply_extreme_perspective(self, pil_img):
 92:         """Extreme skew - as if the user is holding the paper at a 45 degree angle."""
 93:         cv_img = np.array(pil_img)
 94:         h, w = cv_img.shape[:2]
 95:         src = np.float32([[0,0], [w,0], [0,h], [w,h]])
 96:         # Push top-right and bottom-right way in
 97:         dst = np.float32([[0,0], [w*0.8, h*0.2], [0,h], [w*0.7, h*0.9]])
 98:         M = cv2.getPerspectiveTransform(src, dst)
 99:         dst_img = cv2.warpPerspective(cv_img, M, (w, h), borderValue=PLUM_MAIN)
100:         return Image.fromarray(dst_img)
101:     def apply_lighting_shadow(self, pil_img):
102:         """Simulates a phone/head shadow in a dark room."""
103:         cv_img = np.array(pil_img).astype(float)
104:         h, w = cv_img.shape[:2]
105:         # Create a gradient mask
106:         mask = np.ones((h, w), dtype=float)
107:         # Darken the bottom-left corner significantly
108:         for i in range(h):
109:             mask[i, :] *= (i / h) * 0.8 + 0.2
110:         mask = cv2.GaussianBlur(mask, (201, 201), 0)
111:         for c in range(3):
112:             cv_img[:,:,c] *= mask
113:         return Image.fromarray(np.clip(cv_img, 0, 255).astype(np.uint8))
114: # ==========================================
115: # TEST CASE SUITE
116: # ==========================================
117: if __name__ == "__main__":
118:     engine = PlumStressEngine()
119:     if not os.path.exists("stress_test"): os.makedirs("stress_test")
120:     # 1. TC003 - The "Identity Fraud" (Mismatch)
121:     # Prescription is for Rajesh, but this Bill is for Arjun Mehta
122:     mismatch_bill = engine.generate_dental_bill("ARJUN MEHTA", [("Consultation", 1000)])
123:     mismatch_bill.save("stress_test/tc003_mismatched_name_bill.jpg")
124:     # 2. TC006 - Mixed Dental (Covered + Excluded + Handwritten Correction)
125:     dental_bill = engine.generate_dental_bill("Priya Singh", [
126:         ("Root Canal Treatment", 8000),
127:         ("Cosmetic Teeth Whitening", 4000)
128:     ])
129:     # Clerk corrected the price by hand!
130:     dental_bill = engine.add_handwritten_correction(dental_bill, 650, 250, 4000, 4500)
131:     dental_bill.save("stress_test/tc006_dental_mixed_corrected.jpg")
132:     # 3. TC011 - Component Failure (Extreme Perspective + Shadow + Stain)
133:     lab_tests = [
134:         ("Hemoglobin", "13.2", "13-17 g/dL"),
135:         ("WBC Count", "9800", "4500-11000"),
136:         ("Platelets", "1.8L", "1.5L-4.5L")
137:     ]
138:     crazy_doc = engine.generate_lab_report("Kavita Nair", lab_tests)
139:     crazy_doc = engine.apply_coffee_stain(crazy_doc)
140:     crazy_doc = engine.apply_lighting_shadow(crazy_doc)
141:     crazy_doc = engine.apply_extreme_perspective(crazy_doc)
142:     crazy_doc.save("stress_test/tc011_damaged_lab_report.jpg")
143:     # 4. TC002 - Unreadable (The "Blackout" Photo)
144:     unreadable = engine.generate_lab_report("Sneha Reddy", [("Glucose", "110", "70-100")])
145:     enhancer = ImageEnhance.Brightness(unreadable)
146:     unreadable = enhancer.enhance(0.1) # Pitch black
147:     unreadable.save("stress_test/tc002_blackout_photo.jpg")
148:     print("Success! Extreme stress-test documents generated in /stress_test")
149:     # Add this to your plum_stress_engine.py
150: # 1. Doc 9 - TC012: The Excluded Obesity Claim
151: tests_anita = [("BMI Analysis", "37.5", "18-25"), ("Bariatric Eval", "Recommended", "-")]
152: doc_9 = engine.generate_lab_report("Anita Desai", tests_anita)
153: # Add "Obesity Treatment" text explicitly
154: draw = ImageDraw.Draw(doc_9)
155: draw.text((40, 350), "Diagnosis: Morbid Obesity - Bariatric Consultation", font=engine.f_h2, fill=PLUM_MAIN)
156: doc_9.save("stress_test/tc012_obesity_exclusion.jpg")
157: # 2. Doc 10 - TC008: The Over-Limit Bill (₹7,500)
158: items_amit = [("Specialist Consultation", 2000), ("Emergency Observation", 5500)]
159: doc_10 = engine.generate_hospital_bill("City Clinic", "Amit Verma", items_amit, 7500)
160: doc_10.save("stress_test/tc008_over_limit_bill.jpg")
````

## File: scripts/test-llm.ts
````typescript
 1: // generate-test-docs.ts
 2: import OpenAI from 'openai'
 3: import { loadEnvConfig } from '@next/env'
 4: // Load environment variables from .env.local
 5: loadEnvConfig(process.cwd())
 6: const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
 7: async function main() {
 8:   const models = await openai.models.list()
 9:   const relevant = models.data
10:     .map(m => m.id)
11:     .filter(id => id.includes('gpt') || id.includes('o1') || id.includes('o3'))
12:     .sort()
13:   console.log('✅ Key works. Available models:')
14:   relevant.forEach(m => console.log(' ', m))
15: }
16: main().catch(e => console.error('❌ Key failed:', e.message))
````

## File: tsconfig.json
````json
 1: {
 2:   "compilerOptions": {
 3:     "target": "ES2017",
 4:     "lib": ["dom", "dom.iterable", "esnext"],
 5:     "allowJs": true,
 6:     "skipLibCheck": true,
 7:     "strict": true,
 8:     "noEmit": true,
 9:     "esModuleInterop": true,
10:     "module": "esnext",
11:     "moduleResolution": "bundler",
12:     "resolveJsonModule": true,
13:     "isolatedModules": true,
14:     "jsx": "react-jsx",
15:     "incremental": true,
16:     "plugins": [
17:       {
18:         "name": "next"
19:       }
20:     ],
21:     "paths": {
22:       "@/*": ["./*"]
23:     }
24:   },
25:   "include": [
26:     "next-env.d.ts",
27:     "**/*.ts",
28:     "**/*.tsx",
29:     ".next/types/**/*.ts",
30:     ".next/dev/types/**/*.ts",
31:     "**/*.mts"
32:   ],
33:   "exclude": ["node_modules"]
34: }
````

## File: AGENTS.md
````markdown
1: 
````

## File: app/api/policy/route.ts
````typescript
 1: import { NextResponse } from 'next/server'
 2: import { loadPolicy } from '@/lib/policy/policyLoader'
 3: export async function GET() {
 4:   const policy = loadPolicy()
 5:   const members = policy.members.map(m => ({
 6:     id: m.member_id,
 7:     name: m.name,
 8:     relationship: m.relationship,
 9:   }))
10:   const categories = Object.keys(policy.opd_categories).map(key => {
11:     const categoryKey = key.toUpperCase()
12:     const requirements = policy.document_requirements[categoryKey]
13:     return {
14:       id: categoryKey,
15:       label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
16:       required: requirements?.required || [],
17:       optional: requirements?.optional || [],
18:     }
19:   })
20:   const documentTypes = Array.from(new Set(
21:     Object.values(policy.document_requirements)
22:       .flatMap(r => [...r.required, ...r.optional])
23:   ))
24:   const documentDescriptions: Record<string, string> = {
25:     PRESCRIPTION: "Doctor's prescription or referral letter",
26:     HOSPITAL_BILL: "Hospital or clinic bill/invoice",
27:     LAB_REPORT: "Lab test report with patient name and date",
28:     DIAGNOSTIC_REPORT: "Diagnostic test report (X-ray, ultrasound, etc.)",
29:     PHARMACY_BILL: "Pharmacy receipt for medications",
30:     DISCHARGE_SUMMARY: "Hospital discharge summary",
31:     DENTAL_REPORT: "Dental procedure report or receipt",
32:   }
33:   return NextResponse.json({ members, categories, documentTypes, documentDescriptions })
34: }
````

## File: app/globals.css
````css
 1: @import "tailwindcss";
 2: @theme {
 3:   /* Exact Plum Brand Colors */
 4:   --color-plum-main: #2b0b21;      
 5:   --color-plum-secondary: #5e2c4d; 
 6:   --color-plum-offwhite: #fff4eb;  
 7:   --color-plum-pink: #ff4052;      
 8:   /* Muted text (Calculated manually to avoid Tailwind v4 parser crash) */
 9:   --color-plum-muted: #b892a7; 
10:   /* Status Colors */
11:   --color-status-approved: #4ade80; 
12:   --color-status-manual: #fbbf24;   
13:   --color-status-rejected: #ff4052;
14:   /* Typography */
15:   --font-serif: var(--font-alpina);
16:   --font-sans: var(--font-passenger);
17: }
18: @layer base {
19:   h1, h2, h3, h4, h5, h6 {
20:     letter-spacing: -0.02em;
21:   }
22: }
23: /* Force theme globally to prevent dark/light mode switching */
24: html, body {
25:   background-color: var(--color-plum-main) !important;
26:   color: var(--color-plum-offwhite) !important;
27:   font-family: var(--font-passenger), sans-serif; /* Default to Passenger Sans */
28: }
29: h1, h2, h3, h4, h5, h6, .font-serif {
30:   font-family: var(--font-alpina), serif !important; /* Force GT Alpina for headings */
31: }
32: input[type="number"]::-webkit-inner-spin-button,
33: input[type="number"]::-webkit-outer-spin-button {
34:   -webkit-appearance: none;
35:   margin: 0;
36: }
37: input[type="number"] {
38:   -moz-appearance: textfield; /* Firefox */
39: }
40: input[type="date"]::-webkit-calendar-picker-indicator {
41:   filter: invert(1);
42:   cursor: pointer;
43:   opacity: 0.6;
44:   transition: opacity 0.2s;
45: }
46: input[type="date"]::-webkit-calendar-picker-indicator:hover {
47:   opacity: 1;
48: }
49: input[type="date"] {
50:   color-scheme: dark; /* Forces the browser popup to dark mode */
51: }
52: /* Customizing the calendar icon visibility */
53: input[type="date"]::-webkit-calendar-picker-indicator {
54:   background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23ff4052" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>');
55:   cursor: pointer;
56:   padding: 3px;
57: }
58: /* Ensure the text doesn't look white-on-white */
59: input[type="date"]::-webkit-datetime-edit-text,
60: input[type="date"]::-webkit-datetime-edit-month-field,
61: input[type="date"]::-webkit-datetime-edit-day-field,
62: input[type="date"]::-webkit-datetime-edit-year-field {
63:   color: #fff4eb;
64: }
65: /* Mobile-friendly subtle scrollbar */
66: ::-webkit-scrollbar { width: 4px; }
67: ::-webkit-scrollbar-track { background: transparent; }
68: ::-webkit-scrollbar-thumb { background: var(--color-plum-secondary); border-radius: 4px; }
69: ::-webkit-scrollbar-thumb:hover { background: var(--color-plum-muted); }
````

## File: data/policy_terms.json
````json
  1: {
  2:   "policy_id": "PLUM_GHI_2026",
  3:   "policy_name": "Group Health Insurance — Standard Plan",
  4:   "insurer": "ICICI Lombard General Insurance",
  5:   "policy_holder": {
  6:     "company_name": "TechCorp Solutions Pvt Ltd",
  7:     "employee_count": 500,
  8:     "policy_start_date": "2026-04-15",
  9:     "policy_end_date": "2027-04-14",
 10:     "renewal_status": "ACTIVE"
 11:   },
 12:   "coverage": {
 13:     "sum_insured_per_employee": 500000,
 14:     "annual_opd_limit": 50000,
 15:     "per_claim_limit": 5000,
 16:     "family_floater": {
 17:       "enabled": true,
 18:       "combined_limit": 150000,
 19:       "covered_relationships": [
 20:         "SELF",
 21:         "SPOUSE",
 22:         "CHILDREN",
 23:         "PARENTS"
 24:       ]
 25:     }
 26:   },
 27:   "opd_categories": {
 28:     "consultation": {
 29:       "sub_limit": 2000,
 30:       "copay_percent": 10,
 31:       "network_discount_percent": 20,
 32:       "requires_prescription": true,
 33:       "requires_pre_auth": false,
 34:       "covered": true
 35:     },
 36:     "diagnostic": {
 37:       "sub_limit": 10000,
 38:       "copay_percent": 0,
 39:       "network_discount_percent": 10,
 40:       "requires_prescription": true,
 41:       "requires_pre_auth": false,
 42:       "pre_auth_threshold": 10000,
 43:       "high_value_tests_requiring_pre_auth": [
 44:         "MRI",
 45:         "CT Scan",
 46:         "PET Scan"
 47:       ],
 48:       "covered": true
 49:     },
 50:     "pharmacy": {
 51:       "sub_limit": 15000,
 52:       "copay_percent": 0,
 53:       "branded_drug_copay_percent": 30,
 54:       "generic_mandatory": true,
 55:       "requires_prescription": true,
 56:       "covered": true
 57:     },
 58:     "dental": {
 59:       "sub_limit": 10000,
 60:       "copay_percent": 0,
 61:       "requires_prescription": false,
 62:       "requires_dental_report": true,
 63:       "covered": true,
 64:       "covered_procedures": [
 65:         "Root Canal Treatment",
 66:         "Tooth Extraction",
 67:         "Dental Filling",
 68:         "Scaling and Polishing",
 69:         "Dental X-Ray",
 70:         "Crown Placement",
 71:         "Gum Treatment"
 72:       ],
 73:       "excluded_procedures": [
 74:         "Teeth Whitening",
 75:         "Veneers",
 76:         "Orthodontic Treatment (Braces)",
 77:         "Implants (Cosmetic)",
 78:         "Bleaching"
 79:       ]
 80:     },
 81:     "vision": {
 82:       "sub_limit": 5000,
 83:       "copay_percent": 0,
 84:       "requires_prescription": true,
 85:       "covered": true,
 86:       "covered_items": [
 87:         "Glasses",
 88:         "Contact Lenses",
 89:         "Eye Examination",
 90:         "Cataract Surgery"
 91:       ],
 92:       "excluded_items": [
 93:         "LASIK Surgery",
 94:         "Cosmetic Eye Surgery",
 95:         "Refractive Surgery"
 96:       ]
 97:     },
 98:     "alternative_medicine": {
 99:       "sub_limit": 8000,
100:       "copay_percent": 0,
101:       "requires_prescription": true,
102:       "requires_registered_practitioner": true,
103:       "max_sessions_per_year": 20,
104:       "covered_systems": [
105:         "Ayurveda",
106:         "Homeopathy",
107:         "Unani",
108:         "Siddha",
109:         "Naturopathy"
110:       ],
111:       "covered": true
112:     }
113:   },
114:   "waiting_periods": {
115:     "initial_waiting_period_days": 30,
116:     "pre_existing_conditions_days": 365,
117:     "specific_conditions": {
118:       "diabetes": 90,
119:       "hypertension": 90,
120:       "thyroid_disorders": 90,
121:       "joint_replacement": 730,
122:       "maternity": 270,
123:       "mental_health": 180,
124:       "obesity_treatment": 365,
125:       "hernia": 365,
126:       "cataract": 365
127:     }
128:   },
129:   "exclusions": {
130:     "conditions": [
131:       "Self-inflicted injuries",
132:       "War or nuclear hazard",
133:       "Substance abuse treatment",
134:       "Experimental treatments",
135:       "Infertility and assisted reproduction",
136:       "Obesity and weight loss programs",
137:       "Bariatric surgery",
138:       "Cosmetic or aesthetic procedures",
139:       "Vaccination (non-medically necessary)",
140:       "Health supplements and tonics"
141:     ],
142:     "dental_exclusions": [
143:       "Teeth whitening",
144:       "Orthodontic treatment",
145:       "Cosmetic dental procedures"
146:     ],
147:     "vision_exclusions": [
148:       "LASIK",
149:       "Refractive surgery"
150:     ]
151:   },
152:   "pre_authorization": {
153:     "required_for": [
154:       "MRI scan (amount > ₹10,000)",
155:       "CT scan (amount > ₹10,000)",
156:       "PET scan",
157:       "Major surgical procedures",
158:       "Planned hospitalization"
159:     ],
160:     "validity_days": 30
161:   },
162:   "network_hospitals": [
163:     "Apollo Hospitals",
164:     "Fortis Healthcare",
165:     "Max Healthcare",
166:     "Manipal Hospitals",
167:     "Narayana Health",
168:     "Medanta",
169:     "Kokilaben Dhirubhai Ambani Hospital",
170:     "Aster CMI Hospital",
171:     "Columbia Asia",
172:     "Sakra World Hospital"
173:   ],
174:   "submission_rules": {
175:     "deadline_days_from_treatment": 30,
176:     "minimum_claim_amount": 500,
177:     "currency": "INR"
178:   },
179:   "document_requirements": {
180:     "CONSULTATION": {
181:       "required": [
182:         "PRESCRIPTION",
183:         "HOSPITAL_BILL"
184:       ],
185:       "optional": [
186:         "LAB_REPORT",
187:         "DIAGNOSTIC_REPORT"
188:       ]
189:     },
190:     "DIAGNOSTIC": {
191:       "required": [
192:         "PRESCRIPTION",
193:         "LAB_REPORT",
194:         "HOSPITAL_BILL"
195:       ],
196:       "optional": [
197:         "DISCHARGE_SUMMARY"
198:       ]
199:     },
200:     "PHARMACY": {
201:       "required": [
202:         "PRESCRIPTION",
203:         "PHARMACY_BILL"
204:       ],
205:       "optional": []
206:     },
207:     "DENTAL": {
208:       "required": [
209:         "HOSPITAL_BILL"
210:       ],
211:       "optional": [
212:         "PRESCRIPTION",
213:         "DENTAL_REPORT"
214:       ]
215:     },
216:     "VISION": {
217:       "required": [
218:         "PRESCRIPTION",
219:         "HOSPITAL_BILL"
220:       ],
221:       "optional": []
222:     },
223:     "ALTERNATIVE_MEDICINE": {
224:       "required": [
225:         "PRESCRIPTION",
226:         "HOSPITAL_BILL"
227:       ],
228:       "optional": []
229:     }
230:   },
231:   "fraud_thresholds": {
232:     "same_day_claims_limit": 2,
233:     "monthly_claims_limit": 6,
234:     "high_value_claim_threshold": 25000,
235:     "auto_manual_review_above": 25000,
236:     "fraud_score_manual_review_threshold": 0.80
237:   },
238:   "members": [
239:     {
240:       "member_id": "EMP001",
241:       "name": "Rajesh Kumar",
242:       "date_of_birth": "1985-03-15",
243:       "gender": "M",
244:       "relationship": "SELF",
245:       "join_date": "2026-04-01",
246:       "dependents": [
247:         "DEP001",
248:         "DEP002"
249:       ]
250:     },
251:     {
252:       "member_id": "EMP002",
253:       "name": "Priya Singh",
254:       "date_of_birth": "1990-07-22",
255:       "gender": "F",
256:       "relationship": "SELF",
257:       "join_date": "2026-04-01",
258:       "dependents": []
259:     },
260:     {
261:       "member_id": "EMP003",
262:       "name": "Amit Verma",
263:       "date_of_birth": "1988-11-05",
264:       "gender": "M",
265:       "relationship": "SELF",
266:       "join_date": "2026-04-01",
267:       "dependents": [
268:         "DEP003"
269:       ]
270:     },
271:     {
272:       "member_id": "EMP004",
273:       "name": "Sneha Reddy",
274:       "date_of_birth": "1992-02-28",
275:       "gender": "F",
276:       "relationship": "SELF",
277:       "join_date": "2026-04-01",
278:       "dependents": []
279:     },
280:     {
281:       "member_id": "EMP005",
282:       "name": "Vikram Joshi",
283:       "date_of_birth": "1979-09-10",
284:       "gender": "M",
285:       "relationship": "SELF",
286:       "join_date": "2026-05-01",
287:       "dependents": []
288:     },
289:     {
290:       "member_id": "EMP006",
291:       "name": "Kavita Nair",
292:       "date_of_birth": "1983-06-18",
293:       "gender": "F",
294:       "relationship": "SELF",
295:       "join_date": "2026-04-01",
296:       "dependents": []
297:     },
298:     {
299:       "member_id": "EMP007",
300:       "name": "Suresh Patil",
301:       "date_of_birth": "1975-12-30",
302:       "gender": "M",
303:       "relationship": "SELF",
304:       "join_date": "2026-04-01",
305:       "dependents": [
306:         "DEP004",
307:         "DEP005"
308:       ]
309:     },
310:     {
311:       "member_id": "EMP008",
312:       "name": "Ravi Menon",
313:       "date_of_birth": "1987-04-14",
314:       "gender": "M",
315:       "relationship": "SELF",
316:       "join_date": "2026-04-01",
317:       "dependents": []
318:     },
319:     {
320:       "member_id": "EMP009",
321:       "name": "Anita Desai",
322:       "date_of_birth": "1993-08-25",
323:       "gender": "F",
324:       "relationship": "SELF",
325:       "join_date": "2026-04-01",
326:       "dependents": []
327:     },
328:     {
329:       "member_id": "EMP010",
330:       "name": "Deepak Shah",
331:       "date_of_birth": "1980-01-07",
332:       "gender": "M",
333:       "relationship": "SELF",
334:       "join_date": "2026-04-01",
335:       "dependents": [
336:         "DEP006"
337:       ]
338:     },
339:     {
340:       "member_id": "DEP001",
341:       "name": "Sunita Kumar",
342:       "date_of_birth": "1987-05-20",
343:       "gender": "F",
344:       "relationship": "SPOUSE",
345:       "primary_member_id": "EMP001"
346:     },
347:     {
348:       "member_id": "DEP002",
349:       "name": "Arjun Kumar",
350:       "date_of_birth": "2015-08-12",
351:       "gender": "M",
352:       "relationship": "CHILD",
353:       "primary_member_id": "EMP001"
354:     }
355:   ]
356: }
````

## File: lib/agents/5-DecisionSynthesizer.ts
````typescript
 1: import { PolicyCheckResult, FraudResult, TraceEntry, ClaimDecisionOutput } from '../types/claim.types';
 2: export function synthesizeDecision(
 3:   claimId: string,
 4:   policyResult: PolicyCheckResult,
 5:   fraudResult: FraudResult,
 6:   systemConfidence: number,
 7:   allTrace: TraceEntry[],
 8:   degradedComponents: string[],
 9:   verificationErrors: string[] = []
10: ): ClaimDecisionOutput {
11:   let finalDecision = policyResult.decision;
12:   const combinedRejectionReasons = [...new Set([...verificationErrors, ...policyResult.rejectionReasons])];
13:   // If we have document errors but policy result was APPROVED, 
14:   // we should probably still flag as MANUAL_REVIEW or keep the errors
15:   if (verificationErrors.length > 0 && finalDecision === 'APPROVED') {
16:     finalDecision = 'MANUAL_REVIEW';
17:   }
18:   // Fraud override: if hard signals present OR fuzzy risk is high, escalate to MANUAL_REVIEW
19:   if ((fraudResult.requiresManualReview || fraudResult.fraudRisk >= 0.80) && finalDecision === 'APPROVED') {
20:     finalDecision = 'MANUAL_REVIEW';
21:   }
22:   // Confidence floor: if systemConfidence < 0.50, always MANUAL_REVIEW
23:   if (systemConfidence < 0.50) {
24:     finalDecision = 'MANUAL_REVIEW';
25:   }
26:   return {
27:     claimId,
28:     decision: finalDecision,
29:     approvedAmount: policyResult.approvedAmount,
30:     rejectionReasons: combinedRejectionReasons,
31:     systemConfidence: Math.max(0, Math.min(1, systemConfidence)),
32:     trace: allTrace,
33:     degradedComponents,
34:     calculationBreakdown: undefined // Could build this from trace if needed
35:   };
36: }
````

## File: lib/openai.ts
````typescript
 1: import OpenAI from 'openai';
 2: // Shared OpenAI client — single source of truth for all LLM agents.
 3: // If gpt-5.4-mini isn't available on your account, swap here — both
 4: // DocumentVerifier and InformationExtractor update automatically.
 5: export const VISION_MODEL = 'gpt-5.4-mini';
 6: // Lazy Initialization created on first use, not at import time
 7: // This ensures env vars are loaded before the client is constructed
 8: let _client: OpenAI | null = null
 9: export function getOpenAIClient(): OpenAI {
10:   if (!_client) {
11:     const apiKey = process.env.OPENAI_API_KEY
12:     if (!apiKey) {
13:       throw new Error('OPENAI_API_KEY is not set. Check .env.local and ensure loadEnvConfig runs before any OpenAI calls.')
14:     }
15:     _client = new OpenAI({ apiKey })
16:   }
17:   return _client
18: }
19: // Keep named export for backward compat — but access via getter
20: export const openai = new Proxy({} as OpenAI, {
21:   get(_target, prop) {
22:     return (getOpenAIClient() as any)[prop]
23:   }
24: })
````

## File: lib/types/claim.types.ts
````typescript
 1: export type ClaimCategory = string; // e.g., 'CONSULTATION', 'DIAGNOSTIC', 'IPD', 'MATERNITY' (Driven by policy config)
 2: export type ClaimDecision = 'APPROVED' | 'PARTIAL' | 'REJECTED' | 'MANUAL_REVIEW';
 3: export type DocumentType = string; // e.g., 'PRESCRIPTION', 'HOSPITAL_BILL', 'CLAIM_FORM'
 4: export interface TraceEntry {
 5:   stage: string;
 6:   check: string;
 7:   result: 'PASSED' | 'FAILED' | 'WARNING' | 'INFO' | 'SKIPPED';
 8:   detail: string;
 9: }
10: export interface UploadedDocument {
11:   id: string;
12:   type: DocumentType;
13:   content: string;               /** @deprecated Use base64Data + mimeType for all real document processing */ 
14:   base64Data: string;            // Base64-encoded file bytes — primary data for LLM calls
15:   mimeType: string;              // 'image/jpeg' | 'image/png' | 'application/pdf'
16:   fileName?: string;             // Original filename for logging/tracing
17: }
18: export interface ClaimHistoryEntry {
19:   claimId: string;
20:   date: string;
21:   amount: number;
22:   provider: string;
23: }
24: export interface ClaimSubmission {
25:   memberId: string;
26:   policyId: string;
27:   claimCategory: ClaimCategory;
28:   treatmentDate: string;
29:   submissionDate?: string;
30:   claimedAmount: number;
31:   hospitalName?: string;
32:   documents: UploadedDocument[];
33:   claimsHistory?: ClaimHistoryEntry[];
34:   ytdClaimsAmount?: number;
35:   simulateComponentFailure?: boolean;
36:   preAuthObtained?: boolean;
37: }
38: // Agent output contracts
39: export interface VerificationResult {
40:   passed: boolean;
41:   errors: { documentId: string; documentType: string; expectedType: string; message: string }[];
42:   trace: TraceEntry[];
43: }
44: export interface ExtractedDocument {
45:   documentId: string;
46:   documentType: DocumentType;
47:   providerName?: string;
48:   patientName?: string;
49:   doctorName?: string;
50:   doctorRegistration?: string;
51:   date?: string;
52:   diagnosis?: string;
53:   lineItems?: { description: string; amount: number }[];
54:   totalAmount?: number;
55:   extractionConfidence: number;
56:   unreadableFields: string[];
57: }
58: export interface ExtractionResult {
59:   documents: ExtractedDocument[];
60:   overallExtractionConfidence: number;
61:   trace: TraceEntry[];
62:   failed: boolean;
63: }
64: export interface PolicyCheckResult {
65:   checks: { name: string; passed: boolean; reason: string }[];
66:   approvedAmount: number;
67:   decision: ClaimDecision;
68:   rejectionReasons: string[];
69:   partialApprovalDetails?: { approved: string[]; rejected: { item: string; reason: string }[] };
70:   trace: TraceEntry[];
71: }
72: export interface FraudResult {
73:   signals: string[];
74:   fraudRisk: number;
75:   requiresManualReview: boolean;
76:   trace: TraceEntry[];
77:   failed: boolean;
78: }
79: export interface ClaimDecisionOutput {
80:   claimId: string;
81:   decision: ClaimDecision;
82:   approvedAmount: number;
83:   rejectionReasons: string[];
84:   systemConfidence: number;
85:   trace: TraceEntry[];
86:   degradedComponents: string[];
87:   calculationBreakdown?: string;
88: }
````

## File: scripts/test-agents.ts
````typescript
  1: /**
  2:  * scripts/test-agents.ts
  3:  *
  4:  * Tests DocumentVerifier and InformationExtractor agents.
  5:  *
  6:  * Mock mode (default) — no API calls, fully offline:
  7:  *   node node_modules/jiti/lib/jiti-cli.mjs scripts/test-agents.ts
  8:  *
  9:  * Live mode — real OpenAI API calls with real documents from reports/:
 10:  *   node node_modules/jiti/lib/jiti-cli.mjs scripts/test-agents.ts --live
 11:  *
 12:  * Inputs come from data/test_cases.json and data/policy_terms.json — nothing hardcoded.
 13:  */
 14: import fs from 'fs'
 15: import path from 'path'
 16: import { openai } from '../lib/openai'
 17: import { verifyDocuments } from '../lib/agents/1-DocumentVerifier'
 18: import { extractInformation } from '../lib/agents/2-InformationExtractor'
 19: import { loadPolicy } from '../lib/policy/policyLoader'
 20: import type { ClaimSubmission, UploadedDocument } from '../lib/types/claim.types'
 21: import { loadEnvConfig } from '@next/env'
 22: // Load environment variables from .env.local
 23: loadEnvConfig(process.cwd())
 24: const LIVE = process.argv.includes('--live')
 25: // ── Load external data — no hardcoding ──────────────────────────────────────
 26: const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json')
 27: const allTestCases: any[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8')).test_cases
 28: const policy = loadPolicy()
 29: // ── Mock infrastructure ──────────────────────────────────────────────────────
 30: // We mutate the method on the shared OpenAI instance.
 31: // All agents that imported { openai } see the same object — patching create() is visible to them.
 32: const originalCreate = (openai.chat.completions as any).create.bind(openai.chat.completions)
 33: // ── Test runner ──────────────────────────────────────────────────────────────
 34: let passed = 0
 35: let failed = 0
 36: async function test(name: string, fn: () => Promise<void>): Promise<void> {
 37:   // Save current mock state so each test is isolated
 38:   const savedCreate = (openai.chat.completions as any).create
 39:   try {
 40:     await fn()
 41:     console.log(`  ✓  ${name}`)
 42:     passed++
 43:   } catch (e) {
 44:     console.error(`  ✗  ${name}`)
 45:     console.error(`     ${e instanceof Error ? e.message : String(e)}`)
 46:     failed++
 47:   } finally {
 48:     (openai.chat.completions as any).create = savedCreate
 49:   }
 50: }
 51: function assert(condition: boolean, message: string): void {
 52:   if (!condition) throw new Error(message)
 53: }
 54: // ── Helpers ──────────────────────────────────────────────────────────────────
 55: /** Look up a test case from test_cases.json by ID */
 56: function tc(caseId: string): any {
 57:   const found = allTestCases.find(c => c.case_id === caseId)
 58:   if (!found) throw new Error(`Test case ${caseId} not found in test_cases.json`)
 59:   return found
 60: }
 61: /** Build a minimal UploadedDocument with dummy base64 for mock tests */
 62: function makeDoc(id: string, declaredType: string): UploadedDocument {
 63:   return {
 64:     id,
 65:     type: declaredType as any,
 66:     content: '',
 67:     base64Data: 'aGVsbG8=', // base64 of "hello" — valid but meaningless
 68:     mimeType: 'image/jpeg',
 69:     fileName: `${id}.jpg`
 70:   }
 71: }
 72: /** Build a ClaimSubmission from a test case input, merging in provided docs */
 73: function claimFromTc(caseId: string, docs: UploadedDocument[], overrides: Partial<ClaimSubmission> = {}): ClaimSubmission {
 74:   const input = tc(caseId).input
 75:   return {
 76:     memberId: input.member_id,
 77:     policyId: input.policy_id,
 78:     claimCategory: input.claim_category,
 79:     treatmentDate: input.treatment_date,
 80:     claimedAmount: input.claimed_amount,
 81:     submissionDate: new Date().toISOString(),
 82:     documents: docs,
 83:     ...overrides
 84:   }
 85: }
 86: /** Load a real medical document image from reports/ folder */
 87: function loadFixture(relativePath: string, declaredType: UploadedDocument['type'] = 'UNKNOWN'): UploadedDocument {
 88:   const fullPath = path.join(process.cwd(), 'reports', relativePath)
 89:   if (!fs.existsSync(fullPath)) {
 90:     throw new Error(`Fixture not found: ${fullPath}`)
 91:   }
 92:   const buffer = fs.readFileSync(fullPath)
 93:   const ext = path.extname(relativePath).toLowerCase()
 94:   const mimeType = ext === '.pdf' ? 'application/pdf'
 95:     : ext === '.png' ? 'image/png'
 96:       : 'image/jpeg'
 97:   return {
 98:     id: `doc_${path.basename(relativePath, ext).replace(/[\s()]/g, '_').slice(0, 30)}`,
 99:     type: declaredType as any,
100:     content: '',
101:     base64Data: buffer.toString('base64'),
102:     mimeType,
103:     fileName: path.basename(relativePath)
104:   }
105: }
106: /** Build a mock LLM response for document classification */
107: function mockClassification(overrides: Partial<{
108:   detected_type: string
109:   is_readable: boolean
110:   readability_issues: string[]
111:   patient_name: string | null
112:   confidence: number
113: }> = {}) {
114:   return JSON.stringify({
115:     detected_type: 'PRESCRIPTION',
116:     is_readable: true,
117:     readability_issues: [],
118:     patient_name: 'Rajesh Kumar',
119:     confidence: 0.92,
120:     ...overrides
121:   })
122: }
123: /** Build a mock LLM response for document extraction */
124: function mockExtraction(overrides: Record<string, any> = {}) {
125:   return JSON.stringify({
126:     patient_name: 'Rajesh Kumar',
127:     doctor_name: 'Dr. Arun Sharma',
128:     doctor_registration: 'KA/45678/2015',
129:     hospital_name: 'Apollo Hospitals',
130:     provider_name: 'Apollo Hospitals',
131:     date: '01-05-2026',
132:     diagnosis: 'Viral Fever with body ache',
133:     medicines: [
134:       { name: 'Paracetamol 650mg', dosage: '1-1-1', duration: '5 days', amount: 0 },
135:       { name: 'Vitamin C 500mg', dosage: '0-0-1', duration: '10 days', amount: 0 },
136:       { name: 'ORS Liquids', dosage: 'as needed', duration: '', amount: 0 }
137:     ],
138:     tests_ordered: ['CBC', 'Dengue NS1'],
139:     line_items: [
140:       { description: 'Consultation Fee (Dr. Arun Sharma)', amount: 1000 },
141:       { description: 'CBC (Complete Blood Count)', amount: 200 },
142:       { description: 'Dengue NS1 Antigen Test', amount: 300 }
143:     ],
144:     total_amount: 1500,
145:     unreadable_fields: [],
146:     confidence: 0.92,
147:     ...overrides,
148:   })
149: }
150: // ── Mock Tests (10) ──────────────────────────────────────────────────────────
151: console.log('\n── Mock Tests ────────────────────────────────────────────────────')
152: // Read document requirements from policy — no hardcoding
153: const consultationReqs = policy.document_requirements['CONSULTATION']?.required ?? []
154: const pharmacyReqs = policy.document_requirements['PHARMACY']?.required ?? []
155: // Test 1 — Happy path: all required docs present
156: await test('Verifier: correct doc types → passed: true', async () => {
157:   const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
158:   const claim = claimFromTc('TC004', docs)
159:   let callCount = 0;
160:   (openai.chat.completions as any).create = async () => ({
161:     choices: [{ message: { content: mockClassification({ detected_type: consultationReqs[callCount++] ?? 'PRESCRIPTION' }) } }]
162:   })
163:   const result = await verifyDocuments(claim)
164:   assert(result.passed === true,
165:     `Expected passed=true. Errors: ${result.errors.map(e => e.message).join('; ')}`)
166: })
167: // Test 2 — Unreadable document
168: await test('Verifier: unreadable doc → passed: false, message contains "re-upload"', async () => {
169:   const docs = pharmacyReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
170:   const claim = claimFromTc('TC002', docs)
171:   let callCount = 0;
172:   (openai.chat.completions as any).create = async () => {
173:     const idx = callCount++
174:     // First doc readable, second unreadable
175:     return {
176:       choices: [{
177:         message: {
178:           content: mockClassification({
179:             detected_type: pharmacyReqs[idx] ?? 'PRESCRIPTION',
180:             is_readable: idx === 0,
181:             readability_issues: idx === 1 ? ['image_too_dark', 'image_blurry'] : [],
182:             patient_name: idx === 0 ? 'Rajesh Kumar' : null
183:           })
184:         }
185:       }]
186:     }
187:   }
188:   const result = await verifyDocuments(claim)
189:   assert(result.passed === false, 'Expected passed=false due to unreadable document')
190:   const hasReupload = result.errors.some(e => e.message.toLowerCase().includes('re-upload'))
191:   assert(hasReupload,
192:     `Expected "re-upload" in an error message. Got: ${result.errors.map(e => e.message).join(' | ')}`)
193: })
194: // Test 3 — Wrong document type
195: await test('Verifier: wrong doc type → error names both the wrong type and the required type', async () => {
196:   // TC001: CONSULTATION claim but member submits 2 PRESCRIPTIONs (missing HOSPITAL_BILL)
197:   const docs = [makeDoc('d1', 'PRESCRIPTION'), makeDoc('d2', 'PRESCRIPTION')]
198:   const claim = claimFromTc('TC001', docs);
199:   // Both docs classified as PRESCRIPTION — HOSPITAL_BILL will be flagged as missing
200:   (openai.chat.completions as any).create = async () => ({
201:     choices: [{ message: { content: mockClassification({ detected_type: 'PRESCRIPTION' }) } }]
202:   })
203:   const result = await verifyDocuments(claim)
204:   assert(result.passed === false, 'Expected passed=false due to missing HOSPITAL_BILL')
205:   const missingBillError = result.errors.find(e => e.expectedType === 'HOSPITAL_BILL')
206:   assert(!!missingBillError,
207:     `Expected an error for missing HOSPITAL_BILL. Errors: ${JSON.stringify(result.errors)}`)
208:   const msgLower = missingBillError!.message.toLowerCase()
209:   assert(msgLower.includes('hospital bill'),
210:     `Error should mention what is required (hospital bill). Got: "${missingBillError!.message}"`)
211: })
212: // Test 4 — Fix A: empty-string patient_name must NOT trigger consistency check
213: await test('Verifier (Fix A): patient_name: "" filtered out — no false consistency error', async () => {
214:   const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
215:   const claim = claimFromTc('TC004', docs)
216:   let callCount = 0;
217:   // Both docs return empty-string patient_name — should be ignored
218: (openai.chat.completions as any).create = async () => ({
219:   choices: [{
220:     message: { 
221:       content: mockClassification({
222:         detected_type: 'PRESCRIPTION',
223:         patient_name: '' // Testing the empty string filtering
224:       })
225:     }
226:   }]
227: })
228:   const result = await verifyDocuments(claim)
229:   const consistencyFailure = result.trace.find((t: any) => t.check === 'CrossDocumentConsistency' && t.result === 'FAILED')
230:   assert(!consistencyFailure, 'Expected no false consistency error when one patient_name is empty string')
231: })
232: // Test 5 — Cross-document patient name mismatch
233: await test('Verifier: patient names differ across docs → cross_document error with both names', async () => {
234:   // TC003: prescription for Rajesh Kumar, hospital bill for Arjun Mehta
235:   const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
236:   const claim = claimFromTc('TC003', docs)
237:   const patientNames = ['Rajesh Kumar', 'Arjun Mehta']
238:   let callCount = 0;
239:   (openai.chat.completions as any).create = async () => {
240:     const idx = callCount++
241:     return {
242:       choices: [{
243:         message: {
244:           content: mockClassification({
245:             detected_type: idx === 0 ? 'PRESCRIPTION' : 'HOSPITAL_BILL',
246:             patient_name: patientNames[idx]
247:           })
248:         }
249:       }]
250:     }
251:   }
252:   const result = await verifyDocuments(claim)
253:   assert(result.passed === false, 'Expected passed=false due to name mismatch')
254:   const crossDocError = result.errors.find(e => e.documentId === 'cross_document')
255:   assert(!!crossDocError, `Expected cross_document error. Errors: ${JSON.stringify(result.errors)}`)
256:   assert(crossDocError!.message.includes('Rajesh Kumar'), 'Error must name first patient')
257:   assert(crossDocError!.message.includes('Arjun Mehta'), 'Error must name second patient')
258: })
259: // Test 6 — LLM returns malformed JSON
260: await test('Verifier: LLM malformed JSON → no throw, document treated as unverifiable', async () => {
261:   const docs = [makeDoc('d1', 'PRESCRIPTION')]
262:   const claim = claimFromTc('TC001', docs, { claimCategory: 'CONSULTATION' });
263:   (openai.chat.completions as any).create = async () => ({
264:     choices: [{ message: { content: 'not json at all }}}' } }]
265:   })
266:   const result = await verifyDocuments(claim)
267:   assert(result.passed === false, 'Malformed JSON should not pass verification')
268: })
269: // Test 7 — Extractor happy path
270: await test('Extractor: valid PRESCRIPTION JSON → lineItems, diagnosis, confidence > 0', async () => {
271:   const docs = [makeDoc('d1', 'PRESCRIPTION')]
272:   ;(openai.chat.completions as any).create = async () => ({
273:     choices: [{ message: { content: mockExtraction() } }],
274:   })
275:   const result = await extractInformation(docs)
276:   assert(result.documents.length === 1, `Expected 1 extracted document, got ${result.documents.length}`)
277:   const doc = result.documents[0]
278:   assert((doc.extractionConfidence ?? 0) > 0, 'Expected extraction confidence > 0')
279:   assert(!!doc.diagnosis, 'Expected diagnosis to be extracted')
280:   const liCount = Array.isArray(doc.lineItems) ? doc.lineItems.length : 0
281:   assert(
282:     liCount > 0,
283:     `Expected at least one medicine or line item, got lineItems=${liCount}`,
284:   )
285: })
286: // Test 8 — Fix B: confidence: 0 must NOT become 0.5
287: await test('Extractor (Fix B): explicit confidence: 0 preserved, not coerced to 0.5', async () => {
288:   const doc = makeDoc('d1', 'PRESCRIPTION');
289:   (openai.chat.completions as any).create = async () => ({
290:     choices: [{
291:       message: {
292:         content: mockExtraction({
293:           unreadable_fields: ['all_fields'],
294:           medicines: [],
295:           confidence: 0  // ← explicit zero — the old `|| 0.5` bug would lose this
296:         })
297:       }
298:     }]
299:   })
300:   const result = await extractInformation([doc])
301:   assert(result.documents[0].extractionConfidence === 0,
302:     `Expected extractionConfidence 0, got ${result.documents[0].extractionConfidence}`)
303: })
304: // Test 9 — Verifier: LLM malformed JSON → error message contains "re-upload" or "not what we need"
305: await test('Verifier: LLM malformed JSON → error message contains re-upload guidance', async () => {
306:   const docs = [makeDoc('d1', 'PRESCRIPTION')]
307:   const claim = claimFromTc('TC001', docs, { claimCategory: 'CONSULTATION' });
308:   // Force malformed JSON from the LLM
309:   (openai.chat.completions as any).create = async () => ({
310:     choices: [{ message: { content: '{not valid json' } }],
311:   })
312:   const result = await verifyDocuments(claim)
313:   // 1) The verifier itself must not throw (we reached here).
314:   // 2) The document should be treated as UNVERIFIABLE and verification should fail.
315:   assert(result.passed === false, 'Malformed JSON should not pass verification')
316:   const msg = result.errors.map((e: any) => e.message.toLowerCase()).join(' | ')
317:   assert(
318:     msg.includes('re-upload') || msg.includes('not what we need'),
319:     `Expected a "re-upload" or "not what we need" style message. Got: ${msg}`,
320:   )
321: })
322: // Test 10 — Promise.allSettled: middle doc throws, others continue
323: await test('Extractor: middle doc LLM throws → 3 docs out, middle has fallback confidence 0.1', async () => {
324:   const docs = [makeDoc('d1', 'PRESCRIPTION'), makeDoc('d2', 'LAB_REPORT'), makeDoc('d3', 'HOSPITAL_BILL')]
325:   let callCount = 0;
326:   (openai.chat.completions as any).create = async () => {
327:     const idx = callCount++
328:     if (idx === 1) throw new Error('Simulated LLM failure on middle document')
329:     return {
330:       choices: [{ message: { content: mockExtraction() } }]
331:     }
332:   }
333:   const result = await extractInformation(docs)
334:   assert(result.documents.length === 3, `Expected 3 docs, got ${result.documents.length}`)
335:   assert(result.documents[1].extractionConfidence === 0.1, `Expected middle fallback confidence 0.1, got ${result.documents[1].extractionConfidence}`)
336: })
337: // ── Live Tests (4) ───────────────────────────────────────────────────────────
338: if (LIVE) {
339:   // Restore real OpenAI client before live tests
340:   (openai.chat.completions as any).create = originalCreate
341:   console.log('\n── Live Tests (real OpenAI API + real documents) ────────────────')
342:   console.log('Using documents from reports/test-cases/COMB-4')
343:   console.log('Model: gpt-5.4-mini\n')
344:   // Test 11 — Aug 13 happy path: correct prescription + hospital bill, same patient
345:   await test('Live 11: COMB-4 PRESCRIPTION + HOSPITAL_BILL → verified and extracted', async () => {
346:     const bill = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 12.png'), 'HOSPITAL_BILL')
347:     const rx = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 13.png'), 'PRESCRIPTION')
348:     const claim = claimFromTc('TC004', [rx, bill])
349:     const verif = await verifyDocuments(claim)
350:     console.log('     verification.passed =', verif.passed)
351:     console.log('     trace =', verif.trace.map((t: any) => `${t.check}:${t.result}`).join(' | '))
352:     assert(verif.passed === true, `Expected verification to pass. Errors: ${verif.errors.map((e: any) => e.message).join(' | ')}`)
353:     const extraction = await extractInformation([rx, bill])
354:     console.log(
355:       '     extracted =',
356:       extraction.documents.map((d: any) => `${d.documentType}:${(d.extractionConfidence ?? 0).toFixed(2)}`).join(', ')
357:     )
358:     assert(extraction.documents.length === 2, `Expected 2 extracted docs, got ${extraction.documents.length}`)
359:     assert(extraction.overallExtractionConfidence > 0, 'Expected overall extraction confidence > 0')
360:   })
361:   // Test 12 — Very dark image → readability detection
362:   await test('Live 12: COMB-4 prescription extraction → diagnosis/patient/provider present', async () => {
363:     const rx = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 13.png'), 'PRESCRIPTION')
364:     const extraction = await extractInformation([rx])
365:     const doc = extraction.documents[0]
366:     console.log('     diagnosis =', doc?.diagnosis)
367:     console.log('     patient =', doc?.patientName)
368:     console.log('     provider =', doc?.providerName || doc?.doctorName)
369:     assert(!!doc, 'Expected a prescription extraction result')
370:     assert(!!(doc.patientName || '').trim(), 'Expected patientName on prescription')
371:     assert(!!(doc.diagnosis || '').trim(), 'Expected diagnosis on prescription')
372:   })
373:   // Test 13 — "Nynika" vs "Nainika" name mismatch across real documents
374:   await test('Live 13: COMB-4 bill extraction → line items/total present', async () => {
375:     const bill = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 12.png'), 'HOSPITAL_BILL')
376:     const extraction = await extractInformation([bill])
377:     const doc = extraction.documents[0]
378:     console.log('     provider =', doc?.providerName)
379:     console.log('     total =', doc?.totalAmount)
380:     console.log('     line items =', doc?.lineItems?.map((x: any) => x.description).join(', ') ?? 'none')
381:     assert(!!doc, 'Expected a bill extraction result')
382:     assert((doc?.lineItems?.length ?? 0) > 0, 'Expected at least one line item on bill')
383:   })
384: } else {
385:   console.log('\n (Skipping live tests — run with --live to use real documents and OpenAI API)')
386: }
387: // ── Summary ──────────────────────────────────────────────────────────────────
388: const total = passed + failed
389: const modeLabel = LIVE ? '(mock + live)' : '(mock only)'
390: console.log(`\n${total} tests ${modeLabel}: ${passed} passed, ${failed} failed\n`)
391: if (failed > 0) process.exit(1)
````

## File: scripts/test-engine.ts
````typescript
 1: import fs from 'fs';
 2: import path from 'path';
 3: import { PolicyEngine } from '../lib/agents/3-PolicyEngine';
 4: import { loadPolicy } from '../lib/policy/policyLoader';
 5: import { ClaimSubmission, ExtractionResult, DocumentType } from '../lib/types/claim.types';
 6: import { loadEnvConfig } from '@next/env'
 7: // Load environment variables from .env.local
 8: loadEnvConfig(process.cwd())
 9: const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json');
10: const testCasesData = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'));
11: const casesToTest = ['TC004', 'TC005', 'TC010'];
12: const engine = new PolicyEngine();
13: const policy = loadPolicy();
14: for (const tc of testCasesData.test_cases) {
15:   if (!casesToTest.includes(tc.case_id)) continue;
16:   console.log(`\n======================================`);
17:   console.log(`Running ${tc.case_id}: ${tc.case_name}`);
18:   const input = tc.input;
19:   // Construct ClaimSubmission
20:   const claim: ClaimSubmission = {
21:     memberId: input.member_id,
22:     policyId: input.policy_id,
23:     claimCategory: input.claim_category,
24:     treatmentDate: input.treatment_date,
25:     claimedAmount: input.claimed_amount,
26:     ytdClaimsAmount: input.ytd_claims_amount || 0,
27:     hospitalName: input.hospital_name || input.documents?.find((d: any) => d.actual_type === 'HOSPITAL_BILL')?.content?.hospital_name,
28:     documents: [],
29:     claimsHistory: input.claims_history?.map((ch: any) => ({
30:       claimId: ch.claim_id,
31:       date: ch.date,
32:       amount: ch.amount,
33:       provider: ch.provider
34:     })) || [],
35:     // Assume submission happens on Nov 5th since these treatments are mostly Nov 1st/Oct 30th
36:     submissionDate: '2024-11-05',
37:     preAuthObtained: false
38:   };
39:   // Construct ExtractionResult
40:   const extraction: ExtractionResult = {
41:     documents: (input.documents || []).map((doc: any) => {
42:       const content = doc.content || {};
43:       return {
44:         documentId: doc.file_id,
45:         documentType: doc.actual_type as DocumentType,
46:         providerName: content.hospital_name || content.lab_name || content.pharmacy_name,
47:         diagnosis: content.diagnosis,
48:         patientName: content.patient_name,
49:         doctorName: content.doctor_name,
50:         lineItems: content.line_items,
51:         totalAmount: content.total,
52:         extractionConfidence: 0.95,
53:         unreadableFields: []
54:       };
55:     }),
56:     overallExtractionConfidence: 0.95,
57:     trace: [],
58:     failed: false
59:   };
60:   const result = engine.evaluate(claim, extraction, policy, '2024-11-05');
61:   console.log(`Decision: ${result.decision}`);
62:   if (result.decision === 'APPROVED' || result.decision === 'PARTIAL') {
63:     console.log(`Approved Amount: ₹${result.approvedAmount}`);
64:   }
65:   if (result.rejectionReasons.length > 0) {
66:     console.log(`Rejection Reasons: ${result.rejectionReasons.join(', ')}`);
67:   }
68:   console.log(`\nExpected Output:`);
69:   console.log(JSON.stringify(tc.expected, null, 2));
70: }
````

## File: scripts/test-route.cjs
````javascript
 1: // Quick test: send a real image file to the API route and check the response
 2: import { loadEnvConfig } from '@next/env'
 3: 
 4: // Load environment variables from .env.local
 5: loadEnvConfig(process.cwd())
 6: 
 7: const fs = require('fs');
 8: const path = require('path');
 9: 
10: const imagePath = 'C:\\Users\\91939\\Desktop\\92d0eacfb40b69526d3d298b0f85b261.jpg';
11: 
12: async function test() {
13:   // Read the file and build a FormData manually via fetch
14:   const fileBuffer = fs.readFileSync(imagePath);
15:   const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
16: 
17:   const formData = new FormData();
18:   formData.append('claimData', JSON.stringify({
19:     memberId: 'EMP001',
20:     policyId: 'PLUM_GHI_2024',
21:     claimCategory: 'CONSULTATION',
22:     treatmentDate: '2024-10-15',
23:     claimedAmount: 1500,
24:   }));
25:   formData.append('documents', blob, 'apollo_bill.jpg');
26:   formData.append('documentTypes', 'HOSPITAL_BILL');
27: 
28:   console.log('Sending request to http://localhost:3000/api/claims ...');
29: 
30:   const res = await fetch('http://localhost:3000/api/claims', {
31:     method: 'POST',
32:     body: formData,
33:   });
34: 
35:   const json = await res.json();
36:   console.log('\nStatus:', res.status);
37:   console.log('\nResponse:');
38:   console.log(JSON.stringify(json, null, 2));
39: 
40:   // Check key assertions
41:   if (json.claimId) {
42:     console.log('\n✅ Route is working — received claimId:', json.claimId);
43:     console.log('✅ Decision:', json.decision);
44:     console.log('✅ Trace entries:', json.trace?.length || 0);
45:   } else if (json.error) {
46:     console.log('\n❌ Error:', json.error);
47:   }
48: }
49: 
50: test().catch(console.error);
````

## File: app/api/claims/[id]/route.ts
````typescript
 1: import { NextRequest, NextResponse } from 'next/server'
 2: export async function GET(
 3:   _request: NextRequest,
 4:   { params }: { params: Promise<{ id: string }> }
 5: ) {
 6:   const { id } = await params
 7:   return NextResponse.json(
 8:     {
 9:       message: `Claim ${id} retrieval not yet implemented. Results are stored client-side in sessionStorage.`,
10:       claimId: id
11:     },
12:     { status: 404 }
13:   )
14: }
````

## File: app/layout.tsx
````typescript
 1: import { Analytics } from "@vercel/analytics/react";
 2: import { SpeedInsights } from "@vercel/speed-insights/next";
 3: import type { Metadata } from "next";
 4: import localFont from "next/font/local";
 5: import "./globals.css";
 6: const passengerSans = localFont({
 7:   src: [
 8:     { path: "./fonts/PassengerSans-Light.otf", weight: "300", style: "normal" },
 9:     { path: "./fonts/PassengerSans-Regular.otf", weight: "400", style: "normal" },
10:     { path: "./fonts/PassengerSans-Medium.otf", weight: "500", style: "normal" },
11:     { path: "./fonts/PassengerSans-Semibold.otf", weight: "600", style: "normal" },
12:     { path: "./fonts/PassengerSans-Bold.otf", weight: "700", style: "normal" },
13:   ],
14:   variable: "--font-passenger",
15: });
16: const gtAlpina = localFont({
17:   src: [
18:     { path: "./fonts/GT-Alpina-Standard-Light-Trial.otf", weight: "300", style: "normal" },
19:     { path: "./fonts/GT-Alpina-Standard-Regular-Trial.otf", weight: "400", style: "normal" },
20:     { path: "./fonts/GT-Alpina-Standard-Medium-Trial.otf", weight: "500", style: "normal" },
21:     { path: "./fonts/GT-Alpina-Standard-Bold-Trial.otf", weight: "700", style: "normal" },
22:   ],
23:   variable: "--font-alpina",
24: });
25: export const metadata: Metadata = {
26:   title: "Plum | Intelligent Claims",
27:   description: "AI-powered, explainable health insurance claims processing.",
28:   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
29: };
30: export default function RootLayout({
31:   children,
32: }: Readonly<{
33:   children: React.ReactNode;
34: }>) {
35:   return (
36:     <html lang="en">
37:       <body className={`${passengerSans.variable} ${gtAlpina.variable} antialiased min-h-screen flex flex-col relative`}>
38:         <div className="fixed top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-plum-pink/10 blur-[100px] pointer-events-none -z-10" />
39:         <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-plum-secondary/30 blur-[100px] pointer-events-none -z-10" />
40:         <nav className="w-full border-b border-plum-secondary/50 bg-plum-main/80 backdrop-blur-md sticky top-0 z-50">
41:           <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
42:             <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-plum-offwhite flex items-center gap-2">
43:               <span className="text-plum-pink">plum</span> 
44:               <span className="text-plum-muted text-sm sm:text-lg font-sans font-normal ml-2 tracking-normal border-l border-plum-secondary pl-3 sm:pl-4">
45:                 Claims Intelligence
46:               </span>
47:             </div>
48:           </div>
49:         </nav>
50:         <main className="flex-grow">
51:           {children}
52:         </main>
53:         <Analytics />
54:         <SpeedInsights />
55:       </body>
56:     </html>
57:   );
58: }
````

## File: lib/agents/4-FraudDetector.ts
````typescript
 1: import { ClaimSubmission, FraudResult, TraceEntry } from '../types/claim.types';
 2: import { loadPolicy } from '../policy/policyLoader';
 3: import { FraudDetectorTraces } from '../traces/traceMessages';
 4: export async function detectFraud(claim: ClaimSubmission): Promise<FraudResult> {
 5:   const policy = loadPolicy();
 6:   const thresholds = policy.fraud_thresholds;
 7:   const signals: string[] = [];
 8:   const trace: TraceEntry[] = [];
 9:   // Check 1: High-value claim threshold
10:   let forcedManualReview = false;
11:   if (claim.claimedAmount > thresholds.high_value_claim_threshold) {
12:     forcedManualReview = true;
13:     signals.push(`HIGH_VALUE_CLAIM: ₹${claim.claimedAmount} exceeds threshold of ₹${thresholds.high_value_claim_threshold}`);
14:     trace.push({
15:       stage: 'FraudDetection',
16:       check: 'HighValueCheck',
17:       result: 'WARNING',
18:       detail: FraudDetectorTraces.highValueClaim(claim.claimedAmount, thresholds.high_value_claim_threshold)
19:     });
20:   } else {
21:     trace.push({
22:       stage: 'FraudDetection',
23:       check: 'HighValueCheck',
24:       result: 'PASSED',
25:       detail: FraudDetectorTraces.normalValueClaim(claim.claimedAmount)
26:     });
27:   }
28:   // Check 2: Same-day claims count
29:   const sameDayClaims = claim.claimsHistory?.filter(h => h.date === claim.treatmentDate) ?? [];
30:   const totalSameDayCount = sameDayClaims.length + 1;
31:   if (totalSameDayCount >= thresholds.same_day_claims_limit) {
32:     forcedManualReview = true;
33:     signals.push(`SAME_DAY_LIMIT: ${totalSameDayCount} claims on ${claim.treatmentDate} (limit: ${thresholds.same_day_claims_limit})`);
34:     trace.push({
35:       stage: 'FraudDetection',
36:       check: 'SameDayClaimsCheck',
37:       result: 'WARNING',
38:       detail: FraudDetectorTraces.multipleSameDayClaims(totalSameDayCount, claim.treatmentDate)
39:     });
40:   } else {
41:     trace.push({
42:       stage: 'FraudDetection',
43:       check: 'SameDayClaimsCheck',
44:       result: 'PASSED',
45:       detail: FraudDetectorTraces.normalSameDayActivity(claim.treatmentDate)
46:     });
47:   }
48:   // Check 3: Monthly claims count
49:   const treatmentMonth = claim.treatmentDate.substring(0, 7); // "YYYY-MM"
50:   const monthClaims = claim.claimsHistory?.filter(h => h.date.startsWith(treatmentMonth)) ?? [];
51:   const totalMonthCount = monthClaims.length + 1;
52:   if (totalMonthCount >= thresholds.monthly_claims_limit) {
53:     forcedManualReview = true;
54:     signals.push(`MONTHLY_LIMIT: ${totalMonthCount} claims in ${treatmentMonth} (limit: ${thresholds.monthly_claims_limit})`);
55:     trace.push({
56:       stage: 'FraudDetection',
57:       check: 'MonthlyClaimsCheck',
58:       result: 'WARNING',
59:       detail: FraudDetectorTraces.highMonthlyFrequency(totalMonthCount, treatmentMonth)
60:     });
61:   } else {
62:     trace.push({
63:       stage: 'FraudDetection',
64:       check: 'MonthlyClaimsCheck',
65:       result: 'PASSED',
66:       detail: FraudDetectorTraces.normalMonthlyFrequency()
67:     });
68:   }
69:   const requiresManualReview = forcedManualReview;
70:   if (requiresManualReview) {
71:     trace.push({
72:       stage: 'FraudDetection',
73:       check: 'FraudRulesCheck',
74:       result: 'WARNING',
75:       detail: FraudDetectorTraces.manualReviewFlagged("fraud score or amount")
76:     });
77:   }
78:   // We are currently not utilizing a fractional fraud risk because all current rules are Hard Rules.
79:   // Set to 1.0 if manual review is required, 0.0 otherwise.
80:   const fraudRisk = requiresManualReview ? 1.0 : 0.0;
81:   return { signals, fraudRisk, requiresManualReview, trace, failed: false };
82: }
````

## File: lib/pipeline.ts
````typescript
  1: import { ClaimSubmission, ClaimDecisionOutput, TraceEntry } from './types/claim.types';
  2: import { verifyDocuments } from './agents/1-DocumentVerifier';
  3: import { extractInformation } from './agents/2-InformationExtractor';
  4: import { PolicyEngine } from './agents/3-PolicyEngine';
  5: import { detectFraud } from './agents/4-FraudDetector';
  6: import { synthesizeDecision } from './agents/5-DecisionSynthesizer';
  7: import { loadPolicy } from './policy/policyLoader';
  8: export async function processClaimPipeline(
  9:   claim: ClaimSubmission,
 10:   claimId: string
 11: ): Promise<ClaimDecisionOutput> {
 12:   const engine = new PolicyEngine();
 13:   const policy = loadPolicy();
 14:   const degradedComponents: string[] = [];
 15:   const allTrace: TraceEntry[] = [];
 16:   let systemConfidence = 1.0;
 17:   // ── Stage 1: Document Verification ──────────────────────────────────
 18:   let verification;
 19:   try {
 20:     verification = await verifyDocuments(claim);
 21:     allTrace.push(...verification.trace);
 22:   } catch (err) {
 23:     // If verifier itself crashes, we cannot proceed safely
 24:     return buildSystemError(claimId, 'DocumentVerifier', err);
 25:   }
 26:   // Hard stop — wrong or unreadable documents returned to member
 27:   if (!verification.passed) {
 28:     // If we couldn't identify even ONE valid document, it's a hard rejection.
 29:     // "unidentified document" vs "prescription" etc.
 30:     const hasAnyIdentifiedDoc = verification.trace.some(t =>
 31:       t.check === 'DocumentClassification' && !t.detail.includes('unidentified document')
 32:     );
 33:     return {
 34:       claimId: claimId,
 35:       decision: hasAnyIdentifiedDoc ? 'MANUAL_REVIEW' : 'REJECTED',
 36:       approvedAmount: 0,
 37:       rejectionReasons: verification.errors.map(e => e.message),
 38:       systemConfidence: 1.0, // We are 100% sure these documents are invalid
 39:       trace: allTrace,
 40:       degradedComponents: []
 41:     };
 42:   }
 43:   // ── Stage 2: Information Extraction ────────────────────────────────
 44:   let extraction;
 45:   try {
 46:     if (claim.simulateComponentFailure) {
 47:       throw new Error('Simulated component failure to avoid crashing');
 48:     }
 49:     extraction = await extractInformation(claim.documents);
 50:     allTrace.push(...extraction.trace);
 51:     // Penalise systemConfidence proportional to extraction confidence
 52:     systemConfidence -= (1 - extraction.overallExtractionConfidence) * 0.30;
 53:   } catch (err) {
 54:     degradedComponents.push('InformationExtractor');
 55:     systemConfidence -= 0.20;
 56:     // Fallback: build minimal extraction from claim metadata
 57:     extraction = buildFallbackExtraction(claim);
 58:     allTrace.push({
 59:       stage: 'InformationExtraction',
 60:       check: 'ExtractionFailed',
 61:       result: 'WARNING',
 62:       detail: `Extraction failed — using claim metadata fallback. Error: ${String(err)}`
 63:     });
 64:   }
 65:   // ── Stage 3: Policy Engine ─────────────────────────────────────────
 66:   // Deterministic — should never throw. No try/catch needed.
 67:   const policyResult = engine.evaluate(claim, extraction, policy);
 68:   allTrace.push(...policyResult.trace);
 69:   // ── Stage 4: Fraud Detection ────────────────────────────────────────
 70:   let fraudResult;
 71:   try {
 72:     fraudResult = await detectFraud(claim);
 73:     allTrace.push(...fraudResult.trace);
 74:     if (fraudResult.requiresManualReview || fraudResult.fraudRisk >= 0.80) systemConfidence -= 0.15;
 75:   } catch (err) {
 76:     degradedComponents.push('FraudDetector');
 77:     systemConfidence -= 0.10;
 78:     fraudResult = {
 79:       signals: [],
 80:       fraudRisk: 0,
 81:       requiresManualReview: false,
 82:       trace: [],
 83:       failed: true
 84:     };
 85:     allTrace.push({
 86:       stage: 'FraudDetection',
 87:       check: 'FraudDetectorFailed',
 88:       result: 'WARNING',
 89:       detail: `Fraud detection unavailable — proceeding without fraud signals. Error: ${String(err)}`
 90:     });
 91:   }
 92:   // ── Stage 5: Decision Synthesis ─────────────────────────────────────
 93:   return synthesizeDecision(
 94:     claimId,
 95:     policyResult,
 96:     fraudResult,
 97:     systemConfidence,
 98:     allTrace,
 99:     degradedComponents
100:   );
101: }
102: function buildFallbackExtraction(claim: ClaimSubmission) {
103:   return {
104:     documents: claim.documents.map(doc => ({
105:       documentId: doc.id,
106:       documentType: doc.type,
107:       extractionConfidence: 0.3,
108:       unreadableFields: ['all_fields']
109:     })),
110:     overallExtractionConfidence: 0.3,
111:     trace: [],
112:     failed: true
113:   };
114: }
115: function buildSystemError(claimId: string, component: string, err: unknown): ClaimDecisionOutput {
116:   return {
117:     claimId,
118:     decision: 'MANUAL_REVIEW',
119:     approvedAmount: 0,
120:     rejectionReasons: [`System error in ${component} — routed to manual review`],
121:     systemConfidence: 0,
122:     trace: [{
123:       stage: component,
124:       check: 'SystemError',
125:       result: 'FAILED',
126:       detail: String(err)
127:     }],
128:     degradedComponents: [component]
129:   };
130: }
````

## File: README.md
````markdown
1: 
````

## File: app/api/claims/route.ts
````typescript
  1: import { NextRequest, NextResponse } from 'next/server';
  2: import { processClaimPipeline } from '@/lib/pipeline';
  3: import { ClaimSubmission, UploadedDocument } from '@/lib/types/claim.types';
  4: import { randomUUID } from 'crypto';
  5: /**
  6:  * POST /api/claims
  7:  *
  8:  * Accepts a multipart/form-data request with:
  9:  *   - claimData: JSON string containing claim metadata (memberId, policyId, etc.)
 10:  *   - documents[]: one or more files (images or PDFs)
 11:  *
 12:  * Converts each uploaded file to base64, constructs UploadedDocument objects with type 'UNKNOWN'
 13:  * (document type will be auto-detected by DocumentVerifier via OpenAI's vision API),
 14:  * then feeds the full ClaimSubmission into the processing pipeline.
 15:  */
 16: export async function POST(request: NextRequest) {
 17:   try {
 18:     const formData = await request.formData();
 19:     // ── Parse claim metadata ─────────────────────────────────────────
 20:     const claimDataRaw = formData.get('claimData');
 21:     if (!claimDataRaw || typeof claimDataRaw !== 'string') {
 22:       return NextResponse.json(
 23:         { error: 'Missing required field: claimData (JSON string)' },
 24:         { status: 400 }
 25:       );
 26:     }
 27:     let claimMeta: Omit<ClaimSubmission, 'documents'>;
 28:     try {
 29:       claimMeta = JSON.parse(claimDataRaw);
 30:     } catch {
 31:       return NextResponse.json(
 32:         { error: 'claimData must be valid JSON' },
 33:         { status: 400 }
 34:       );
 35:     }
 36:     // Validate required fields
 37:     if (!claimMeta.memberId || !claimMeta.policyId || !claimMeta.claimCategory ||
 38:       !claimMeta.treatmentDate || claimMeta.claimedAmount == null) {
 39:       return NextResponse.json(
 40:         { error: 'Missing required claim fields: memberId, policyId, claimCategory, treatmentDate, claimedAmount' },
 41:         { status: 400 }
 42:       );
 43:     }
 44:     // ── Parse uploaded files ─────────────────────────────────────────
 45:     const files = formData.getAll('documents') as File[];
 46:     if (files.length === 0) {
 47:       return NextResponse.json(
 48:         { error: 'At least one document file is required' },
 49:         { status: 400 }
 50:       );
 51:     }
 52:     // Convert each file to base64 — this is the ONLY place file→base64 happens
 53:     const documents: UploadedDocument[] = await Promise.all(
 54:       files.map(async (file, index) => {
 55:         const arrayBuffer = await file.arrayBuffer();
 56:         const buffer = Buffer.from(arrayBuffer);
 57:         const base64Data = buffer.toString('base64');
 58:         const mimeType = file.type || 'application/octet-stream';
 59:         // Validate MIME type — only images and PDFs
 60:         const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
 61:         if (!allowedMimeTypes.includes(mimeType)) {
 62:           throw new Error(
 63:             `Unsupported file type: ${mimeType} for file "${file.name}". ` +
 64:             `Accepted types: JPEG, PNG, WebP, PDF.`
 65:           );
 66:         }
 67:         return {
 68:           id: `doc_${randomUUID().slice(0, 8)}`,
 69:           type: 'UNKNOWN',       // Will be auto-detected by DocumentVerifier
 70:           content: '',          // @deprecated — kept for backward compat
 71:           base64Data,
 72:           mimeType,
 73:           fileName: file.name || `document_${index + 1}`,
 74:         };
 75:       })
 76:     );
 77:     // ── Assemble full ClaimSubmission and run pipeline ────────────────
 78:     const claimId = `CLM-${Date.now()}-${randomUUID().slice(0, 6)}`;
 79:     const submission: ClaimSubmission = {
 80:       ...claimMeta,
 81:       documents,
 82:       submissionDate: new Date().toISOString(),
 83:     };
 84:     const result = await processClaimPipeline(submission, claimId);
 85:     return NextResponse.json(result, { status: 200 });
 86:   } catch (err) {
 87:     console.error('[POST /api/claims] Error:', err);
 88:     return NextResponse.json(
 89:       { error: err instanceof Error ? err.message : 'Internal server error' },
 90:       { status: 500 }
 91:     );
 92:   }
 93: }
 94: /*
 95:  * PUT /api/claims
 96:  * 
 97:  * Used for TESTING and JSON-ONLY submissions.
 98:  * Unlike POST, this expects the caller to have already converted documents to base64.
 99: */
100: export async function PUT(request: NextRequest) {
101:   try {
102:     const body = await request.json();
103:     if (!body.memberId || !body.documents || !Array.isArray(body.documents)) {
104:       return NextResponse.json(
105:         { error: 'Missing required fields: memberId, documents[]' },
106:         { status: 400 }
107:       );
108:     }
109:     const claimId = `CLM-${Date.now()}-${randomUUID().slice(0, 6)}`;
110:     const submission: ClaimSubmission = {
111:       ...body,
112:       submissionDate: body.submissionDate || new Date().toISOString(),
113:     };
114:     const result = await processClaimPipeline(submission, claimId);
115:     return NextResponse.json(result, { status: 200 });
116:   } catch (err) {
117:     console.error('[PUT /api/claims] Error:', err);
118:     return NextResponse.json(
119:       { error: err instanceof Error ? err.message : 'Internal server error' },
120:       { status: 500 }
121:     );
122:   }
123: }
````

## File: package.json
````json
 1: {
 2:   "name": "plum-claims",
 3:   "version": "0.1.0",
 4:   "private": true,
 5:   "scripts": {
 6:     "dev": "next dev",
 7:     "build": "next build",
 8:     "start": "next start",
 9:     "lint": "eslint",
10:     "test:agents": "node node_modules/jiti/lib/jiti-cli.mjs scripts/test-agents.ts"
11:   },
12:   "dependencies": {
13:     "@vercel/analytics": "^2.0.1",
14:     "@vercel/speed-insights": "^2.0.0",
15:     "next": "16.2.4",
16:     "openai": "^6.35.0",
17:     "react": "19.2.4",
18:     "react-dom": "19.2.4"
19:   },
20:   "devDependencies": {
21:     "@tailwindcss/postcss": "^4",
22:     "@types/node": "^20",
23:     "@types/react": "^19",
24:     "@types/react-dom": "^19",
25:     "eslint": "^9",
26:     "eslint-config-next": "16.2.4",
27:     "tailwindcss": "^4",
28:     "typescript": "^5"
29:   }
30: }
````

## File: scripts/test-pipeline.ts
````typescript
  1: import fs from 'fs';
  2: import path from 'path';
  3: import { loadEnvConfig } from '@next/env';
  4: import { processClaimPipeline } from '../lib/pipeline';
  5: import { ClaimSubmission } from '../lib/types/claim.types';
  6: loadEnvConfig(process.cwd());
  7: function buildDocumentsFromTestCase(input: any) {
  8:   return (input.documents || []).map((doc: any, index: number) => ({
  9:     id: doc.file_id || `doc_${index + 1}`,
 10:     type: doc.actual_type,
 11:     content: doc.content ? JSON.stringify(doc.content) : `${doc.actual_type} document`,
 12:     base64Data: Buffer.from(
 13:       JSON.stringify(doc.content || { type: doc.actual_type, ok: true }),
 14:       'utf-8'
 15:     ).toString('base64'),
 16:     mimeType: 'image/jpeg',
 17:     quality: doc.quality || 'GOOD',
 18:     patientNameOnDoc:
 19:       doc.patient_name_on_doc || doc.content?.patient_name || undefined,
 20:   }));
 21: }
 22: async function main() {
 23:   const caseId = process.argv[2] || 'TC009';
 24:   const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json');
 25:   const raw = fs.readFileSync(testCasesPath, 'utf-8');
 26:   const testCasesData = JSON.parse(raw);
 27:   const testCase = testCasesData.test_cases.find((tc: any) => tc.case_id === caseId);
 28:   if (!testCase) {
 29:     throw new Error(`${caseId} not found`);
 30:   }
 31:   const input = testCase.input;
 32:   const mockClaim: ClaimSubmission = {
 33:     memberId: input.member_id,
 34:     policyId: input.policy_id,
 35:     claimCategory: input.claim_category,
 36:     treatmentDate: input.treatment_date,
 37:     claimedAmount: input.claimed_amount,
 38:     hospitalName:
 39:       input.hospital_name ||
 40:       input.documents?.find((d: any) => d.content?.hospital_name)?.content?.hospital_name ||
 41:       'Mock Hospital',
 42:     submissionDate: input.submission_date || input.treatment_date,
 43:     ytdClaimsAmount: input.ytd_claims_amount || 0,
 44:     simulateComponentFailure: input.simulate_component_failure || false,
 45:     claimsHistory:
 46:       input.claims_history?.map((ch: any) => ({
 47:         claimId: ch.claim_id,
 48:         date: ch.date,
 49:         amount: ch.amount,
 50:         provider: ch.provider,
 51:       })) || [],
 52:     documents: buildDocumentsFromTestCase(input),
 53:   };
 54:   console.log(`Running Pipeline on ${testCase.case_id}: ${testCase.case_name}`);
 55:   const result = await processClaimPipeline(mockClaim, `CLAIM_${caseId}`);
 56:   console.log('\n=== Pipeline Result ===');
 57:   console.log(`Decision: ${result.decision}`);
 58:   console.log(`Approved amount: ${result.approvedAmount}`);
 59:   console.log(`System confidence: ${result.systemConfidence}`);
 60:   console.log(`Degraded components: ${result.degradedComponents.join(', ') || 'none'}`);
 61:   if (result.rejectionReasons.length > 0) {
 62:     console.log(`Reasons/Flags: ${result.rejectionReasons.join(' | ')}`);
 63:   }
 64:   const groupedTrace = result.trace.reduce((acc: Record<string, any[]>, t: any) => {
 65:     if (!acc[t.stage]) acc[t.stage] = [];
 66:     acc[t.stage].push(t);
 67:     return acc;
 68:   }, {});
 69:   console.log('\n=== Trace by Stage ===');
 70:   for (const [stage, entries] of Object.entries(groupedTrace)) {
 71:     console.log(`\n--- ${stage} ---`);
 72:     console.log(JSON.stringify(entries, null, 2));
 73:   }
 74:   const fraudTraces = result.trace.filter((t: any) => t.stage === 'FraudDetection');
 75:   const onlyVerificationStage =
 76:     result.trace.length > 0 &&
 77:     result.trace.every((t: any) => t.stage === 'DocumentVerification');
 78:   if (caseId === 'TC009') {
 79:     if (result.decision !== 'MANUAL_REVIEW') {
 80:       throw new Error(`Expected MANUAL_REVIEW for TC009, got ${result.decision}`);
 81:     }
 82:     // Accept either:
 83:     // 1) early stop at verification, OR
 84:     // 2) fraud stage reached with fraud traces present
 85:     if (!onlyVerificationStage && fraudTraces.length === 0) {
 86:       throw new Error(
 87:         'Expected FraudDetection trace for TC009 if pipeline progressed beyond DocumentVerification'
 88:       );
 89:     }
 90:   }
 91:   if (caseId === 'TC011') {
 92:     if (result.decision !== 'MANUAL_REVIEW') {
 93:       throw new Error(`Expected MANUAL_REVIEW for TC011, got ${result.decision}`);
 94:     }
 95:     // If pipeline gets past verification, degraded extraction should appear.
 96:     // If it stops at verification, that is still acceptable for the current pipeline.
 97:     const extractionWarnings = result.trace.filter(
 98:       (t: any) =>
 99:         t.stage === 'InformationExtraction' &&
100:         t.check === 'ExtractionFailed'
101:     );
102:     if (!onlyVerificationStage) {
103:       if (!result.degradedComponents.includes('InformationExtractor')) {
104:         throw new Error(
105:           'Expected degradedComponents to include InformationExtractor for TC011'
106:         );
107:       }
108:       if (extractionWarnings.length === 0) {
109:         throw new Error(
110:           'Expected InformationExtraction/ExtractionFailed trace for TC011'
111:         );
112:       }
113:     }
114:   }
115:   console.log(`\nTest ${caseId} Passed!`);
116: }
117: main().catch((err) => {
118:   console.error('\nTest Failed:');
119:   console.error(err);
120:   process.exit(1);
121: });
````

## File: app/claims/[id]/page.tsx
````typescript
  1: "use client";
  2: import { useEffect, useState } from "react";
  3: import { useParams, useRouter } from "next/navigation";
  4: import { simplifyRejectionReasons } from "@/lib/utils/rejectionMessageMapper";
  5: // --- Data Types ---
  6: /** Possible outcomes for a claim review */
  7: type Decision = "APPROVED" | "PARTIAL" | "REJECTED" | "MANUAL_REVIEW";
  8: /** Individual checks performed by the Claim System */
  9: interface TraceEntry {
 10:   stage: string;
 11:   check: string;
 12:   result: "PASSED" | "FAILED" | "WARNING" | "INFO" | "SKIPPED";
 13:   detail: string;
 14: }
 15: /** The final payload from the claim processing pipeline */
 16: interface ClaimResult {
 17:   claimId: string;
 18:   decision: Decision;
 19:   approvedAmount: number;
 20:   rejectionReasons: string[];
 21:   systemConfidence: number;
 22:   trace: TraceEntry[];
 23:   degradedComponents: string[];
 24: }
 25: // --- Visual Config ---
 26: /** Mapping machine-readable check IDs to friendly labels */
 27: const CHECK_LABELS: Record<string, string> = {
 28:   // DocumentVerifier
 29:   FileDataCheck: "File received",
 30:   DocumentClassification: "Document identified",
 31:   RequiredDocumentCheck: "Required paperwork",
 32:   ReadabilityCheck: "Can we read this?",
 33:   CrossDocumentConsistency: "Patient name match",
 34:   RequirementsLookup: "Policy requirements",
 35:   ProviderExtracted: "Provider identified",
 36:   DiagnosisExtracted: "Diagnosis noted",
 37:   // Consistency
 38:   "Provider Consistency": "Hospital name check",
 39:   "Date Consistency": "Date check",
 40:   // InformationExtractor
 41:   Extract_PRESCRIPTION: "Prescription details",
 42:   Extract_HOSPITAL_BILL: "Hospital bill details",
 43:   Extract_LAB_REPORT: "Lab report details",
 44:   Extract_PHARMACY_BILL: "Pharmacy bill details",
 45:   Extract_DENTAL_REPORT: "Dental report details",
 46:   Extract_DISCHARGE_SUMMARY: "Discharge summary",
 47:   // PolicyEngine
 48:   "Member Exists": "Member found",
 49:   MEMBER_NOT_FOUND: "Member check",
 50:   "Policy Active": "Policy active",
 51:   POLICY_INACTIVE: "Policy active",
 52:   "Submission Deadline": "Submitted on time",
 53:   SUBMISSION_LATE: "Submission deadline",
 54:   "Minimum Amount": "Claim amount",
 55:   MINIMUM_AMOUNT_NOT_MET: "Claim amount",
 56:   "Initial Waiting Period": "Waiting period",
 57:   WAITING_PERIOD: "Waiting period",
 58:   "Condition Waiting Period": "Condition waiting period",
 59:   "Category Covered": "Category covered",
 60:   CATEGORY_NOT_COVERED: "Category covered",
 61:   "Diagnosis Exclusions": "Exclusions check",
 62:   EXCLUDED_CONDITION: "Exclusions check",
 63:   "Exclusions (Partial)": "Partial exclusions",
 64:   "Pre-authorization": "Pre-authorisation",
 65:   PRE_AUTH_MISSING: "Pre-authorisation",
 66:   "Annual OPD Limit": "Annual limit",
 67:   ANNUAL_LIMIT_EXCEEDED: "Annual limit",
 68:   "Category Sub-limit": "Category limit",
 69:   "Per-claim Limit": "Per-claim limit",
 70:   PER_CLAIM_EXCEEDED: "Per-claim limit",
 71:   // FraudDetector
 72:   HighValueCheck: "Claim amount check",
 73:   AutoManualReviewCheck: "Review threshold",
 74:   SameDayClaimsCheck: "Same-day activity",
 75:   MonthlyClaimsCheck: "Monthly activity",
 76:   FraudRulesCheck: "Overall integrity",
 77:   // Financial
 78:   "Network Discount": "Network discount",
 79:   Copay: "Your co-pay",
 80:   "Final Approval": "Refund calculated",
 81: };
 82: /** Labels for the major stages of the AI pipeline */
 83: const STAGE_LABELS: Record<string, string> = {
 84:   DocumentVerification: "Paperwork Check",
 85:   InformationExtraction: "Data Review",
 86:   POLICY_ENGINE: "Coverage Check",
 87:   FraudDetection: "Trust & Integrity",
 88:   FINANCIAL: "Your Refund Calculation",
 89: };
 90: /** Visual styles (colors, labels, subtitles) for each decision type */
 91: const DECISION_STYLES: Record<Decision, { color: string; glow: string; label: string; subtitle: string }> = {
 92:   APPROVED: { color: "text-status-approved", glow: "shadow-[0_0_20px_rgba(74,222,128,0.25)]", label: "Fully Approved", subtitle: "You're all set." },
 93:   PARTIAL: { color: "text-status-manual", glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]", label: "Partially Approved", subtitle: "We've covered what we can." },
 94:   REJECTED: { color: "text-status-rejected", glow: "shadow-[0_0_20px_rgba(255,64,82,0.25)]", label: "Declined", subtitle: "We couldn't approve this one." },
 95:   MANUAL_REVIEW: { color: "text-status-manual", glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]", label: "Routing for Care", subtitle: "A specialist will take a closer look." },
 96: };
 97: /** Glow colors for the status indicators */
 98: const RESULT_DOT: Record<string, string> = {
 99:   PASSED: "bg-status-approved shadow-[0_0_6px_var(--color-status-approved)]",
100:   FAILED: "bg-status-rejected shadow-[0_0_6px_var(--color-status-rejected)]",
101:   WARNING: "bg-status-manual shadow-[0_0_6px_var(--color-status-manual)]",
102:   INFO: "bg-plum-muted",
103:   SKIPPED: "bg-plum-secondary",
104: };
105: /** Text colors for the status badges */
106: const RESULT_BADGE: Record<string, string> = {
107:   PASSED: "text-status-approved",
108:   FAILED: "text-status-rejected",
109:   WARNING: "text-status-manual",
110:   INFO: "text-plum-muted",
111:   SKIPPED: "text-plum-secondary",
112: };
113: // --- Helper Functions ---
114: /** Groups a flat list of AI checks into their parent stages (e.g., all Policy Engine checks together) */
115: function groupTraceByStage(trace: TraceEntry[]): { stage: string; entries: TraceEntry[] }[] {
116:   const order = ["DocumentVerification", "InformationExtraction", "POLICY_ENGINE", "FraudDetection", "FINANCIAL"];
117:   const map = new Map<string, TraceEntry[]>();
118:   for (const entry of trace) {
119:     if (!map.has(entry.stage)) map.set(entry.stage, []);
120:     map.get(entry.stage)!.push(entry);
121:   }
122:   // Return in order, then any unexpected stages at end
123:   const result: { stage: string; entries: TraceEntry[] }[] = [];
124:   for (const stage of order) {
125:     if (map.has(stage)) result.push({ stage, entries: map.get(stage)! });
126:   }
127:   for (const [stage, entries] of map) {
128:     if (!order.includes(stage)) result.push({ stage, entries });
129:   }
130:   return result;
131: }
132: /** Determines the overall result of a stage (e.g., if one check fails, the whole stage is 'FAILED') */
133: function stageOverallResult(entries: TraceEntry[]): "PASSED" | "FAILED" | "WARNING" | "INFO" {
134:   if (entries.some(e => e.result === "FAILED")) return "FAILED";
135:   if (entries.some(e => e.result === "WARNING")) return "WARNING";
136:   if (entries.every(e => e.result === "PASSED")) return "PASSED";
137:   return "INFO";
138: }
139: // --- UI Components ---
140: /** An expandable section showing the detailed AI checks for a specific pipeline stage */
141: function TraceAccordion({ stage, entries }: { stage: string; entries: TraceEntry[] }) {
142:   const [open, setOpen] = useState(false);
143:   const overall = stageOverallResult(entries);
144:   return (
145:     <div className="border border-plum-secondary rounded-md overflow-hidden bg-plum-main/60">
146:       <button
147:         type="button"
148:         onClick={() => setOpen(!open)}
149:         className="w-full flex items-center justify-between p-4 hover:bg-plum-secondary/40 active:bg-plum-secondary/60 transition-colors text-left gap-2"
150:       >
151:         {/* Stage Name & Status Dot */}
152:         <div className="flex items-center gap-3 min-w-0">
153:           <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${RESULT_DOT[overall]}`} />
154:           <span className="font-medium text-sm sm:text-base text-plum-offwhite truncate">
155:             {STAGE_LABELS[stage] ?? stage}
156:           </span>
157:         </div>
158:         {/* Status Badge & Toggle */}
159:         <div className="flex items-center gap-3 shrink-0 ml-auto">
160:           <span className="text-[10px] text-plum-muted hidden xs:inline">({entries.length} checks)</span>
161:           <span className={`text-[10px] font-mono font-bold tracking-wider ${RESULT_BADGE[overall]}`}>
162:             {overall}
163:           </span>
164:           <svg className={`w-4 h-4 text-plum-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
165:             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
166:           </svg>
167:         </div>
168:       </button>
169:       {/* Expanded check details */}
170:       {open && (
171:         <div className="border-t border-plum-secondary bg-plum-secondary/5 divide-y divide-plum-secondary/20">
172:           {entries.map((entry, i) => (
173:             <div key={i} className="px-4 py-3 flex gap-3 items-start">
174:               <span className={`text-xs mt-1 shrink-0 ${RESULT_BADGE[entry.result]}`}>
175:                 {entry.result === "PASSED" ? "✓" : entry.result === "FAILED" ? "✗" : "⚠"}
176:               </span>
177:               <div className="min-w-0 flex-1">
178:                 <p className="text-[10px] font-bold text-plum-muted uppercase tracking-widest leading-none mb-1">{CHECK_LABELS[entry.check] ?? entry.check}</p>
179:                 <p className="text-sm text-plum-offwhite/90 leading-snug">{entry.detail}</p>
180:               </div>
181:             </div>
182:           ))}
183:         </div>
184:       )}
185:     </div>
186:   );
187: }
188: // --- Main Page Component ---
189: export default function ClaimResult() {
190:   const { id } = useParams<{ id: string }>();
191:   const router = useRouter();
192:   /** The processed claim data retrieved from the local browser session */
193:   const [result, setResult] = useState<ClaimResult | null>(null);
194:   const [loading, setLoading] = useState(true);
195:   /** Load result from sessionStorage on page load */
196:   useEffect(() => {
197:     const stored = sessionStorage.getItem(`claim_${id}`);
198:     if (stored) {
199:       setResult(JSON.parse(stored));
200:     }
201:     setLoading(false);
202:   }, [id]);
203:   /** Loading state UI */
204:   if (loading) {
205:     return (
206:       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
207:         <svg className="w-10 h-10 text-plum-pink animate-spin" fill="none" viewBox="0 0 24 24">
208:           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
209:           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
210:         </svg>
211:         <p className="text-plum-muted text-sm">Loading claim result...</p>
212:       </div>
213:     );
214:   }
215:   /** Error state (claim not found) */
216:   if (!result) {
217:     return (
218:       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
219:         <p className="text-plum-muted">We couldn&apos;t find this claim. It may have expired from your session.</p>
220:         <button onClick={() => router.push("/")} className="text-plum-pink text-sm hover:underline">
221:           ← Submit a new claim
222:         </button>
223:       </div>
224:     );
225:   }
226:   const ds = DECISION_STYLES[result.decision];
227:   const groups = groupTraceByStage(result.trace);
228:   const hasAmount = result.approvedAmount > 0;
229:   return (
230:     <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
231:       {/* Back link */}
232:       <button onClick={() => router.push("/")} className="text-plum-muted text-sm hover:text-plum-pink transition-colors flex items-center gap-1.5 w-fit">
233:         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
234:           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
235:         </svg>
236:         Submit another claim
237:       </button>
238:       {/* Header */}
239:       <div>
240:         <h1 className="font-serif text-3xl sm:text-4xl text-plum-offwhite mb-2">
241:           Here&apos;s what we <em className="text-plum-muted">found.</em>
242:         </h1>
243:         <p className="text-plum-muted text-xs font-mono">{result.claimId}</p>
244:       </div>
245:       {/* Decision Card */}
246:       <div className={`bg-plum-secondary/20 border border-plum-secondary rounded-xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm ${ds.glow}`}>
247:         {/* Status & Amount */}
248:         <div className="flex items-start justify-between border-b border-plum-secondary pb-5 mb-5">
249:           <div>
250:             <p className="text-[10px] sm:text-xs font-bold text-plum-muted uppercase tracking-widest mb-1">Decision</p>
251:             <h2 className={`font-serif text-4xl sm:text-5xl mt-1 drop-shadow-md ${ds.color}`}>{ds.label}</h2>
252:             <p className="text-sm text-plum-muted mt-1.5">{ds.subtitle}</p>
253:           </div>
254:           {hasAmount && (
255:             <div className="text-right">
256:               <p className="text-[10px] sm:text-xs font-bold text-plum-muted uppercase tracking-widest mb-1">Approved Amount</p>
257:               <h3 className="font-sans font-semibold text-3xl sm:text-4xl text-plum-offwhite mt-1">
258:                 ₹{result.approvedAmount.toLocaleString("en-IN")}
259:               </h3>
260:             </div>
261:           )}
262:         </div>
263:         {/* Confidence */}
264:         <div className="mb-5">
265:           <div className="flex justify-between items-center mb-1.5">
266:             <span className="text-xs text-plum-muted uppercase tracking-wider font-semibold">Decision Certainty</span>
267:             <span className="text-xs text-plum-offwhite font-mono">{(result.systemConfidence * 100).toFixed(0)}%</span>
268:           </div>
269:           <div className="h-1.5 w-full bg-plum-main rounded-full overflow-hidden">
270:             <div
271:               className="h-full rounded-full transition-all duration-1000 ease-out"
272:               style={{
273:                 width: `${result.systemConfidence * 100}%`,
274:                 backgroundColor:
275:                   result.decision === "APPROVED"
276:                     ? "var(--color-status-approved)"
277:                     : result.decision === "REJECTED"
278:                       ? "var(--color-status-rejected)"
279:                       : "var(--color-status-manual)"
280:               }}
281:             />
282:           </div>
283:         </div>
284:         {/* Rejection Reasons */}
285:         {result.rejectionReasons.length > 0 && (
286:           <div className="mb-5 bg-plum-pink/10 border border-plum-pink/30 rounded-md px-4 py-3 flex flex-col gap-1.5">
287:             <p className="text-xs font-semibold text-plum-pink uppercase tracking-wider">Why we couldn't approve this</p>
288:             {Array.from(new Set(simplifyRejectionReasons(result.rejectionReasons))).map((r, i) => (
289:               <p key={i} className="text-sm text-plum-offwhite/80">{r}</p>
290:             ))}
291:           </div>
292:         )}
293:         {/* Degraded components System Warnings (e.g., Component Failure) */}
294:         {result.degradedComponents.length > 0 && (
295:           <div className="mb-5 bg-status-manual/10 border border-status-manual/30 rounded-md px-4 py-3">
296:             <p className="text-xs font-semibold text-status-manual uppercase tracking-wider mb-1">Heads up</p>
297:             <p className="text-sm text-plum-offwhite/70">We had a hiccup with {result.degradedComponents.join(" and ")} during this review. Some details may be incomplete. A specialist may follow up.</p>
298:           </div>
299:         )}
300:         {/* Audit Trail (Step-by-step review) */}
301:         <div className="flex flex-col gap-3">
302:           <h3 className="font-serif text-xl sm:text-2xl text-plum-offwhite mb-1">How we got here</h3>
303:           {groups.map(({ stage, entries }) => (
304:             <TraceAccordion key={stage} stage={stage} entries={entries} />
305:           ))}
306:         </div>
307:       </div>
308:     </div>
309:   );
310: }
````

## File: app/page.tsx
````typescript
  1: "use client";
  2: import { useState, useRef, useEffect, useCallback } from "react";
  3: import { useRouter } from "next/navigation";
  4: interface UploadedFile {
  5:   file: File;
  6:   previewUrl: string;
  7: }
  8: // --- Components ---
  9: /** Custom searchable dropdown with Plum styling */
 10: function Dropdown<T extends { id: string; label?: string; name?: string }>({
 11:   options, value, onChange, label, getLabel,
 12: }: {
 13:   options: T[];
 14:   value: T;
 15:   onChange: (val: T) => void;
 16:   label: string;
 17:   getLabel: (item: T) => string;
 18: }) {
 19:   const [open, setOpen] = useState(false);
 20:   const ref = useRef<HTMLDivElement>(null);
 21:   /** Close dropdown on outside click */
 22:   useEffect(() => {
 23:     const handler = (e: MouseEvent) => {
 24:       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
 25:     };
 26:     document.addEventListener("mousedown", handler);
 27:     return () => document.removeEventListener("mousedown", handler);
 28:   }, []);
 29:   if (!value) return null;
 30:   return (
 31:     <div className="relative" ref={ref}>
 32:       <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">{label}</label>
 33:       <div
 34:         onClick={() => setOpen(!open)}
 35:         className={`w-full bg-plum-main/80 border ${open ? "border-plum-pink" : "border-plum-secondary"} rounded-md px-4 py-3 text-plum-offwhite text-base cursor-pointer flex justify-between items-center transition-colors hover:border-plum-pink`}
 36:       >
 37:         <span className="select-none truncate">{getLabel(value)}</span>
 38:         <svg className={`w-4 h-4 text-plum-muted transition-transform duration-200 shrink-0 ml-2 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
 39:           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 40:         </svg>
 41:       </div>
 42:       {open && (
 43:         <ul className="absolute z-50 w-full mt-1 bg-plum-main border border-plum-secondary rounded-md shadow-2xl overflow-hidden py-1 max-h-52 overflow-y-auto">
 44:           {options.map((opt) => (
 45:             <li
 46:               key={opt.id}
 47:               onClick={() => { onChange(opt); setOpen(false); }}
 48:               className={`px-4 py-2.5 cursor-pointer text-base transition-colors select-none ${value.id === opt.id ? "bg-plum-pink/10 text-plum-pink font-medium" : "text-plum-offwhite hover:bg-plum-pink hover:text-white"}`}
 49:             >
 50:               {getLabel(opt)}
 51:             </li>
 52:           ))}
 53:         </ul>
 54:       )}
 55:     </div>
 56:   );
 57: }
 58: // --- Main Page ---
 59: export default function SubmitClaim() {
 60:   const router = useRouter();
 61:   /** Policy & Form State */
 62:   const [policyData, setPolicyData] = useState<{
 63:     members: { id: string; name: string; relationship: string }[];
 64:     categories: { id: string; label: string; required: string[]; optional: string[] }[];
 65:     documentTypes: string[];
 66:     documentDescriptions: Record<string, string>;
 67:   } | null>(null);
 68:   /** Fetch policy data on mount */
 69:   useEffect(() => {
 70:     fetch("/api/policy")
 71:       .then((r) => r.json())
 72:       .then(setPolicyData);
 73:   }, []);
 74:   const MEMBERS = policyData?.members ?? [];
 75:   const CATEGORIES = policyData?.categories ?? [];
 76:   const [member, setMember] = useState<any>(null);
 77:   const [category, setCategory] = useState<any>(null);
 78:   const [amount, setAmount] = useState("");
 79:   const [treatmentDate, setTreatmentDate] = useState(() => new Date().toISOString().split("T")[0]);
 80:   const [hospitalName, setHospitalName] = useState("");
 81:   const [files, setFiles] = useState<UploadedFile[]>([]);
 82:   const [isSubmitting, setIsSubmitting] = useState(false);
 83:   const [error, setError] = useState<string | null>(null);
 84:   /** Initialize form defaults once policy data is loaded*/
 85:   useEffect(() => {
 86:     if (policyData) {
 87:       if (!member && MEMBERS.length > 0) setMember(MEMBERS[0]);
 88:       if (!category && CATEGORIES.length > 0) setCategory(CATEGORIES[0]);
 89:     }
 90:   }, [policyData, member, category, MEMBERS, CATEGORIES]);
 91:   const fileInputRef = useRef<HTMLInputElement>(null);
 92:   /** Add files with preview URLs */
 93:   const addFiles = useCallback((incoming: FileList) => {
 94:     const added: UploadedFile[] = Array.from(incoming).map((file) => ({
 95:       file,
 96:       previewUrl: URL.createObjectURL(file),
 97:     }));
 98:     setFiles(prev => [...prev, ...added]);
 99:   }, []);
100:   /** Remove file & revoke URL */
101:   const removeFile = (idx: number) => {
102:     setFiles(prev => {
103:       URL.revokeObjectURL(prev[idx].previewUrl);
104:       return prev.filter((_, i) => i !== idx);
105:     });
106:   };
107:   /** Handle drag & drop for file upload */
108:   const handleDrop = (e: React.DragEvent) => {
109:     e.preventDefault();
110:     if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
111:   };
112:   /** Process claim submission */
113:   const handleSubmit = async (e: React.FormEvent) => {
114:     e.preventDefault();
115:     setError(null);
116:     if (files.length === 0) {
117:       setError("We need at least one document to get started. Could you upload your prescription or bill?");
118:       return;
119:     }
120:     setIsSubmitting(true);
121:     try {
122:       const formData = new FormData();
123:       const claimData = {
124:         memberId:       member.id,
125:         policyId:       "PLUM_GHI_2024",
126:         claimCategory:  category.id,
127:         treatmentDate,
128:         claimedAmount:  parseFloat(amount),
129:         hospitalName:   hospitalName || undefined,
130:       };
131:       formData.append("claimData", JSON.stringify(claimData));
132:       files.forEach(f => formData.append("documents", f.file));
133:       const res = await fetch("/api/claims", {
134:         method: "POST",
135:         body: formData,
136:       });
137:       if (!res.ok) {
138:         const data = await res.json();
139:         throw new Error(data.error || "Something didn't go through. Please try again.");
140:       }
141:       const result = await res.json();
142:       // Store result in sessionStorage. Results page reads this
143:       sessionStorage.setItem(`claim_${result.claimId}`, JSON.stringify(result));
144:       router.push(`/claims/${result.claimId}`);
145:     } catch (err) {
146:       setError(err instanceof Error ? err.message : "We have hit a setback. Please try again in a moment.");
147:       setIsSubmitting(false);
148:     }
149:   };
150:   return (
151:     <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
152:       {/* Header */}
153:       <div>
154:         <h1 className="font-serif text-3xl sm:text-4xl text-plum-offwhite mb-2">
155:           Let&apos;s get your claim <em className="text-plum-muted">sorted.</em>
156:         </h1>
157:         <p className="text-plum-muted text-sm sm:text-base leading-relaxed">
158:           Upload your documents and we&apos;ll take it from there. Our AI reviews everything instantly, so your money comes back faster.
159:         </p>
160:       </div>
161:       <form onSubmit={handleSubmit} className="bg-plum-secondary/30 border border-plum-secondary rounded-xl p-5 sm:p-7 flex flex-col gap-5 shadow-2xl relative overflow-visible backdrop-blur-sm">
162:         {/* Design Accent */}
163:         <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-plum-main via-plum-pink to-plum-main rounded-t-xl" />
164:         {/* Member Selection */}
165:         <Dropdown
166:           options={MEMBERS}
167:           value={member}
168:           onChange={setMember}
169:           label="Member"
170:           getLabel={m => `${m.id}: ${m.name}`}
171:         />
172:         {/* Category & Amount */}
173:         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
174:           <Dropdown
175:             options={CATEGORIES}
176:             value={category}
177:             onChange={setCategory}
178:             label="Category"
179:             getLabel={c => c.label}
180:           />
181:           <div>
182:             <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Amount (₹)</label>
183:             <input
184:               type="number"
185:               value={amount}
186:               onChange={e => setAmount(e.target.value)}
187:               required
188:               className="w-full bg-plum-main/80 border border-plum-secondary rounded-md px-4 py-3 text-plum-offwhite text-base focus:outline-none focus:border-plum-pink transition-colors"
189:             />
190:           </div>
191:         </div>
192:         {/* Treatment Date + Hospital */}
193:         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
194:           <div>
195:             <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Treatment Date</label>
196:             <input
197:               type="date"
198:               value={treatmentDate}
199:               max={new Date().toISOString().split("T")[0]}
200:               onChange={e => setTreatmentDate(e.target.value)}
201:               required
202:               className="w-full bg-plum-main/80 border border-plum-secondary rounded-md px-4 py-[11px] text-plum-offwhite text-base focus:outline-none focus:border-plum-pink transition-colors"
203:             />
204:           </div>
205:           <div>
206:             <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Hospital Name <span className="text-plum-muted/50 normal-case font-normal">(optional)</span></label>
207:             <input
208:               type="text"
209:               value={hospitalName}
210:               onChange={e => setHospitalName(e.target.value)}
211:               placeholder="e.g. Apollo Hospitals"
212:               className="w-full bg-plum-main/80 border border-plum-secondary rounded-md px-4 py-3 text-plum-offwhite text-base focus:outline-none focus:border-plum-pink transition-colors placeholder-plum-muted/40"
213:             />
214:           </div>
215:         </div>
216:         {/* File Upload Zone */}
217:         <div>
218:           <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Upload Documents</label>
219:           <div
220:             onClick={() => fileInputRef.current?.click()}
221:             onDrop={handleDrop}
222:             onDragOver={e => e.preventDefault()}
223:             className="border border-dashed border-plum-secondary bg-plum-main/40 rounded-md p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-plum-secondary/50 transition-colors cursor-pointer group active:bg-plum-secondary/70"
224:           >
225:             <div className="w-10 h-10 rounded-full bg-plum-secondary flex items-center justify-center mb-3 group-hover:bg-plum-pink transition-colors">
226:               <svg className="w-5 h-5 text-plum-offwhite" fill="none" viewBox="0 0 24 24" stroke="currentColor">
227:                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
228:               </svg>
229:             </div>
230:             <p className="text-sm font-medium text-plum-offwhite mb-1">Tap to upload, or drag your files here</p>
231:             <p className="text-xs text-plum-muted">Prescriptions, bills, lab reports - PDF, JPG, PNG (Max 5MB each)</p>
232:             <input
233:               ref={fileInputRef}
234:               type="file"
235:               multiple
236:               accept="image/jpeg,image/png,image/webp,application/pdf"
237:               capture="environment"
238:               className="hidden"
239:               onChange={e => { if (e.target.files) addFiles(e.target.files); }}
240:             />
241:         </div>
242:         {/* Required Documents Checklist */}
243:         {category && policyData && (
244:           <div className="bg-plum-main/40 border border-plum-secondary/50 rounded-md p-4">
245:             <p className="text-xs font-semibold text-plum-muted uppercase tracking-wider mb-3">Documents needed</p>
246:             <div className="space-y-3">
247:               <div>
248:                 <p className="text-xs font-semibold text-plum-pink mb-2">Required</p>
249:                 <ul className="space-y-1">
250:                   {category.required.map((doc: string) => (
251:                     <li key={doc} className="text-xs text-plum-offwhite/80">
252:                       • {policyData.documentDescriptions?.[doc] || doc.replace(/_/g, " ")}
253:                     </li>
254:                   ))}
255:                 </ul>
256:               </div>
257:               {category.optional && category.optional.length > 0 && (
258:                 <div>
259:                   <p className="text-xs font-semibold text-plum-muted/70 mb-2">Optional (helps faster approval)</p>
260:                   <ul className="space-y-1">
261:                     {category.optional.map((doc: string) => (
262:                       <li key={doc} className="text-xs text-plum-offwhite/60">
263:                         • {policyData.documentDescriptions?.[doc] || doc.replace(/_/g, " ")}
264:                       </li>
265:                     ))}
266:                   </ul>
267:                 </div>
268:               )}
269:             </div>
270:           </div>
271:         )}
272:         {/* Active File List */}
273:           {files.length > 0 && (
274:             <div className="mt-3 flex flex-col gap-2">
275:               {files.map((f, idx) => (
276:                 <div key={idx} className="flex items-center gap-3 bg-plum-main/60 border border-plum-secondary rounded-md px-3 py-2">
277:                   <div className="w-8 h-8 rounded bg-plum-secondary/50 flex items-center justify-center shrink-0 text-xs text-plum-muted font-mono">
278:                     {f.file.name.endsWith(".pdf") ? "PDF" : "IMG"}
279:                   </div>
280:                   <div className="flex-1 min-w-0">
281:                     <p className="text-xs text-plum-offwhite truncate">{f.file.name}</p>
282:                   </div>
283:                   <button type="button" onClick={() => removeFile(idx)} className="text-plum-muted hover:text-plum-pink transition-colors shrink-0 p-1">
284:                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
285:                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
286:                     </svg>
287:                   </button>
288:                 </div>
289:               ))}
290:             </div>
291:           )}
292:         </div>
293:         {/* Notifications & Submit */}
294:         {error && (
295:           <div className="bg-plum-pink/10 border border-plum-pink/40 rounded-md px-4 py-3 text-sm text-plum-pink">
296:             {error}
297:           </div>
298:         )}
299:         {/* Submit */}
300:         <button
301:           type="submit"
302:           disabled={isSubmitting}
303:           className="mt-2 w-full bg-plum-pink hover:bg-[#e03848] active:scale-[0.98] text-white font-semibold py-3.5 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-lg shadow-[0_4px_14px_rgba(255,64,82,0.3)] select-none"
304:         >
305:           {isSubmitting ? (
306:             <>
307:               <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
308:                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
309:                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
310:               </svg>
311:               Reviewing your documents...
312:             </>
313:           ) : (
314:             <>Submit Claim <span className="text-xl font-light leading-none">→</span></>
315:           )}
316:         </button>
317:       </form>
318:     </div>
319:   );
320: }
````

## File: lib/agents/1-DocumentVerifier.ts
````typescript
  1: import { ClaimSubmission, VerificationResult, TraceEntry, UploadedDocument } from '../types/claim.types'
  2: import { loadPolicy } from '../policy/policyLoader'
  3: import { openai, VISION_MODEL } from '../openai'
  4: import { DocumentVerifierTraces } from '../traces/traceMessages'
  5: interface DocumentAnalysis {
  6:   detected_type: string
  7:   is_readable: boolean
  8:   readability_issues: string[]
  9:   patient_name: string | null
 10:   confidence: number
 11: }
 12: function buildVisionContent(doc: UploadedDocument) {
 13:   // Both images and PDFs sent as image_url with base64 data URL
 14:   // Works across all vision-capable models
 15:   return {
 16:     type: 'image_url' as const,
 17:     image_url: {
 18:       url: `data:${doc.mimeType};base64,${doc.base64Data}`
 19:     }
 20:   }
 21: }
 22: async function analyseDocument(doc: UploadedDocument, validDocTypes: string): Promise<DocumentAnalysis> {
 23:   const response = await openai.chat.completions.create({
 24:     model: VISION_MODEL,
 25:     response_format: { type: 'json_object' },
 26:     messages: [
 27:       {
 28:         role: 'system',
 29:         content: `You are a medical document classifier for Indian health insurance claims.
 30: Analyse the provided document image or PDF and return structured JSON only.
 31: Be strict about readability — if key fields are obscured, declare unreadable.
 32: Valid document types: ${validDocTypes}.
 33: Return ONLY valid JSON. No explanation.`
 34:       },
 35:       {
 36:         role: 'user',
 37:         content: [
 38:           buildVisionContent(doc),
 39:           {
 40:             type: 'text',
 41:             text: `Analyse this Indian medical document and return JSON with this exact structure:
 42: {
 43:   "detected_type": "one of: ${validDocTypes}",
 44:   "is_readable": true or false,
 45:   "readability_issues": ["rubber_stamp_over_text", "image_blurry", "handwriting_illegible", "partial_document", "image_too_dark"],
 46:   "patient_name": "exact name as written on document, or null if not found",
 47:   "confidence": 0.0 to 1.0
 48: }
 49: Notes:
 50: - readability_issues should only list actual problems present, can be empty array
 51: - patient_name should be the name as written — do not correct spelling
 52: - confidence reflects your certainty in the detected_type classification
 53: - If the document is a photo of a handwritten prescription, detected_type is PRESCRIPTION
 54: - If it is a hospital invoice, receipt, bill, OP-slip, or consultation receipt with a fee/total amount, detected_type is HOSPITAL_BILL (even if it's from a dental or vision clinic)
 55: - If it is a diagnostic report (lab results, X-ray report, dental procedure summary) WITHOUT pricing/fee information, detected_type is the specific report type (e.g., DENTAL_REPORT, LAB_REPORT)
 56: - If the document contains any currency symbols (₹), "Amount", "Total", or "Invoice No.", it is likely a HOSPITAL_BILL.
 57: - If the image is dark, shadowed, low-contrast, or requires any effort to read — 
 58: mark is_readable: false. Err on the side of caution. A member can re-upload; extracting from a bad image causes incorrect decisions.`
 59:           }
 60:         ]
 61:       }
 62:     ]
 63:   })
 64:   const raw = response.choices[0].message.content || '{}'
 65:   try {
 66:     const parsed = JSON.parse(raw) as DocumentAnalysis
 67:     parsed.confidence = Math.max(0, Math.min(1, parsed.confidence || 0))
 68:     return parsed
 69:   } catch {
 70:     return {
 71:       detected_type: 'UNKNOWN',
 72:       is_readable: false,
 73:       readability_issues: ['analysis_failed'],
 74:       patient_name: null,
 75:       confidence: 0
 76:     }
 77:   }
 78: }
 79: function normaliseName(name: string): string {
 80:   const HONORIFICS = new Set(['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'master', 'sri', 'smt', 'shri'])
 81:   return name
 82:     .toLowerCase()
 83:     .replace(/\./g, ' ')          // dots → spaces FIRST ("Miss.NAINIKA" → "Miss NAINIKA")
 84:     .replace(/[^a-z\s]/g, '')     // strip remaining punctuation
 85:     .replace(/\s+/g, ' ')
 86:     .trim()
 87:     .split(' ')
 88:     .filter(word => word.length > 0 && !HONORIFICS.has(word))
 89:     .join(' ')
 90:     .trim()
 91: }
 92: export async function verifyDocuments(claim: ClaimSubmission): Promise<VerificationResult> {
 93:   const policy = loadPolicy()
 94:   const requirements = policy.document_requirements[claim.claimCategory]
 95:   const trace: TraceEntry[] = []
 96:   const errors: VerificationResult['errors'] = []
 97:   if (!requirements) {
 98:     return { passed: true, errors: [], trace }
 99:   }
100:   // Derive valid doc types from policy — no hardcoding
101:   const validDocTypes = [
102:     ...new Set(
103:       Object.values(policy.document_requirements)
104:         .flatMap(r => [...r.required, ...r.optional])
105:     ),
106:     'UNKNOWN'
107:   ].join(', ')
108:   // ── Step 1: Analyse each document via LLM (parallel) ──────────────────────
109:   const docsWithData = claim.documents.filter(doc => doc.base64Data && doc.mimeType)
110:   const docsWithoutData = claim.documents.filter(doc => !doc.base64Data || !doc.mimeType)
111:   // Push errors for docs with no file data upfront
112:   docsWithoutData.forEach((doc, idx) => {
113:     errors.push({
114:       documentId: doc.id,
115:       documentType: 'UNKNOWN',
116:       expectedType: doc.type,
117:       message: `We couldn't read "${doc.fileName || doc.id}". It looks like the file didn't come through. Could you try uploading it again?`
118:     })
119:     trace.push({
120:       stage: 'DocumentVerification',
121:       check: 'FileDataCheck',
122:       result: 'FAILED',
123:       detail: DocumentVerifierTraces.fileDataMissing(idx)
124:     })
125:   })
126:   // Run LLM analysis for all valid docs in parallel
127:   const settled = await Promise.allSettled(
128:     docsWithData.map(doc =>
129:       analyseDocument(doc, validDocTypes).then(analysis => ({ ...analysis, documentId: doc.id, declared: doc.type }))
130:     )
131:   )
132:   const analyses: (DocumentAnalysis & { documentId: string; declared: string })[] = []
133:   for (let i = 0; i < settled.length; i++) {
134:     const result = settled[i]
135:     const doc = docsWithData[i]
136:     if (result.status === 'fulfilled') {
137:       analyses.push(result.value)
138:     } else {
139:       // LLM failed for this doc — treat as unverifiable
140:       errors.push({
141:         documentId: doc.id,
142:         documentType: 'UNKNOWN',
143:         expectedType: doc.type,
144:         message: `We're having trouble reading "${doc.fileName || doc.id}". Could you re-upload a clearer copy?`
145:       })
146:       trace.push({
147:         stage: 'DocumentVerification',
148:         check: 'DocumentClassification',
149:         result: 'FAILED',
150:         detail: DocumentVerifierTraces.classificationFailed(doc.fileName || doc.id)
151:       })
152:     }
153:   }
154:   // ── Step 2: Required document type check ──────────────────────────────────
155:   const detectedTypes = analyses.map(a => a.detected_type)
156:   for (const required of requirements.required) {
157:     if (!detectedTypes.includes(required)) {
158:       const requiredLabel = required.replace(/_/g, ' ').toLowerCase()
159:       const foundTypes = analyses.map(a => a.detected_type.replace(/_/g, ' ').toLowerCase())
160:       const message = foundTypes.length > 0
161:         ? DocumentVerifierTraces.requiredDocumentWrong(foundTypes.join(', '), required)
162:         : DocumentVerifierTraces.requiredDocumentMissing(required)
163:       errors.push({
164:         documentId: analyses[0]?.documentId || 'missing',
165:         documentType: analyses[0]?.detected_type || 'MISSING',
166:         expectedType: required,
167:         message
168:       })
169:       trace.push({
170:         stage: 'DocumentVerification',
171:         check: 'RequiredDocumentCheck',
172:         result: 'FAILED',
173:         detail: message
174:       })
175:     } else {
176:       trace.push({
177:         stage: 'DocumentVerification',
178:         check: 'RequiredDocumentCheck',
179:         result: 'PASSED',
180:         detail: DocumentVerifierTraces.requiredDocumentFound(required)
181:       })
182:     }
183:   }
184:   // ── Step 3: Readability check ─────────────────────────────────────────────
185:   for (const analysis of analyses) {
186:     if (!analysis.is_readable) {
187:       const message = DocumentVerifierTraces.documentUnreadable(analysis.detected_type, analysis.readability_issues)
188:       errors.push({
189:         documentId: analysis.documentId,
190:         documentType: analysis.detected_type,
191:         expectedType: analysis.declared,
192:         message
193:       })
194:       trace.push({
195:         stage: 'DocumentVerification',
196:         check: 'ReadabilityCheck',
197:         result: 'FAILED',
198:         detail: message
199:       })
200:     } else {
201:       trace.push({
202:         stage: 'DocumentVerification',
203:         check: 'ReadabilityCheck',
204:         result: 'PASSED',
205:         detail: DocumentVerifierTraces.documentReadable(analysis.detected_type)
206:       })
207:     }
208:   }
209:   // ── Step 4: Cross-document patient name consistency ───────────────────────
210:   // filter out null AND empty-string patient names
211:   const namedDocs = analyses.filter(a => a.patient_name !== null && a.patient_name.trim() !== '')
212:   if (namedDocs.length > 1) {
213:     const normalised = namedDocs.map(a => ({
214:       id: a.documentId,
215:       type: a.detected_type,
216:       name: a.patient_name!,
217:       norm: normaliseName(a.patient_name!)
218:     }))
219:     const allMatch = normalised.every(d => d.norm === normalised[0].norm)
220:     if (!allMatch) {
221:       const namesMap = new Map(normalised.map(d => [d.type, d.name]))
222:       const message = DocumentVerifierTraces.patientNameMismatch(namesMap)
223:       errors.push({
224:         documentId: 'cross_document',
225:         documentType: 'MULTIPLE',
226:         expectedType: 'CONSISTENT_PATIENT',
227:         message
228:       })
229:       trace.push({
230:         stage: 'DocumentVerification',
231:         check: 'CrossDocumentConsistency',
232:         result: 'FAILED',
233:         detail: message
234:       })
235:     } else {
236:       trace.push({
237:         stage: 'DocumentVerification',
238:         check: 'CrossDocumentConsistency',
239:         result: 'PASSED',
240:         detail: DocumentVerifierTraces.patientNameMatch(namedDocs[0].patient_name!)
241:       })
242:     }
243:   }
244:   return {
245:     passed: errors.length === 0,
246:     errors,
247:     trace
248:   }
249: }
````

## File: lib/agents/2-InformationExtractor.ts
````typescript
  1: import { UploadedDocument, ExtractionResult, ExtractedDocument, TraceEntry } from '../types/claim.types'
  2: import { openai, VISION_MODEL } from '../openai'
  3: import { InformationExtractorTraces } from '../traces/traceMessages'
  4: // Medical shorthand glossary — included in all extraction prompts
  5: const MEDICAL_SHORTHAND = `Medical abbreviation reference (expand these in your output):
  6: HTN = Hypertension, T2DM = Type 2 Diabetes Mellitus, URI = Upper Respiratory Infection,
  7: GERD = Gastroesophageal Reflux Disease, IBS = Irritable Bowel Syndrome,
  8: COPD = Chronic Obstructive Pulmonary Disease, UTI = Urinary Tract Infection,
  9: OA = Osteoarthritis, CAD = Coronary Artery Disease, CKD = Chronic Kidney Disease,
 10: Rx = Prescription, OPD = Outpatient Department, IPD = Inpatient Department,
 11: BMI = Body Mass Index, BP = Blood Pressure, CBC = Complete Blood Count, CBP = Complete Blood Picture,
 12: LFT = Liver Function Test, KFT = Kidney Function Test, ECG = Electrocardiogram.
 13: Always expand abbreviations in the diagnosis field.`
 14: function buildVisionContent(doc: UploadedDocument) {
 15:   if (doc.mimeType === 'application/pdf') {
 16:     return {
 17:       type: 'file' as const,
 18:       file: {
 19:         filename: doc.fileName || 'document.pdf',
 20:         file_data: `data:application/pdf;base64,${doc.base64Data}`
 21:       }
 22:     }
 23:   }
 24:   return {
 25:     type: 'image_url' as const,
 26:     image_url: { url: `data:${doc.mimeType};base64,${doc.base64Data}` }
 27:   }
 28: }
 29: function getExtractionPrompt(docType: string): string {
 30:   const base = `${MEDICAL_SHORTHAND}
 31: Return ONLY valid JSON. No explanation before or after.
 32: For any field you cannot read, include the field name in "unreadable_fields" and set the field value to null.
 33: Do not guess or hallucinate values — null is better than wrong data.`
 34:   const prompts: Record<string, string> = {
 35:     PRESCRIPTION: `${base}
 36: Extract from this Indian medical prescription and return JSON:
 37: {
 38:   "patient_name": "full name as written",
 39:   "doctor_name": "full name with qualifications",
 40:   "doctor_registration": "registration number in any format e.g. KA/45678/2015, APMC/FMR/89145, MH/23456/2018, or bare numbers like 55926",
 41:   "clinic_name": "clinic or hospital name",
 42:   "date": "DD-MM-YYYY format, or null",
 43:   "diagnosis": "primary diagnosis, expanded from abbreviations",
 44:   "medicines": [
 45:     { "name": "medicine name with strength", "dosage": "e.g. 1-0-1", "duration": "e.g. 5 days", "amount": 0 }
 46:   ],
 47:   "tests_ordered": ["list of tests if any"],
 48:   "unreadable_fields": ["list fields you could not read"],
 49:   "confidence": 0.0 to 1.0
 50: }
 51: Note: amount for medicines is 0 unless a price is listed. medicines array can be empty if none prescribed.`,
 52:     HOSPITAL_BILL: `${base}
 53: Extract from this Indian hospital bill, clinic invoice, OP-slip, outpatient slip, or consultation receipt and return JSON.
 54: This includes any hospital-issued payment receipt regardless of its exact format or label:
 55: {
 56:   "hospital_name": "full hospital or clinic name",
 57:   "patient_name": "full name as written",
 58:   "doctor_name": "referring or treating doctor name",
 59:   "bill_number": "bill or receipt number",
 60:   "date": "DD-MM-YYYY format, or null",
 61:   "line_items": [
 62:     { "description": "service or item name", "quantity": 1, "amount": 0.0 }
 63:   ],
 64:   "subtotal": 0.0,
 65:   "gst_amount": 0.0,
 66:   "total_amount": 0.0,
 67:   "payment_mode": "Cash / UPI / Card / null",
 68:   "gstin": "GST number if present, or null",
 69:   "unreadable_fields": ["list fields you could not read"],
 70:   "confidence": 0.0 to 1.0
 71: }
 72: Note: line_items must be itemized — do not merge multiple services into one line. If amounts are crossed out and rewritten, use the final written amount.`,
 73:     LAB_REPORT: `${base}
 74: Extract from this Indian laboratory or diagnostic report and return JSON:
 75: {
 76:   "lab_name": "full laboratory name",
 77:   "patient_name": "full name as written",
 78:   "referring_doctor": "doctor who ordered the tests",
 79:   "sample_date": "DD-MM-YYYY format, or null",
 80:   "report_date": "DD-MM-YYYY format, or null",
 81:   "tests": [
 82:     { "name": "test name", "result": "result value as string", "unit": "unit", "normal_range": "range or null", "amount": 0.0 }
 83:   ],
 84:   "total_amount": 0.0,
 85:   "pathologist_name": "signing pathologist if present",
 86:   "nabl_accredited": true or false,
 87:   "remarks": "any remarks or clinical correlation notes",
 88:   "unreadable_fields": ["list fields you could not read"],
 89:   "confidence": 0.0 to 1.0
 90: }`,
 91:     PHARMACY_BILL: `${base}
 92: Extract from this Indian pharmacy or medicine bill and return JSON:
 93: {
 94:   "pharmacy_name": "full pharmacy name",
 95:   "drug_license_number": "license number if visible",
 96:   "patient_name": "full name as written",
 97:   "doctor_name": "prescribing doctor if mentioned",
 98:   "date": "DD-MM-YYYY format, or null",
 99:   "medicines": [
100:     { "name": "medicine name with strength", "batch": "batch number", "expiry": "expiry date", "quantity": 0, "mrp": 0.0, "amount": 0.0 }
101:   ],
102:   "subtotal": 0.0,
103:   "discount": 0.0,
104:   "net_amount": 0.0,
105:   "unreadable_fields": ["list fields you could not read"],
106:   "confidence": 0.0 to 1.0
107: }`,
108:     DENTAL_REPORT: `${base}
109: Extract from this Indian dental report or dental clinic bill and return JSON:
110: {
111:   "clinic_name": "dental clinic name",
112:   "patient_name": "full name as written",
113:   "dentist_name": "treating dentist",
114:   "date": "DD-MM-YYYY format, or null",
115:   "procedures": [
116:     { "description": "procedure name", "tooth_number": "tooth number if mentioned", "amount": 0.0 }
117:   ],
118:   "total_amount": 0.0,
119:   "unreadable_fields": ["list fields you could not read"],
120:   "confidence": 0.0 to 1.0
121: }`,
122:     DISCHARGE_SUMMARY: `${base}
123: Extract from this Indian hospital discharge summary and return JSON:
124: {
125:   "hospital_name": "hospital name",
126:   "patient_name": "full name",
127:   "date_of_admission": "DD-MM-YYYY or null",
128:   "date_of_discharge": "DD-MM-YYYY or null",
129:   "diagnosis": "primary diagnosis, expanded",
130:   "treating_doctor": "doctor name",
131:   "procedures_done": ["list of procedures"],
132:   "total_amount": 0.0,
133:   "unreadable_fields": [],
134:   "confidence": 0.0 to 1.0
135: }`
136:   }
137:   return prompts[docType] || prompts['HOSPITAL_BILL']
138: }
139: function mapToExtractedDocument(docId: string, docType: string, raw: Record<string, unknown>): ExtractedDocument {
140:   // Use null check instead of || to preserve explicit zero confidence
141:   const confidence = Math.max(0, Math.min(1, raw.confidence != null ? (raw.confidence as number) : 0.5))
142:   const unreadableFields = (raw.unreadable_fields as string[]) || []
143:   // Unified line items — different doc types use different field names
144:   let lineItems: { description: string; amount: number }[] = []
145:   if (docType === 'PRESCRIPTION') {
146:     const meds = (raw.medicines as { name: string; amount?: number }[]) || []
147:     lineItems = meds.map(m => ({ description: m.name, amount: m.amount || 0 }))
148:   } else if (docType === 'HOSPITAL_BILL') {
149:     const items = (raw.line_items as { description: string; amount: number }[]) || []
150:     lineItems = items.map(i => ({ description: i.description, amount: i.amount || 0 }))
151:   } else if (docType === 'LAB_REPORT') {
152:     const tests = (raw.tests as { name: string; amount?: number }[]) || []
153:     lineItems = tests.map(t => ({ description: t.name, amount: t.amount || 0 }))
154:   } else if (docType === 'PHARMACY_BILL') {
155:     const meds = (raw.medicines as { name: string; amount?: number }[]) || []
156:     lineItems = meds.map(m => ({ description: m.name, amount: m.amount || 0 }))
157:   } else if (docType === 'DENTAL_REPORT') {
158:     const procs = (raw.procedures as { description: string; amount?: number }[]) || []
159:     lineItems = procs.map(p => ({ description: p.description, amount: p.amount || 0 }))
160:   }
161:   // providerName — critical for PolicyEngine network discount check
162:   const providerName = (
163:     raw.hospital_name ||
164:     raw.pharmacy_name ||
165:     raw.lab_name ||
166:     raw.clinic_name
167:   ) as string | undefined
168:   // date — prefer bill date, fall back to sample/report date
169:   const date = (
170:     raw.date ||
171:     raw.bill_date ||
172:     raw.sample_date ||
173:     raw.report_date ||
174:     raw.date_of_discharge
175:   ) as string | undefined
176:   // totalAmount
177:   const totalAmount = (
178:     raw.total_amount ||
179:     raw.net_amount ||
180:     raw.subtotal
181:   ) as number | undefined
182:   // diagnosis — from prescription or discharge summary
183:   const diagnosis = (raw.diagnosis) as string | undefined
184:   // doctor name
185:   const doctorName = (
186:     raw.doctor_name ||
187:     raw.referring_doctor ||
188:     raw.treating_doctor ||
189:     raw.dentist_name
190:   ) as string | undefined
191:   return {
192:     documentId: docId,
193:     documentType: docType,
194:     providerName,
195:     patientName: raw.patient_name as string | undefined,
196:     doctorName,
197:     doctorRegistration: raw.doctor_registration as string | undefined,
198:     date,
199:     diagnosis,
200:     lineItems,
201:     totalAmount,
202:     extractionConfidence: confidence,
203:     unreadableFields
204:   }
205: }
206: async function extractSingleDocument(doc: UploadedDocument): Promise<ExtractedDocument> {
207:   const prompt = getExtractionPrompt(doc.type)
208:   const response = await openai.chat.completions.create({
209:     model: VISION_MODEL,
210:     response_format: { type: 'json_object' },
211:     messages: [
212:       {
213:         role: 'system',
214:         content: `You are a medical document data extractor for Indian health insurance claims.
215: Extract structured data from the provided document image or PDF.
216: Return ONLY valid JSON matching the requested structure. No prose, no markdown.
217: If a field is partially visible, extract what you can and add it to unreadable_fields.
218: Never hallucinate values — use null for anything you cannot read with confidence.`
219:       },
220:       {
221:         role: 'user',
222:         content: [
223:           buildVisionContent(doc),
224:           { type: 'text', text: prompt }
225:         ]
226:       }
227:     ]
228:   })
229:   const raw = response.choices[0].message.content || '{}'
230:   let parsed: Record<string, unknown>
231:   try {
232:     parsed = JSON.parse(raw)
233:   } catch {
234:     return {
235:       documentId: doc.id,
236:       documentType: doc.type,
237:       extractionConfidence: 0.1,
238:       unreadableFields: ['all_fields']
239:     }
240:   }
241:   return mapToExtractedDocument(doc.id, doc.type, parsed)
242: }
243: export async function extractInformation(
244:   documents: UploadedDocument[],
245:   _claimCategory?: string
246: ): Promise<ExtractionResult> {
247:   const trace: TraceEntry[] = []
248:   // Run all document extractions in parallel — critical for Vercel timeout
249:   const results = await Promise.allSettled(
250:     documents.map(doc => extractSingleDocument(doc))
251:   )
252:   const extracted: ExtractedDocument[] = []
253:   let confidenceSum = 0
254:   for (let i = 0; i < results.length; i++) {
255:     const result = results[i]
256:     const doc = documents[i]
257:     if (result.status === 'fulfilled') {
258:       extracted.push(result.value)
259:       confidenceSum += result.value.extractionConfidence
260:       const docLabel = doc.type.replace(/_/g, ' ').toLowerCase()
261:       const partialFields = result.value.unreadableFields.length > 0
262:         ? `Few fields were hard to make out: ${result.value.unreadableFields.join(', ')}.`
263:         : ''
264:       trace.push({
265:         stage: 'InformationExtraction',
266:         check: `Extract_${doc.type}`,
267:         result: result.value.extractionConfidence >= 0.6 ? 'PASSED' : 'WARNING',
268:         detail: InformationExtractorTraces.dataExtracted(
269:           doc.type, 
270:           result.value.extractionConfidence,
271:           (result.value.lineItems?.length || 0) + (result.value.totalAmount ? 1 : 0),
272:           (result.value.lineItems?.length || 0) + 5 // Heuristic for expected fields
273:         )
274:       })
275:       // Log key extracted fields for trace visibility
276:       if (result.value.providerName) {
277:         trace.push({
278:           stage: 'InformationExtraction',
279:           check: 'ProviderExtracted',
280:           result: 'INFO',
281:           detail: InformationExtractorTraces.providerIdentified(result.value.providerName)
282:         })
283:       }
284:       if (result.value.diagnosis) {
285:         trace.push({
286:           stage: 'InformationExtraction',
287:           check: 'DiagnosisExtracted',
288:           result: 'INFO',
289:           detail: InformationExtractorTraces.diagnosisIdentified(result.value.diagnosis)
290:         })
291:       }
292:     } else {
293:       // Individual document failed — push fallback, pipeline continues
294:       const fallback: ExtractedDocument = {
295:         documentId: doc.id,
296:         documentType: doc.type,
297:         extractionConfidence: 0.1,
298:         unreadableFields: ['all_fields']
299:       }
300:       extracted.push(fallback)
301:       confidenceSum += 0.1
302:       trace.push({
303:         stage: 'InformationExtraction',
304:         check: `Extract_${doc.type}`,
305:         result: 'FAILED',
306:         detail: InformationExtractorTraces.extractionFailed(doc.type.replace(/_/g, ' ').toLowerCase())
307:       })
308:     }
309:   }
310:   const overallExtractionConfidence = extracted.length > 0
311:     ? confidenceSum / extracted.length
312:     : 0
313:   return {
314:     documents: extracted,
315:     overallExtractionConfidence,
316:     trace,
317:     failed: false
318:   }
319: }
````

## File: lib/agents/3-PolicyEngine.ts
````typescript
  1: import {
  2:   ClaimSubmission,
  3:   ExtractionResult,
  4:   PolicyCheckResult,
  5:   TraceEntry,
  6:   ClaimDecision,
  7: } from '../types/claim.types';
  8: import { PolicyTerms, PolicyMember } from '../policy/policyLoader';
  9: import { PolicyEngineTraces } from '../traces/traceMessages';
 10: export class PolicyEngine {
 11:   public evaluate(
 12:     claim: ClaimSubmission,
 13:     extraction: ExtractionResult,
 14:     policy: PolicyTerms,
 15:     currentDate?: string
 16:   ): PolicyCheckResult {
 17:     const trace: TraceEntry[] = [];
 18:     const rejectionReasons: string[] = [];
 19:     const partialApprovalDetails = { approved: [] as string[], rejected: [] as {item: string, reason: string}[] };
 20:     let approvedAmount = 0;
 21:     let decision: ClaimDecision = 'APPROVED';
 22:     const checks: { name: string; passed: boolean; reason: string }[] = [];
 23:     const addCheck = (name: string, passed: boolean, reason: string, isCritical = true) => {
 24:       checks.push({ name, passed, reason });
 25:       trace.push({
 26:         stage: 'POLICY_ENGINE',
 27:         check: name,
 28:         result: passed ? 'PASSED' : 'FAILED',
 29:         detail: reason
 30:       });
 31:       if (!passed && isCritical) {
 32:         // Only add if not already present
 33:         if (!rejectionReasons.includes(reason)) {
 34:             rejectionReasons.push(reason);
 35:         }
 36:         decision = 'REJECTED';
 37:       }
 38:     };
 39:     const parseDate = (d: string) => new Date(d);
 40:     const diffDays = (d1: Date, d2: Date) => Math.floor((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
 41:     const treatmentDate = parseDate(claim.treatmentDate);
 42:     const submissionDateStr = claim.submissionDate || currentDate || new Date().toISOString(); 
 43:     const submissionDate = parseDate(submissionDateStr);
 44:     const allDiagnoses = extraction.documents.map(d => d.diagnosis).filter(Boolean) as string[];
 45:     const allItems = extraction.documents.flatMap(d => (d.lineItems || []).map(li => ({ ...li, providerName: d.providerName })));
 46:     // 1. Member exists in policy roster
 47:     let member = policy.members.find(m => m.member_id === claim.memberId);
 48:     let primaryMember: PolicyMember | undefined;
 49:     if (!member) {
 50:       addCheck('MEMBER_NOT_FOUND', false, PolicyEngineTraces.memberNotFound(claim.memberId));
 51:       return { checks, approvedAmount, decision, rejectionReasons, trace };
 52:     } else {
 53:       addCheck('Member Exists', true, PolicyEngineTraces.memberFound(claim.memberId, member.name));
 54:       if (member.relationship !== 'SELF') {
 55:         primaryMember = policy.members.find(m => m.member_id === member?.primary_member_id);
 56:       } else {
 57:         primaryMember = member;
 58:       }
 59:     }
 60:     const joinDate = parseDate(primaryMember?.join_date || member.join_date || policy.policy_holder.policy_start_date);
 61:     // 2. Policy is active on treatment date
 62:     const pStart = parseDate(policy.policy_holder.policy_start_date);
 63:     const pEnd = parseDate(policy.policy_holder.policy_end_date);
 64:     if (treatmentDate >= pStart && treatmentDate <= pEnd) {
 65:       addCheck('Policy Active', true, PolicyEngineTraces.policyActive(claim.treatmentDate));
 66:     } else {
 67:       addCheck('POLICY_INACTIVE', false, PolicyEngineTraces.policyInactive(claim.treatmentDate, policy.policy_holder.policy_end_date));
 68:     }
 69:     // 3. Submission within 30-day deadline
 70:     const daysSinceTreatment = diffDays(submissionDate, treatmentDate);
 71:     if (daysSinceTreatment <= policy.submission_rules.deadline_days_from_treatment) {
 72:       addCheck('Submission Deadline', true, PolicyEngineTraces.submissionOnTime(daysSinceTreatment, policy.submission_rules.deadline_days_from_treatment));
 73:     } else {
 74:       addCheck('SUBMISSION_LATE', false, PolicyEngineTraces.submissionLate(daysSinceTreatment, policy.submission_rules.deadline_days_from_treatment));
 75:     }
 76:     // 4. Minimum claim amount (₹500)
 77:     if (claim.claimedAmount >= policy.submission_rules.minimum_claim_amount) {
 78:       addCheck('Minimum Amount', true, PolicyEngineTraces.amountAboveMinimum(claim.claimedAmount, policy.submission_rules.minimum_claim_amount));
 79:     } else {
 80:       addCheck('MINIMUM_AMOUNT_NOT_MET', false, PolicyEngineTraces.amountBelowMinimum(claim.claimedAmount, policy.submission_rules.minimum_claim_amount));
 81:     }
 82:     // 5. Initial 30-day waiting period from join date
 83:     const daysSinceJoin = diffDays(treatmentDate, joinDate);
 84:     if (daysSinceJoin >= policy.waiting_periods.initial_waiting_period_days) {
 85:       addCheck('Initial Waiting Period', true, PolicyEngineTraces.waitingPeriodCompleted(policy.waiting_periods.initial_waiting_period_days));
 86:     } else {
 87:       const remaining = policy.waiting_periods.initial_waiting_period_days - daysSinceJoin;
 88:       const eligibleDate = new Date(joinDate.getTime() + policy.waiting_periods.initial_waiting_period_days * 24 * 3600 * 1000).toISOString().split('T')[0];
 89:       addCheck('WAITING_PERIOD', false, PolicyEngineTraces.waitingPeriodActive(policy.waiting_periods.initial_waiting_period_days, remaining, eligibleDate));
 90:     }
 91:     // 6. Condition-specific waiting period
 92:     let specificWaitingFailed = false;
 93:     for (const diagnosis of allDiagnoses) {
 94:       const lowerDiag = diagnosis.toLowerCase();
 95:       for (const [condition, waitDays] of Object.entries(policy.waiting_periods.specific_conditions)) {
 96:         if (lowerDiag.includes(condition.replace('_', ' '))) {
 97:           if (daysSinceJoin < waitDays) {
 98:             specificWaitingFailed = true;
 99:             const remaining = waitDays - daysSinceJoin;
100:             addCheck('WAITING_PERIOD', false, PolicyEngineTraces.conditionWaitingPeriodActive(condition.replace(/_/g, ' '), waitDays, remaining));
101:           }
102:         }
103:       }
104:     }
105:     if (!specificWaitingFailed) {
106:       addCheck('Condition Waiting Period', true, PolicyEngineTraces.conditionWaitingPeriodCompleted('diagnoses'));
107:     }
108:     // 7. Category coverage check (The "bucket" e.g. Pharmacy, Dental, Vision)
109:     const categoryKey = claim.claimCategory.toLowerCase();
110:     const catRules = policy.opd_categories[categoryKey];
111:     const catDisplayName = claim.claimCategory.toLowerCase().replace(/_/g, ' ')
112:     if (catRules && catRules.covered) {
113:       addCheck('Category Covered', true, PolicyEngineTraces.categoryCovered(catDisplayName));
114:     } else {
115:       addCheck('CATEGORY_NOT_COVERED', false, PolicyEngineTraces.categoryNotCovered(catDisplayName));
116:     }
117:     // 8. Diagnosis/treatment exclusions (The specific "condition" e.g. Maternity, Cosmetic)
118:     // Even if a category (like Consultation) is covered, a specific condition might be excluded.
119:     let hasExclusions = false;
120:     for (const diagnosis of allDiagnoses) {
121:       for (const excl of policy.exclusions.conditions) {
122:         if (this.isExclusionMatch(diagnosis, excl)) {
123:           hasExclusions = true;
124:           addCheck('EXCLUDED_CONDITION', false, PolicyEngineTraces.conditionExcluded(diagnosis));
125:         }
126:       }
127:     }
128:     // 9. User Input vs Extracted Document fuzzy Consistency Checks for Health Provider & Treatment Date
129:     if (claim.hospitalName && extraction.documents.length > 0) {
130:       const userHospital = claim.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, '');
131:       const hasHospitalMatch = extraction.documents.some((d: any) => {
132:         if (!d.providerName) return false;
133:         const extracted = d.providerName.toLowerCase().replace(/[^a-z0-9]/g, '');
134:         return extracted.includes(userHospital) || userHospital.includes(extracted);
135:       });
136:       if (!hasHospitalMatch) {
137:         addCheck('Provider Consistency', false, PolicyEngineTraces.hospitalMismatch(), false);
138:         trace[trace.length - 1].result = 'WARNING';
139:       }
140:     }
141:     if (claim.treatmentDate && extraction.documents.length > 0) {
142:       const uDate = parseDate(claim.treatmentDate);
143:       const hasDateMatch = extraction.documents.some((d: any) => {
144:         if (!d.date) return false;
145:         const eDate = parseDate(d.date);
146:         const diff = Math.abs(diffDays(uDate, eDate));
147:         return diff <= 7; // Allow 1 week tolerance
148:       });
149:       if (!hasDateMatch) {
150:         addCheck('Date Consistency', false, PolicyEngineTraces.dateMismatch(), false);
151:         trace[trace.length - 1].result = 'WARNING';
152:       }
153:     }
154:     // 10. Partial line item Exclusions (Audit line-by-line)
155:     const categorySpecificExclusions = (policy.exclusions as any)[`${categoryKey}_exclusions`] || [];
156:     const ruleExclusions = catRules?.excluded_procedures || catRules?.excluded_items || [];
157:     const allCategoryExclusions = [...categorySpecificExclusions, ...ruleExclusions];
158:     for (const item of allItems) {
159:       for (const excl of allCategoryExclusions) {
160:         if (this.isExclusionMatch(item.description, excl)) {
161:           partialApprovalDetails.rejected.push({ item: item.description, reason: `Exclusion: ${excl}` });
162:         }
163:       }
164:     }
165:     if (partialApprovalDetails.rejected.length > 0) {
166:       addCheck('Exclusions (Partial)', true, PolicyEngineTraces.partialCoverageExcluded(partialApprovalDetails.rejected.map(r => r.item)), false);
167:       if (decision === 'APPROVED') decision = 'PARTIAL';
168:     } else if (!hasExclusions) {
169:       addCheck('Diagnosis Exclusions', true, PolicyEngineTraces.conditionNotExcluded());
170:     }
171:     // 11. Overall Pre-authorization required and obtained
172:     let preAuthMissing = false;
173:     if (catRules?.requires_pre_auth) {
174:       if (!claim.preAuthObtained) {
175:         preAuthMissing = true;
176:         addCheck('PRE_AUTH_MISSING', false, PolicyEngineTraces.preAuthRequired(catDisplayName));
177:       }
178:     }
179:     // 12. Check line-item-level Pre-authorization required
180:     if (catRules?.high_value_tests_requiring_pre_auth && catRules.high_value_tests_requiring_pre_auth.length > 0) {
181:       const threshold = catRules.pre_auth_threshold || Infinity;
182:       for (const item of allItems) {
183:         if (item.amount > threshold && this.lowerDiagMatch(item.description, catRules.high_value_tests_requiring_pre_auth)) {
184:           if (!claim.preAuthObtained) {
185:             preAuthMissing = true;
186:             addCheck('PRE_AUTH_MISSING', false, PolicyEngineTraces.preAuthItemRequired(item.description, threshold));
187:           }
188:         }
189:       }
190:     }
191:     if (!preAuthMissing) {
192:       addCheck('Pre-authorization', true, PolicyEngineTraces.preAuthNotRequired());
193:     }
194:     // 13. Annual OPD limit check
195:     const ytd = claim.ytdClaimsAmount || 0;
196:     const remainingAnnual = policy.coverage.annual_opd_limit - ytd;
197:     if (remainingAnnual > 0) {
198:       addCheck('Annual OPD Limit', true, PolicyEngineTraces.annualLimitAvailable(remainingAnnual, policy.coverage.annual_opd_limit));
199:     } else {
200:       const resetDate = policy.policy_holder.policy_end_date; // Assuming reset on renewal
201:       addCheck('ANNUAL_LIMIT_EXCEEDED', false, PolicyEngineTraces.annualLimitExhausted(ytd, policy.coverage.annual_opd_limit, resetDate));
202:     }
203:     // 14. Category sub-limit check
204:     const catLimit = catRules?.sub_limit || Infinity;
205:     if (claim.claimedAmount <= catLimit) {
206:       addCheck('Category Sub-limit', true, PolicyEngineTraces.withinCategoryLimit(claim.claimedAmount, catLimit, catDisplayName));
207:     } else {
208:       addCheck('Category Sub-limit', false, PolicyEngineTraces.exceedsCategoryLimit(claim.claimedAmount, catLimit, catDisplayName), false);
209:       // We emit a WARNING trace instead of FAILED for non-critical
210:       trace[trace.length - 1].result = 'WARNING';
211:     }
212:     // 15. Per-claim limit check
213:     if (claim.claimedAmount <= policy.coverage.per_claim_limit) {
214:       addCheck('Per-claim Limit', true, PolicyEngineTraces.withinPerClaimLimit(claim.claimedAmount, policy.coverage.per_claim_limit));
215:     } else {
216:       addCheck('PER_CLAIM_EXCEEDED', false, PolicyEngineTraces.exceedsPerClaimLimit(claim.claimedAmount, policy.coverage.per_claim_limit));
217:     }
218:     // 16. Claim Financial Calculation
219:     if (rejectionReasons.length > 0) {
220:       return { checks, approvedAmount: 0, decision: 'REJECTED', rejectionReasons, trace, partialApprovalDetails };
221:     }
222:     let calculatedAmount = claim.claimedAmount;
223:     // --- Step A: Deduct Partial Exclusions ---
224:     if (decision === 'PARTIAL') {
225:       const rejectedAmount = partialApprovalDetails.rejected.reduce((sum, ri) => {
226:         const item = allItems.find(i => i.description === ri.item);
227:         return sum + (item?.amount || 0);
228:       }, 0);
229:       calculatedAmount -= rejectedAmount;
230:       partialApprovalDetails.approved = allItems.filter(i => !partialApprovalDetails.rejected.find(r => r.item === i.description)).map(i => i.description);
231:     }
232:     // --- Step B: Network Hospital Discount ---
233:     let networkDiscount = 0;
234:     if (catRules?.network_discount_percent) {
235:       if (allItems.length > 0) {
236:         let networkEligibleAmount = 0;
237:         const approvedItems = decision === 'PARTIAL' ? partialApprovalDetails.approved : allItems.map(i => i.description);
238:         for (const itemDesc of approvedItems) {
239:           const originalItem = allItems.find(i => i.description === itemDesc);
240:           const provider = originalItem?.providerName;
241:           if (!provider) {
242:             // Cannot safely determine network status. Abort and flag for manual review.
243:             decision = 'MANUAL_REVIEW';
244:             rejectionReasons.push("We couldn't confirm the hospital network for one of your items. A specialist will review this for you.");
245:             trace.push({
246:               stage: 'FINANCIAL',
247:               check: 'Network Discount',
248:               result: 'FAILED',
249:               detail: PolicyEngineTraces.networkStatusUnknown(itemDesc)
250:             });
251:             return { checks, approvedAmount: 0, decision, rejectionReasons, trace, partialApprovalDetails };
252:           }
253:           const isNetwork = policy.network_hospitals.some(h => h.toLowerCase() === provider.toLowerCase());
254:           if (isNetwork) {
255:              networkEligibleAmount += originalItem?.amount || 0;
256:           }
257:         }
258:         networkEligibleAmount = Math.min(networkEligibleAmount, calculatedAmount);
259:         if (networkEligibleAmount > 0) {
260:           networkDiscount = (networkEligibleAmount * catRules.network_discount_percent) / 100;
261:         }
262:       } else {
263:         // Fallback to overarching claim hospital name for simple claims
264:         const isNetwork = policy.network_hospitals.some(h => h.toLowerCase() === claim.hospitalName?.toLowerCase());
265:         if (isNetwork) {
266:            networkDiscount = (calculatedAmount * catRules.network_discount_percent) / 100;
267:         }
268:       }
269:       if (networkDiscount > 0) {
270:         calculatedAmount -= networkDiscount;
271:         trace.push({ stage: 'FINANCIAL', check: 'Network Discount', result: 'INFO', detail: PolicyEngineTraces.networkDiscountApplied(claim.hospitalName || 'your hospital', catRules.network_discount_percent) });
272:       }
273:     }
274:     // --- Step C: Co-pay Application ---
275:     let copay = 0;
276:     if (catRules?.copay_percent) {
277:       copay = (calculatedAmount * catRules.copay_percent) / 100;
278:       calculatedAmount -= copay;
279:       trace.push({ stage: 'FINANCIAL', check: 'Copay', result: 'INFO', detail: PolicyEngineTraces.copayApplied(catRules.copay_percent, copay) });
280:     }
281:     // --- Step D: Final Caps (Annual & Per-Claim) ---
282:     approvedAmount = Math.min(calculatedAmount, policy.coverage.per_claim_limit, remainingAnnual);
283:     trace.push({ stage: 'FINANCIAL', check: 'Final Approval', result: 'INFO', detail: PolicyEngineTraces.approvalAmount(approvedAmount) });
284:     return { checks, approvedAmount, decision, rejectionReasons, trace, partialApprovalDetails };
285:   }
286:   private lowerDiagMatch(description: string, tests: string[]) {
287:     const lowerDesc = description.toLowerCase();
288:     return tests.some(t => lowerDesc.includes(t.toLowerCase()));
289:   }
290:   // ── Exclusion Matching ─────────────────────────────────────────────
291:   //
292:   // Exclusion phrases are read directly from policy_terms.json and
293:   // tokenized at match time. No developer synonyms, no hardcoded keyword
294:   // maps — everything derives from the policy file.
295:   //
296:   // Known limitation: semantic paraphrasing (e.g. "nose job" for "cosmetic
297:   // rhinoplasty") will not match. A production system would use
298:   // embedding-based similarity for this.
299:   // Words too generic to carry exclusion-specific meaning on their own
300:   private static readonly EXCLUSION_STOP_WORDS = new Set([
301:     'and', 'or', 'of', 'the', 'in', 'for', 'a', 'an', 'to', 'non',
302:     'surgery', 'treatment', 'program', 'programs', 'procedure',
303:     'procedures', 'therapy', 'services', 'related', 'necessary',
304:     'health', 'medical', 'clinical',
305:   ]);
306:   /**
307:    * Check if text matches an exclusion phrase from the policy.
308:    *
309:    * Tokenizes the exclusion phrase into significant words (dropping generic
310:    * stop words), then checks if ANY significant word appears in the text.
311:    * Short words (≤5 chars) use word-boundary regex to prevent substring
312:    * false positives (e.g. "war" inside "warfarin").
313:    *
314:    * Used for both diagnosis-level and line-item exclusion checks.
315:    */
316:   private isExclusionMatch(text: string, exclusion: string): boolean {
317:     const lowerText = text.toLowerCase();
318:     // Tokenize the exclusion phrase from the policy JSON
319:     const significantWords = exclusion
320:       .toLowerCase()
321:       .replace(/[()]/g, '')
322:       .split(/[\s\-]+/)
323:       .filter(w => w.length > 3 && !PolicyEngine.EXCLUSION_STOP_WORDS.has(w));
324:     if (significantWords.length === 0) return false;
325:     // Any single significant concept word is enough for a match
326:     return significantWords.some(word => {
327:       if (word.length <= 5) {
328:         // Word-boundary check for short words to prevent substring false positives
329:         const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
330:         return new RegExp(`\\b${escaped}\\b`, 'i').test(lowerText);
331:       }
332:       return lowerText.includes(word);
333:     });
334:   }
335: }
````
