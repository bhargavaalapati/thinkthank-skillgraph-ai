# SkillGraph AI 🚀

### Enterprise-Grade Agentic Skill Intelligence & Competency Mapping

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Redis](https://img.shields.io/badge/Upstash-Redis-DC382D?style=for-the-badge&logo=redis)](https://upstash.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 🧠 Overview

**SkillGraph AI** is an enterprise-grade, agentic skill intelligence and competency mapping platform purpose-built around India's **Karmayogi Competency Model (KCM)**.

It bridges the gap between complex **government and organizational policy mandates** and practical **workforce execution**.

Instead of treating policy documents as static information, SkillGraph AI transforms them into an actionable competency intelligence pipeline:

```text
Policy / Organizational Knowledge
              ↓
       Structural RAG
              ↓
      Semantic Embeddings
              ↓
     Competency Intelligence
              ↓
   Situational Judgment Tests
              ↓
      Agentic Evaluation
              ↓
   Competency Score & Insights
              ↓
      Visual Skill Mapping
```

The platform combines Agentic RAG, structural vector embeddings, deterministic evaluation schemas, real-time analytics, and secure cloud infrastructure to create an end-to-end competency assessment workflow.

### 🎯 Problem Statement

Organizations and government departments often have detailed competency frameworks and policy mandates, but translating those documents into daily workforce actions and measurable competency outcomes is difficult.

Traditional approaches generally separate:

Policy documentation
Employee training
Competency assessment
Evaluation
Analytics

SkillGraph AI connects these layers into a single workflow.

### The core question:

How can organizational policy be transformed into measurable workforce competency intelligence?

SkillGraph AI addresses this by converting policy knowledge into structured assessment scenarios and mapping employee decisions back to competency dimensions.

### 💡 Solution

SkillGraph AI provides a complete intelligent competency workflow:

### 1. 📚 Policy Intelligence

Policy and organizational knowledge can be fragmented into meaningful semantic units.

### 2. 🔎 Agentic RAG

Relevant policy context is retrieved from the vector knowledge base and supplied to the AI reasoning pipeline.

### 3. 📝 Dynamic Assessment Generation

The retrieved policy context is transformed into realistic **Situational Judgment Tests (SJT)** designed around the competency expectations of a specific role.

### 4. 🎯 Deterministic Evaluation

Candidate responses are evaluated against defined competency dimensions using structured AI outputs and explicit validation schemas.

### 5. 📊 Competency Intelligence

Evaluation results are transformed into actionable competency metrics and visualized through radar-based analytics.

### 6. 🔄 Continuous Improvement

The architecture is designed to support historical assessments, competency trends, and personalized development insights as the platform evolves.

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                     NEXT.JS CLIENT                           │
│                                                              │
│  Dashboard │ Policy Ingestion │ SJT │ Evaluation │ Analytics │
└────────────────────────────┬─────────────────────────────────┘
                             │
                     API Requests / Results
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    FASTAPI ENGINE                            │
│                                                              │
│  RAG Orchestration │ Assessment Generation │ Evaluation      │
│  Schema Validation │ Session Processing │ API Protection    │
└───────────────┬────────────────┬────────────────┬─────────────┘
                │                │                │
                ▼                ▼                ▼
      ┌────────────────┐ ┌───────────────┐ ┌──────────────────┐
      │  GOOGLE GEMINI │ │ UPSTASH REDIS │ │ SUPABASE         │
      │                │ │               │ │                  │
      │ Gemini Flash   │ │ Rate Limiting │ │ PostgreSQL       │
      │ Embeddings     │ │ Caching       │ │ pgvector         │
      │ Structured AI  │ │               │ │ Supabase Auth    │
      └────────────────┘ └───────────────┘ └──────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* **Next.js** — App Router and application framework
* **TypeScript** — Type-safe frontend development
* **Tailwind CSS** — Utility-first styling
* **Framer Motion** — UI transitions and animations
* **Recharts** — Competency and radar visualizations
* **Lucide Icons** — Consistent interface iconography

## Backend

* **FastAPI** — High-performance Python API framework
* **Python** — Backend and AI orchestration
* **Google GenAI SDK** — Gemini model integration
* **Pydantic v2** — Request and response validation

## Database & AI Memory

* **Supabase PostgreSQL** — Persistent relational storage
* **pgvector** — Semantic vector search
* **Supabase Auth** — Authentication and session management
* **Gemini Embeddings** — Semantic representation of policy knowledge

## Infrastructure

* **Upstash Redis** — Serverless caching and rate limiting
* **Vercel** — Frontend deployment
* **Environment-based configuration** — Secure secret management

---

# ✨ Key Features

## 1. 📚 Pre-Cached Knowledge Base

SkillGraph AI converts policy and organizational knowledge into a reusable semantic knowledge base.

```text
Policy Document
      ↓
Structural Fragmentation
      ↓
Semantic Chunks
      ↓
Gemini Embeddings
      ↓
Supabase pgvector
```

This enables relevant policy context to be retrieved without repeatedly processing the same source material.

### Why it matters

Instead of treating every assessment as a completely new AI request, the platform establishes a reusable **organizational knowledge layer**.

---

## 2. 🔎 Agentic RAG

The platform uses Retrieval-Augmented Generation to ground AI-generated assessments in the available policy knowledge.

```text
Role / Assessment Context
          ↓
     Vector Search
          ↓
 Relevant Policy Chunks
          ↓
    Context Assembly
          ↓
      Gemini AI
          ↓
 Structured Assessment
```

The objective is to make generated assessments **context-aware rather than generic**.

---

## 3. 📝 Dynamic Assessment Generation

SkillGraph AI dynamically generates **3-question Situational Judgment Tests (SJT)** based on:

* Retrieved policy context
* Role expectations
* Competency dimensions
* Scenario-specific decision requirements

The goal is to evaluate **decision-making and applied competency**, rather than simple factual recall.

---

## 4. 🎯 Deterministic Evaluation Agent

The evaluation engine scores candidate responses against predefined competency dimensions on a **1–10 scale**.

Rather than passing unrestricted text through the application, the AI response is constrained using structured schemas.

```text
Candidate Response
        ↓
 Evaluation Agent
        ↓
Competency Analysis
        ↓
 Structured JSON
        ↓
 Pydantic Validation
        ↓
 Dashboard Metrics
```

This creates a predictable contract between the AI layer and the rest of the application.

---

## 5. 📊 Competency Radar Analytics

Evaluation results are converted into visual competency intelligence.

The dashboard can represent:

* Competency scores
* Strength areas
* Development areas
* Competency distribution
* Evaluation reasoning
* Radar-based competency profiles

This makes the output easier for users and organizational decision-makers to interpret.

---

## 6. 💾 State Persistence

Multi-step workflows use browser-side persistence to protect active assessment and ingestion context.

This helps preserve state during:

* Page refreshes
* Step navigation
* Layout changes
* Temporary UI transitions

The approach minimizes unnecessary network requests during intermediate workflow stages.

---

## 7. 🔄 Global Workflow Reset

A centralized workflow reset mechanism allows users to clear the active operational state and return to the initial ingestion workflow.

This is especially useful during:

* Demonstrations
* Testing
* Repeated assessments
* Development

---

## 8. 🛡️ API Protection

Upstash Redis provides infrastructure for rate limiting and request protection.

This helps prevent uncontrolled API usage and provides a foundation for production-scale request management.

---

# 🔄 End-to-End Workflow

```text
┌──────────────────────┐
│ 1. Policy Ingestion  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 2. Policy Parsing    │
│    & Fragmentation   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 3. Gemini Embedding  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 4. pgvector Storage  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 5. Context Retrieval │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 6. SJT Generation    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 7. User Responses    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 8. AI Evaluation     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 9. Competency Scores │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 10. Radar Analytics  │
└──────────────────────┘
```

---

# 🧩 Competency Intelligence Model

The platform is designed around the principle that competency should be evaluated through **contextual decision-making**.

Instead of:

```text
Question → Correct / Incorrect
```

SkillGraph AI follows:

```text
Policy Context
      ↓
Workplace Scenario
      ↓
Candidate Decision
      ↓
Competency Evaluation
      ↓
Score + Reasoning
```

This makes the assessment more representative of real-world workforce situations.

---

# ⚙️ Quick Start

## Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js 18+
* npm
* Git
* Supabase account
* Google Gemini API access
* Upstash Redis account

---

## 1. Backend Infrastructure Setup

```bash
cd backend

python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key

GEMINI_API_KEY=your_gemini_api_key

UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

API:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

# 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the frontend:

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# 🔐 Environment Configuration

| Variable                        | Purpose                         |
| ------------------------------- | ------------------------------- |
| `SUPABASE_URL`                  | Supabase project URL            |
| `SUPABASE_KEY`                  | Backend service-role credential |
| `GEMINI_API_KEY`                | Gemini API authentication       |
| `UPSTASH_REDIS_URL`             | Redis connection URL            |
| `UPSTASH_REDIS_TOKEN`           | Redis authentication            |
| `NEXT_PUBLIC_API_URL`           | FastAPI endpoint                |
| `NEXT_PUBLIC_SUPABASE_URL`      | Frontend Supabase URL           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend Supabase public key    |

> ⚠️ Never commit `.env` or `.env.local` files to the repository.

---

# ⚖️ Architecture Trade-offs & Operational Guardrails

SkillGraph AI intentionally makes several architectural trade-offs to balance **AI flexibility, deterministic application behavior, performance, and infrastructure complexity**.

---

## 1. Deterministic JSON Schemas vs. Raw LLM Streams

### Trade-off

Raw LLM streams provide a highly fluid generation experience.

However, unrestricted text generation can create unpredictable output structures that are difficult for downstream application logic to consume reliably.

Structured generation introduces a small amount of additional processing latency.

### Mitigation

The application enforces explicit Pydantic response models such as:

```text
EvaluationResponse
```

The evaluation pipeline therefore becomes:

```text
Gemini
  ↓
Structured Response
  ↓
Pydantic Validation
  ↓
Accepted / Rejected
  ↓
Application Logic
```

This reduces structural output failures and ensures the application receives data in an expected format.

---

## 2. Ephemeral Browser State vs. Heavy Relational Persistence

### Trade-off

Persisting every intermediate step of a multi-stage wizard directly to a remote database can introduce:

* Additional network latency
* Increased database traffic
* Unnecessary writes
* More complicated state management

### Mitigation

The application uses browser-side storage for temporary workflow context.

```text
Active Workflow
      ↓
Browser Storage
      ↓
Final Submission
      ↓
Persistent Database
```

This provides faster intermediate interactions while keeping persistent storage focused on meaningful application state.

---

## 3. Namespace-Derived Validation for Anonymous Testing

### Trade-off

Production database relationships enforce strict UUID formats.

However, development and sandbox environments may use identifiers such as:

```text
mock_judge_session_123
```

Writing these directly into UUID-constrained fields can trigger PostgreSQL errors such as:

```text
22P02
invalid input syntax for type uuid
```

### Mitigation

Schema-level pre-validation converts non-standard identifiers into deterministic namespace-derived UUIDs before database writes.

This provides:

* UUID compatibility
* Traceable test sessions
* Deterministic identifiers
* Safer database operations

---

# 🚧 Known Limitations

## 1. Transient Simulation State

Active, unsubmitted workflow state depends partly on browser-side storage.

Therefore:

* Clearing browser/site data can reset active state.
* Switching browsers can remove local workflow context.
* Switching devices does not automatically transfer an in-progress workflow.

### Planned improvement

Introduce server-side workflow checkpoints while retaining local caching for fast UI interactions.

---

## 2. Embedding Dimensionality Dependency

The current vector architecture is explicitly tied to the configured embedding dimensionality.

Changing the embedding model or provider may require:

```text
New Embedding Model
        ↓
Schema / Index Update
        ↓
Vector Migration
        ↓
Full Re-Embedding
        ↓
Index Rebuild
```

Therefore, embedding-provider migration is an infrastructure operation rather than a simple configuration change.

---

## 3. Synchronous Large-Scale Ingestion

Large multi-document ingestion workloads currently depend on the application request lifecycle.

As document volume increases, processing may increase:

* API execution time
* Resource consumption
* Request latency

This is targeted by the planned asynchronous worker architecture.

---

# 🔮 Future Roadmap

## Phase 1 — ⚡ Asynchronous Execution Workers

Introduce Celery workers backed by Redis to move heavy ingestion workloads outside the primary API request lifecycle.

```text
FastAPI
   ↓
Redis
   ↓
Celery Worker
   ↓
Document Processing
   ↓
Embedding Generation
   ↓
pgvector
```

This will make large ingestion workloads more resilient and scalable.

---

## Phase 2 — 🧩 Dynamic Competency Profiles

Currently defined competency structures can evolve into configurable organizational profiles.

Organizations could define:

* Roles
* Competencies
* Weightages
* Assessment criteria
* Evaluation thresholds

directly from the platform.

---

## Phase 3 — 📈 Historical Multi-Run Analytics

Persist evaluation outcomes across multiple assessment runs.

```text
Assessment #1
      ↓
Assessment #2
      ↓
Assessment #3
      ↓
Historical Competency Trend
```

This enables identification of:

* Competency improvement
* Persistent skill gaps
* Strength development
* Long-term progression

---

## Phase 4 — 🏢 Enterprise Multi-Tenancy

Extend the platform to support isolated organizational environments with:

* Organization-level workspaces
* Role-based access control
* Department-level segmentation
* Tenant-specific knowledge bases
* Organization-specific competency frameworks

---

# 🧪 Reliability & Validation

SkillGraph AI treats AI-generated output as **structured application data**, not as unrestricted text.

Important validation boundaries include:

* API request validation
* API response validation
* AI response schema validation
* UUID normalization
* Database constraints
* Authentication
* Rate limiting
* Error handling
* Client state recovery

The objective is to ensure that AI flexibility does not compromise application reliability.

---

# 📁 Project Structure

```text
skillgraph-ai/
│
├── backend/
│   ├── main.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── dashboard.tsx
│   ├── package.json
│   └── .env.local
│
├── README.md
└── .gitignore
```

---

# 🔒 Security

SkillGraph AI follows a layered security approach.

### 🔑 Secret Management

API credentials are stored through environment variables rather than source code.

### 🚦 Rate Limiting

Upstash Redis provides API request protection.

### 🧾 Schema Validation

Pydantic validates structured backend and AI responses.

### 🔐 Authentication

Supabase Auth provides the authentication layer.

### 🗄️ Database Validation

Database constraints and schema-level validation prevent malformed identifiers from entering persistent state.

---

# 📊 Design Philosophy

SkillGraph AI is built around three principles:

### 🧠 Grounded

AI-generated assessments should be grounded in retrieved organizational knowledge.

### 🧩 Structured

AI output should conform to explicit application schemas.

### 📈 Measurable

Competency should be represented using structured metrics that can be visualized and tracked.

```text
GROUND
   ↓
STRUCTURE
   ↓
MEASURE
```

---

# 🌍 Intended Impact

SkillGraph AI acts as an intelligence layer between organizational policy and workforce development.

```text
Government / Organizational Policy
                 ↓
          SkillGraph AI
                 ↓
        Contextual Assessment
                 ↓
          AI Evaluation
                 ↓
       Competency Intelligence
                 ↓
       Workforce Development
```

The long-term vision is to move organizations from **static competency frameworks** toward **continuous, evidence-driven competency intelligence**.

---

# 🚀 Project Status

![Status](https://img.shields.io/badge/Project%20Status-Active%20Development-success?style=for-the-badge)

### Implemented

* [x] Next.js application
* [x] FastAPI backend
* [x] Gemini AI integration
* [x] Policy RAG pipeline
* [x] Structural policy fragmentation
* [x] Gemini semantic embeddings
* [x] Supabase pgvector storage
* [x] Dynamic SJT generation
* [x] Structured competency evaluation
* [x] 1–10 competency scoring
* [x] Radar-based competency analytics
* [x] Browser state persistence
* [x] Upstash Redis rate limiting
* [x] Supabase authentication
* [x] Global workflow reset

### Planned

* [ ] Celery asynchronous ingestion
* [ ] Dynamic competency profile builder
* [ ] Historical multi-run analytics
* [ ] Advanced organizational RBAC
* [ ] Enterprise multi-tenancy
* [ ] Longitudinal competency intelligence

---

# 🤝 Collaboration & Contribution

We welcome structured contributions that preserve the reliability of the AI and application layers.

## 1. Create a Feature Branch

Use descriptive branch names:

```bash
git checkout -b feature/your-implementation-goal
```

Examples:

```text
feature/dynamic-competency-profiles
feature/historical-analytics
feature/async-ingestion
feature/assessment-export
```

---

## 2. Keep API Schemas Synchronized

Backend payload changes must be reflected in the corresponding frontend TypeScript interfaces.

```text
Backend
schemas.py
     ↕
API Contract
     ↕
Frontend
dashboard.tsx
```

This prevents frontend/backend contract mismatches.

---

## 3. Use Focused Commits

Prefer descriptive commits:

```bash
git commit -m "feat: add dynamic competency profiles"

git commit -m "fix: normalize anonymous session UUIDs"

git commit -m "feat: add competency radar analytics"
```

---

## 4. Pull Request Checklist

Before submitting a pull request:

* [ ] Backend starts successfully
* [ ] Frontend builds successfully
* [ ] API contracts are validated
* [ ] Database operations are tested
* [ ] SJT generation works
* [ ] Evaluation schema is valid
* [ ] Authentication flows correctly
* [ ] Rate limiting works as expected
* [ ] No secrets are committed
* [ ] Related frontend/backend schemas are synchronized

---

# 📜 License

This project is currently intended for **hackathon, demonstration, research, and development purposes**.

Before public production distribution, add an appropriate license such as:

* MIT
* Apache-2.0
* Proprietary / Organization-specific license

---

# 🚀 Vision

> **From Policy → Knowledge → Assessment → Competency → Workforce Intelligence.**

**SkillGraph AI** aims to transform how organizations operationalize competency frameworks by turning static policy knowledge into measurable, contextual, and actionable workforce intelligence.

---

### Built with ❤️ using AI, RAG, vector intelligence, and modern cloud-native engineering.

**SkillGraph AI — Turning Policy into Competency Intelligence. 🚀**
