// Quick test: send a real image file to the API route and check the response
import { loadEnvConfig } from '@next/env'

// Load environment variables from .env.local
loadEnvConfig(process.cwd())

const fs = require('fs');
const path = require('path');

const imagePath = 'C:\\Users\\91939\\Desktop\\92d0eacfb40b69526d3d298b0f85b261.jpg';

async function test() {
  // Read the file and build a FormData manually via fetch
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('claimData', JSON.stringify({
    memberId: 'EMP001',
    policyId: 'PLUM_GHI_2024',
    claimCategory: 'CONSULTATION',
    treatmentDate: '2024-10-15',
    claimedAmount: 1500,
  }));
  formData.append('documents', blob, 'apollo_bill.jpg');
  formData.append('documentTypes', 'HOSPITAL_BILL');

  console.log('Sending request to http://localhost:3000/api/claims ...');

  const res = await fetch('http://localhost:3000/api/claims', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  console.log('\nStatus:', res.status);
  console.log('\nResponse:');
  console.log(JSON.stringify(json, null, 2));

  // Check key assertions
  if (json.claimId) {
    console.log('\n✅ Route is working — received claimId:', json.claimId);
    console.log('✅ Decision:', json.decision);
    console.log('✅ Trace entries:', json.trace?.length || 0);
  } else if (json.error) {
    console.log('\n❌ Error:', json.error);
  }
}

test().catch(console.error);
