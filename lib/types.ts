// Row types matching the Supabase schema.

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string | null;
  employees: number | null;
  environment: string[] | null;
  summary: string | null;
}

export interface Asset {
  id: string;
  asset_code: string;
  asset_name: string;
  asset_type: string | null;
  owner: string | null;
  business_criticality: string | null;
  data_classification: string | null;
  description: string | null;
}

export interface Control {
  id: string;
  control_code: string;
  control_name: string;
  control_type: string | null;
  description: string | null;
  framework_reference: string | null;
  implementation_status: string | null;
  owner: string | null;
}

export interface Risk {
  id: string;
  risk_code: string;
  risk_title: string;
  asset_id: string | null;
  threat: string | null;
  vulnerability: string | null;
  likelihood: number | null;
  impact: number | null;
  inherent_risk_score: number | null;
  risk_rating: string | null;
  control_recommendation: string | null;
  residual_risk_score: number | null;
  status: string | null;
  owner: string | null;
  created_at: string;
}

export interface ComplianceMapping {
  id: string;
  mapping_code: string;
  control_id: string | null;
  framework: string | null;
  function_category: string | null;
  requirement: string | null;
  compliance_status: string | null;
  evidence_notes: string | null;
}

export interface Policy {
  id: string;
  policy_code: string;
  title: string;
  purpose: string | null;
  scope: string | null;
  policy_statement: string | null;
  owner: string | null;
  review_date: string | null;
  status: string | null;
}

export interface GapAssessment {
  id: string;
  requirement: string;
  current_state: string | null;
  gap: string | null;
  risk_level: string | null;
  recommendation: string | null;
  priority: string | null;
}
