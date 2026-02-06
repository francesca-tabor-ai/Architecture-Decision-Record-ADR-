export type ADRStatus = 'proposed' | 'accepted' | 'deprecated' | 'superseded';

export type ADRCategory =
  | 'model-selection'
  | 'data-pipeline'
  | 'infrastructure'
  | 'evaluation'
  | 'prompt-architecture'
  | 'rag-architecture'
  | 'feature-store'
  | 'inference-serving'
  | 'data-retention'
  | 'security'
  | 'compliance'
  | 'general';

export type ComplianceFramework = 'GDPR' | 'EU AI Act' | 'SOC2' | 'HIPAA' | 'Model Governance';

export type PolicyTrigger = {
  id: string;
  name: string;
  description: string;
  pattern: string;
  severity: 'info' | 'warning' | 'required';
  enabled: boolean;
};

export type ADR = {
  id: string;
  number: number;
  title: string;
  status: ADRStatus;
  category: ADRCategory;
  date: string;
  lastUpdated: string;
  authors: string[];
  context: string;
  decision: string;
  consequences: string;
  alternatives?: string;
  relatedADRs?: string[];
  supersededBy?: string;
  supersedes?: string;
  tags: string[];
  complianceFrameworks?: ComplianceFramework[];
  linkedPRs?: string[];
  linkedExperiments?: string[];
  modelVersion?: string;
  datasetVersion?: string;
  riskClassification?: 'low' | 'medium' | 'high' | 'critical';
  qualityScore?: number;
};

export type ADRTemplate = {
  id: string;
  name: string;
  description: string;
  category: ADRCategory;
  fields: {
    context: string;
    decision: string;
    consequences: string;
    alternatives: string;
  };
  tags: string[];
};

export type TimelineEvent = {
  id: string;
  adrId: string;
  adrTitle: string;
  type: 'created' | 'accepted' | 'deprecated' | 'superseded' | 'updated';
  date: string;
  description: string;
};

export type SearchResult = {
  adr: ADR;
  relevanceScore: number;
  matchedFields: string[];
  snippet: string;
};
