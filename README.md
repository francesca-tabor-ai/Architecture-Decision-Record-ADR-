# ADR Copilot

AI-assisted Architecture Decision Records for ML/AI teams. Capture, understand, and operationalize architectural decisions with minimal friction.

## What is ADR Copilot?

ADR Copilot helps AI teams create, maintain, and enforce Architecture Decision Records (ADRs). It addresses common problems in ML/AI teams where architectural decisions are lost in Slack, tickets, or meeting notes — poorly documented, repeatedly re-debated, and hard to audit.

## Features

### AI-Assisted ADR Authoring
- Generate ADR drafts from natural language descriptions
- Extract decisions from code changes and PRs
- Pre-built AI-specific templates (model selection, RAG architecture, inference serving, etc.)
- Y-Statement format with automatic consequence and trade-off suggestions
- Quality scoring for ADR completeness

### Git-Native Storage
- ADRs stored as Markdown in your repository
- Version controlled and PR reviewable
- Auto-numbered (ADR-0001, ADR-0002, etc.)
- Linkable to code, PRs, and experiments

### Search & Relevance Engine
- Full-text and semantic search across all ADRs
- Contextual suggestions based on developer activity
- Relevance scoring for search results

### Compliance & Governance
- Policy triggers that detect when ADRs should be created
- Configurable enforcement levels (off / warn / enforce)
- Compliance framework tagging (GDPR, EU AI Act, SOC2, HIPAA)
- Risk classification (low, medium, high, critical)
- Audit readiness dashboard

### ADR Lifecycle Management
- Status tracking: Proposed, Accepted, Deprecated, Superseded
- Decision supersession chains with linked ADRs
- Timeline visualization of all decision events
- Decision lineage graph

### AI-Specific Templates
- Model Selection Decision
- Data Retention Policy
- RAG Architecture Decision
- Inference Serving Strategy
- Prompt Architecture Decision
- Feature Store Architecture

### Integrations
- GitHub / GitLab (required)
- VS Code / JetBrains IDE plugins
- Slack / Teams for thread-to-ADR conversion
- Jira / Linear for ticket linking
- MLflow, Weights & Biases, Databricks, Kubernetes (optional)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
  app/
    page.tsx              # Dashboard
    adrs/
      page.tsx            # ADR listing with filters
      new/page.tsx        # AI-assisted ADR creation
      [id]/page.tsx       # ADR detail view
    search/page.tsx       # Search & discovery
    compliance/page.tsx   # Compliance dashboard
    templates/page.tsx    # Decision templates
    timeline/page.tsx     # Timeline & lineage
    settings/page.tsx     # Configuration
  components/
    Sidebar.tsx           # Navigation sidebar
    StatusBadge.tsx       # ADR status indicators
    RiskBadge.tsx         # Risk level badges
    QualityScore.tsx      # Quality score bars
  lib/
    types.ts              # TypeScript type definitions
    data.ts               # Mock data and utility functions
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats, recent decisions, compliance alerts |
| `/adrs` | All ADRs with filtering by status, category, and search |
| `/adrs/new` | AI-assisted ADR creation (natural language, code, templates) |
| `/adrs/[id]` | Full ADR detail with Nygard 5-part structure |
| `/search` | Text and semantic search with relevance scoring |
| `/compliance` | Policy triggers, risk overview, audit readiness |
| `/templates` | AI-specific decision templates |
| `/timeline` | Chronological timeline and decision lineage graph |
| `/settings` | Integrations, enforcement, notifications, team |

## License

MIT
