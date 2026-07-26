# CrimeLens AI – Architectural Review & Justification

As the Chief Database Architect, this document answers the final review questions regarding the enterprise upgrade of the CrimeLens AI database.

## 1. Weaknesses Found in the Previous Schema
- **Rigid Hierarchy**: The old schema only had `District` -> `PoliceStation`. It failed to capture the complex reality of State, Range, Commissionerate, Sub-Division, and Circle hierarchies required for realistic police reporting.
- **Overwritten Data**: The old schema updated `status` and `assignedOfficer` directly on the `FIR` table, destroying the historical chain of custody.
- **Coupled Suspects**: The old `Suspect` table was rigid. If an investigation found a vehicle, phone, or bank account, there was no centralized way to perform Cytoscape network graph analysis across all these mixed entities.
- **No Spatial Awareness**: `latitude` and `longitude` were just decimals. It lacked PostGIS geometry for spatial indexing, meaning heatmap queries would crash at scale.

## 2. Improvements Made
- **Full 7-Tier Hierarchy**: Implemented the complete structure from State down to the individual Beat.
- **Append-Only Histories**: Introduced `CaseStatusHistory` and `OfficerAssignmentHistory` to maintain a perfect audit trail.
- **Abstract Intelligence Graph**: Replaced rigid tables with `IntelligenceEntity` and `EntityRelationship` to form a flexible N:M graph capable of linking phones, cars, and suspects infinitely.
- **Partitioning & PostGIS**: Range-partitioned the `FIR` table by year and introduced PostGIS `geom` columns for spatial queries.
- **Tamper Evidence**: Added SHA-256 hashes and digital signatures to the `Evidence` table.

## 3. Why Each New Table Exists
- `CaseStatusHistory` & `OfficerAssignmentHistory`: Exist purely to prevent data loss. If a case is closed, we must know *who* closed it and *when*.
- `IntelligenceEntity`: Exists to normalize the massive variety of clues (Phones, IMEIs, Bank Accounts) into a single queryable graph.
- `AuditLog`: Exists to satisfy legal compliance. If a rogue officer queries the database, it is permanently logged.
- `AIAnalysis`: Exists to satisfy "Explainable AI". We must store exactly *why* the AI generated a certain risk score, tying it back to a specific LLM version and vector embedding.

## 4. Production-Critical Additions
- **PostgreSQL Partitioning**: Without partitioning, scanning 5 million FIRs for a dashboard would take minutes. It now takes milliseconds.
- **AuditLog**: No intelligence system can be deployed without strict access logging.
- **Role-Based Access Control (RBAC)**: Ensuring a constable can only view their Beat, while a Commissioner can view the State.

## 5. AI-Specific Additions
- `EntityRelationship.confidenceScore`: Allows the system to differentiate between a "Police Verified" link and a "AI Inferred" link (e.g., AI guesses two suspects are linked based on MO similarity, but assigns it an 80% score).
- `AIAnalysis` and `EmbeddingReference`: Connects the relational database to the vector database, allowing the Copilot to securely fetch grounded context.

## 6. Police-Domain Specific Additions
- **Beat and Circle Hierarchies**: Maps directly to Karnataka Police structure.
- **IPC/BNS Section Mapping**: (`SubCrimeCategory.ipcBnsSections`) allows the system to map legal penal codes to standard language.
- **Modus Operandi Full Text Search** (`ts_mo`): Allows investigators to rapidly search for "climbed through window using rope" across millions of historical cases.
