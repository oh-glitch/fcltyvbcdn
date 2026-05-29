# AI Facility Management Assistant

An enterprise-inspired conversational AI platform for commercial real estate and facility management teams.

This project enables users to upload lease agreements, maintenance reports, and operational facility documents, then interact with them through a modern AI-powered chat interface using Retrieval-Augmented Generation (RAG).

Built with a beginner-friendly modern AI stack using Next.js, OpenAI, Supabase, and vector search.

---

# Features

* AI-powered conversational interface
* Upload and analyze PDFs
* Semantic document search (RAG)
* Lease agreement assistant
* Maintenance log analysis
* Streaming AI responses
* Source citations
* Modern responsive dashboard
* Authentication
* Telemetry and analytics
* Real-time operational insights

---

# Tech Stack

## Frontend

* Next.js
* Tailwind CSS
* shadcn/ui
* Vercel AI SDK

## Backend

* Next.js API Routes
* TypeScript

## Database & Storage

* Supabase PostgreSQL
* Supabase Storage
* pgvector

## AI & RAG

* OpenAI API
* Embeddings API
* Vector similarity search

## Authentication

* Clerk

## Observability

* PostHog
* Sentry

---

# Architecture Overview

```txt id="v4t7n1"
User Uploads PDF
        ↓
Supabase Storage
        ↓
PDF Text Extraction
        ↓
Chunking + Embeddings
        ↓
pgvector Semantic Search
        ↓
Relevant Context Retrieval
        ↓
OpenAI Prompt Injection
        ↓
Streaming AI Response
```

---

# Project Goals

The platform is designed to:

* Reduce manual lease lookup time
* Centralize operational facility knowledge
* Improve maintenance reporting workflows
* Enable conversational querying over unstructured documents
* Support rapid AI prototyping workflows
* Demonstrate enterprise-grade AI architecture using beginner-friendly tooling

---

# Folder Structure

```bash id="v0h8m3"
app/
  api/
  dashboard/
  chat/
  upload/

components/
  ui/
  chat/
  dashboard/

lib/
  ai/
  rag/
  db/
  utils/

services/
  embeddings/
  pdf/
  telemetry/

types/

public/
```

---

# Getting Started

## 1. Clone the Repository

```bash id="x2f9b6"
git clone <your-repo-url>
cd ai-facility-management-assistant
```

---

## 2. Install Dependencies

```bash id="g5w1q7"
npm install
```

---

## 3. Create Environment Variables

Create a `.env.local` file:

```env id="n6u4r2"
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_POSTHOG_KEY=

SENTRY_AUTH_TOKEN=
```

---

## 4. Run Development Server

```bash id="d9k3s5"
npm run dev
```

Open:

```txt id="e1c8v4"
http://localhost:3000
```

---

# Core Features
<img width="1436" height="810" alt="image" src="https://github.com/user-attachments/assets/199152d3-a5e6-4775-8a32-bdf98ab4fc0c" />

<img width="1436" height="810" alt="image" src="https://github.com/user-attachments/assets/b08d2475-7e2f-4944-b6f2-f3a6f7204987" />




## AI Chat Assistant

* Streaming responses
* Conversational memory
* Facility management Q&A
* Lease agreement analysis
* Context-aware document retrieval

---

## PDF Processing Pipeline

* Upload lease agreements
* Extract document text
* Chunk large files
* Generate embeddings
* Store searchable vectors

---

## RAG (Retrieval-Augmented Generation)

The system uses semantic search to retrieve relevant document chunks before generating AI responses.

Benefits:

* More accurate answers
* Reduced hallucinations
* Context-aware responses
* Source attribution

---

# Development Workflow

This project follows a rapid prototyping / “vibe coding” workflow using:

* Cursor
* AI-assisted scaffolding
* Small iterative prompts
* Fast feedback loops
* Continuous refinement

---

# Recommended Cursor Workflow

Build incrementally:

1. Chat UI
2. AI streaming
3. PDF upload
4. Text extraction
5. Embeddings
6. RAG retrieval
7. Dashboard
8. Telemetry
9. Production deployment

Avoid overengineering early.

---

# Future Improvements

* Multi-tenant architecture
* Role-based access control
* Advanced analytics
* Multi-agent workflows
* Live telemetry ingestion
* IoT sensor integration
* Azure OpenAI support
* Hybrid vector search
* Knowledge graph integration

---

# Deployment

Recommended deployment stack:

| Service        | Platform         |
| -------------- | ---------------- |
| Frontend       | Vercel           |
| Database       | Supabase         |
| Storage        | Supabase Storage |
| Analytics      | PostHog          |
| Error Tracking | Sentry           |

---

## Business Value

This platform demonstrates how conversational AI can modernize commercial real estate and facility management workflows by transforming fragmented operational data into actionable insights.

### Operational Efficiency

* Reduces manual lease and maintenance document lookup time
* Enables instant semantic search across large volumes of unstructured PDFs
* Minimizes repetitive reporting and administrative overhead
* Accelerates access to critical building and operational information

### Intelligent Decision Support

* Allows facility managers to query operational data using natural language
* Surfaces relevant lease clauses and maintenance records in seconds
* Helps identify anomalies, trends, and operational risks proactively
* Improves visibility into property and facility performance

### AI-Powered Knowledge Centralization

* Consolidates lease agreements, maintenance logs, and facility documentation into a single searchable interface
* Converts unstructured documents into structured, AI-accessible knowledge
* Reduces dependency on siloed spreadsheets and manual processes

### Rapid AI Prototyping & Innovation

* Demonstrates modern “vibe coding” workflows using AI-assisted development tools
* Enables rapid experimentation and feature iteration cycles
* Reduces time-to-prototype from weeks to days
* Supports continuous user feedback and fast architectural pivots

### Scalability & Extensibility

The architecture is designed to evolve into a larger enterprise AI ecosystem supporting:

* Multi-building management
* Real-time telemetry ingestion
* IoT integrations
* Predictive maintenance
* Multi-agent workflows
* Enterprise analytics dashboards
* Advanced operational automation

### Technical Business Outcomes

Potential measurable outcomes include:

| Area                   | Impact                                             |
| ---------------------- | -------------------------------------------------- |
| Document Retrieval     | Faster access to lease and maintenance information |
| Reporting Workflows    | Reduced manual reporting effort                    |
| Operational Visibility | Improved facility oversight                        |
| User Productivity      | Faster issue resolution and decision-making        |
| AI Adoption            | Accelerated enterprise AI experimentation          |

---


# Learning Objectives

This project is ideal for learning:

* Modern AI application architecture
* RAG systems
* Semantic search
* Full-stack TypeScript
* Next.js App Router
* AI streaming interfaces
* Prompt engineering
* Vector databases
* AI observability

---

# Disclaimer

This is a prototype educational project intended for rapid experimentation and AI-assisted development workflows.

Additional security, compliance, and scalability improvements are required before production deployment in regulated enterprise environments.

---

# License

MIT License

---

# Acknowledgements

Inspired by modern enterprise conversational AI systems, rapid AI prototyping workflows, and emerging “vibe coding” development methodologies.
