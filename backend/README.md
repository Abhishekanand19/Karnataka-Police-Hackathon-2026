# CrimeLens AI – Enterprise Backend Service

Version: 1.0  
Project: **CrimeLens AI – Karnataka Police Crime Intelligence Command Centre**  
Track: **Backend Foundation & Zoho Catalyst Integration (Phase B1 / 4)**

---

## 1. Overview

This directory contains the modular Node.js & TypeScript enterprise backend service for CrimeLens AI. The backend is designed for high scalability and integrates natively with **Zoho Catalyst** (Catalyst Functions, Catalyst Data Store, Catalyst API Gateway, and Catalyst Signals).

---

## 2. Modular Architecture & Folder Structure

```
backend/
├── src/
│   ├── api/          # Catalyst API Adapters
│   ├── catalyst/     # Zoho Catalyst SDK Initialization & Handlers
│   ├── config/       # Environment Configuration Loader
│   ├── controllers/  # API Route Controllers
│   ├── datastore/    # Catalyst Data Store Interfaces & Managers
│   ├── logger/       # Enterprise Winston Logging Service
│   ├── middleware/   # Request Logging, Auth, Auditing & Error Handling
│   ├── repositories/ # Generic Repository Pattern Implementations
│   ├── routes/       # Express API Route Mounts
│   ├── services/     # Business Service Layer Placeholders
│   ├── types/        # Shared Interface & Envelope Definitions
│   ├── utils/        # Response, Date & Error Formatting Helpers
│   ├── validators/   # Zod Input Validation Schemas
│   └── index.ts      # Server Entry Point
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Standardized API Response Contract

Every endpoint returns a unified JSON envelope:

```json
{
  "success": true,
  "message": "CrimeLens AI Backend Service Operational",
  "data": { ... },
  "timestamp": "2026-07-20T22:00:00.000Z"
}
```

---

## 4. Operational Endpoints (Phase B1 Placeholders)

- `GET /api/health`: Health status & Catalyst SDK connectivity check.
- `GET /api/dashboard`: Executive statewide crime analytics overview.
- `GET /api/hotspots`: Spatial crime hotspot cluster list.
- `GET /api/network`: Criminal network relationship graph metadata.
- `GET /api/case/:id`: Case FIR dossier details by ID.
- `POST /api/copilot/query`: AI Copilot analytical reasoning endpoint.
- `POST /api/report`: Intelligence dossier PDF export trigger.
- `GET /api/settings`: System preferences payload.

---

## 5. Local Setup & Execution

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run development server with live reload
npm run dev

# Compile TypeScript
npm run build

# Start production server
npm start
```

---

## 6. Zoho Catalyst Functions Deployment Guide

To deploy the backend to **Zoho Catalyst**:
1. Install Catalyst CLI: `npm install -g zcatalyst-cli`.
2. Authenticate: `catalyst login`.
3. Initialize project: `catalyst init`.
4. Deploy functions: `catalyst deploy`.
