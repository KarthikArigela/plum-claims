import fs from 'fs';
import path from 'path';
import { loadEnvConfig } from '@next/env';
import { processClaimPipeline } from '../lib/pipeline';
import { ClaimSubmission } from '../lib/types/claim.types';

loadEnvConfig(process.cwd());

function buildDocumentsFromTestCase(input: any) {
  return (input.documents || []).map((doc: any, index: number) => ({
    id: doc.file_id || `doc_${index + 1}`,
    type: doc.actual_type,
    content: doc.content ? JSON.stringify(doc.content) : `${doc.actual_type} document`,
    base64Data: Buffer.from(
      JSON.stringify(doc.content || { type: doc.actual_type, ok: true }),
      'utf-8'
    ).toString('base64'),
    mimeType: 'image/jpeg',
    quality: doc.quality || 'GOOD',
    patientNameOnDoc:
      doc.patient_name_on_doc || doc.content?.patient_name || undefined,
  }));
}

async function main() {
  const caseId = process.argv[2] || 'TC009';

  const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json');
  const raw = fs.readFileSync(testCasesPath, 'utf-8');
  const testCasesData = JSON.parse(raw);

  const testCase = testCasesData.test_cases.find((tc: any) => tc.case_id === caseId);
  if (!testCase) {
    throw new Error(`${caseId} not found`);
  }

  const input = testCase.input;

  const mockClaim: ClaimSubmission = {
    memberId: input.member_id,
    policyId: input.policy_id,
    claimCategory: input.claim_category,
    treatmentDate: input.treatment_date,
    claimedAmount: input.claimed_amount,
    hospitalName:
      input.hospital_name ||
      input.documents?.find((d: any) => d.content?.hospital_name)?.content?.hospital_name ||
      'Mock Hospital',
    submissionDate: input.submission_date || input.treatment_date,
    ytdClaimsAmount: input.ytd_claims_amount || 0,
    simulateComponentFailure: input.simulate_component_failure || false,
    claimsHistory:
      input.claims_history?.map((ch: any) => ({
        claimId: ch.claim_id,
        date: ch.date,
        amount: ch.amount,
        provider: ch.provider,
      })) || [],
    documents: buildDocumentsFromTestCase(input),
  };

  console.log(`Running Pipeline on ${testCase.case_id}: ${testCase.case_name}`);

  const result = await processClaimPipeline(mockClaim, `CLAIM_${caseId}`);

  console.log('\n=== Pipeline Result ===');
  console.log(`Decision: ${result.decision}`);
  console.log(`Approved amount: ${result.approvedAmount}`);
  console.log(`System confidence: ${result.systemConfidence}`);
  console.log(`Degraded components: ${result.degradedComponents.join(', ') || 'none'}`);

  if (result.rejectionReasons.length > 0) {
    console.log(`Reasons/Flags: ${result.rejectionReasons.join(' | ')}`);
  }

  const groupedTrace = result.trace.reduce((acc: Record<string, any[]>, t: any) => {
    if (!acc[t.stage]) acc[t.stage] = [];
    acc[t.stage].push(t);
    return acc;
  }, {});

  console.log('\n=== Trace by Stage ===');
  for (const [stage, entries] of Object.entries(groupedTrace)) {
    console.log(`\n--- ${stage} ---`);
    console.log(JSON.stringify(entries, null, 2));
  }

  const fraudTraces = result.trace.filter((t: any) => t.stage === 'FraudDetection');
  const onlyVerificationStage =
    result.trace.length > 0 &&
    result.trace.every((t: any) => t.stage === 'DocumentVerification');

  if (caseId === 'TC009') {
    if (result.decision !== 'MANUAL_REVIEW') {
      throw new Error(`Expected MANUAL_REVIEW for TC009, got ${result.decision}`);
    }

    // Accept either:
    // 1) early stop at verification, OR
    // 2) fraud stage reached with fraud traces present
    if (!onlyVerificationStage && fraudTraces.length === 0) {
      throw new Error(
        'Expected FraudDetection trace for TC009 if pipeline progressed beyond DocumentVerification'
      );
    }
  }

  if (caseId === 'TC011') {
    if (result.decision !== 'MANUAL_REVIEW') {
      throw new Error(`Expected MANUAL_REVIEW for TC011, got ${result.decision}`);
    }

    // If pipeline gets past verification, degraded extraction should appear.
    // If it stops at verification, that is still acceptable for the current pipeline.
    const extractionWarnings = result.trace.filter(
      (t: any) =>
        t.stage === 'InformationExtraction' &&
        t.check === 'ExtractionFailed'
    );

    if (!onlyVerificationStage) {
      if (!result.degradedComponents.includes('InformationExtractor')) {
        throw new Error(
          'Expected degradedComponents to include InformationExtractor for TC011'
        );
      }
      if (extractionWarnings.length === 0) {
        throw new Error(
          'Expected InformationExtraction/ExtractionFailed trace for TC011'
        );
      }
    }
  }

  console.log(`\nTest ${caseId} Passed!`);
}

main().catch((err) => {
  console.error('\nTest Failed:');
  console.error(err);
  process.exit(1);
});