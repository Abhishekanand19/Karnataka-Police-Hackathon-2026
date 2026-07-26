# CrimeLens AI – Enterprise Data Dictionary

This document defines the purpose, usage, and structure of every critical table in the Enterprise Database Schema.

## 1. Police Organization Hierarchy Layer

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **State** | Highest level of police organization (e.g., Karnataka). | `id`, `name` |
| **Range** | A grouping of Commissionerates/Districts (e.g., Eastern Range). | `stateId`, `name` |
| **Commissionerate** | City-level high-density jurisdiction (e.g., Bengaluru City). | `rangeId`, `name` |
| **District** | Rural or town-level jurisdiction. | `commissionerateId`, `name` |
| **SubDivision** | Division managed by an ACP or DSP. | `districtId`, `name` |
| **Circle** | Group of Police Stations managed by a CPI. | `subDivisionId`, `name` |
| **PoliceStation** | The primary operational unit where FIRs are registered. | `circleId`, `latitude`, `longitude` |
| **Beat** | The smallest patrol jurisdiction for a constable. | `policeStationId`, `name` |

## 2. Core Case Management Layer

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **FIR** | The core First Information Report record. Uses PostGIS for spatial mapping and Partitioning by date. | `firNumber`, `incidentDate`, `geom`, `ts_mo` |
| **CaseStatusHistory** | Immutable append-only log of every status change in an FIR. Prevents overwriting history. | `firId`, `oldStatus`, `newStatus`, `changedAt` |
| **OfficerAssignmentHistory** | Tracks exactly which officer was working on which case at what time. | `firId`, `officerId`, `assignedDate` |
| **CrimeCategory** | Normalized high-level crime classifications (e.g., Theft, Assault). | `name`, `severity` |
| **SubCrimeCategory** | Detailed mapping of crime types to specific IPC/BNS legal sections. | `categoryId`, `ipcBnsSections[]` |

## 3. Intelligence & Link Analysis Layer (The Engine)

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **IntelligenceEntity** | A master abstract table storing every noun in the system (Person, Vehicle, Phone, Bank Account). This eliminates rigid tables and allows fluid graph connections. | `entityType`, `value`, `biometricRef` |
| **FIREntityLink** | Junction mapping which entities were involved in which FIRs. | `firId`, `entityId`, `involvementType` |
| **EntityRelationship** | The core of the Cytoscape.js Network Graph. Maps how two entities relate (e.g., "Person A called Phone B"). Supports AI confidence scores. | `sourceEntityId`, `targetEntityId`, `confidenceScore` |

## 4. Evidence & Chain of Custody

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **Evidence** | Tracks digital evidence (CCTV, PDFs). Uses SHA-256 for tamper detection and digital signatures. | `type`, `sha256Hash`, `chainOfCustody` |

## 5. Security, AI, and Audit

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **AuditLog** | Tamper-evident log of every read/write action. Crucial for legal compliance. | `action`, `tableName`, `oldData`, `newData` |
| **AIAnalysis** | Stores generated AI insights, risk scores, and the reasoning behind them to satisfy Explainable AI (XAI) requirements. | `aiRiskScore`, `aiReasoning`, `vectorIndexReference` |
| **User** | Tracks police personnel, their Roles (RBAC), and logical deletion (Soft Delete). | `badgeNumber`, `role`, `isDeleted` |
