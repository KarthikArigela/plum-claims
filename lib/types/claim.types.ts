export type ClaimCategory = string; // e.g., 'CONSULTATION', 'DIAGNOSTIC', 'IPD', 'MATERNITY' (Driven by policy config)
export type ClaimDecision = 'APPROVED' | 'PARTIAL' | 'REJECTED' | 'MANUAL_REVIEW';
export type DocumentType = string; // e.g., 'PRESCRIPTION', 'HOSPITAL_BILL', 'CLAIM_FORM'

export interface TraceEntry {
  stage: string;
  check: string;
  result: 'PASSED' | 'FAILED' | 'WARNING' | 'INFO' | 'SKIPPED';
  detail: string;
}

export interface UploadedDocument {
  id: string;
  type: DocumentType;
  content: string;               /** @deprecated Use base64Data + mimeType for all real document processing */ 
  base64Data: string;            // Base64-encoded file bytes — primary data for LLM calls
  mimeType: string;              // 'image/jpeg' | 'image/png' | 'application/pdf'
  fileName?: string;             // Original filename for logging/tracing
}

export interface ClaimHistoryEntry {
  claimId: string;
  date: string;
  amount: number;
  provider: string;
}

export interface ClaimSubmission {
  memberId: string;
  policyId: string;
  claimCategory: ClaimCategory;
  treatmentDate: string;
  submissionDate?: string;
  claimedAmount: number;
  hospitalName?: string;
  documents: UploadedDocument[];
  claimsHistory?: ClaimHistoryEntry[];
  ytdClaimsAmount?: number;
  simulateComponentFailure?: boolean;
  preAuthObtained?: boolean;
}

// Agent output contracts
export interface VerificationResult {
  passed: boolean;
  errors: { documentId: string; documentType: string; expectedType: string; message: string }[];
  trace: TraceEntry[];
}

export interface ExtractedDocument {
  documentId: string;
  documentType: DocumentType;
  providerName?: string;
  patientName?: string;
  doctorName?: string;
  doctorRegistration?: string;
  date?: string;
  diagnosis?: string;
  lineItems?: { description: string; amount: number }[];
  totalAmount?: number;
  extractionConfidence: number;
  unreadableFields: string[];
}

export interface ExtractionResult {
  documents: ExtractedDocument[];
  overallExtractionConfidence: number;
  trace: TraceEntry[];
  failed: boolean;
}

export interface PolicyCheckResult {
  checks: { name: string; passed: boolean; reason: string }[];
  approvedAmount: number;
  decision: ClaimDecision;
  rejectionReasons: string[];
  partialApprovalDetails?: { approved: string[]; rejected: { item: string; reason: string }[] };
  trace: TraceEntry[];
}

export interface FraudResult {
  signals: string[];
  fraudRisk: number;
  requiresManualReview: boolean;
  trace: TraceEntry[];
  failed: boolean;
}

export interface ClaimDecisionOutput {
  claimId: string;
  decision: ClaimDecision;
  approvedAmount: number;
  rejectionReasons: string[];
  systemConfidence: number;
  trace: TraceEntry[];
  degradedComponents: string[];
  calculationBreakdown?: string;
}
