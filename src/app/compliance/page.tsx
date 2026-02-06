'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ToggleLeft,
  ToggleRight,
  Info,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { mockADRs, policyTriggers } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import RiskBadge from '@/components/RiskBadge';

export default function CompliancePage() {
  const [policies, setPolicies] = useState(policyTriggers);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const highRiskADRs = mockADRs.filter(
    (a) => a.riskClassification === 'high' || a.riskClassification === 'critical'
  );
  const complianceADRs = mockADRs.filter(
    (a) => a.complianceFrameworks && a.complianceFrameworks.length > 0
  );
  const proposedADRs = mockADRs.filter((a) => a.status === 'proposed');

  const frameworkCounts: Record<string, number> = {};
  mockADRs.forEach((adr) => {
    adr.complianceFrameworks?.forEach((fw) => {
      frameworkCounts[fw] = (frameworkCounts[fw] || 0) + 1;
    });
  });

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const severityIcon = {
    info: <Info className="h-4 w-4 text-blue-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    required: <AlertOctagon className="h-4 w-4 text-red-500" />,
  };

  const severityLabel = {
    info: 'Informational',
    warning: 'Warning',
    required: 'Required',
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance & Governance</h1>
        <p className="mt-1 text-sm text-muted">
          Policy guardrails, risk oversight, and audit readiness dashboard
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">Compliance ADRs</p>
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{complianceADRs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">High/Critical Risk</p>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{highRiskADRs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">Active Policies</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {policies.filter((p) => p.enabled).length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">Pending Review</p>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{proposedADRs.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Policy Triggers */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-foreground">Policy Triggers</h2>
            <p className="mt-0.5 text-xs text-muted">
              Rules that detect when ADRs should be created for architecture changes
            </p>
          </div>
          <div className="divide-y divide-border">
            {policies.map((policy) => (
              <div key={policy.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {severityIcon[policy.severity]}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">{policy.name}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            policy.severity === 'required'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : policy.severity === 'warning'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}
                        >
                          {severityLabel[policy.severity]}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{policy.description}</p>
                      <button
                        onClick={() =>
                          setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)
                        }
                        className="mt-1.5 flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {expandedPolicy === policy.id ? (
                          <>
                            Hide pattern <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Show pattern <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                      {expandedPolicy === policy.id && (
                        <code className="mt-2 block rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 font-mono text-xs text-muted">
                          {policy.pattern}
                        </code>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => togglePolicy(policy.id)}
                    className="ml-3 shrink-0"
                  >
                    {policy.enabled ? (
                      <ToggleRight className="h-6 w-6 text-primary" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Frameworks */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Compliance Frameworks</h2>
            <p className="mt-0.5 text-xs text-muted">ADRs tagged with regulatory frameworks</p>
            <div className="mt-4 space-y-3">
              {Object.entries(frameworkCounts).map(([fw, count]) => (
                <div key={fw} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{fw}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(count / mockADRs.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted">{count} ADRs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Risk ADRs */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">High Risk Decisions</h2>
              <p className="mt-0.5 text-xs text-muted">ADRs classified as high or critical risk</p>
            </div>
            <div className="divide-y divide-border">
              {highRiskADRs.map((adr) => (
                <Link
                  key={adr.id}
                  href={`/adrs/${adr.id}`}
                  className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{adr.title}</p>
                    <p className="text-xs text-muted">ADR-{String(adr.number).padStart(4, '0')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {adr.riskClassification && <RiskBadge risk={adr.riskClassification} />}
                    <StatusBadge status={adr.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Audit Log Preview */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Audit Readiness</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-foreground">All ADRs version controlled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-foreground">Decision rationale documented</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-foreground">Author attribution on all ADRs</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-foreground">
                  {proposedADRs.length} ADR{proposedADRs.length !== 1 ? 's' : ''} pending approval
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-foreground">
                  {highRiskADRs.filter((a) => a.status === 'proposed').length} high-risk ADR{highRiskADRs.filter((a) => a.status === 'proposed').length !== 1 ? 's' : ''} not yet accepted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
