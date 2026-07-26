# CrimeLens AI – RBAC & Audit Architecture

This document defines the strict Role-Based Access Control (RBAC) matrix and the tamper-evident audit logging architecture required for production deployment within the Karnataka Police ecosystem.

## 1. Authentication & Session Flow

CrimeLens AI uses **Zoho Catalyst Authentication** backed by JWT (JSON Web Tokens).

### Authentication Lifecycle:
1. **Login**: Officer enters Badge Number and Password.
2. **Validation**: Catalyst Auth validates credentials.
3. **Token Issuance**: A short-lived (15 minutes) JWT Access Token and a long-lived (7 days) HttpOnly Refresh Token are issued.
4. **API Requests**: The frontend attaches the JWT as a `Bearer` token in the `Authorization` header.
5. **Middleware Verification**: The Express `AuthMiddleware` verifies the JWT signature and extracts the `role` and `badgeNumber`.

---

## 2. RBAC (Role-Based Access Control) Matrix

CrimeLens AI enforces a strict 6-Role hierarchy.

| Role | Description | Allowed Actions |
| :--- | :--- | :--- |
| **INVESTIGATOR** | Field officer assigned to specific FIRs. | Create FIR, Add Evidence, Query AI Copilot (only for assigned cases), View assigned District Hotspots. |
| **SUPERVISOR** | Station House Officer (SHO) managing a specific Police Station. | View all FIRs in station, Reassign FIRs, View Station Network Graphs, Generate Station PDF Reports. |
| **CRIME_ANALYST** | Dedicated SCRB intelligence analyst. | Statewide read access, Run Advanced Network Graph queries, Query AI Copilot globally, Generate Executive Briefs. |
| **COMMISSIONER** | High-level executive requiring statewide oversight. | Read-only access to all Statewide Dashboards, Hotspots, and PDF Export triggers. |
| **SYSTEM_AUDITOR** | Independent internal affairs or IT auditor. | Read-only access to Audit Logs and Access Histories. Cannot view PII or Evidence files. |
| **ADMINISTRATOR** | IT Administrator (Strictly constrained). | Manage Users, Manage API Keys. Cannot view Case Notes or Evidence. |

### RBAC Enforcement
Enforced at the route level using an Express middleware factory:
```typescript
router.get("/api/v1/cases", requireAuth, requireRole(["CRIME_ANALYST", "SUPERVISOR", "COMMISSIONER"]), casesController.getAll);
```

---

## 3. Audit Architecture & Tamper Detection

Every action taken on the CrimeLens AI platform that reads or mutates sensitive data is recorded in the `AuditLog` table.

### 3.1 Audit Log Schema Details
- `id`: UUID.
- `userId`: The officer making the request.
- `action`: E.g., `VIEW_RECORD`, `EXPORT_REPORT`, `AI_QUERY`.
- `resource`: The entity being accessed (e.g., `FIR`, `Copilot`).
- `resourceId`: The specific Primary Key accessed.
- `ipAddress`: Network origin of the request.
- `status`: `SUCCESS`, `DENIED`, `FAILURE`.
- `createdAt`: Immutable timestamp.

### 3.2 Evidence Chain of Custody & Tamper Detection
- **File Hashing**: When an Investigator uploads Evidence (e.g., CCTV footage) to Catalyst Stratus, the backend computes a **SHA-256 hash** of the file buffer *before* upload.
- **Immutability**: This `fileHash` is stored in the `Evidence` database table.
- **Verification**: If a file is downloaded or rendered in a report, the hash is re-calculated. If it does not match the database hash, the system flags the evidence as `TAMPERED` and prevents it from being used in AI Context building or exported reports.

### 3.3 Report Export Logging
When a PDF dossier is exported via SmartBrowz, the system logs:
- Who exported the file.
- When it was exported.
- A cryptographic seal (watermark) embedded in the PDF metadata linking back to the `AuditLog` entry.
