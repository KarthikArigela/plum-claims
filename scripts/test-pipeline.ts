import fs from 'fs';
import path from 'path';
import { processClaimPipeline } from '../lib/pipeline';
import { ClaimSubmission } from '../lib/types/claim.types';

async function main() {
  const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json');
  const testCasesData = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'));
  
  // Find TC009
  const tc009 = testCasesData.test_cases.find((tc: any) => tc.case_id === 'TC009');
  if (!tc009) {
    throw new Error('TC009 not found');
  }

  const input = tc009.input;
  
  const mockClaim: ClaimSubmission = {
    memberId: input.member_id,
    policyId: input.policy_id,
    claimCategory: input.claim_category,
    treatmentDate: input.treatment_date,
    claimedAmount: input.claimed_amount,
    hospitalName: input.hospital_name || 'Mock Hospital',
    submissionDate: '2024-11-05',
    ytdClaimsAmount: input.ytd_claims_amount || 0,
    claimsHistory: input.claims_history?.map((ch: any) => ({
      claimId: ch.claim_id,
      date: ch.date,
      amount: ch.amount,
      provider: ch.provider
    })) || [],
    documents: [
      {
        id: 'doc_001',
        type: 'PRESCRIPTION',
        content: '',
        base64Data: '',
        mimeType: 'image/jpeg'
      }
    ]
  };

  console.log(`Running Pipeline on ${tc009.case_id}: ${tc009.case_name}`);
  const result = await processClaimPipeline(mockClaim, 'CLAIM_TC009');
  
  console.log('\n=== Pipeline Result ===');
  console.log(`Decision: ${result.decision}`);
  if (result.rejectionReasons.length > 0) {
    console.log(`Reasons/Flags: ${result.rejectionReasons.join(', ')}`);
  }
  
  // Print the fraud traces to verify
  const fraudTraces = result.trace.filter(t => t.stage === 'FraudDetection');
  console.log('\n=== Fraud Traces ===');
  console.log(JSON.stringify(fraudTraces, null, 2));
}

main().catch(console.error);
