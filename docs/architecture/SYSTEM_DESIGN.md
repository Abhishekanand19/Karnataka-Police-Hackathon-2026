# CrimeLens AI – System Design & Architecture

This document describes the enterprise module architecture, Zoho Catalyst integrations, AI abstractions, and the modernized folder structure for the production environment of CrimeLens AI.

## 1. Enterprise Module Architecture

The backend follows a strict multi-tier architecture to enforce Separation of Concerns (SoC) and maintainability:

1. **API Gateway Layer**: Zoho Catalyst API Gateway handles rate limiting, WAF, and routes requests to the Express.js endpoints.
2. **Controller Layer**: Handles HTTP requests, extracts parameters, coordinates with the service layer, and formats the unified JSON response (`APIResponse<T>`).
3. **Middleware Layer**: 
   - `AuthMiddleware`: Validates JWTs using Catalyst Auth.
   - `RBACMiddleware`: Verifies 5-Role matrix permissions.
   - `AuditMiddleware`: Tamper-evident logging of the request.
   - `ValidationMiddleware`: Zod schema enforcement.
4. **Service Layer**: Contains core business logic.
   - `CrimeStatsService`, `HotspotEngineService`, `NetworkAnalysisService`.
5. **AI Engine Layer**: 
   - `CopilotEngine`: Orchestrates contextual queries.
   - `EvidenceValidator`: Validates LLM claims against active database records (0% Hallucination Policy).
   - `LLMProvider`: Interface supporting Catalyst QuickML or external LLMs (OpenAI/Gemini).
6. **Repository Layer**: Abstracts data access. Uses Prisma Client to interface with PostgreSQL.
7. **Database Layer**: Zoho Catalyst DataStore (PostgreSQL compatible).

## 2. Zoho Catalyst Mapping & Infrastructure

| Subsystem | Catalyst Service | Description / Justification |
| :--- | :--- | :--- |
| **Relational Database** | **Catalyst DataStore** | Replaces in-memory JSON data. Stores all structured entities (FIRs, Suspects, Users). Supports complex JOINs and indexing required by the Prisma schema. |
| **Authentication** | **Catalyst Authentication** | Handles OAuth2, SSO, session management, and JWT issuance. Replaces the mock `/login` flow. |
| **File Storage** | **Catalyst Stratus** | Object storage for FIR PDF dossiers, victim photos, and CCTV screenshots. Replaces local static assets. |
| **Dossier Generation** | **Catalyst SmartBrowz** | Serverless PDF generation. Converts HTML/React case intelligence templates into secure, printable PDF briefs with SHA-256 seals. |
| **Caching** | **Catalyst Cache** | Redis-backed caching for statewide heatmap coordinate arrays, drastically reducing DB load during spatial queries. |
| **Search / NLP** | **Catalyst QuickML / Zia** | Serves as the foundation for biometric matching, predictive analytics, and local, secure LLM reasoning. |

## 3. Production Folder Structure

The repository is structured to support enterprise scaling and clear boundaries between domains.

```
crimelens-ai/
├── .github/workflows/          # CI/CD Pipelines
├── client/                     # Next.js Frontend
│   ├── public/                 # Static assets
│   └── src/
│       ├── app/                # App Router (Pages & Layouts)
│       ├── components/
│       │   ├── ui/             # Reusable UI tokens (Tailwind/Radix)
│       │   ├── map/            # GIS Mapbox components
│       │   ├── network/        # Cytoscape.js network components
│       │   └── copilot/        # AI Copilot chat & evidence panels
│       ├── hooks/              # Custom React Hooks
│       ├── store/              # State Management (Zustand)
│       └── lib/                # API clients, utilities
├── server/                     # Express.js Backend
│   ├── prisma/                 # Prisma Schema & Migrations
│   │   └── schema.prisma
│   └── src/
│       ├── api/                # Catalyst Functions & Triggers
│       ├── controllers/        # Express Route Handlers
│       ├── middleware/         # Auth, Zod Validation, Audit Logging
│       ├── services/           # Business Logic (Hotspots, Case, Network)
│       ├── ai/                 # Copilot Engine, QuickML adapters
│       ├── repositories/       # Prisma Data Access Layer
│       ├── types/              # DTOs, Enums, Shared Interfaces
│       └── utils/              # Error Handlers, Date Formatters
├── catalyst.json               # Zoho Catalyst Project Configuration
└── docs/                       # Architecture & API Specifications
    └── architecture/           # System Design Documents (This directory)
```

## 4. AI Architecture & Evidence Pipeline

To ensure a strict **0% Hallucination Policy**, the AI architecture intercepts all LLM responses:

1. **User Query**: "Which suspects are linked to HSR Layout burglaries?"
2. **Context Builder**: The backend fetches all FIRs, Suspects, and Notes related to HSR Layout from the DataStore using Prisma.
3. **LLM Invocation**: The context and prompt are sent to the `LLMProvider`.
4. **Evidence Validator**: The LLM output is parsed. If the LLM mentions "Rajesh Kumar (A-901)", the `EvidenceValidator` checks the Prisma database to ensure `A-901` actually exists and is linked to the context.
5. **Citation Engine**: Validated claims are wrapped in verifiable citations pointing directly to the Database Primary Keys.
6. **Response**: The frontend renders the response with interactive citation pills.
