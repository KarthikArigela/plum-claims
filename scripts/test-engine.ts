import fs from 'fs';
import path from 'path';
import { PolicyEngine } from '../lib/agents/3-PolicyEngine';
import { loadPolicy } from '../lib/policy/policyLoader';
import { ClaimSubmission, ExtractionResult, DocumentType } from '../lib/types/claim.types';

const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json');
const testCasesData = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'));
const casesToTest = ['TC004', 'TC005', 'TC010'];

const engine = new PolicyEngine();
const policy = loadPolicy();

for (const tc of testCasesData.test_cases) {
  if (!casesToTest.includes(tc.case_id)) continue;

  console.log(`\n======================================`);
  console.log(`Running ${tc.case_id}: ${tc.case_name}`);
  
  const input = tc.input;
  
  // Construct ClaimSubmission
  const claim: ClaimSubmission = {
    memberId: input.member_id,
    policyId: input.policy_id,
    claimCategory: input.claim_category,
    treatmentDate: input.treatment_date,
    claimedAmount: input.claimed_amount,
    ytdClaimsAmount: input.ytd_claims_amount || 0,
    hospitalName: input.hospital_name || input.documents?.find((d: any) => d.actual_type === 'HOSPITAL_BILL')?.content?.hospital_name,
    documents: [],
    claimsHistory: input.claims_history?.map((ch: any) => ({
      claimId: ch.claim_id,
      date: ch.date,
      amount: ch.amount,
      provider: ch.provider
    })) || [],
    // Assume submission happens on Nov 5th since these treatments are mostly Nov 1st/Oct 30th
    submissionDate: '2024-11-05',
    preAuthObtained: false
  };

  // Construct ExtractionResult
  const extraction: ExtractionResult = {
    documents: (input.documents || []).map((doc: any) => {
      const content = doc.content || {};
      return {
        documentId: doc.file_id,
        documentType: doc.actual_type as DocumentType,
        providerName: content.hospital_name || content.lab_name || content.pharmacy_name,
        diagnosis: content.diagnosis,
        patientName: content.patient_name,
        doctorName: content.doctor_name,
        lineItems: content.line_items,
        totalAmount: content.total,
        extractionConfidence: 0.95,
        unreadableFields: []
      };
    }),
    overallExtractionConfidence: 0.95,
    trace: [],
    failed: false
  };

  const result = engine.evaluate(claim, extraction, policy, '2024-11-05');
  
  console.log(`Decision: ${result.decision}`);
  if (result.decision === 'APPROVED' || result.decision === 'PARTIAL') {
    console.log(`Approved Amount: ₹${result.approvedAmount}`);
  }
  if (result.rejectionReasons.length > 0) {
    console.log(`Rejection Reasons: ${result.rejectionReasons.join(', ')}`);
  }
  
  console.log(`\nExpected Output:`);
  console.log(JSON.stringify(tc.expected, null, 2));
}
