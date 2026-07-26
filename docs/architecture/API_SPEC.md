# CrimeLens AI – REST API Specification

This document defines the RESTful endpoints supporting the CrimeLens AI platform.

## 1. Authentication Endpoints

### 1.1 `POST /api/v1/auth/login`
Authenticates a user via Zoho Catalyst Authentication and issues a session JWT.
- **Request Body**:
  ```json
  {
    "badgeNumber": "KSP-894102",
    "password": "hashed_string"
  }
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbG...",
      "user": {
        "id": "uuid",
        "role": "INVESTIGATOR",
        "firstName": "Anand"
      }
    }
  }
  ```
- **Response** `401 Unauthorized`: Invalid credentials.

### 1.2 `POST /api/v1/auth/logout`
Invalidates the current session. Requires `Authorization: Bearer <token>`.

---

## 2. Core Operational Endpoints

### 2.1 `GET /api/v1/cases`
Retrieves a paginated list of FIR cases.
- **Query Params**: `page`, `limit`, `districtId`, `status`, `crimeCategory`.
- **RBAC**: Administrator, Supervisor, Investigator, Crime Analyst.
- **Response** `200 OK`: Returns `PaginatedResponse<FIR[]>`.

### 2.2 `GET /api/v1/cases/:id`
Retrieves the full dossier for a specific FIR, including suspects, vehicles, and evidence.
- **Response** `200 OK`: Returns detailed `FIR` object with nested relations.

### 2.3 `POST /api/v1/cases`
Registers a new FIR in the system.
- **RBAC**: Investigator, Supervisor, Administrator.
- **Request Body**: Detailed FIR payload.
- **Response** `201 Created`: Returns created `FIR` entity.

---

## 3. Analytics & Intelligence Endpoints

### 3.1 `GET /api/v1/analytics/hotspots`
Calculates crime density hotspots based on spatial parameters.
- **Query Params**: `radiusKm`, `timeframe` (e.g., "30d"), `category`.
- **Response** `200 OK`: Returns an array of GeoJSON clusters with calculated threat scores.

### 3.2 `GET /api/v1/analytics/network`
Retrieves the graph structure (Nodes & Edges) for Cytoscape.js rendering.
- **Query Params**: `seedId` (e.g., suspect UUID or FIR UUID), `depth` (default: 2).
- **Response** `200 OK`:
  ```json
  {
    "nodes": [ { "id": "uuid", "type": "SUSPECT", "label": "Rajesh Kumar" } ],
    "edges": [ { "source": "uuid1", "target": "uuid2", "relationship": "CO_ACCUSED" } ]
  }
  ```

---

## 4. Explainable AI Copilot Endpoints

### 4.1 `POST /api/v1/copilot/query`
Submits a natural language query to the AI Investigator Copilot.
- **RBAC**: Investigator, Crime Analyst, Supervisor, Administrator.
- **Request Body**:
  ```json
  {
    "prompt": "Summarize the MO for recent burglaries in HSR Layout.",
    "contextFilters": { "districtId": "uuid" }
  }
  ```
- **Response** `200 OK`:
  ```json
  {
    "answer": "Recent burglaries share a common MO involving...",
    "citations": [
      { "id": "fir-uuid", "title": "FIR-2026-00491" }
    ],
    "confidenceScore": 92
  }
  ```

---

## 5. Export & Reporting Endpoints

### 5.1 `POST /api/v1/reports/export`
Triggers Catalyst SmartBrowz to generate a PDF intelligence dossier.
- **Request Body**:
  ```json
  {
    "reportType": "CASE_DOSSIER",
    "targetId": "fir-uuid"
  }
  ```
- **Response** `202 Accepted`:
  ```json
  {
    "status": "PROCESSING",
    "jobId": "uuid",
    "downloadUrl": null
  }
  ```

### 5.2 `GET /api/v1/reports/status/:jobId`
Polls for the PDF generation status. Returns `downloadUrl` (Catalyst Stratus URL) when complete.

---

## 6. Audit & System Endpoints

### 6.1 `GET /api/v1/audit/logs`
Retrieves tamper-evident system audit logs.
- **RBAC**: System Auditor, Administrator.
- **Query Params**: `userId`, `action`, `startDate`, `endDate`.
- **Response** `200 OK`: Returns `PaginatedResponse<AuditLog[]>`.

### 6.2 `GET /api/v1/health`
Checks the health of the API, Database connection, Stratus, and LLM Provider.
- **Response** `200 OK`: Returns health status array.
