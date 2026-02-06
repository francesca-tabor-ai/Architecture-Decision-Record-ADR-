'use client';

import { useState } from 'react';
import {
  Settings,
  Github,
  MessageSquare,
  Code,
  TicketCheck,
  FlaskConical,
  Database,
  Cloud,
  Container,
  CheckCircle2,
  Circle,
  FolderGit2,
  Bell,
  Shield,
  Users,
  Palette,
} from 'lucide-react';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  required: boolean;
  category: 'required' | 'nice-to-have';
};

const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Git-native ADR storage, PR linking, and compliance checks',
    icon: <Github className="h-5 w-5" />,
    connected: true,
    required: true,
    category: 'required',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'IDE plugin for ADR discovery and contextual suggestions',
    icon: <Code className="h-5 w-5" />,
    connected: true,
    required: true,
    category: 'required',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Convert Slack threads into ADR drafts, notifications',
    icon: <MessageSquare className="h-5 w-5" />,
    connected: true,
    required: true,
    category: 'required',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Link ADRs to Jira tickets and track decision-related work',
    icon: <TicketCheck className="h-5 w-5" />,
    connected: false,
    required: true,
    category: 'required',
  },
  {
    id: 'mlflow',
    name: 'MLflow',
    description: 'Connect experiments to architecture decisions',
    icon: <FlaskConical className="h-5 w-5" />,
    connected: false,
    required: false,
    category: 'nice-to-have',
  },
  {
    id: 'wandb',
    name: 'Weights & Biases',
    description: 'Link W&B experiment runs to model selection ADRs',
    icon: <Database className="h-5 w-5" />,
    connected: false,
    required: false,
    category: 'nice-to-have',
  },
  {
    id: 'databricks',
    name: 'Databricks',
    description: 'Track data pipeline decisions with Databricks workflows',
    icon: <Cloud className="h-5 w-5" />,
    connected: false,
    required: false,
    category: 'nice-to-have',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Monitor infrastructure ADRs with K8s cluster changes',
    icon: <Container className="h-5 w-5" />,
    connected: false,
    required: false,
    category: 'nice-to-have',
  },
];

export default function SettingsPage() {
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    integrations.reduce((acc, i) => ({ ...acc, [i.id]: i.connected }), {} as Record<string, boolean>)
  );

  const [adrPath, setAdrPath] = useState('docs/adr');
  const [numberFormat, setNumberFormat] = useState('ADR-NNNN');
  const [defaultTemplate, setDefaultTemplate] = useState('general');
  const [enforcementLevel, setEnforcementLevel] = useState<'off' | 'warn' | 'enforce'>('warn');
  const [notifications, setNotifications] = useState({
    newADR: true,
    statusChange: true,
    prReminder: true,
    weeklyDigest: false,
  });

  const toggleConnection = (id: string) => {
    setConnectedIntegrations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const requiredIntegrations = integrations.filter((i) => i.category === 'required');
  const optionalIntegrations = integrations.filter((i) => i.category === 'nice-to-have');

  return (
    <div className="animate-fade-in max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Configure ADR Copilot for your team&apos;s workflow
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">General</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">ADR Storage Path</p>
              <p className="text-xs text-muted">Where ADR markdown files are stored in the repo</p>
            </div>
            <input
              type="text"
              value={adrPath}
              onChange={(e) => setAdrPath(e.target.value)}
              className="w-48 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Numbering Format</p>
              <p className="text-xs text-muted">How ADRs are numbered (e.g., ADR-0001)</p>
            </div>
            <select
              value={numberFormat}
              onChange={(e) => setNumberFormat(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="ADR-NNNN">ADR-NNNN (e.g., ADR-0001)</option>
              <option value="ADR-NNN">ADR-NNN (e.g., ADR-001)</option>
              <option value="NNN">NNN (e.g., 001)</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Default Template</p>
              <p className="text-xs text-muted">Template used when creating new ADRs</p>
            </div>
            <select
              value={defaultTemplate}
              onChange={(e) => setDefaultTemplate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="general">General (Nygard)</option>
              <option value="model-selection">Model Selection</option>
              <option value="rag-architecture">RAG Architecture</option>
              <option value="inference-serving">Inference Serving</option>
              <option value="data-retention">Data Retention</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enforcement Settings */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Policy Enforcement</h2>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-muted mb-4">
            Control how strictly ADR policies are enforced in your CI/CD pipeline
          </p>
          <div className="space-y-3">
            {[
              { id: 'off', label: 'Off', description: 'No enforcement — ADR policies are informational only' },
              { id: 'warn', label: 'Warn (Recommended)', description: 'Show warnings in PRs when ADR policies are triggered, but don\'t block merges' },
              { id: 'enforce', label: 'Enforce', description: 'Block PR merges when required ADR policies are not satisfied' },
            ].map((level) => (
              <label
                key={level.id}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  enforcementLevel === level.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <input
                  type="radio"
                  name="enforcement"
                  value={level.id}
                  checked={enforcementLevel === level.id}
                  onChange={(e) => setEnforcementLevel(e.target.value as 'off' | 'warn' | 'enforce')}
                  className="mt-0.5 accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{level.label}</p>
                  <p className="text-xs text-muted">{level.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Notifications</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[
            { key: 'newADR', label: 'New ADR Created', desc: 'Get notified when a new ADR is proposed' },
            { key: 'statusChange', label: 'Status Changes', desc: 'Notify when ADR status changes (accepted, deprecated, etc.)' },
            { key: 'prReminder', label: 'PR Reminders', desc: 'Remind to link ADRs when architecture-impacting PRs are opened' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of ADR activity and pending reviews' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'left-5.5'
                      : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Integrations</h2>
          </div>
          <p className="mt-0.5 text-xs text-muted">Connect ADR Copilot with your development tools</p>
        </div>

        {/* Required */}
        <div className="px-6 py-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Required</p>
        </div>
        <div className="divide-y divide-border">
          {requiredIntegrations.map((integration) => (
            <div key={integration.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-foreground">
                {integration.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{integration.name}</p>
                <p className="text-xs text-muted">{integration.description}</p>
              </div>
              <button
                onClick={() => toggleConnection(integration.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  connectedIntegrations[integration.id]
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-muted hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {connectedIntegrations[integration.id] ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Connected
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5" />
                    Connect
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Nice to Have */}
        <div className="px-6 py-3 border-t border-border">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Optional</p>
        </div>
        <div className="divide-y divide-border">
          {optionalIntegrations.map((integration) => (
            <div key={integration.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-foreground">
                {integration.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{integration.name}</p>
                <p className="text-xs text-muted">{integration.description}</p>
              </div>
              <button
                onClick={() => toggleConnection(integration.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  connectedIntegrations[integration.id]
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-muted hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {connectedIntegrations[integration.id] ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Connected
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5" />
                    Connect
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Team</h2>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {[
              { name: 'Sarah Chen', role: 'AI Architect', initials: 'SC' },
              { name: 'Mike Torres', role: 'MLOps Engineer', initials: 'MT' },
              { name: 'Alex Rivera', role: 'ML Engineer', initials: 'AR' },
              { name: 'Jordan Kim', role: 'Platform Engineer', initials: 'JK' },
              { name: 'Priya Patel', role: 'Data Engineer', initials: 'PP' },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {member.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          Save Settings
        </button>
        <button className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
