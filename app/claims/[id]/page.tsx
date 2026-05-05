"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { simplifyRejectionReasons } from "@/lib/utils/rejectionMessageMapper";

type Decision = "APPROVED" | "PARTIAL" | "REJECTED" | "MANUAL_REVIEW";

interface TraceEntry {
  stage: string;
  check: string;
  result: "PASSED" | "FAILED" | "WARNING" | "INFO" | "SKIPPED";
  detail: string;
}

interface ClaimResult {
  claimId: string;
  decision: Decision;
  approvedAmount: number;
  rejectionReasons: string[];
  systemConfidence: number;
  trace: TraceEntry[];
  degradedComponents: string[];
}

// Human-readable names for individual check IDs emitted by agents
const CHECK_LABELS: Record<string, string> = {
  // DocumentVerifier
  FileDataCheck:              "File received",
  DocumentClassification:     "Document identified",
  RequiredDocumentCheck:      "Required paperwork",
  ReadabilityCheck:           "Can we read this?",
  CrossDocumentConsistency:   "Patient name match",
  RequirementsLookup:         "Policy requirements",
  ProviderExtracted:          "Provider identified",
  DiagnosisExtracted:         "Diagnosis noted",
  // Consistency
  "Provider Consistency":     "Hospital name check",
  "Date Consistency":         "Date check",
  // InformationExtractor
  Extract_PRESCRIPTION:       "Prescription details",
  Extract_HOSPITAL_BILL:      "Hospital bill details",
  Extract_LAB_REPORT:         "Lab report details",
  Extract_PHARMACY_BILL:      "Pharmacy bill details",
  Extract_DENTAL_REPORT:      "Dental report details",
  Extract_DISCHARGE_SUMMARY:  "Discharge summary",
  // PolicyEngine
  "Member Exists":            "Member found",
  MEMBER_NOT_FOUND:           "Member check",
  "Policy Active":            "Policy active",
  POLICY_INACTIVE:            "Policy active",
  "Submission Deadline":      "Submitted on time",
  SUBMISSION_LATE:            "Submission deadline",
  "Minimum Amount":           "Claim amount",
  MINIMUM_AMOUNT_NOT_MET:     "Claim amount",
  "Initial Waiting Period":   "Waiting period",
  WAITING_PERIOD:             "Waiting period",
  "Condition Waiting Period": "Condition waiting period",
  "Category Covered":         "Category covered",
  CATEGORY_NOT_COVERED:       "Category covered",
  "Diagnosis Exclusions":     "Exclusions check",
  EXCLUDED_CONDITION:         "Exclusions check",
  "Exclusions (Partial)":     "Partial exclusions",
  "Pre-authorization":        "Pre-authorisation",
  PRE_AUTH_MISSING:           "Pre-authorisation",
  "Annual OPD Limit":         "Annual limit",
  ANNUAL_LIMIT_EXCEEDED:      "Annual limit",
  "Category Sub-limit":       "Category limit",
  "Per-claim Limit":          "Per-claim limit",
  PER_CLAIM_EXCEEDED:         "Per-claim limit",
  // FraudDetector
  HighValueCheck:             "Claim amount check",
  AutoManualReviewCheck:      "Review threshold",
  SameDayClaimsCheck:         "Same-day activity",
  MonthlyClaimsCheck:         "Monthly activity",
  FraudRulesCheck:            "Overall integrity",
  // Financial
  "Network Discount":         "Network discount",
  Copay:                      "Your co-pay",
  "Final Approval":           "Refund calculated",
};

const STAGE_LABELS: Record<string, string> = {
  DocumentVerification:  "Paperwork Check",
  InformationExtraction: "Data Review",
  POLICY_ENGINE:         "Coverage Check",
  FraudDetection:        "Trust & Integrity",
  FINANCIAL:             "Your Refund Calculation",
};

