import fs from 'fs';
import path from 'path';

export interface PolicyMember {
  member_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  relationship: string;
  join_date?: string; // Exists for primary member
  primary_member_id?: string; // Exists for dependent
  dependents?: string[];
}

export interface OpdCategoryRules {
  sub_limit: number;
  copay_percent: number;
  network_discount_percent?: number;
  requires_prescription: boolean;
  requires_pre_auth?: boolean;
  pre_auth_threshold?: number;
  high_value_tests_requiring_pre_auth?: string[];
  covered: boolean;
  branded_drug_copay_percent?: number;
  generic_mandatory?: boolean;
  requires_dental_report?: boolean;
  covered_procedures?: string[];
  excluded_procedures?: string[];
  covered_items?: string[];
  excluded_items?: string[];
  requires_registered_practitioner?: boolean;
  max_sessions_per_year?: number;
  covered_systems?: string[];
}

export interface PolicyTerms {
  policy_id: string;
  policy_name: string;
  insurer: string;
  policy_holder: {
    company_name: string;
    employee_count: number;
    policy_start_date: string;
    policy_end_date: string;
    renewal_status: string;
  };
  coverage: {
    sum_insured_per_employee: number;
    annual_opd_limit: number;
    per_claim_limit: number;
    family_floater: {
      enabled: boolean;
      combined_limit: number;
      covered_relationships: string[];
    };
  };
  opd_categories: Record<string, OpdCategoryRules>;
  waiting_periods: {
    initial_waiting_period_days: number;
    pre_existing_conditions_days: number;
    specific_conditions: Record<string, number>;
  };
  exclusions: {
    conditions: string[];
    dental_exclusions: string[];
    vision_exclusions: string[];
  };
  pre_authorization: {
    required_for: string[];
    validity_days: number;
  };
  network_hospitals: string[];
  submission_rules: {
    deadline_days_from_treatment: number;
    minimum_claim_amount: number;
    currency: string;
  };
  document_requirements: Record<string, { required: string[]; optional: string[] }>;
  fraud_thresholds: {
    same_day_claims_limit: number;
    monthly_claims_limit: number;
    high_value_claim_threshold: number;
    auto_manual_review_above: number;
    fraud_score_manual_review_threshold: number;
  };
  members: PolicyMember[];
}

export function loadPolicy(): PolicyTerms {
  // Read the policy_terms.json synchronously for simplicity
  const filePath = path.join(process.cwd(), 'data', 'policy_terms.json');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents) as PolicyTerms;
}
