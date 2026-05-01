import { ClaimSubmission, ClaimDecisionOutput, TraceEntry } from './types/claim.types';
import { verifyDocuments } from './agents/1-DocumentVerifier';
import { extractInformation } from './agents/2-InformationExtractor';
import { PolicyEngine } from './agents/3-PolicyEngine';
import { detectFraud } from './agents/4-FraudDetector';
import { synthesizeDecision } from './agents/5-DecisionSynthesizer';
import { loadPolicy } from './policy/policyLoader';

const engine = new PolicyEngine();
const policy = loadPolicy();

export async function processClaimPipeline(
  claim: ClaimSubmission,
  claimId: string
): Promise<ClaimDecisionOutput> {
  
  const degradedComponents: string[] = [];
  const allTrace: TraceEntry[] = [];
  let systemConfidence = 1.0;

  // ── Stage 1: Document Verification ──────────────────────────────────
  let verification;
  try {
    verification = await verifyDocuments(claim);
    allTrace.push(...verification.trace);
  } catch (err) {
    // If verifier itself crashes, we cannot proceed safely
    return buildSystemError(claimId, 'DocumentVerifier', err);
  }

  // Hard stop — wrong or unreadable documents returned to member
  if (!verification.passed) {
    return {
      claimId: claimId,
      decision: 'MANUAL_REVIEW' as any, // Or REJECTED
      approvedAmount: 0,
      rejectionReasons: verification.errors.map(e => e.message),
      systemConfidence: 1.0, // High confidence in the error itself
      trace: allTrace,
      degradedComponents: []
    };
  }

  // ── Stage 2: Information Extraction ────────────────────────────────
  let extraction;
  try {
    extraction = await extractInformation(claim.documents);
    allTrace.push(...extraction.trace);
    // Penalise systemConfidence proportional to extraction confidence
    systemConfidence -= (1 - extraction.overallExtractionConfidence) * 0.30;
  } catch (err) {
    degradedComponents.push('InformationExtractor');
    systemConfidence -= 0.20;
    // Fallback: build minimal extraction from claim metadata
    extraction = buildFallbackExtraction(claim);
    allTrace.push({
      stage: 'InformationExtraction',
      check: 'ExtractionFailed',
      result: 'WARNING',
      detail: `Extraction failed — using claim metadata fallback. Error: ${String(err)}`
    });
  }

  // ── Stage 3: Policy Engine ─────────────────────────────────────────
  // Deterministic — should never throw. No try/catch needed.
  const policyResult = engine.evaluate(claim, extraction, policy);
  allTrace.push(...policyResult.trace);

  // ── Stage 4: Fraud Detection ────────────────────────────────────────
  let fraudResult;
  try {
    fraudResult = await detectFraud(claim);
    allTrace.push(...fraudResult.trace);
    if (fraudResult.requiresManualReview || fraudResult.fraudRisk >= 0.80) systemConfidence -= 0.15;
  } catch (err) {
    degradedComponents.push('FraudDetector');
    systemConfidence -= 0.10;
    fraudResult = {
      signals: [],
      fraudRisk: 0,
      requiresManualReview: false,
      trace: [],
      failed: true
    };
    allTrace.push({
      stage: 'FraudDetection',
      check: 'FraudDetectorFailed',
      result: 'WARNING',
      detail: `Fraud detection unavailable — proceeding without fraud signals. Error: ${String(err)}`
    });
  }

  // ── Stage 5: Decision Synthesis ─────────────────────────────────────
  return synthesizeDecision(
    claimId,
    policyResult,
    fraudResult,
    systemConfidence,
    allTrace,
    degradedComponents
  );
}

function buildFallbackExtraction(claim: ClaimSubmission) {
  return {
    documents: claim.documents.map(doc => ({
      documentId: doc.id,
      documentType: doc.type,
      extractionConfidence: 0.3,
      unreadableFields: ['all_fields']
    })),
    overallExtractionConfidence: 0.3,
    trace: [],
    failed: true
  };
}

function buildSystemError(claimId: string, component: string, err: unknown): ClaimDecisionOutput {
  return {
    claimId,
    decision: 'MANUAL_REVIEW',
    approvedAmount: 0,
    rejectionReasons: [`System error in ${component} — routed to manual review`],
    systemConfidence: 0,
    trace: [{
      stage: component,
      check: 'SystemError',
      result: 'FAILED',
      detail: String(err)
    }],
    degradedComponents: [component]
  };
}