const DECISION_STYLES: Record<Decision, { color: string; glow: string; label: string; subtitle: string }> = {
  APPROVED:      { color: "text-status-approved", glow: "shadow-[0_0_20px_rgba(74,222,128,0.25)]",  label: "Fully Approved",      subtitle: "You're all set." },
  PARTIAL:       { color: "text-status-manual",   glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",  label: "Partially Approved",  subtitle: "We've covered what we can." },
  REJECTED:      { color: "text-status-rejected", glow: "shadow-[0_0_20px_rgba(255,64,82,0.25)]",   label: "Declined",            subtitle: "We couldn't approve this one." },
  MANUAL_REVIEW: { color: "text-status-manual",   glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",  label: "Routing for Care",    subtitle: "A specialist will take a closer look." },
};

const RESULT_DOT: Record<string, string> = {
  PASSED:  "bg-status-approved shadow-[0_0_6px_var(--color-status-approved)]",
  FAILED:  "bg-status-rejected shadow-[0_0_6px_var(--color-status-rejected)]",
  WARNING: "bg-status-manual shadow-[0_0_6px_var(--color-status-manual)]",
  INFO:    "bg-plum-muted",
  SKIPPED: "bg-plum-secondary",
};

const RESULT_BADGE: Record<string, string> = {
  PASSED:  "text-status-approved",
  FAILED:  "text-status-rejected",
  WARNING: "text-status-manual",
  INFO:    "text-plum-muted",
  SKIPPED: "text-plum-secondary",
};

function groupTraceByStage(trace: TraceEntry[]): { stage: string; entries: TraceEntry[] }[] {
  const order = ["DocumentVerification", "InformationExtraction", "POLICY_ENGINE", "FraudDetection", "FINANCIAL"];
  const map = new Map<string, TraceEntry[]>();

  for (const entry of trace) {
    if (!map.has(entry.stage)) map.set(entry.stage, []);
    map.get(entry.stage)!.push(entry);
  }

  // Return in order, then any unexpected stages at end
  const result: { stage: string; entries: TraceEntry[] }[] = [];
  for (const stage of order) {
    if (map.has(stage)) result.push({ stage, entries: map.get(stage)! });
  }
  for (const [stage, entries] of map) {
    if (!order.includes(stage)) result.push({ stage, entries });
  }
  return result;
}

function stageOverallResult(entries: TraceEntry[]): "PASSED" | "FAILED" | "WARNING" | "INFO" {
  if (entries.some(e => e.result === "FAILED")) return "FAILED";
  if (entries.some(e => e.result === "WARNING")) return "WARNING";
  if (entries.every(e => e.result === "PASSED")) return "PASSED";
  return "INFO";
}

function TraceAccordion({ stage, entries }: { stage: string; entries: TraceEntry[] }) {
  const [open, setOpen] = useState(false);
  const overall = stageOverallResult(entries);

  return (
    <div className="border border-plum-secondary rounded-md overflow-hidden bg-plum-main/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-plum-secondary/40 active:bg-plum-secondary/60 transition-colors text-left gap-2"
      >
        {/* Left side: Dot + Label */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${RESULT_DOT[overall]}`} />
          <span className="font-medium text-sm sm:text-base text-plum-offwhite truncate">
            {STAGE_LABELS[stage] ?? stage}
          </span>
        </div>
        
        {/* Right side: Badge + Arrow */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="text-[10px] text-plum-muted hidden xs:inline">({entries.length} checks)</span>
          <span className={`text-[10px] font-mono font-bold tracking-wider ${RESULT_BADGE[overall]}`}>
            {overall}
          </span>
          <svg className={`w-4 h-4 text-plum-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-plum-secondary bg-plum-secondary/5 divide-y divide-plum-secondary/20">
          {entries.map((entry, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 items-start">
              <span className={`text-xs mt-1 shrink-0 ${RESULT_BADGE[entry.result]}`}>
                {entry.result === "PASSED" ? "✓" : entry.result === "FAILED" ? "✗" : "⚠"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-plum-muted uppercase tracking-widest leading-none mb-1">{CHECK_LABELS[entry.check] ?? entry.check}</p>
                <p className="text-sm text-plum-offwhite/90 leading-snug">{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClaimResult() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(`claim_${id}`);
    if (stored) {
      setResult(JSON.parse(stored));
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <svg className="w-10 h-10 text-plum-pink animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-plum-muted text-sm">Loading claim result...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-plum-muted">We couldn&apos;t find this claim. It may have expired from your session.</p>
        <button onClick={() => router.push("/")} className="text-plum-pink text-sm hover:underline">
          ← Submit a new claim
        </button>
      </div>
    );
  }

  const ds = DECISION_STYLES[result.decision];
  const groups = groupTraceByStage(result.trace);
  const hasAmount = result.approvedAmount > 0;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">

      {/* Back link */}
      <button onClick={() => router.push("/")} className="text-plum-muted text-sm hover:text-plum-pink transition-colors flex items-center gap-1.5 w-fit">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Submit another claim
      </button>

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-plum-offwhite mb-2">
          Here&apos;s what we <em className="text-plum-muted">found.</em>
        </h1>
        <p className="text-plum-muted text-xs font-mono">{result.claimId}</p>
      </div>

      {/* Decision Card */}
      <div className={`bg-plum-secondary/20 border border-plum-secondary rounded-xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm ${ds.glow}`}>

        <div className="flex items-start justify-between border-b border-plum-secondary pb-5 mb-5">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-plum-muted uppercase tracking-widest mb-1">Decision</p>
            <h2 className={`font-serif text-4xl sm:text-5xl mt-1 drop-shadow-md ${ds.color}`}>{ds.label}</h2>
            <p className="text-sm text-plum-muted mt-1.5">{ds.subtitle}</p>
          </div>
          {hasAmount && (
            <div className="text-right">
              <p className="text-[10px] sm:text-xs font-bold text-plum-muted uppercase tracking-widest mb-1">Approved Amount</p>
              <h3 className="font-sans font-semibold text-3xl sm:text-4xl text-plum-offwhite mt-1">
                ₹{result.approvedAmount.toLocaleString("en-IN")}
              </h3>
            </div>
          )}
        </div>

        {/* Confidence */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-plum-muted uppercase tracking-wider font-semibold">Decision Certainty</span>
            <span className="text-xs text-plum-offwhite font-mono">{(result.systemConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-plum-main rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${result.systemConfidence * 100}%`,
                backgroundColor: 
                  result.decision === "APPROVED" 
                    ? "var(--color-status-approved)" 
                    : result.decision === "REJECTED" 
                    ? "var(--color-status-rejected)" 
                    : "var(--color-status-manual)"
              }}
            />
          </div>
        </div>

        {/* Rejection Reasons */}
        {result.rejectionReasons.length > 0 && (
          <div className="mb-5 bg-plum-pink/10 border border-plum-pink/30 rounded-md px-4 py-3 flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-plum-pink uppercase tracking-wider">Why we couldn't approve this</p>
            {Array.from(new Set(simplifyRejectionReasons(result.rejectionReasons))).map((r, i) => (
              <p key={i} className="text-sm text-plum-offwhite/80">{r}</p>
            ))}
          </div>
        )}

        {/* Degraded components warning */}
        {result.degradedComponents.length > 0 && (
          <div className="mb-5 bg-status-manual/10 border border-status-manual/30 rounded-md px-4 py-3">
            <p className="text-xs font-semibold text-status-manual uppercase tracking-wider mb-1">Heads up</p>
            <p className="text-sm text-plum-offwhite/70">We had a hiccup with {result.degradedComponents.join(" and ")} during this review. Some details may be incomplete. A specialist may follow up.</p>
          </div>
        )}

        {/* Trace Accordions */}
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-xl sm:text-2xl text-plum-offwhite mb-1">How we got here</h3>
          {groups.map(({ stage, entries }) => (
            <TraceAccordion key={stage} stage={stage} entries={entries} />
          ))}
        </div>

      </div>
    </div>
  );
}